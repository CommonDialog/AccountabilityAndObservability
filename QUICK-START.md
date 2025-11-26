# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js 16 or higher installed (`node --version`)
- [ ] PostgreSQL 12 or higher installed (`psql --version`)
- [ ] npm installed (`npm --version`)

## Step 1: Database Setup

```bash
# Create the database
createdb food_eval_db

# Run the schema to create tables and seed data
psql -d food_eval_db -f backend/schema.sql
```

Expected output: Tables created successfully, 5 team members inserted, 4 config entries inserted.

## Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed (default values should work for local development)
# DB_USER=postgres
# DB_HOST=localhost
# DB_NAME=food_eval_db
# DB_PASSWORD=postgres
# DB_PORT=5432
# PORT=3001
# ANTHROPIC_API_KEY=your_key_here (OPTIONAL - for AI food generation)
```

### Optional: Enable Claude API Integration

For AI-powered food rating generation:

1. Get an API key from https://console.anthropic.com/
2. Add to `backend/.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   ```
3. Restart the backend server

See `CLAUDE-API-SETUP.md` for detailed instructions. **Note:** The app works fine without this - it just enables the AI food generation feature.

### Start Backend Server

```bash
# For development (with auto-reload)
npm run dev

# OR for production
npm start
```

Backend should now be running on http://localhost:3001

**Verify backend is working:**
```bash
curl http://localhost:3001/api/team
```
You should see JSON with 5 team members.

## Step 3: Frontend Setup

Open a NEW terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# The default REACT_APP_API_URL=http://localhost:3001/api should work
```

### Start Frontend Development Server

```bash
npm start
```

Frontend should automatically open at http://localhost:3000

## Step 4: Test the Application

### Option A: Test AI Food Generation (if you added API key)

1. Go to the **Evaluate Food** tab
2. In the "Name of Food" text box, type: `Chicken Wings`
3. Click **Generate & Evaluate Food**
4. Watch the notifications:
   - "Generating food ratings with AI..."
   - "Evaluating food..."
5. See results with AI-generated ratings!

**Try these foods:**
- "Veggie Burger"
- "Sushi Combo"
- "Pepperoni Pizza"
- "Hawaiian Pizza" (watch it get rejected! 🍍)

### Option B: Test with JSON Upload (original method)

1. **Evaluate Food Tab**: Try uploading the sample JSON:

Create a file `test-food.json`:
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
  },
  {
    "name": "Sushi Combo",
    "price": 9,
    "messiness": 3,
    "heaviness": 4,
    "energy_boost": 7,
    "healthiness": 8,
    "shareability": 8,
    "protein": 9,
    "spiciness": 3,
    "happiness": 9,
    "allergens": ["fish", "soy"]
  }
]
```

2. **Upload the file** and click "Evaluate Foods"
3. You should see ranked results with scores and evaluation steps
4. Check **Review Queue** tab if any items were flagged
5. Try the **Search History** tab to find your submissions
6. Go to **Team Settings** to modify allergies
7. Check **Algorithm Config** to see/adjust weights
8. View **Compliance** tab (will show data after 20+ submissions)

## Step 5: Test Pineapple Pizza Rejection

Create `pineapple-test.json`:
```json
[
  {
    "name": "Hawaiian Pizza with Pineapple",
    "price": 8,
    "messiness": 5,
    "heaviness": 7,
    "energy_boost": 5,
    "healthiness": 4,
    "shareability": 8,
    "protein": 6,
    "spiciness": 1,
    "happiness": 3,
    "allergens": ["gluten", "dairy"]
  }
]
```

Upload this and you should see it **REJECTED** with humorous scientific reasons!

## Common Issues & Solutions

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Make sure PostgreSQL is running
- Windows: Check Services → PostgreSQL should be running
- Mac: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution**: Either:
1. Stop the process using port 3001: `npx kill-port 3001`
2. Change PORT in backend/.env to a different port (e.g., 3002)

### Frontend Can't Connect to Backend
```
Error loading team: Failed to fetch
```
**Solution**: 
1. Make sure backend is running on port 3001
2. Check frontend/.env has correct REACT_APP_API_URL
3. Check browser console for CORS errors

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` in the appropriate directory (backend or frontend)

## File Structure Overview

```
AccountabilityAndObservability/
├── backend/
│   ├── server.js              # Express API server
│   ├── schema.sql             # Database schema
│   ├── package.json           # Dependencies
│   ├── .env                   # Your config (create from .env.example)
│   └── README.md              # Backend docs
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── EvaluateTab.js
│   │   │   ├── SearchTab.js
│   │   │   ├── ReviewTab.js
│   │   │   ├── TeamTab.js
│   │   │   ├── ConfigTab.js
│   │   │   └── ComplianceTab.js
│   │   ├── App.js             # Main app
│   │   ├── App.css            # All styles
│   │   └── index.js           # Entry point
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── package.json           # Dependencies
│   ├── .env                   # Your config (create from .env.example)
│   └── README.md              # Frontend docs
│
├── Claude Files (v0)/         # Original source files
├── README.md                  # Main documentation
├── FUNCTIONALITY-CHECKLIST.md # Verification checklist
└── QUICK-START.md            # This file
```

## Next Steps

Once everything is running:

1. **Read the main README.md** for detailed feature documentation
2. **Set up Claude API** (optional) - See `CLAUDE-API-SETUP.md` for AI food generation
3. **Check FUNCTIONALITY-CHECKLIST.md** to understand what's preserved
4. **Explore the code** - all functionality is well-commented
5. **Test all tabs** - each has unique features
6. **Modify algorithm weights** in Config tab to see how scoring changes
7. **Add team member allergies** to see allergen warnings
8. **Submit 20+ foods** to see compliance tracking activate

## Production Deployment

### Backend
```bash
cd backend
npm start
```
Consider using PM2 or similar for process management.

### Frontend
```bash
cd frontend
npm run build
```
Serve the `build/` folder with nginx, Apache, or a static hosting service.

### Environment Variables
Remember to set appropriate production values:
- Backend: Update DB credentials, set NODE_ENV=production
- Frontend: Update REACT_APP_API_URL to production backend URL

## Support

If you encounter issues:
1. Check the console output for error messages
2. Review the backend logs
3. Check browser developer console (F12)
4. Verify database tables were created: `psql -d food_eval_db -c "\dt"`
5. Test API endpoints directly with curl or Postman

---

**You're all set!** 🎉 Enjoy evaluating your late-night dev food with AI-powered accountability and observability!
