// Custom Error Class để quản lý các lỗi định danh (AppError)
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // isOperational: Để phân biệt lỗi do logic của chúng ta (404, 400) 
    // và lỗi hệ thống không mong muốn (crash, lỗi thư viện)
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
