# 🚀 Quick Start Guide

Get the Late Night Dev Food Evaluator running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 16+)
node --version

# Check PostgreSQL (need 12+)
psql --version

# Check npm
npm --version
```

Don't have them? Install:
- **Node.js**: https://nodejs.org/
- **PostgreSQL**: https://www.postgresql.org/download/

## 1. Automated Setup (Recommended)

```bash
cd food-eval-system
chmod +x setup.sh
./setup.sh
```

This script will:
- Create the PostgreSQL database
- Run the schema (creates tables and seed data)
- Install backend dependencies
- Install frontend dependencies

## 2. Manual Setup (Alternative)

If the script doesn't work for your system:

### Create Database
```bash
psql -U postgres -c "CREATE DATABASE food_eval_db;"
psql -U postgres -d food_eval_db -f database/schema.sql
```

### Install Backend
```bash
cd backend
npm install
```

### Install Frontend
```bash
cd frontend
npm install
```

## 3. Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```

Wait for: `Server running on port 3001`

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

Browser will auto-open to: http://localhost:3000

## 4. Test It Out!

### First Test: Upload Sample Data
1. Click "Evaluate Food" tab
2. Click "Choose JSON file..."
3. Select `sample-data/food-options.json`
4. Click "Evaluate Foods"
5. See 10 foods ranked!

### Second Test: Pineapple Pizza Rejection
1. Upload `sample-data/pineapple-test.json`
2. Watch Hawaiian Pizza get rejected with hilarious excuses!

### Third Test: Explore Features
- **Search History**: Find previously evaluated foods
- **Review Queue**: See items flagged for human review
- **Team Settings**: Add allergies to team members
- **Algorithm Config**: Adjust rating weights
- **Compliance**: View four-fifths rule tracking

## 5. Understanding the Results

Each food card shows:
- **Rank**: Position in sorted list
- **Score**: Final calculated score (0-10)
- **Red Flags**: Potential issues (high messiness, allergens, etc.)
- **Allergen Warnings**: Team member conflicts
- **Evaluation Steps**: Click "Show Evaluation Steps" to see the 10-step AI process

## Common Issues

### "Failed to fetch"
- Backend not running? Start it first!
- Check: http://localhost:3001/api/team (should return JSON)

### "Connection refused" 
- PostgreSQL not running?
```bash
sudo systemctl start postgresql  # Linux
brew services start postgresql    # macOS
```

### "Database does not exist"
```bash
psql -U postgres -c "CREATE DATABASE food_eval_db;"
psql -U postgres -d food_eval_db -f database/schema.sql
```

### Port already in use
- Frontend (3000): Change in package.json or close other React apps
- Backend (3001): Change PORT in backend/.env

## Project Structure at a Glance

```
backend/server.js       → 10-step LLM agent, API endpoints
frontend/src/App.js     → React UI with 6 tabs
database/schema.sql     → 7 tables for complete tracking
sample-data/*.json      → Test files
```

## Key Features to Demo

1. **Multi-step LLM Agent**: View evaluation steps for transparency
2. **Pineapple Pizza Filter**: Upload pineapple-test.json
3. **Allergen Safety**: Add peanuts to a food, see Intern Kevin warning
4. **Configurable Weights**: Increase energy_boost to 2.0, see rankings change
5. **Human Review**: Lower threshold to 70, see more items flagged
6. **Compliance Tracking**: After 20+ submissions, view four-fifths rule

## Next Steps

- Read **README.md** for comprehensive documentation
- Check **FEATURE-CHECKLIST.md** to see all 15 requirements met
- Review **API-REFERENCE.md** for endpoint details
- Explore **PROJECT-STRUCTURE.md** for architecture

## Create Your Own Food Data

JSON format:
```json
[
  {
    "name": "Your Food Name",
    "price": 1-10,
    "messiness": 1-10,
    "heaviness": 1-10,
    "energy_boost": 1-10,
    "healthiness": 1-10,
    "shareability": 1-10,
    "protein": 1-10,
    "spiciness": 1-10,
    "happiness": 1-10,
    "allergens": ["gluten", "dairy"]
  }
]
```

Save as `my-foods.json` and upload!

## Need Help?

- All documentation in the project root
- Sample data in `sample-data/` folder
- Check browser console (F12) for errors
- Check backend terminal for server errors

## Stopping the Application

```bash
# In each terminal, press:
Ctrl + C
```

## Production Deployment (Future)

This is a **demo prototype**. For production:
- Add authentication
- Implement rate limiting
- Set up proper environment variables
- Use production database
- Add HTTPS
- Implement proper error logging
- Set up monitoring

---

**You're all set! 🎉**

Upload `sample-data/food-options.json` and watch the AI agent evaluate your late-night dev snacks!
