import { AOI_CONFIG } from '../config/aoiConfig';
import { supabase } from './supabase';

export interface AoiMessage {
  question: string;
  context?: Record<string, any>;
}

export interface AoiResponse {
  response: string;
  context?: Record<string, any>;
  source: 'foundation' | 'local';
  foundationUrl?: string;
}

class AoiApiClient {
  private async getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  async chat(message: AoiMessage): Promise<AoiResponse> {
    const token = await this.getAuthToken();

    if (AOI_CONFIG.features.useFoundationApi) {
      try {
        const response = await this.chatWithFoundation(message, token);
        return response;
      } catch (error) {
        console.warn('Foundation API unavailable, falling back to local:', error);

        if (AOI_CONFIG.features.fallbackToLocal) {
          return this.chatWithLocal(message, token);
        }

        throw error;
      }
    }

    return this.chatWithLocal(message, token);
  }

  private async chatWithFoundation(
    message: AoiMessage,
    token: string | null
  ): Promise<AoiResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Source-Domain': AOI_CONFIG.app.domain,
    };

    if (token && AOI_CONFIG.features.crossDomainAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(AOI_CONFIG.foundation.apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Foundation API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      response: data.response,
      context: data.context,
      source: 'foundation',
      foundationUrl: AOI_CONFIG.foundation.websiteUrl,
    };
  }

  private async chatWithLocal(
    message: AoiMessage,
    token: string | null
  ): Promise<AoiResponse> {
    const { data, error } = await supabase.functions.invoke('aoi-chat', {
      body: message,
    });

    if (error) throw error;

    return {
      response: data.response,
      context: data.context,
      source: 'local',
    };
  }

  async checkFoundationStatus(): Promise<boolean> {
    try {
      const response = await fetch(AOI_CONFIG.foundation.statusUrl, {
        method: 'GET',
        headers: {
          'X-Source-Domain': AOI_CONFIG.app.domain,
        },
      });

      return response.ok;
    } catch (error) {
      console.warn('Foundation status check failed:', error);
      return false;
    }
  }

  getFoundationLinks() {
    return {
      home: AOI_CONFIG.foundation.websiteUrl,
      aboutAoi: AOI_CONFIG.foundation.aboutUrl,
      learnMore: `${AOI_CONFIG.foundation.websiteUrl}/learn`,
      donate: `${AOI_CONFIG.foundation.websiteUrl}/donate`,
      research: `${AOI_CONFIG.foundation.websiteUrl}/research`,
    };
  }
}

export const aoiApiClient = new AoiApiClient();
