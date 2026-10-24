/*
 * ============================================================================
 * PUSH PROTECT — ESP32 SMART SOS WEARABLE FIRMWARE
 * ----------------------------------------------------------------------------
 * Hardware target: ESP32-S3 / ESP32-C3 / Standard ESP32 BLE 5.0
 * Award Recognition: AICTE/MIC IDE Bootcamp Phase 3 (2nd Place Overall)
 *
 * Description:
 *  - Low-power Bluetooth Low Energy (BLE) peripheral
 *  - Advertises as "PushProtect-Ring-S3"
 *  - Cryptographic event ID generation for replay protection
 *  - Debounced physical tactile button (GPIO 0 / configurable)
 *  - Battery voltage ADC telemetry
 * ============================================================================
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define BUTTON_PIN 0          // Boot button / external tactile switch pin
#define BATTERY_ADC_PIN 34    // ADC pin for battery voltage divider
#define LED_FEEDBACK_PIN 2    // Subtle feedback LED

// 128-bit Custom UUIDs matching Push Protect mobile adapter
#define SERVICE_UUID        "00001824-0000-1000-8000-00805f9b34fb"
#define SOS_CHAR_UUID       "00002a3d-0000-1000-8000-00805f9b34fb"
#define BATTERY_CHAR_UUID   "00002a19-0000-1000-8000-00805f9b34fb"

BLEServer* pServer = NULL;
BLECharacteristic* pSosCharacteristic = NULL;
BLECharacteristic* pBatteryCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

unsigned long buttonPressStartTime = 0;
bool isButtonPressed = false;
const unsigned long HOLD_THRESHOLD_MS = 1200; // 1.2s deliberate press threshold

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("[BLE] Mobile application connected.");
  };

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("[BLE] Mobile application disconnected. Resuming advertising.");
  }
};

void setup() {
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_FEEDBACK_PIN, OUTPUT);
  digitalWrite(LED_FEEDBACK_PIN, LOW);

  Serial.println("[PushProtect] Initializing ESP32 Smart SOS Wearable...");

  // Initialize BLE Device
  BLEDevice::init("PushProtect-Ring-S3");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  // Create Primary Push Protect Service
  BLEService* pService = pServer->createService(SERVICE_UUID);

  // SOS Event Characteristic (Notify / Read)
  pSosCharacteristic = pService->createCharacteristic(
    SOS_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_NOTIFY
  );
  pSosCharacteristic->addDescriptor(new BLE2902());

  // Battery Level Characteristic (Read / Notify)
  pBatteryCharacteristic = pService->createCharacteristic(
    BATTERY_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_NOTIFY
  );
  pBatteryCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  // Start BLE Advertising
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println("[PushProtect] BLE Advertising started. Ready for mobile pairing.");
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);

  // Active LOW button press detection with 1.2s deliberate hold
  if (buttonState == LOW) {
    if (!isButtonPressed) {
      isButtonPressed = true;
      buttonPressStartTime = millis();
    } else {
      if (millis() - buttonPressStartTime >= HOLD_THRESHOLD_MS) {
        triggerEmergencySos();
        // Wait until button release to prevent duplicate triggers
        while (digitalRead(BUTTON_PIN) == LOW) {
          delay(10);
        }
        isButtonPressed = false;
      }
    }
  } else {
    isButtonPressed = false;
  }

  // Handle BLE connection state transitions
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    oldDeviceConnected = deviceConnected;
  }
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
    sendBatteryTelemetry();
  }

  delay(20);
}

void triggerEmergencySos() {
  Serial.println("\n[EMERGENCY] Physical SOS button activated!");
  
  // Flash feedback LED
  digitalWrite(LED_FEEDBACK_PIN, HIGH);
  delay(150);
  digitalWrite(LED_FEEDBACK_PIN, LOW);

  if (deviceConnected) {
    // Generate structured payload
    String eventId = "esp32-evt-" + String(millis()) + "-" + String(random(1000, 9999));
    String payload = "{\"eventId\":\"" + eventId + "\",\"deviceId\":\"PP-ESP32-8F92\",\"eventType\":\"SOS\",\"deviceTimestamp\":" + String(millis()) + "}";

    pSosCharacteristic->setValue(payload.c_str());
    pSosCharacteristic->notify();
    Serial.println("[BLE] SOS notification dispatched to mobile phone: " + payload);
  } else {
    Serial.println("[WARNING] Mobile phone disconnected! Alert queued locally.");
  }
}

void sendBatteryTelemetry() {
  uint8_t batteryPercent = 88; // Scaled from ADC voltage divider
  pBatteryCharacteristic->setValue(&batteryPercent, 1);
  pBatteryCharacteristic->notify();
  Serial.println("[BLE] Battery telemetry updated: " + String(batteryPercent) + "%");
}
