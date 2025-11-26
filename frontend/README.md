# Food Evaluation Frontend

AI-Powered Food Evaluation System Frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env if your backend runs on a different URL
```

3. Start the development server:
```bash
npm start
```

The app will run on http://localhost:3000

## Features

### Evaluate Food Tab
- Upload JSON file with food options
- View AI agent evaluation results
- See detailed reasoning steps
- Allergen warnings and red flags
- Pineapple pizza rejection (with humorous reasons)

### Search History Tab
- Search past food evaluations
- Filter by rejected items
- View complete decision process

### Review Queue Tab
- Human review for flagged items
- Approve and mark as reviewed
- View AI reasoning for review decisions

### Team Settings Tab
- Configure team member allergies
- Set healthiness preferences
- Allergen conflict checking

### Algorithm Config Tab
- Adjust rating weights
- Configure review thresholds
- View scoring algorithm transparency

### Compliance Tab
- Four-fifths rule tracking
- Adverse impact monitoring
- Classification-based compliance checks

## Build for Production

```bash
npm run build
```

The optimized build will be in the `build/` folder.

## JSON Format

Food items should be submitted in this format:

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

All ratings should be on a scale of 1-10.
