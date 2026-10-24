/**
 * Push Protect HTTP API Service
 * Handles network calls between the React frontend and NestJS backend (/api/v1).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const api = {
  // Incidents
  async createIncident(payload: any) {
    const res = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to trigger incident: ${res.statusText}`);
    return res.json();
  },

  async getIncidents() {
    const res = await fetch(`${API_BASE_URL}/incidents`);
    if (!res.ok) throw new Error(`Failed to fetch incidents: ${res.statusText}`);
    return res.json();
  },

  async getIncidentById(id: string) {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch incident: ${res.statusText}`);
    return res.json();
  },

  async acknowledgeIncident(id: string, contactId: string) {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}/acknowledgements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId }),
    });
    if (!res.ok) throw new Error(`Failed to acknowledge incident: ${res.statusText}`);
    return res.json();
  },

  async resolveIncident(id: string, notes?: string) {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error(`Failed to resolve incident: ${res.statusText}`);
    return res.json();
  },

  async cancelIncident(id: string) {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to cancel incident: ${res.statusText}`);
    return res.json();
  },

  // Contacts
  async getContacts() {
    const res = await fetch(`${API_BASE_URL}/contacts`);
    if (!res.ok) throw new Error(`Failed to fetch contacts: ${res.statusText}`);
    return res.json();
  },

  async addContact(payload: any) {
    const res = await fetch(`${API_BASE_URL}/contacts/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to add contact: ${res.statusText}`);
    return res.json();
  },

  // Journeys
  async startJourney(payload: any) {
    const res = await fetch(`${API_BASE_URL}/journeys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to start journey: ${res.statusText}`);
    return res.json();
  },

  async checkInJourney(id: string) {
    const res = await fetch(`${API_BASE_URL}/journeys/${id}/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to check in journey: ${res.statusText}`);
    return res.json();
  },
};
