interface OptInOutPayload {
  type: 'optin' | 'optout';
  recipients: {
    recipient: string;
    source: string;
    user_agent: string;
    ip: string;
  }[];
}

export class OptService {
  private readonly API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.netcorecloud.com';

  async optIn(phoneNumber: string): Promise<void> {
    const payload: OptInOutPayload = {
      type: 'optin',
      recipients: [
        {
          recipient: phoneNumber,
          source: 'User',
          user_agent: 'APP',
          ip: '0.0.0.0'
        }
      ]
    };

    await this.makeRequest(payload);
  }

  async optOut(phoneNumber: string): Promise<void> {
    const payload: OptInOutPayload = {
      type: 'optout',
      recipients: [
        {
          recipient: phoneNumber,
          source: 'User',
          user_agent: 'APP',
          ip: '0.0.0.0'
        }
      ]
    };

    await this.makeRequest(payload);
  }

  private async makeRequest(payload: OptInOutPayload): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/opt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required authentication headers here
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error making opt-in/out request:', error);
      throw error;
    }
  }
} 