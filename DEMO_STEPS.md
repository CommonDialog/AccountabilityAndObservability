# Demo Steps - Feature Flags Guide

This document describes all the feature flags you can enable to demonstrate the accountability and observability features of the Food Evaluation System.

## Overview

The application has several feature flags that control UI visibility. These flags are designed to progressively show more advanced features, making it easier to demo the system's accountability and observability capabilities.

---

## Feature Flags in `frontend/src/App.js`

### 1. **Show Name Search** (Line ~30)
**Current State:** `false`  
**Purpose:** Enables AI-powered food generation from text input using Claude API

```javascript
// Uncomment to see the name search feature
const [showNameSearch, setShowNameSearch] = useState(false);
```

**To Enable:** Change to `useState(true)`

**What it shows:**
- Text input field where users can type a food name (e.g., "Pizza Margherita")
- "Generate & Evaluate Food" button that:
  - Calls Claude API to generate JSON ratings from the food name
  - Detects user input bias (keywords like "junk food", "fried", fast food chains)
  - Calls OpenAI API to check Claude's output for bias
  - Displays all AI interactions transparently in the UI
- Complete observability of the AI generation process

**When to use:**
- Demonstrating AI-powered features
- Showing multi-AI bias detection (Claude + OpenAI)
- Highlighting transparency and accountability in AI decision-making

---

### 2. **Show Evaluation Steps** (Line ~34)
**Current State:** `false`  
**Purpose:** Shows the "Show Evaluation Steps" button and detailed step-by-step reasoning

```javascript
// Uncomment to see the evaluation steps
const [showEvaluationSteps, setShowEvaluationSteps] = useState(false);
```

**To Enable:** Change to `useState(true)`

**What it shows:**
- "Show Evaluation Steps" button on each food result card
- When clicked, displays complete AI agent evaluation process:
  - Step 1: Intake and validation
  - Step 2: Pineapple pizza check (humorous but demonstrates filtering)
  - Step 3: Nutritional tool call
  - Step 4: Allergen conflict detection
  - Step 5: Weighted score calculation
  - Step 6: Team healthiness consideration
  - Step 7: Late night optimization
  - Step 8: Review requirement check
  - Step 9: Final recommendation
  - Step 10: Summary with red flags
- User bias detection (if applicable) appears as Step 0

**When to use:**
- Demonstrating explainable AI
- Showing complete audit trail of decision-making
- Highlighting transparency in algorithmic scoring
- Proving compliance with "right to explanation"

---

### 3. **Show Human Flagging** (Line ~36)
**Current State:** `false`  
**Purpose:** Shows the yellow "⚠️ Flagged for Human Review" banner

```javascript
// Uncomment to see human flagging
const [showHumanFlagging, setShowHumanFlagging] = useState(false);
```

**To Enable:** Change to `useState(true)`

**What it shows:**
- Yellow warning banner on food items that require human review
- Items are flagged when:
  - Score falls below configured threshold (default: 5.0)
  - Random audit percentage is triggered (default: 10%)
  - Four-fifths rule compliance violation detected

**When to use:**
- Demonstrating human-in-the-loop AI
- Showing accountability mechanisms
- Highlighting compliance with fairness regulations
- Proving the system doesn't make fully automated decisions for edge cases

---

## Recommended Demo Sequence

### **Demo Level 1: Basic Functionality**
All flags set to `false`
- Shows simple file upload and evaluation
- Clean, minimal UI
- Good for initial introduction

### **Demo Level 2: Add Observability**
Enable: `showEvaluationSteps = true`
- Shows detailed reasoning for each decision
- Demonstrates explainable AI
- Good for technical audiences and compliance officers

### **Demo Level 3: Add Human Oversight**
Enable: `showEvaluationSteps = true`, `showHumanFlagging = true`
- Shows both reasoning and human review requirements
- Demonstrates accountability and governance
- Good for executive presentations and auditors

### **Demo Level 4: Full AI Integration**
Enable all flags: `showNameSearch = true`, `showEvaluationSteps = true`, `showHumanFlagging = true`
- Shows complete system capabilities
- Demonstrates AI generation, bias detection, reasoning, and human oversight
- Best for comprehensive demos and technical deep-dives
- **Requires:** `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` in `backend/.env`

---

## Additional Observability Features

### **Database Logging**
All AI interactions are logged to the `decision_reasons` table:
- Claude API requests and responses
- OpenAI bias check requests and responses
- User input bias detection
- All evaluation steps

**To view:** Check the `Review Queue` and `Search History` tabs

### **Console Logging**
All API calls include detailed console output:
- Timestamps
- Request/response content
- Token usage
- Duration metrics
- Bias detection results

**To view:** Open browser DevTools console (F12) or check backend terminal

### **Compliance Tracking**
Four-fifths rule violations are tracked in `compliance_tracking` table

**To view:** Go to the `Compliance` tab in the UI

---

## Setup Requirements

### For Basic Features (Levels 1-3)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set database credentials
cd ..
.\start.bat  # or .\start.ps1 on Windows, ./start.sh on Unix
```

### For Full AI Features (Level 4)
Add to `backend/.env`:
```
ANTHROPIC_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

Get API keys from:
- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/

---

## Quick Toggle Guide

| Feature | File | Line | Change From | Change To |
|---------|------|------|-------------|-----------|
| Name Search | `frontend/src/App.js` | ~30 | `useState(false)` | `useState(true)` |
| Evaluation Steps | `frontend/src/App.js` | ~34 | `useState(false)` | `useState(true)` |
| Human Flagging | `frontend/src/App.js` | ~36 | `useState(false)` | `useState(true)` |

---

## Key Talking Points for Each Feature

### **Show Name Search**
- "This demonstrates our AI-powered food generation using Claude API"
- "Notice how we detect bias at the input level - keywords like 'junk food' or 'fried' trigger warnings"
- "We use a second AI (OpenAI) to check the first AI's output for bias"
- "Everything is logged - we have a complete audit trail of all AI interactions"

### **Show Evaluation Steps**
- "Every decision the AI makes is explainable - click 'Show Evaluation Steps' to see the reasoning"
- "This provides transparency and accountability - users can challenge decisions"
- "All steps are logged to the database for compliance and auditing"
- "Notice how bias detection appears as Step 0 when applicable"

### **Show Human Flagging**
- "We don't make fully automated decisions for edge cases"
- "Items are flagged for human review based on score thresholds or random audits"
- "This ensures accountability and prevents algorithmic bias from going unchecked"
- "The Review Queue tab shows all items awaiting human judgment"

---

## Testing Suggestions

### Test User Input Bias Detection
Try food names like:
- "McDonalds Big Mac" (fast food chain)
- "Fried Chicken Wings" (unhealthy keyword)
- "Chocolate Cake" (high sugar)
- "Beer and Pizza" (alcohol)

### Test Pineapple Pizza Rejection
Upload JSON with:
```json
{"name": "Hawaiian Pizza", "price": 7, ...}
```

### Test Human Review Flagging
- Upload foods with very low healthiness scores (<3)
- Configure review threshold higher in Config tab
- Multiple submissions will trigger random audit percentage

---

## Summary

These feature flags provide a progressive demo experience:
1. **Start simple** with basic evaluation
2. **Add transparency** with evaluation steps
3. **Show accountability** with human flagging
4. **Demonstrate AI capabilities** with name search and bias detection

Each level builds on the previous to tell a complete story about responsible AI development and deployment.
