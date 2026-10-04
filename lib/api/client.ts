import { ServiceErrorCode } from "../booking/types";
import { DomainError } from "./errors";

/**
 * Minimal API Client boundary for future backend integration.
 * This ensures React components never see fetch(), Authorization headers,
 * or raw HTTP status codes.
 * 
 * Future ApiBookingService and ApiPaymentService implementations will use this client
 * instead of raw fetch() calls.
 */
export class ApiClient {
  private baseUrl = "/api";

  // In the future, this is where authentication tokens will be securely injected
  // so that React components never need to pass tokens manually.
  private async getHeaders(): Promise<HeadersInit> {
    return {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${await getAuthToken()}`
    };
  }

  // Example of translating raw HTTP errors to domain errors
  private mapHttpErrorToDomain(status: number): ServiceErrorCode {
    switch (status) {
      case 400: return "VALIDATION_ERROR";
      case 401: return "UNAUTHORIZED";
      case 402: return "PAYMENT_FAILED";
      case 404: return "UNAVAILABLE";
      case 409: return "BOOKING_FAILED";
      default: return "UNKNOWN";
    }
  }

  async get<T>(path: string): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: "GET",
        headers: await this.getHeaders(),
      });
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("NETWORK_ERROR");
    }
    
    if (!response.ok) {
      throw new DomainError(this.mapHttpErrorToDomain(response.status));
    }
    return response.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: await this.getHeaders(),
        body: JSON.stringify(body),
      });
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("NETWORK_ERROR");
    }
    
    if (!response.ok) {
      throw new DomainError(this.mapHttpErrorToDomain(response.status));
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();
