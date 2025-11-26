# Claude API Integration Setup

The Food Evaluator now supports AI-powered food rating generation using Claude!

## Setup Instructions

### 1. Install the Anthropic SDK in Backend

```powershell
cd backend
npm install
```

This will install the `@anthropic-ai/sdk` package.

### 2. Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-ant-`)

### 3. Add API Key to .env File

Edit `backend/.env` and replace `your_api_key_here` with your actual API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

### 4. Restart the Backend

If the backend is running, restart it to load the new environment variable:

```powershell
# Stop the backend (Ctrl+C in the backend terminal)
# Then restart
cd backend
npm run dev
```

Or use the stop/start scripts:
```powershell
.\stop.ps1
.\start.ps1
```

## How to Use

### Option 1: Enter Food Name (AI-Generated)

1. Go to the "Evaluate Food" tab
2. In the "Name of Food" text box, enter any food name (e.g., "Pizza Margherita", "Chicken Wings", "Sushi Combo")
3. Click "Generate & Evaluate Food"
4. Claude AI will:
   - Generate ratings for all 9 factors (price, messiness, heaviness, etc.)
   - Identify allergens (gluten, dairy, peanuts)
   - Return properly formatted JSON
5. The system will then evaluate the food using the multi-step AI agent

### Option 2: Upload JSON File (Original Method)

1. Upload a JSON file as before
2. Works exactly the same way

## What Happens Behind the Scenes

1. **User enters food name** → Frontend sends to `/api/generate-food`
2. **Backend calls Claude API** → Uses the prompt to generate ratings
3. **Claude returns JSON** → With all ratings and allergens
4. **Frontend sends to `/api/evaluate`** → Normal evaluation process
5. **Results displayed** → Same as file upload method

## Example Prompt

When you enter "Pizza Margherita", Claude receives:

```
I will give you a food and I want you to format the food in JSON like this:
[
  {
    "name": "Pizza Margherita",
    "price": 7,
    "messiness": 5,
    ...
  }
]
Do your best to rate price, messiness, heaviness, energy_boost, healthiness, 
shareability, protein, spiciness, and happiness on a scale of 1 to 10.
For the allergens, add gluten if there's gluten, dairy if there's dairy and 
peanuts if there is peanuts. Do not guess. Be sure.

The name of the food is Pizza Margherita.
```

## Testing Without API Key

If you don't have an API key yet, you can still use the file upload method (Option 2) which works without Claude API.

## Troubleshooting

**Error: "Failed to generate food data"**
- Check that your API key is correctly set in `backend/.env`
- Verify the backend restarted after adding the key
- Check backend console for detailed error messages

**Error: "ANTHROPIC_API_KEY is not set"**
- Make sure you added the key to `backend/.env`
- Restart the backend server

**Rate Limits**
- Free tier has usage limits
- If you hit limits, wait or upgrade your plan
- File upload method still works without API

## Benefits of AI Generation

✅ **Faster**: No need to manually create JSON files
✅ **Accurate**: Claude provides realistic ratings based on food knowledge
✅ **Allergen Detection**: Automatically identifies common allergens
✅ **Consistent**: Always returns properly formatted JSON
✅ **Easy**: Just type the food name and go!

---

**Note:** The original file upload functionality is preserved and works exactly as before. This is an additional feature!
