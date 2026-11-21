export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
    }
}

export class ValidationError extends AppError {
    constructor(message, details = []) {
        super(message, 400);
        this.name = "ValidationError";
        this.details = details;
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Recurso no encontrado.") {
        super(message, 404);
        this.name = "NotFoundError";
    }
}
