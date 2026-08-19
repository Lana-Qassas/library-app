export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(code: string, statusCode: number, message?: string) {
    super(message ?? code);
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
