-- Initialize PostgreSQL databases for La Internacional CRM

-- Main database (lid)
-- Provided via POSTGRES_DB env var, just ensure it exists
SELECT 'Main database (lid) ready' as status;

-- Postsale database
CREATE DATABASE lid_postsale;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE lid TO postgres;
GRANT ALL PRIVILEGES ON DATABASE lid_postsale TO postgres;

SELECT 'Databases initialized successfully' as status;
