// Global test setup file for Vitest
// Sets up environment variables needed for tests

process.env.DATABASE_URL = "file:./prisma/dev.db";
process.env.JWT_SECRET = "test-jwt-secret-for-unit-testing-only";
process.env.ADMIN_EMAIL = "admin@saadsuhaib.local";
process.env.ADMIN_PASSWORD_HASH = "$2b$10$testHashForUnitTestingOnly";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
