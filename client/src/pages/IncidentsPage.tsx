import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock, ShieldAlert, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';

export const IncidentsPage: React.FC = () => {
  const { activeIncident, incidentHistory } = useSafetyStore();

  const allIncidents = [
    ...(activeIncident ? [activeIncident] : []),
    ...incidentHistory,
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-plum">
          Incident Audit Records
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Complete cryptographic and chronological history of all emergency activations and drills.
        </p>
      </div>

      {allIncidents.length > 0 ? (
        <div className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-soft divide-y divide-border-subtle">
          {allIncidents.map((inc) => (
            <Link
              key={inc.id}
              to={`/app/incidents/${inc.incidentId}`}
              className="p-5 flex items-center justify-between hover:bg-ivory-warm transition-colors block"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    inc.status === 'resolved'
                      ? 'bg-emerald-50 text-status-success'
                      : inc.status === 'cancelled'
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-status-emergency/10 text-status-emergency'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-plum">
                      #{inc.incidentId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        inc.status === 'resolved'
                          ? 'bg-emerald-100 text-status-success'
                          : inc.status === 'cancelled'
                          ? 'bg-gray-200 text-text-secondary'
                          : 'bg-status-emergency text-white animate-pulse'
                      }`}
                    >
                      {inc.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary mt-1 flex items-center space-x-2">
                    <span>Activated via {inc.source.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{new Date(inc.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-text-secondary hidden sm:inline">
                  {inc.timeline.length} events logged
                </span>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border-subtle p-12 text-center space-y-3 shadow-soft">
          <CheckCircle2 className="w-12 h-12 text-status-success mx-auto opacity-70" />
          <h3 className="font-serif text-lg font-bold text-plum">No Incident Records Found</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Your safety circle is active and ready. When an SOS is activated or a practice drill is run, the full audit trail appears here.
          </p>
          <div className="pt-2">
            <Link
              to="/app/practice"
              className="px-4 py-2 bg-plum text-ivory-warm rounded-xl text-xs font-semibold hover:bg-plum-800 transition-colors inline-block"
            >
              Run a Safe Practice Drill
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
