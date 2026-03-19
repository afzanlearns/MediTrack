package com.meditrack.exception;

/**
 * Thrown when a business-level validation rule fails.
 * For example: trying to generate doses for a date before a medication's start date.
 * Caught by GlobalExceptionHandler and returned as a 400 response.
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }
}
