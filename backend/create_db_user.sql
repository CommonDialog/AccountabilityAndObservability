-- Database User Setup Script
-- Run this script as the postgres superuser to create the milwaukee_user

-- Create the database user
CREATE USER milwaukee_user WITH PASSWORD 'SuperSecretPassword!2025';

-- Grant connection privileges to the database
GRANT CONNECT ON DATABASE food_eval_db TO milwaukee_user;

-- Connect to the food_eval_db database first, then run the following:
-- \c food_eval_db

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO milwaukee_user;

-- Grant privileges on all tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO milwaukee_user;

-- Grant privileges on all sequences (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO milwaukee_user;

-- Grant privileges on future tables (so new tables automatically get permissions)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO milwaukee_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO milwaukee_user;

-- Grant privileges on the view
GRANT SELECT ON food_submissions_complete TO milwaukee_user;

-- Verify the user was created successfully
\du milwaukee_user
