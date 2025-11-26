# 🍕 Late Night Dev Food Evaluator

AI-Powered Food Selection System for Development Sessions

This project demonstrates accountability and observability in AI agent systems through a multi-step food evaluation agent with complete decision transparency.

## Project Structure

```
AccountabilityAndObservability/
├── backend/                 # Node.js + Express API server
│   ├── server.js           # Main server with AI agent logic
│   ├── schema.sql          # PostgreSQL database schema
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment configuration template
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components (tabs)
│   │   ├── App.js          # Main application component
│   │   ├── App.css         # Complete styling
│   │   └── index.js        # React entry point
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json        # Frontend dependencies
│   └── .env.example        # Frontend configuration template
│
└── Claude Files (v0)/      # Original source files
```

## Features

### 🎯 Claude API Integration (NEW!)
- **AI-Powered Food Rating Generation**: Simply enter a food name and Claude AI generates all ratings automatically
- **Instant JSON Creation**: No need to manually create JSON files for single food items
- **Smart Allergen Detection**: AI identifies common allergens (gluten, dairy, peanuts)
- **Two Input Options**: Choose between AI generation or traditional file upload

### 🤖 Multi-Step AI Agent Evaluation
- 10-step evaluation process with full transparency
- LLM tool integration (nutritional information)
- Weighted scoring algorithm
- Late-night optimization (energy vs heaviness)
- Team healthiness consideration

### 🍍 Pineapple Pizza Protection
- Automatic rejection with humorous scientific reasons
- Pattern matching for Hawaiian pizza variants

### ⚠️ Allergen Safety
- Team member allergen tracking
- Automatic conflict detection
- Warning system for allergen issues

### 👥 Human Review Queue
- Threshold-based flagging
- Random sampling for audit
- Reviewer assignment tracking

### 📊 Four-Fifths Rule Compliance
- Adverse impact monitoring
- Classification-based tracking
- Automated compliance reporting

### 🔍 Complete Observability
- All decision steps logged
- Searchable history
- Audit trail for every evaluation

## Quick Start

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up database
createdb food_eval_db
psql -d food_eval_db -f schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your database credentials
# OPTIONAL: Add your Anthropic API key for AI food generation:
# ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Start server
npm run dev
```

Backend will run on http://localhost:3001

**Optional Claude API Setup**: For AI-powered food rating generation, get an API key from https://console.anthropic.com/ and add it to `backend/.env`. See `CLAUDE-API-SETUP.md` for detailed instructions.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm start
```

Frontend will run on http://localhost:3000

## Usage

### Option 1: AI-Powered Food Generation (NEW!)
1. Go to **Evaluate Food** tab
2. Enter a food name in the text box (e.g., "Chicken Wings", "Veggie Burger")
3. Click **Generate & Evaluate Food**
4. Claude AI automatically generates ratings and evaluates the food
5. View results with full reasoning

### Option 2: Upload JSON File (Original Method)
1. **Evaluate Food**: Upload a JSON file with food options
2. **View Results**: See ranked evaluations with full reasoning

### Other Features
3. **Review Queue**: Human oversight for flagged items
4. **Configure**: Adjust algorithm weights and thresholds
5. **Monitor Compliance**: Track four-fifths rule adherence

### Example JSON Format

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

## Key Concepts Demonstrated

### Accountability
- Every decision is logged with reasoning
- Human review system for oversight
- Configurable algorithm transparency
- Audit trail for compliance

### Observability
- Multi-step process visibility
- Real-time decision tracking
- Historical search capability
- Compliance monitoring

### Bias Detection
- Four-fifths rule implementation
- Adverse impact tracking
- Classification-based monitoring

### Agent Architecture
- Tool usage (nutritional API)
- Multi-step reasoning
- Context awareness (team preferences)
- Configurable parameters

## Technology Stack

**Frontend:**
- React 18
- react-toastify for notifications
- Native Fetch API
- CSS3 with animations

**Backend:**
- Node.js + Express
- PostgreSQL database
- Multer for file uploads
- Anthropic SDK (Claude 3.5 Sonnet) for AI food generation
- Multi-step AI agent evaluation

## API Endpoints

- `GET /api/team` - Team members
- `PUT /api/team/:id` - Update member
- `GET /api/config` - System configuration
- `PUT /api/config/:key` - Update config
- `POST /api/generate-food` - **NEW:** Generate food ratings with Claude AI
- `POST /api/evaluate` - Evaluate foods
- `GET /api/search` - Search history
- `GET /api/review-queue` - Review queue
- `POST /api/review/:id` - Mark reviewed
- `GET /api/compliance` - Compliance data

## Database Schema

- `team_members` - Team configuration
- `food_submissions` - All evaluations
- `food_ratings` - Rating details
- `decision_reasons` - Reasoning steps
- `food_type_classifications` - Type tracking
- `compliance_tracking` - Compliance logs
- `system_config` - Algorithm configuration

## License

ISC

## Author

Built to demonstrate AI agent accountability and observability principles.
