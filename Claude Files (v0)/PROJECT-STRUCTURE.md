# Project Structure

```
food-eval-system/
├── README.md                          # Comprehensive setup and usage guide
├── setup.sh                           # Automated setup script
├── .gitignore                         # Git ignore patterns
│
├── database/
│   └── schema.sql                     # PostgreSQL database schema with tables and seed data
│
├── backend/
│   ├── package.json                   # Node.js dependencies
│   ├── .env.example                   # Environment variables template
│   └── server.js                      # Express server with API endpoints and LLM agent logic
│
├── frontend/
│   ├── package.json                   # React dependencies
│   ├── public/
│   │   └── index.html                 # HTML template
│   └── src/
│       ├── index.js                   # React entry point
│       ├── index.css                  # Global styles
│       ├── App.js                     # Main React application with all components
│       └── App.css                    # Application styles
│
└── sample-data/
    ├── food-options.json              # Sample food data for testing
    └── pineapple-test.json            # Test case with pineapple pizza (will be rejected)
```

## Key Files Explained

### Database (`database/schema.sql`)
- 7 tables for complete data tracking
- team_members: 5 default members with Intern Kevin having peanut allergy
- food_submissions: All food evaluations
- food_ratings: Individual factor scores
- food_type_classifications: Dynamic classification system
- decision_reasons: Complete AI reasoning logs
- system_config: Configurable parameters
- compliance_tracking: Four-fifths rule monitoring

### Backend (`backend/server.js`)
- **Multi-step LLM Agent**: 10-step evaluation process
- **Bias Detection**: Identifies unhealthy food requests
- **Pineapple Filter**: Automatic rejection with creative excuses
- **Tool Simulation**: Random nutritional scores (1-10)
- **Allergen Checking**: Team safety verification
- **Dynamic Classification**: Food type tracking for compliance
- **API Endpoints**: 9 RESTful endpoints for all operations

### Frontend (`frontend/src/App.js`)
- **6 Main Tabs**:
  1. Evaluate Food - Upload and rank foods
  2. Search History - Find previous submissions
  3. Review Queue - Human approval workflow
  4. Team Settings - Manage allergies and preferences
  5. Algorithm Config - Adjust weights and visibility
  6. Compliance - Four-fifths rule tracking
- **No Dummy Data**: Shows real errors when backend unavailable
- **Detailed UI**: Complete reasoning display for transparency

### Sample Data (`sample-data/`)
- **food-options.json**: 10 diverse foods covering all rating ranges
- **pineapple-test.json**: Includes Hawaiian pizza for rejection testing

## Data Flow

1. **User uploads JSON** → Frontend
2. **FormData sent** → Backend `/api/evaluate`
3. **Multi-step evaluation**:
   - Pineapple check
   - Tool call (nutritional info)
   - Allergen verification
   - Weighted scoring
   - Team consideration
   - Late night optimization
   - Review flagging
   - Classification
4. **Database storage**:
   - food_submissions record
   - food_ratings record
   - decision_reasons (all steps)
   - food_type_classifications
   - Compliance check (if 20+ of type)
5. **Results returned** → Frontend
6. **Ranked display** with complete transparency

## Key Features Implementation

### Four-Fifths Rule
- Triggered after 20 submissions of ANY classification type
- Classifications: {high|medium|low}_{factor_name}
- Example: "high_healthiness", "medium_protein", "low_messiness"
- NOT hardcoded - dynamically created based on ratings
- Pass rate must be ≥80% of highest pass rate

### Review Flagging
Two triggers:
1. Score below threshold (configurable, default 40/100)
2. Random selection (configurable %, default 10%)

### Algorithm Transparency
Complete formula visible in UI:
```
Score = Σ(factor × weight) / Σ(weights)
      + team_adjustment
      + late_night_bonus
```

### Logging
Everything logged:
- Submission timestamp
- All 10 reasoning steps
- Final scores and classifications
- Review status and reviewer name
- Compliance check results

## Technologies Used

- **Frontend**: React 18, Hooks, CSS3
- **Backend**: Node.js, Express, Multer
- **Database**: PostgreSQL 12+
- **File Format**: JSON
- **HTTP**: RESTful API
- **Styling**: Custom CSS with gradients and animations

## Environment Requirements

- Node.js 16+
- PostgreSQL 12+
- npm or yarn
- Modern web browser

## Port Configuration

- Frontend: 3000 (React dev server)
- Backend: 3001 (Express API)
- Database: 5432 (PostgreSQL default)
