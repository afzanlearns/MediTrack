CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    google_id       VARCHAR(255) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    full_name       VARCHAR(255),
    avatar_url      VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
