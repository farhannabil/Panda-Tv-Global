export interface IPTVResponse {
  status: string;
  message: string;
  user_id?: string;
  url?: string;
  code?: string;
  username?: string;
  password?: string;
  credits?: string;
  lines_count?: string;
  active_lines?: string;
  exp_date?: string;
  [key: string]: any;
}

export const iptvService = {
  async provision(type: 'mag' | 'm3u', identifier: string, sub: string, pack: string, resellerUid: string): Promise<IPTVResponse> {
    const response = await fetch('/api/provision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, identifier, sub, pack, resellerUid })
    });
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  },

  async renew(type: 'mag' | 'm3u', identifier: string, sub: string, resellerUid: string): Promise<IPTVResponse> {
    const response = await fetch('/api/renew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, identifier, sub, resellerUid })
    });
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  },

  async getPackages(): Promise<any> {
    const response = await fetch('/api/packages', { method: 'POST' });
    return await response.json();
  },

  async getResellerInfo(resellerUid?: string): Promise<IPTVResponse> {
    const response = await fetch('/api/reseller-info', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resellerUid })
    });
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  },

  async syncReseller(resellerUid: string): Promise<IPTVResponse> {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resellerUid })
    });
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  },

  async syncAllResellers(): Promise<any> {
    const response = await fetch('/api/sync-all-resellers', { method: 'POST' });
    return await response.json();
  }
};
