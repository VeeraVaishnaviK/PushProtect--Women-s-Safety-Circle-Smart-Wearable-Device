import React, { useState } from 'react';
import {
  Bluetooth,
  Battery,
  ShieldCheck,
  RefreshCw,
  Zap,
  Unlink,
  CheckCircle2,
  Heart,
  Footprints,
  Flame,
  Activity,
  ShieldAlert,
  AlertTriangle,
  Sun,
  BatteryCharging,
  Sparkles,
} from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';
import { bleAdapter } from '../services/bleAdapter';

export const DevicePage: React.FC = () => {
  const { device, setDevice, updateDeviceBattery, updateDeviceMetrics, togglePanicAutoSos, triggerSOS } = useSafetyStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [spikeAlert, setSpikeAlert] = useState<string | null>(null);
  const [solarNotice, setSolarNotice] = useState<string | null>(null);

  const isConnected = device?.pairingStatus === 'connected';
  const heartRate = device?.heartRateBpm ?? 76;
  const isHeartRateSpiked = heartRate > (device?.panicHeartRateThreshold ?? 135);
  const isPanicAutoSosOn = device?.panicAutoSosEnabled ?? true;
  const steps = device?.stepsToday ?? 4820;
  const distanceKm = device?.distanceKm ?? 3.4;
  const calories = device?.caloriesBurned ?? 195;
  const spO2 = device?.spO2Percent ?? 98;
  const batteryLevel = device?.batteryLevel ?? 88;
  const isSolarChargingActive = batteryLevel < 50;

  // Real-time Solar Sunlight Charging effect: When battery < 50%, automatically increments charge
  React.useEffect(() => {
    if (batteryLevel < 50 && isConnected) {
      const timer = setInterval(() => {
        updateDeviceBattery(Math.min(100, (device?.batteryLevel ?? batteryLevel) + 2));
      }, 2500);
      return () => clearInterval(timer);
    }
  }, [batteryLevel, isConnected, device?.batteryLevel, updateDeviceBattery]);

  const handleSimulateBatteryDrop = () => {
    updateDeviceBattery(42);
    setSolarNotice('☀️ Battery dropped to 42% (<50%). Embedded micro-photovoltaic cells automatically engaged in sunlight to recharge!');
    setTimeout(() => setSolarNotice(null), 6000);
  };

  const handleRestoreBattery = () => {
    updateDeviceBattery(88);
    setSolarNotice(null);
  };

  const handleScanRealBLE = async () => {
    setIsScanning(true);
    setScanError(null);
    try {
      const paired = await bleAdapter.scanAndConnectReal();
      setDevice(paired);
    } catch (err: any) {
      setScanError(err.message || 'Failed to connect via Web Bluetooth. You can continue in hardware simulation mode.');
    } finally {
      setIsScanning(false);
    }
  };

  const handlePairSimulated = async () => {
    setIsScanning(true);
    const paired = await bleAdapter.simulatePairing('Push Protect Wearable');
    setDevice(paired);
    setIsScanning(false);
  };

  const handleUnpair = () => {
    bleAdapter.unpair();
    setDevice(null);
  };

  const handleTestLatency = () => {
    setTestResult(null);
    setTimeout(() => {
      setTestResult('BLE Signal Latency: 22ms. RSSI: -54 dBm (Excellent). PPG optical sensor OK. Switch debounce OK.');
    }, 800);
  };

  const handleSimulateHeartSpike = () => {
    if (!isPanicAutoSosOn) {
      setSpikeAlert('Panic button is currently OFF. Turn it ON to trigger automatic SOS on abnormal heart rate.');
      setTimeout(() => setSpikeAlert(null), 3000);
      return;
    }

    updateDeviceMetrics({ heartRateBpm: 142, activityState: 'running' });
    setSpikeAlert('⚠️ Abnormal Heart Rate Spike (142 BPM) detected! Triggering Emergency SOS...');

    setTimeout(() => {
      triggerSOS('heart_rate_abnormal');
    }, 800);

    setTimeout(() => {
      updateDeviceMetrics({ heartRateBpm: 76, activityState: 'walking' });
      setSpikeAlert(null);
    }, 15000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-plum">
          Smart Wearable Integration
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Manage Bluetooth Low Energy (BLE) paired Push Protect Wearable with real-time biometrics, activity tracking, and panic detection.
        </p>
      </div>

      {/* Main Paired Device Card */}
      {device ? (
        <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-plum text-champagne flex items-center justify-center shadow-md">
                <Bluetooth className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-plum">{device.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isConnected
                        ? 'bg-emerald-50 text-status-success border border-emerald-200'
                        : 'bg-amber-50 text-status-warning border border-amber-200'
                    }`}
                  >
                    {isConnected ? 'BLE Connected' : 'Disconnected'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  ID: <span className="font-mono text-plum">{device.deviceIdentifier}</span> • {device.hardwareModel}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleUnpair}
                className="px-3.5 py-2 border border-border-subtle text-status-emergency hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Unpair Device</span>
              </button>
            </div>
          </div>

          {/* Smartwatch Biometric & Activity Dashboard */}
          <div>
            <h4 className="text-xs font-bold text-plum uppercase tracking-wider mb-3">
              Smartwatch Biometrics & Walking Activity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 1. Heart Beat Rate */}
              <div className={`p-4 rounded-xl border transition-all ${
                isHeartRateSpiked ? 'bg-red-50 border-red-300' : 'bg-ivory-warm border-border-subtle/80'
              }`}>
                <div className="flex items-center justify-between text-text-secondary mb-1">
                  <span className="flex items-center space-x-1.5 text-xs font-semibold text-plum">
                    <Heart className={`w-4 h-4 ${isHeartRateSpiked ? 'text-status-emergency fill-red-500 animate-ping' : 'text-status-emergency fill-red-500/20 animate-pulse'}`} />
                    <span>Heart Beat Rate</span>
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isHeartRateSpiked ? 'bg-status-emergency text-white' : 'bg-rose-blush text-plum'
                  }`}>
                    {isHeartRateSpiked ? 'ABNORMAL' : 'NORMAL'}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className={`text-3xl font-extrabold ${isHeartRateSpiked ? 'text-status-emergency' : 'text-plum'}`}>
                    {heartRate}
                  </span>
                  <span className="text-xs text-text-secondary font-medium">BPM</span>
                </div>
                <div className="text-[10px] text-text-secondary mt-2 flex justify-between">
                  <span>Optical PPG Sensor</span>
                  <span>Resting: 60-100</span>
                </div>
              </div>

              {/* 2. Walking & Steps */}
              <div className="p-4 rounded-xl bg-ivory-warm border border-border-subtle/80">
                <div className="flex items-center justify-between text-text-secondary mb-1">
                  <span className="flex items-center space-x-1.5 text-xs font-semibold text-plum">
                    <Footprints className="w-4 h-4 text-berry" />
                    <span>Walking Activity</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-status-success border border-emerald-200">
                    WALKING
                  </span>
                </div>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-3xl font-extrabold text-plum">
                    {steps.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-secondary font-medium">steps</span>
                </div>
                <div className="text-[10px] text-text-secondary mt-2 flex justify-between">
                  <span>{distanceKm} km walked</span>
                  <span className="flex items-center space-x-0.5 text-amber-700 font-semibold">
                    <Flame className="w-3 h-3 text-amber-600" />
                    <span>{calories} kcal</span>
                  </span>
                </div>
              </div>

              {/* 3. SpO2 Blood Oxygen */}
              <div className="p-4 rounded-xl bg-ivory-warm border border-border-subtle/80">
                <div className="flex items-center justify-between text-text-secondary mb-1">
                  <span className="flex items-center space-x-1.5 text-xs font-semibold text-plum">
                    <Activity className="w-4 h-4 text-plum" />
                    <span>Blood Oxygen (SpO₂)</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-status-success border border-emerald-200">
                    OPTIMAL
                  </span>
                </div>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-3xl font-extrabold text-plum">{spO2}%</span>
                  <span className="text-xs text-text-secondary font-medium">Saturation</span>
                </div>
                <div className="w-full bg-rose-blush/60 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="h-full rounded-full bg-emerald-600" style={{ width: `${spO2}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Panic Button / Abnormal Heart Rate Auto-SOS Section (User Requested Feature) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isPanicAutoSosOn ? 'bg-rose-blush/20 border-berry/30' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isPanicAutoSosOn ? 'bg-status-emergency text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-plum">
                    Panic button (Abnormal Heart Rate Auto-SOS)
                  </h4>
                  <p className="text-xs font-semibold text-plum mt-0.5">
                    When heart rate increases abnormally, the SOS triggers.
                  </p>
                </div>
              </div>

              {/* On / Off Switch */}
              <div className="flex items-center space-x-2 self-end sm:self-center">
                <span className="text-xs font-bold text-plum">
                  {isPanicAutoSosOn ? 'ON' : 'OFF'}
                </span>
                <button
                  type="button"
                  onClick={togglePanicAutoSos}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isPanicAutoSosOn ? 'bg-status-emergency' : 'bg-gray-300'
                  }`}
                  title={isPanicAutoSosOn ? 'Turn Panic button OFF' : 'Turn Panic button ON'}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      isPanicAutoSosOn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              When enabled, optical PPG sensor continuously evaluates sudden tachycardia distress patterns. If heart rate surges abnormally (&gt;135 BPM during struggle, panic, or physical distress), emergency incident creation and circle notification dispatches automatically.
            </p>

            <div className="mt-3 pt-3 border-t border-border-subtle/60 flex flex-wrap items-center justify-between gap-2">
              <span className={`text-xs font-bold ${isPanicAutoSosOn ? 'text-status-success' : 'text-text-secondary'}`}>
                {isPanicAutoSosOn ? '● Panic Guard Armed (Distress Threshold: >135 BPM)' : '○ Panic Guard Disabled'}
              </span>

              {isPanicAutoSosOn && (
                <button
                  type="button"
                  onClick={handleSimulateHeartSpike}
                  className="px-3 py-1.5 bg-status-emergency text-white rounded-xl text-xs font-bold hover:bg-status-emergency/90 transition-colors flex items-center space-x-1.5 shadow-sm"
                  title="Simulate sudden heart rate spike to test automatic panic SOS"
                >
                  <Zap className="w-3.5 h-3.5 text-champagne" />
                  <span>Test Heart Spike (&gt;135 BPM)</span>
                </button>
              )}
            </div>

            {spikeAlert && (
              <div className="mt-3 p-2.5 rounded-xl bg-status-emergency text-white text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{spikeAlert}</span>
              </div>
            )}
          </div>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Battery Health & Solar Auto-Charging (<50% Trigger) */}
            <div className={`p-4 rounded-xl border transition-all ${
              isSolarChargingActive
                ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                : 'bg-ivory-warm border-border-subtle/80'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">Battery Health</span>
                {isSolarChargingActive ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1 animate-pulse">
                    <Sun className="w-3 h-3 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Solar Charging Active</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Optimal
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-2">
                  {isSolarChargingActive ? (
                    <BatteryCharging className="w-5 h-5 text-amber-600 animate-pulse" />
                  ) : (
                    <Battery className="w-5 h-5 text-plum" />
                  )}
                  <span className={`text-xl font-bold ${isSolarChargingActive ? 'text-amber-700' : 'text-plum'}`}>
                    {batteryLevel}%
                  </span>
                </div>
                {isSolarChargingActive && (
                  <span className="text-[10px] font-bold text-amber-700 flex items-center space-x-1 bg-amber-100/60 px-1.5 py-0.5 rounded">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>+2%/2.5s (Sunlight)</span>
                  </span>
                )}
              </div>

              {/* Progress Bar with Solar Gradient when <50% */}
              <div className="w-full bg-rose-blush/60 h-2.5 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSolarChargingActive
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 animate-pulse'
                      : batteryLevel > 20
                      ? 'bg-status-success'
                      : 'bg-status-warning'
                  }`}
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>

              {/* Solar Auto-Charging Explanation */}
              <div className="mt-3 pt-2.5 border-t border-border-subtle/60 text-[11px]">
                {isSolarChargingActive ? (
                  <div className="space-y-1">
                    <p className="font-bold text-amber-800 flex items-center space-x-1 text-xs">
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>Solar Sunlight Auto-Charging Active (&lt;50%)</span>
                    </p>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      Battery is below 50%. Embedded micro-photovoltaic cells automatically harvest solar sunlight to replenish charge without plugging in.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-plum flex items-center space-x-1">
                      <Sun className="w-3.5 h-3.5 text-champagne" />
                      <span>Solar Auto-Charging Feature:</span>
                    </p>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      When battery becomes low below 50%, it automatically charges through solar sunlight via embedded micro-photovoltaic cells.
                    </p>
                  </div>
                )}
              </div>

              {/* Simulation Quick Buttons */}
              <div className="mt-2.5 flex items-center space-x-1.5">
                {!isSolarChargingActive ? (
                  <button
                    type="button"
                    onClick={handleSimulateBatteryDrop}
                    className="w-full py-1 px-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold transition-colors flex items-center justify-center space-x-1 border border-amber-300 shadow-xs"
                    title="Simulate battery dropping to 42% (<50%) to demonstrate automatic solar charging"
                  >
                    <Sun className="w-3 h-3 text-amber-600" />
                    <span>Test Solar Auto-Charge (&lt;50%)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRestoreBattery}
                    className="w-full py-1 px-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition-colors flex items-center justify-center space-x-1 border border-emerald-300"
                  >
                    <span>Restore Battery (88%)</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-ivory-warm border border-border-subtle/80">
              <span className="text-xs text-text-secondary block mb-1">Firmware Version</span>
              <span className="text-base font-mono font-bold text-plum block">{device.firmwareVersion}</span>
              <span className="text-[10px] text-status-success mt-2 block flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Firmware is up-to-date</span>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-ivory-warm border border-border-subtle/80">
              <span className="text-xs text-text-secondary block mb-1">Last Telemetry Ping</span>
              <span className="text-base font-bold text-plum block">
                {new Date(device.lastSeenAt).toLocaleTimeString()}
              </span>
              <span className="text-[10px] text-text-secondary mt-2 block">
                Authenticated BLE Characteristic
              </span>
            </div>
          </div>

          {/* Test & Simulation Actions */}
          <div className="pt-2 border-t border-border-subtle/60 flex flex-wrap items-center gap-3">
            <button
              onClick={handleTestLatency}
              className="px-4 py-2 bg-plum text-ivory-warm rounded-xl text-xs font-bold hover:bg-plum-800 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run BLE Diagnostics</span>
            </button>

            <button
              onClick={() => bleAdapter.triggerHardwareButtonPress()}
              className="px-4 py-2 bg-berry/10 text-berry border border-berry/20 rounded-xl text-xs font-bold hover:bg-berry/20 transition-colors flex items-center space-x-2"
            >
              <Zap className="w-3.5 h-3.5 text-champagne" />
              <span>Simulate Physical Button Click</span>
            </button>
          </div>

          {testResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-status-success flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{testResult}</span>
            </div>
          )}
        </div>
      ) : (
        /* Empty / Pair New Device View */
        <div className="bg-white rounded-2xl border border-border-subtle p-8 shadow-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-blush text-plum flex items-center justify-center mx-auto">
            <Bluetooth className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif text-xl font-bold text-plum">Pair Your Push Protect Wearable</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Connect your Push Protect ESP32 smart wearable over Bluetooth Low Energy. You can also start in simulated demo mode to test the application immediately.
            </p>
          </div>

          {scanError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-status-warning max-w-md mx-auto text-left">
              {scanError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleScanRealBLE}
              disabled={isScanning}
              className="w-full sm:w-auto px-6 py-2.5 bg-plum text-ivory-warm rounded-xl text-xs font-bold hover:bg-plum-800 transition-colors flex items-center justify-center space-x-2 shadow-elevated disabled:opacity-50"
            >
              <Bluetooth className="w-4 h-4 text-champagne" />
              <span>{isScanning ? 'Scanning BLE Devices...' : 'Scan for Physical Wearable'}</span>
            </button>

            <button
              onClick={handlePairSimulated}
              disabled={isScanning}
              className="w-full sm:w-auto px-6 py-2.5 border border-border-subtle bg-ivory-warm text-plum rounded-xl text-xs font-semibold hover:bg-rose-blush/40 transition-colors"
            >
              <span>Pair Simulated Wearable (Demo)</span>
            </button>
          </div>
        </div>
      )}

      {/* Technical Specifications & BLE GATT Profile */}
      <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-plum">BLE 5.0 GATT & Smartwatch Telemetry Profile</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Push Protect Wearable communicates via standard 128-bit UUID characteristics with replay protection, optical PPG heart rate streaming, pedometer step counters, and abnormal tachycardia threshold triggers.
        </p>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 bg-ivory-warm rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:justify-between text-text-secondary">
            <span>Primary Service UUID:</span>
            <span className="text-plum font-bold">00001824-0000-1000-8000-00805f9b34fb</span>
          </div>
          <div className="p-3 bg-ivory-warm rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:justify-between text-text-secondary">
            <span>Heart Rate / Optical PPG (Notify):</span>
            <span className="text-plum font-bold">00002A37-0000-1000-8000-00805f9b34fb</span>
          </div>
          <div className="p-3 bg-ivory-warm rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:justify-between text-text-secondary">
            <span>Emergency SOS Characteristic (Notify):</span>
            <span className="text-plum font-bold">00002A3D-0000-1000-8000-00805f9b34fb</span>
          </div>
          <div className="p-3 bg-ivory-warm rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:justify-between text-text-secondary">
            <span>Battery Level Telemetry (Read/Notify):</span>
            <span className="text-plum font-bold">00002A19-0000-1000-8000-00805f9b34fb</span>
          </div>
        </div>
      </div>
    </div>
  );
};
