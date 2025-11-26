-- Food Evaluation System Database Schema

-- Team members table
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    allergies TEXT[], -- Array of allergens
    healthiness_factor INTEGER CHECK (healthiness_factor >= 1 AND healthiness_factor <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food submissions table
CREATE TABLE food_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    raw_data JSONB NOT NULL, -- Store the original JSON data
    final_score DECIMAL(5,2),
    rejected BOOLEAN DEFAULT FALSE,
    rejection_reason TEXT,
    requires_human_review BOOLEAN DEFAULT FALSE,
    reviewed BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR(100)
);

-- Food ratings table (stores individual ratings for each food)
CREATE TABLE food_ratings (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES food_submissions(id) ON DELETE CASCADE,
    price INTEGER CHECK (price >= 1 AND price <= 10),
    messiness INTEGER CHECK (messiness >= 1 AND messiness <= 10),
    heaviness INTEGER CHECK (heaviness >= 1 AND heaviness <= 10),
    energy_boost INTEGER CHECK (energy_boost >= 1 AND energy_boost <= 10),
    healthiness INTEGER CHECK (healthiness >= 1 AND healthiness <= 10),
    shareability INTEGER CHECK (shareability >= 1 AND shareability <= 10),
    protein INTEGER CHECK (protein >= 1 AND protein <= 10),
    spiciness INTEGER CHECK (spiciness >= 1 AND spiciness <= 10),
    happiness INTEGER CHECK (happiness >= 1 AND happiness <= 10),
    allergens TEXT[],
    nutritional_score INTEGER CHECK (nutritional_score >= 1 AND nutritional_score <= 10) -- From LLM tool call
);

-- Food type classifications (for four-fifths rule tracking)
CREATE TABLE food_type_classifications (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES food_submissions(id) ON DELETE CASCADE,
    classification_key VARCHAR(100) NOT NULL, -- e.g., "high_healthiness", "medium_protein"
    factor_name VARCHAR(50) NOT NULL, -- e.g., "healthiness", "protein"
    level VARCHAR(20) NOT NULL, -- "high", "medium", "low"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(submission_id, classification_key)
);

-- Decision reasons table (logs all reasoning steps)
CREATE TABLE decision_reasons (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES food_submissions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    reason_type VARCHAR(50), -- e.g., "evaluation", "bias_detection", "allergen_check"
    reason_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuration table
CREATE TABLE system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Four-fifths rule tracking
CREATE TABLE compliance_tracking (
    id SERIAL PRIMARY KEY,
    classification_key VARCHAR(100) NOT NULL,
    total_submissions INTEGER DEFAULT 0,
    flagged_for_review INTEGER DEFAULT 0,
    pass_rate DECIMAL(5,2),
    compliant BOOLEAN,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default team members
INSERT INTO team_members (name, allergies, healthiness_factor) VALUES
    ('Chris', '{}', 7),
    ('Amanda', '{}', 8),
    ('Andy', '{}', 6),
    ('Ximena', '{}', 9),
    ('Intern Kevin', '{peanuts}', 5);

-- Insert default configuration
INSERT INTO system_config (config_key, config_value) VALUES
    ('rating_weights', '{"price": 1.0, "messiness": 1.0, "heaviness": 1.0, "energy_boost": 1.0, "healthiness": 1.0, "shareability": 1.0, "protein": 1.0, "spiciness": 1.0, "happiness": 1.0}'),
    ('review_threshold', '40'),
    ('review_percentage', '10'),
    ('four_fifths_threshold', '0.8');

-- Create indexes for performance
CREATE INDEX idx_food_submissions_submitted_at ON food_submissions(submitted_at);
CREATE INDEX idx_food_type_classifications_key ON food_type_classifications(classification_key);
CREATE INDEX idx_decision_reasons_submission ON decision_reasons(submission_id);
CREATE INDEX idx_food_ratings_submission ON food_ratings(submission_id);

-- Create view for easy querying of complete food data
CREATE VIEW food_submissions_complete AS
SELECT 
    fs.id,
    fs.name,
    fs.submitted_at,
    fs.final_score,
    fs.rejected,
    fs.rejection_reason,
    fs.requires_human_review,
    fs.reviewed,
    fr.price,
    fr.messiness,
    fr.heaviness,
    fr.energy_boost,
    fr.healthiness,
    fr.shareability,
    fr.protein,
    fr.spiciness,
    fr.happiness,
    fr.allergens,
    fr.nutritional_score
FROM food_submissions fs
LEFT JOIN food_ratings fr ON fs.id = fr.submission_id;
