CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "resetToken" VARCHAR(255),
    "resetTokenExpires" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_email ON "user" (email);
