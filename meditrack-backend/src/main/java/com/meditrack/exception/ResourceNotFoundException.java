package com.meditrack.exception;

/**
 * Thrown when an entity cannot be found by its ID.
 * Caught by GlobalExceptionHandler and returned as a 404 response.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String entityName, Long id) {
        super(entityName + " not found with id: " + id);
    }
}
