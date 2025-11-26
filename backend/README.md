# Food Evaluation Backend

AI-Powered Food Evaluation System Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
```bash
# Create database
createdb food_eval_db

# Run schema
psql -d food_eval_db -f schema.sql
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Start the server:
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The server will run on http://localhost:3001

## API Endpoints

### Team Management
- `GET /api/team` - Get all team members
- `PUT /api/team/:id` - Update team member

### Configuration
- `GET /api/config` - Get system configuration
- `PUT /api/config/:key` - Update configuration

### Food Evaluation
- `POST /api/evaluate` - Evaluate food items (upload JSON file)
- `GET /api/search` - Search food history
- `GET /api/review-queue` - Get items requiring review
- `POST /api/review/:id` - Mark item as reviewed

### Compliance
- `GET /api/compliance` - Get compliance tracking data

## Features

- Multi-step AI agent evaluation
- Pineapple pizza rejection (with humorous reasons)
- Team allergen checking
- Weighted scoring algorithm
- Human review queue
- Four-fifths rule compliance tracking
- Full audit trail of decision reasoning
