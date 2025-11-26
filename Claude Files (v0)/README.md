# Late Night Dev Food Evaluator 🍕

An AI-powered food evaluation system designed to help development teams choose the best food options for late-night coding sessions. The system uses a multi-step LLM agent simulation to evaluate food based on multiple factors, detect bias, check allergens, and ensure compliance with the four-fifths rule.

## Features

### Core Functionality
- **Multi-step LLM Agent**: 10-step evaluation process with detailed reasoning
- **Bias Detection**: Identifies when users request unhealthy options
- **Pineapple Pizza Filter**: Automatically rejects pineapple on pizza with creative excuses
- **Allergen Checking**: Compares food allergens against team member allergies
- **Nutritional Tool Call**: Simulated LLM tool that provides nutritional scores (1-10 random)
- **Weighted Scoring**: Configurable weights for all evaluation factors
- **Human Review Queue**: Flags low-scoring foods for manual review
- **Four-Fifths Rule Compliance**: Tracks adverse impact across food classifications

### Rating Factors
Each food is evaluated on a 1-10 scale for:
- **Price**: Cost-effectiveness
- **Messiness**: Impact on workspace cleanliness
- **Heaviness**: Post-meal energy levels
- **Energy Boost**: Sustained alertness
- **Healthiness**: Nutritional value
- **Shareability**: Team-friendliness
- **Protein**: Satiety and muscle support
- **Spiciness**: Digestive comfort
- **Happiness**: Mood enhancement

### Team Management
- Configure team members with custom allergies
- Set individual healthiness preferences (1-10)
- Default team includes: Chris, Amanda, Andy, Ximena, and Intern Kevin (with peanut allergy)

### Compliance & Logging
- All submissions logged with timestamp
- Complete decision reasoning stored
- Food type classifications (high/medium/low for each factor)
- Four-fifths rule tracking after 20+ submissions per type
- Compliance reports showing pass/fail rates

## Technology Stack

- **Frontend**: React 18 with modern hooks
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with comprehensive schema
- **File Upload**: Multer for JSON processing
- **No Dummy Data**: Real errors shown when backend unavailable

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### 1. Database Setup

First, create the PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE food_eval_db;

# Exit psql
\q

# Run the schema
psql -U postgres -d food_eval_db -f database/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set environment variables (optional, defaults work for local dev)
export DB_USER=postgres
export DB_HOST=localhost
export DB_NAME=food_eval_db
export DB_PASSWORD=postgres
export DB_PORT=5432
export PORT=3001

# Start the server
npm start

# Or use nodemon for development
npm run dev
```

The backend will start on http://localhost:3001

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on http://localhost:3000 and automatically open in your browser.

## Usage Guide

### 1. Evaluate Food Options

1. Navigate to the "Evaluate Food" tab
2. Click "Choose JSON file..." and select a food options file
3. Click "Evaluate Foods"
4. View ranked results with AI reasoning

**JSON Format:**
```json
[
  {
    "name": "Pizza Margherita",
    "price": 7,
    "messiness": 5,
    "heaviness": 6,
    "energy_boost": 6,
    "healthiness": 5,
    "shareability": 9,
    "protein": 6,
    "spiciness": 2,
    "happiness": 8,
    "allergens": ["gluten", "dairy"]
  }
]
```

### 2. Search History

Search previously submitted foods by name or rejection reason. Filter to show only rejected items to learn from past failures.

### 3. Review Queue

Foods flagged for human review appear here. A reviewer can:
- View complete AI evaluation
- See all ratings and scores
- Approve and mark as reviewed

Items are flagged when:
- Score falls below configured threshold (default: 4.0)
- Random selection (configurable percentage, default: 10%)

### 4. Team Settings

- Edit team member allergies
- Adjust individual healthiness factors (1-10)
- Higher healthiness factor = system gives more weight to healthy options

### 5. Algorithm Configuration

**Rating Weights**: Adjust importance of each factor (0.0 - 10.0)
- Higher weight = more influence on final score
- Example: Set energy_boost to 2.0 to prioritize alertness

**Review Configuration**:
- **Threshold**: Score below which foods are flagged (0-10)
- **Review Percentage**: % of all submissions randomly flagged (0-100)

**Algorithm Visibility**: View the exact scoring formula used by the system

### 6. Compliance Tracking

View four-fifths rule compliance reports:
- Each food type (e.g., "high_healthiness", "medium_protein") tracked separately
- System needs 20+ submissions per type before compliance checking begins
- Pass rate calculated as: (total - flagged) / total
- Non-compliant if pass rate < 80%

## Special Features

### Pineapple Pizza Detection

Any food with "pineapple" and "pizza" in the name is automatically rejected with creative excuses:
- "Pineapple on pizza has been linked to increased digestive distress during coding sessions"
- "Studies show 94% of pizzerias in your area are currently out of pineapple"
- And more ridiculous reasons!

### Bias Detection

The system detects when users explicitly request unhealthy options in the submission context, though this feature is primarily implemented for potential future prompt-based submissions.

### Late Night Optimization

The scoring algorithm includes a special late-night bonus:
```
late_night_bonus = (energy_boost × 0.1) - (heaviness × 0.05)
```

This favors high-energy, low-heaviness foods for productive coding sessions.

### Multi-Step LLM Agent Process

Each food goes through 5-10 evaluation steps:
1. **Intake & Validation**: Initial processing
2. **Pineapple Check**: Instant rejection if detected
3. **Tool Call**: Nutritional information lookup (simulated)
4. **Allergen Check**: Compare against team allergies
5. **Weighted Scoring**: Calculate base score
6. **Team Consideration**: Apply healthiness factors
7. **Late Night Optimization**: Add energy/heaviness adjustment
8. **Review Flag**: Determine if human review needed
9. **Final Recommendation**: Approve or reject
10. **Summary**: Generate red flags list

## Sample Data

Two sample files are provided:

1. **food-options.json**: 10 diverse food options for testing
2. **pineapple-test.json**: Includes Hawaiian pizza (will be rejected)

## API Endpoints

### Team Management
- `GET /api/team` - Get all team members
- `PUT /api/team/:id` - Update team member

### Configuration
- `GET /api/config` - Get all configuration
- `PUT /api/config/:key` - Update configuration value

### Evaluation
- `POST /api/evaluate` - Submit foods for evaluation (multipart/form-data)

### Search & Review
- `GET /api/search` - Search food history
- `GET /api/review-queue` - Get items needing review
- `POST /api/review/:id` - Mark item as reviewed

### Compliance
- `GET /api/compliance` - Get compliance tracking data

## Database Schema

### Tables
- **team_members**: Team member profiles with allergies
- **food_submissions**: All submitted foods with metadata
- **food_ratings**: Individual rating scores for each food
- **food_type_classifications**: Classification tags for compliance tracking
- **decision_reasons**: Step-by-step AI reasoning logs
- **system_config**: Configurable system parameters
- **compliance_tracking**: Four-fifths rule compliance history

## Architecture Highlights

### No Dummy Data Philosophy
The frontend never uses placeholder data. If the backend is unavailable, clear error messages are displayed instead of fake data. This ensures the demo accurately represents the system's real behavior.

### Comprehensive Logging
Every decision is logged with:
- Timestamp of submission
- Complete evaluation reasoning (all steps)
- Final scores and classifications
- Reviewer actions (if applicable)

### Scalable Classification System
The four-fifths rule implementation doesn't hardcode food types. It dynamically creates classifications based on factor levels (high/medium/low) and tracks them individually.

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check connection parameters in backend/server.js
- Ensure database exists: `psql -U postgres -l`

### Frontend Can't Connect to Backend
- Verify backend is running on port 3001
- Check CORS settings if accessing from different origin
- Look for errors in browser console (F12)

### No Foods Showing After Upload
- Check browser network tab for API errors
- Verify JSON file format matches expected schema
- Look at backend console for error messages

## Future Enhancements

Potential additions for production version:
- Real LLM integration (Claude API)
- User authentication and multi-team support
- Historical trend analysis and recommendations
- Integration with food delivery APIs
- Mobile app for on-the-go ordering
- Advanced bias detection with NLP
- Machine learning for personalized preferences

## License

This is a demonstration prototype for educational purposes.

## Contributors

Demo created for AI agent evaluation showcase.
