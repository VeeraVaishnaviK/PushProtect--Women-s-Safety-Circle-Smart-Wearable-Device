# 🛡️ PUSH PROTECT
### *"Your safety. Your signal. Your circle."*

---

## 📖 Executive Summary & Mission

**Push Protect** is a production-oriented women's safety platform combining a discreet smart wearable with an honest, observable emergency response ecosystem. A single physical press initiates an immediate, observable response workflow across trusted responders—providing genuine delivery verification, horizontal GPS accuracy metrics, and tiered contact escalation without exaggerated claims.

---

## 🏛️ System Architecture

```
[ ESP32 Smart Wearable ]
      │ (BLE 5.0 GATT Encrypted Event)
      ▼
[ Mobile Application / PWA - React 19 + Capacitor ]
      │ (Non-blocking GPS + Offline Fallback)
      ▼
[ NestJS Core Gateway API (/api/v1) ] ◄──► [ MongoDB Atlas Cluster ]
      │
      ├─► [ Telecom SMS Gateway / FCM Push ] ──► [ Trusted Circle Responders ]
      │                                                     │
      │                                                     ▼
      └─► [ Real-time Socket.IO Gateway ] ◄───── [ 1-Click Ack Web Portal ]
```

---

## 🌟 Key Differentiators

### 1. Signature Feature: Response Confidence Envelope
Replaces arbitrary AI percentage scores with **5 deterministic, verifiable dimensions**:
1. **Location Freshness**: Seconds elapsed since satellite GPS fix (`<45s` = Fresh, `45s-3m` = Moderate, `>3m` = Stale).
2. **Reported Accuracy**: Horizontal radius in meters (`±5m–20m` = High, `±20m–60m` = Medium, `>60m` = Degraded).
3. **Notification Delivery**: Telecom provider acceptance vs confirmed handset carrier receipt.
4. **Trusted Circle Response**: Explicit count of responders who tapped "Acknowledge" (e.g. 2 of 3 acknowledged).
5. **Telemetry & Uplink**: Wearable BLE link status and network connectivity.

### 2. Honest Emergency State Machine
Distinguishes between:
- `triggered`
- `incident_created`
- `dispatching`
- `acknowledged`
- `escalating`
- `unconfirmed`
- `resolved`
- `cancelled`

> **Helpline Notice**: Push Protect coordinates trusted personal contacts. It is never presented as a replacement for official police or ambulance dispatch. Direct 1-tap dialling for India's National Emergency Helpline (**112**) is integrated across all incident screens.

### 3. Privacy by Design & Zero Continuous Tracking
- Zero 24/7 background location surveillance.
- Coordinates captured strictly upon deliberate SOS trigger or scheduled Safe Journey check-in.
- Automatic data purge on MongoDB Atlas clusters according to configured retention policies (default: 7 days).
- Ephemeral response links automatically expire after incident resolution.

---

## 🗺️ Route Directory

### Public Website
- `/` — Premium Landing Page (Hero showcase, 4-step workflow, and feature cards)
- `/about` — Mission, origins, and core safety principles
- `/how-it-works` — Deep dive into BLE 5.0, non-blocking GPS, and carrier escalation
- `/privacy` — Privacy by Design pledge, data retention, and rights
- `/contact` — Institutional partnerships and support channels
- `/login` — Secure account access
- `/register` — 7-Step Guided Safety Onboarding

### Authenticated Safety Application (`/app/*`)
- `/app/dashboard` — Mobile-first safety hub (SOS button, live GPS map, confidence envelope, quick tools)
- `/app/device` — BLE Wearable Manager (Scan, pair, battery telemetry, diagnostic self-test)
- `/app/contacts` — Trusted Circle Manager (Escalation priorities 1, 2, 3, readiness checks)
- `/app/incidents` — Cryptographic incident history & audit log
- `/app/incidents/:incidentId` — Active SOS Incident Command Center (Live map, receipts, 112 dial, resolve/cancel)
- `/app/journey` — Safe Journey Automated Escort (Check-in countdown timer, missed check-in grace window)
- `/app/privacy` — Retention policies, JSON audit export, account deletion
- `/app/settings` — Tactile vibration cues and preferences
- `/app/practice` — Zero-Alarm Practice Drill (Rehearsal mode without sending real alerts)

### Trusted Responder Portal
- `/respond/:invitationToken` — Accept circle responder invitation
- `/respond/incidents/:incidentId` — Dedicated Contact Response Portal (1-click acknowledge, live map, call wearer, 112 helpline)

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### 1. Run the Frontend (Vite + React)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run the Backend API (NestJS + Swagger)
```bash
cd server
npm install
npm run build
npm start
```
- API Base: `http://localhost:3001/api/v1`
- Swagger OpenAPI Interactive Docs: `http://localhost:3001/api/v1/docs`

### 3. Run Automated Acceptance & Simulation Suite
```bash
node scripts/test_simulation.mjs
```
Executes 7 end-to-end acceptance scenarios verifying idempotency, replay protection, stale location handling, and acknowledgement progression.

---

## 📱 Android APK Packaging (Capacitor)

The mobile web application is packaged into a native Android APK using Capacitor.

### 1. Build Client Web Assets & Sync
```bash
cd client
npm run build
npx cap sync
```

### 2. Open in Android Studio
```bash
npx cap open android
```

### 3. Generate Debug / Release APK
In Android Studio:
1. Select **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. The generated debug APK will be located in:
   `client/android/app/build/outputs/apk/debug/app-debug.apk`

Declared native permissions (`AndroidManifest.xml`):
- `ACCESS_FINE_LOCATION` & `ACCESS_COARSE_LOCATION`
- `BLUETOOTH`, `BLUETOOTH_ADMIN`, `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`
- `VIBRATE` & `POST_NOTIFICATIONS`

---

## 💍 ESP32 Wearable Firmware

Firmware source is provided in `hardware/esp32_firmware.ino`.
- Microcontroller: ESP32-S3 or compatible BLE 5.0 board.
- Service UUID: `00001824-0000-1000-8000-00805f9b34fb`
- Characteristic SOS Event (Notify): `00002A3D-0000-1000-8000-00805f9b34fb`
- Characteristic Battery Level (Read/Notify): `00002A19-0000-1000-8000-00805f9b34fb`
- Tactile button on GPIO 0 with 1.2-second debounce hold threshold.

---

## 🔒 Security & Disclosure

- Replay protection with cryptographic event nonces.
- Server-side validation with NestJS and class-validator.
- PWA manifest and offline-first fallback.
- In immediate danger in India, always dial **112**.

*Push Protect — Designed for dignity, security, and peace of mind.*
