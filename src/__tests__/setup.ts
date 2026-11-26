// Global test setup file for Vitest
// Sets up environment variables needed for tests

// Never a real database: unit tests mock Prisma.
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = "test-jwt-secret-for-unit-testing-only";
process.env.ADMIN_EMAIL = "admin@saadsuhaib.local";
process.env.ADMIN_PASSWORD_HASH = "$2b$10$testHashForUnitTestingOnly";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
