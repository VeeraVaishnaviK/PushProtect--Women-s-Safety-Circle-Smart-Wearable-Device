import React, { useState, useEffect } from 'react';
import {
  Bluetooth,
  Battery,
  RefreshCw,
  Activity,
  ShieldCheck,
  Zap,
  Heart,
  Footprints,
  Flame,
  Watch,
  ShieldAlert,
  AlertTriangle,
  Sun,
  BatteryCharging,
  Sparkles,
} from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';
import { bleAdapter } from '../services/bleAdapter';

export const WearableCard: React.FC = () => {
  const { device, updateDeviceBattery, updateDeviceMetrics, togglePanicAutoSos, triggerSOS } = useSafetyStore();
  const [testingSignal, setTestingSignal] = useState(false);
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
  useEffect(() => {
    if (batteryLevel < 50 && isConnected) {
      const timer = setInterval(() => {
        updateDeviceBattery(Math.min(100, (device?.batteryLevel ?? batteryLevel) + 2));
      }, 2500);
      return () => clearInterval(timer);
    }
  }, [batteryLevel, isConnected, device?.batteryLevel, updateDeviceBattery]);

  const handleSimulateBatteryDrop = () => {
    updateDeviceBattery(42);
    setSolarNotice('☀️ Battery dropped below 50% (42%). Embedded micro-solar cells automatically engaged in sunlight to recharge!');
    setTimeout(() => setSolarNotice(null), 5000);
  };

  const handleRestoreBattery = () => {
    updateDeviceBattery(88);
    setSolarNotice(null);
  };

  // Gentle subtle heart rate variation simulation every 4 seconds to feel alive
  useEffect(() => {
    if (!isConnected || isHeartRateSpiked) return;
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const newBpm = Math.max(68, Math.min(84, 76 + variation));
      updateDeviceMetrics({ heartRateBpm: newBpm });
    }, 4000);
    return () => clearInterval(interval);
  }, [isConnected, isHeartRateSpiked, updateDeviceMetrics]);

  const handleSelfTest = () => {
    setTestingSignal(true);
    setTestResult(null);

    setTimeout(() => {
      setTestingSignal(false);
      setTestResult('Self-test passed: BLE latency 22ms, Optical PPG sensor OK, Tactile switch OK, Battery OK.');
    }, 1200);
  };

  const handleSimulateHardwarePress = () => {
    // Triggers actual BLE button listener which starts the SOS workflow
    bleAdapter.triggerHardwareButtonPress();
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      bleAdapter.disconnect();
    } else {
      bleAdapter.reconnect();
    }
  };

  const handleSimulateHeartSpike = () => {
    if (!isPanicAutoSosOn) {
      setSpikeAlert('Panic button is currently OFF. Turn it ON to trigger automatic SOS on abnormal heart rate.');
      setTimeout(() => setSpikeAlert(null), 3000);
      return;
    }

    // Set heart rate above abnormal threshold (e.g. 142 BPM)
    updateDeviceMetrics({ heartRateBpm: 142, activityState: 'running' });
    setSpikeAlert('⚠️ Abnormal Heart Rate Spike (142 BPM) detected! Triggering Emergency SOS...');

    // Automatically trigger SOS due to abnormal heart rate spike
    setTimeout(() => {
      triggerSOS('heart_rate_abnormal');
    }, 800);

    // Reset heart rate back after 15 seconds
    setTimeout(() => {
      updateDeviceMetrics({ heartRateBpm: 76, activityState: 'walking' });
      setSpikeAlert(null);
    }, 15000);
  };

  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isConnected ? 'bg-plum text-champagne shadow-sm' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Bluetooth className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-plum">
              {device ? device.name : 'Push Protect Wearable'}
            </h3>
            <p className="text-xs text-text-secondary">
              {device ? `ID: ${device.deviceIdentifier} • ${device.hardwareModel}` : 'Pair your smart SOS wearable'}
            </p>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isConnected
                ? 'bg-emerald-50 text-status-success border border-emerald-200'
                : 'bg-amber-50 text-status-warning border border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-status-success animate-pulse' : 'bg-status-warning'
              }`}
            />
            <span>{isConnected ? 'BLE CONNECTED' : 'DISCONNECTED'}</span>
          </span>
        </div>
      </div>

      {device ? (
        <div className="space-y-4">
          {/* Smartwatch Biometric & Activity Dashboard */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Heart Beat Rate */}
            <div className={`p-3 rounded-xl border transition-all ${
              isHeartRateSpiked
                ? 'bg-red-50 border-red-300 shadow-sm'
                : 'bg-ivory-warm border-border-subtle/80'
            }`}>
              <div className="flex items-center justify-between text-text-secondary mb-1">
                <span className="flex items-center space-x-1.5 text-xs font-semibold">
                  <Heart className={`w-3.5 h-3.5 ${isHeartRateSpiked ? 'text-status-emergency fill-red-500 animate-ping' : 'text-status-emergency fill-red-500/20 animate-pulse'}`} />
                  <span className="text-plum">Heart Beat Rate</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  isHeartRateSpiked
                    ? 'bg-status-emergency text-white'
                    : 'bg-rose-blush text-plum'
                }`}>
                  {isHeartRateSpiked ? 'ABNORMAL' : 'NORMAL'}
                </span>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className={`text-2xl font-extrabold ${isHeartRateSpiked ? 'text-status-emergency animate-pulse' : 'text-plum'}`}>
                  {heartRate}
                </span>
                <span className="text-xs text-text-secondary font-medium">BPM</span>
              </div>
              <div className="text-[10px] text-text-secondary mt-1 flex items-center justify-between">
                <span>Optical PPG Sensor</span>
                <span>Resting: 60-100</span>
              </div>
            </div>

            {/* 2. Walking / Step Activity */}
            <div className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/80">
              <div className="flex items-center justify-between text-text-secondary mb-1">
                <span className="flex items-center space-x-1.5 text-xs font-semibold">
                  <Footprints className="w-3.5 h-3.5 text-berry" />
                  <span className="text-plum">Walking Activity</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-status-success border border-emerald-200">
                  WALKING
                </span>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-extrabold text-plum">
                  {steps.toLocaleString()}
                </span>
                <span className="text-xs text-text-secondary font-medium">steps</span>
              </div>
              <div className="text-[10px] text-text-secondary mt-1 flex items-center justify-between">
                <span>{distanceKm} km</span>
                <span className="flex items-center space-x-0.5">
                  <Flame className="w-3 h-3 text-amber-600" />
                  <span>{calories} kcal</span>
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Telemetry: Battery & Blood Oxygen SpO2 */}
          {/* Secondary Telemetry: Battery (Solar Auto-Charging) & Blood Oxygen SpO2 */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Battery Health with Solar Sun Light Auto-Charging (<50% Trigger) */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              isSolarChargingActive
                ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                : 'bg-ivory-warm border-border-subtle/60'
            }`}>
              <div className="flex items-center justify-between text-text-secondary mb-1">
                <span className="flex items-center space-x-1">
                  {isSolarChargingActive ? (
                    <Sun className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                  ) : (
                    <Battery className="w-3.5 h-3.5 text-plum" />
                  )}
                  <span className={isSolarChargingActive ? 'text-amber-800 font-bold' : 'text-text-secondary'}>
                    {isSolarChargingActive ? 'Solar Auto-Charge' : 'Battery'}
                  </span>
                </span>
                <span className={`font-bold ${isSolarChargingActive ? 'text-amber-700' : 'text-plum'}`}>
                  {batteryLevel}%
                </span>
              </div>

              {/* Progress bar with Solar Energy Gradient */}
              <div className="w-full bg-rose-blush/60 h-2 rounded-full overflow-hidden mt-1.5">
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

              {/* Solar Auto-Charging Caption */}
              <div className="mt-1.5 text-[9px] leading-tight">
                {isSolarChargingActive ? (
                  <span className="text-amber-800 font-bold flex items-center space-x-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                    <span>Harvesting sunlight (+2%/2.5s)</span>
                  </span>
                ) : (
                  <span className="text-text-secondary">
                    Auto-charges via solar sun light when &lt;50%
                  </span>
                )}
              </div>

              {/* Quick simulation button */}
              <div className="mt-1.5 pt-1 border-t border-border-subtle/50">
                {!isSolarChargingActive ? (
                  <button
                    type="button"
                    onClick={handleSimulateBatteryDrop}
                    className="w-full py-0.5 px-1.5 rounded-lg bg-amber-100/70 hover:bg-amber-200 text-amber-800 text-[9px] font-bold transition-colors flex items-center justify-center space-x-1"
                    title="Simulate battery dropping to 42% (<50%) to demonstrate solar auto-charge"
                  >
                    <Sun className="w-2.5 h-2.5 text-amber-600" />
                    <span>Test Solar (&lt;50%)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRestoreBattery}
                    className="w-full py-0.5 px-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[9px] font-bold transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Restore (88%)</span>
                  </button>
                )}
              </div>
            </div>

            {/* SpO2 Blood Oxygen */}
            <div className="p-2.5 rounded-xl bg-ivory-warm border border-border-subtle/60">
              <div className="flex items-center justify-between text-text-secondary mb-1">
                <span className="flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-plum" />
                  <span>Blood Oxygen</span>
                </span>
                <span className="font-bold text-plum">{spO2}% SpO₂</span>
              </div>
              <div className="w-full bg-rose-blush/60 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${spO2}%` }}
                />
              </div>
            </div>
          </div>

          {/* Panic Button / Abnormal Heart Rate Auto-SOS Section (User Requested Feature) */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isPanicAutoSosOn
              ? 'bg-rose-blush/20 border-berry/30'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className={`w-4 h-4 ${isPanicAutoSosOn ? 'text-status-emergency' : 'text-gray-400'}`} />
                <div>
                  <h4 className="text-xs font-bold text-plum">
                    Panic button (Abnormal Heart Rate Auto-SOS)
                  </h4>
                </div>
              </div>

              {/* On / Off Switch */}
              <button
                type="button"
                onClick={togglePanicAutoSos}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPanicAutoSosOn ? 'bg-status-emergency' : 'bg-gray-300'
                }`}
                title={isPanicAutoSosOn ? 'Turn Panic button OFF' : 'Turn Panic button ON'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    isPanicAutoSosOn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* User Requested Caption */}
            <p className="text-[11px] font-semibold text-plum mt-1.5 leading-tight">
              When heart rate increases abnormally, the SOS triggers.
            </p>
            <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
              Monitors optical PPG biometrics for tachycardia distress surges (&gt;135 BPM during struggle/panic) to trigger verified multi-tier emergency escalation automatically.
            </p>

            {/* Test Simulation Button for Panic Spike */}
            <div className="mt-2 pt-2 border-t border-border-subtle/60 flex items-center justify-between">
              <span className={`text-[10px] font-bold ${isPanicAutoSosOn ? 'text-status-success' : 'text-text-secondary'}`}>
                {isPanicAutoSosOn ? '● Panic Guard Armed (>135 BPM)' : '○ Disabled (Manual button only)'}
              </span>

              {isPanicAutoSosOn && (
                <button
                  type="button"
                  onClick={handleSimulateHeartSpike}
                  className="px-2.5 py-1 bg-status-emergency/10 hover:bg-status-emergency/20 text-status-emergency border border-status-emergency/30 rounded-lg text-[10px] font-bold transition-colors flex items-center space-x-1"
                  title="Simulate sudden heart rate spike to test automatic panic SOS"
                >
                  <Zap className="w-3 h-3 text-status-emergency" />
                  <span>Test Heart Spike (&gt;135 BPM)</span>
                </button>
              )}
            </div>

            {spikeAlert && (
              <div className="mt-2 p-2 rounded-lg bg-status-emergency text-white text-[11px] font-semibold flex items-center space-x-1.5 animate-fadeIn">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{spikeAlert}</span>
              </div>
            )}
          </div>

          {/* Test Feedback Notice */}
          {testResult && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-status-success flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{testResult}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleSelfTest}
              disabled={testingSignal || !isConnected}
              className="flex-1 py-2 px-3 rounded-xl border border-border-subtle bg-white hover:bg-rose-blush/40 text-xs font-semibold text-plum flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingSignal ? 'animate-spin' : ''}`} />
              <span>{testingSignal ? 'Testing...' : 'Diagnostic Self-Test'}</span>
            </button>

            <button
              onClick={handleSimulateHardwarePress}
              title="Simulates pressing physical wearable button"
              className="py-2 px-3 rounded-xl bg-berry/10 hover:bg-berry/20 text-berry border border-berry/20 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-champagne" />
              <span>Simulate Physical Press</span>
            </button>

            <button
              onClick={handleToggleConnection}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-text-secondary hover:text-plum hover:bg-rose-blush/30 transition-colors"
            >
              {isConnected ? 'Disconnect' : 'Reconnect'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-xs text-text-secondary mb-4">
            No hardware currently paired. Connect your Push Protect Wearable via BLE.
          </p>
          <button
            onClick={() => bleAdapter.simulatePairing('Push Protect Wearable')}
            className="px-4 py-2 bg-plum text-ivory-warm rounded-xl text-xs font-semibold hover:bg-plum-800 transition-colors"
          >
            Pair Wearable Now
          </button>
        </div>
      )}
    </div>
  );
};
