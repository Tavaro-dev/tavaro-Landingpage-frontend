import type { ServiceErrorCode } from "../booking/types";

export class DomainError extends Error {
  readonly code: ServiceErrorCode;

  constructor(code: ServiceErrorCode, message?: string) {
    super(message ?? code);
    this.name = "DomainError";
    this.code = code;
  }
}
