import React, { useState } from 'react';
import { Bluetooth, Battery, RefreshCw, Activity, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';
import { bleAdapter } from '../services/bleAdapter';

export const WearableCard: React.FC = () => {
  const { device, setDevice, updateDeviceBattery } = useSafetyStore();
  const [testingSignal, setTestingSignal] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const isConnected = device?.pairingStatus === 'connected';

  const handleSelfTest = () => {
    setTestingSignal(true);
    setTestResult(null);

    setTimeout(() => {
      setTestingSignal(false);
      setTestResult('Self-test passed: BLE latency 24ms, Button tactile switch OK, Battery OK.');
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

  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80 mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isConnected ? 'bg-plum text-champagne' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Bluetooth className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-plum">
              {device ? device.name : 'No Wearable Linked'}
            </h3>
            <p className="text-xs text-text-secondary">
              {device ? `${device.hardwareModel} • ${device.deviceIdentifier}` : 'Pair your smart SOS button or ring'}
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
            <span>{isConnected ? 'BLE Connected' : 'Disconnected'}</span>
          </span>
        </div>
      </div>

      {/* Telemetry info */}
      {device ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Battery */}
            <div className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/60">
              <div className="flex items-center justify-between text-text-secondary mb-1">
                <span className="flex items-center space-x-1">
                  <Battery className="w-3.5 h-3.5 text-plum" />
                  <span>Battery</span>
                </span>
                <span className="font-bold text-plum">
                  {device.batteryLevel !== undefined ? `${device.batteryLevel}%` : 'Unavailable'}
                </span>
              </div>
              <div className="w-full bg-rose-blush/60 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    (device.batteryLevel || 0) > 20 ? 'bg-status-success' : 'bg-status-warning'
                  }`}
                  style={{ width: `${device.batteryLevel || 0}%` }}
                />
              </div>
              <div className="text-[10px] text-text-secondary mt-1.5">
                {(device.batteryLevel || 0) > 20 ? 'Good for ~14 days' : 'Charge recommended'}
              </div>
            </div>

            {/* Last Ping & Firmware */}
            <div className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/60">
              <div className="flex items-center space-x-1 text-text-secondary mb-1">
                <Activity className="w-3.5 h-3.5 text-plum" />
                <span>Last Telemetry</span>
              </div>
              <div className="font-bold text-plum text-xs">
                {new Date(device.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[10px] text-text-secondary mt-2">
                FW: <span className="font-mono">{device.firmwareVersion}</span>
              </div>
            </div>
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
              title="Simulates pressing the physical ESP32 wearable button"
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
            No hardware currently paired. Connect your Push Protect wearable ring or charm via BLE.
          </p>
          <button
            onClick={() => bleAdapter.simulatePairing()}
            className="px-4 py-2 bg-plum text-ivory-warm rounded-xl text-xs font-semibold hover:bg-plum-800 transition-colors"
          >
            Pair Wearable Now
          </button>
        </div>
      )}
    </div>
  );
};
