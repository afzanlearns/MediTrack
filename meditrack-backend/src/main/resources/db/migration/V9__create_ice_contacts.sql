CREATE TABLE ice_contacts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(255)    NOT NULL,
    relationship    VARCHAR(100)    NOT NULL,   -- e.g. Spouse, Parent, Sibling
    phone_primary   VARCHAR(20)     NOT NULL,
    phone_secondary VARCHAR(20),
    email           VARCHAR(255),
    priority_order  INT             NOT NULL DEFAULT 1,  -- 1 = call first
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
