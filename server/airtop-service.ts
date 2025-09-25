// @ts-ignore - airtop-sdk doesn't have types yet
import Airtop from 'airtop-sdk';

interface AirtopConfig {
  apiKey: string;
  sessionLimit: number;
}

class AirtopService {
  private client: Airtop | null = null;
  private config: AirtopConfig | null = null;

  initialize(config: AirtopConfig) {
    this.config = config;
    this.client = new Airtop({ apiKey: config.apiKey });
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.client) {
      return { success: false, message: "Airtop not initialized" };
    }

    try {
      // Test by creating a session and immediately closing it
      const session = await this.client.sessions.create({
        configuration: { timeoutMs: 60000 }
      });
      
      await this.client.sessions.close(session.data.id);
      
      return { 
        success: true, 
        message: "Successfully connected to Airtop API" 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async enrichLeadProfile(lead: { firstName: string; lastName: string; email?: string }) {
    if (!this.client) {
      throw new Error("Airtop not initialized");
    }

    const session = await this.client.sessions.create({
      configuration: { timeoutMs: 300000 } // 5 minutes
    });

    try {
      // Search for the person on LinkedIn or other professional networks
      const searchQuery = `${lead.firstName} ${lead.lastName}`;
      
      // Navigate to LinkedIn and search for the person
      await this.client.windows.create({
        sessionId: session.data.id,
        url: "https://www.linkedin.com"
      });

      const result = await this.client.ai.query({
        sessionId: session.data.id,
        prompt: `Search for "${searchQuery}" on this page and extract professional information including current job title, company, industry, and any relevant professional details. Return the information in JSON format.`,
        maxCredits: 50
      });

      return {
        success: true,
        data: result.data,
        sessionId: session.data.id
      };
    } catch (error) {
      await this.client.sessions.close(session.data.id);
      throw error;
    }
  }

  async automateFormFilling(formUrl: string, formData: Record<string, string>) {
    if (!this.client) {
      throw new Error("Airtop not initialized");
    }

    const session = await this.client.sessions.create({
      configuration: { timeoutMs: 300000 }
    });

    try {
      await this.client.windows.create({
        sessionId: session.data.id,
        url: formUrl
      });

      const fillPrompt = Object.entries(formData)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      const result = await this.client.ai.query({
        sessionId: session.data.id,
        prompt: `Fill out the form on this page with the following information: ${fillPrompt}. Submit the form when complete.`,
        maxCredits: 100
      });

      await this.client.sessions.close(session.data.id);

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      await this.client.sessions.close(session.data.id);
      throw error;
    }
  }

  async monitorCompetitorPricing(competitorUrls: string[]) {
    if (!this.client) {
      throw new Error("Airtop not initialized");
    }

    const results = [];

    for (const url of competitorUrls) {
      const session = await this.client.sessions.create({
        configuration: { timeoutMs: 180000 } // 3 minutes
      });

      try {
        await this.client.windows.create({
          sessionId: session.data.id,
          url
        });

        const result = await this.client.ai.query({
          sessionId: session.data.id,
          prompt: "Extract all pricing information from this page including course prices, payment plans, and any promotional offers. Return the data in structured JSON format.",
          maxCredits: 75
        });

        results.push({
          url,
          success: true,
          data: result.data
        });

        await this.client.sessions.close(session.data.id);
      } catch (error) {
        await this.client.sessions.close(session.data.id);
        results.push({
          url,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }
}

export const airtopService = new AirtopService();