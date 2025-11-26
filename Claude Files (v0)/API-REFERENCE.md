# API Reference Guide

Base URL: `http://localhost:3001/api`

## Team Management

### Get All Team Members
```http
GET /team
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Chris",
    "allergies": [],
    "healthiness_factor": 7,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update Team Member
```http
PUT /team/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "allergies": ["peanuts", "shellfish"],
  "healthiness_factor": 8
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Chris",
  "allergies": ["peanuts", "shellfish"],
  "healthiness_factor": 8,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## Configuration Management

### Get All Configuration
```http
GET /config
```

**Response:**
```json
{
  "rating_weights": {
    "price": 1.0,
    "messiness": 1.0,
    "heaviness": 1.0,
    "energy_boost": 1.0,
    "healthiness": 1.0,
    "shareability": 1.0,
    "protein": 1.0,
    "spiciness": 1.0,
    "happiness": 1.0
  },
  "review_threshold": 40,
  "review_percentage": 10,
  "four_fifths_threshold": 0.8
}
```

### Update Configuration
```http
PUT /config/:key
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": {
    "price": 1.5,
    "energy_boost": 2.0,
    "healthiness": 0.8
  }
}
```

**Response:**
```json
{
  "id": 1,
  "config_key": "rating_weights",
  "config_value": { ... },
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

## Food Evaluation

### Evaluate Foods
```http
POST /evaluate
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <JSON file with food data>
```

**Food JSON Format:**
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

**Response:**
```json
{
  "foods": [
    {
      "id": 123,
      "name": "Pizza Margherita",
      "finalScore": 6.85,
      "rejected": false,
      "rejectionReason": null,
      "reasons": [
        "Received food submission: Pizza Margherita. Beginning evaluation process.",
        "Pineapple pizza check passed. Proceeding with evaluation.",
        "Called nutritional information tool for Pizza Margherita. Received score: 7/10",
        "No allergen conflicts detected with team members.",
        "Calculated weighted average score: 6.50/10 based on configured weights.",
        "Team average healthiness factor: 7.0. Applied healthiness adjustment: 0.70",
        "Late night development session adjustment: +0.30 (high energy boost preferred, low heaviness preferred)",
        "Food flagged for human review. Score: 6.85, Threshold: 40, Random review chance: 10%",
        "Final recommendation: APPROVED. Score: 6.85/10",
        "Evaluation complete. Red flags: None"
      ],
      "redFlags": [],
      "allergenIssues": [],
      "requiresReview": false
    }
  ]
}
```

**Rejected Food Response:**
```json
{
  "foods": [
    {
      "id": 124,
      "name": "Hawaiian Pizza (Pineapple & Ham)",
      "finalScore": 0,
      "rejected": true,
      "rejectionReason": "Pineapple on pizza has been linked to increased digestive distress during coding sessions; Studies show 94% of pizzerias in your area are currently out of pineapple; Pineapple enzymes can interfere with keyboard typing accuracy by up to 47%; Health authorities recommend avoiding tropical fruit on Italian dishes after 8 PM",
      "reasons": [
        "Received food submission: Hawaiian Pizza (Pineapple & Ham). Beginning evaluation process.",
        "REJECTED: Hawaiian Pizza (Pineapple & Ham). Reasons: Pineapple on pizza has been linked to increased digestive distress during coding sessions; Studies show 94% of pizzerias in your area are currently out of pineapple; Pineapple enzymes can interfere with keyboard typing accuracy by up to 47%; Health authorities recommend avoiding tropical fruit on Italian dishes after 8 PM"
      ],
      "redFlags": [],
      "allergenIssues": [],
      "requiresReview": false
    }
  ]
}
```

## Search & History

### Search Food Submissions
```http
GET /search?query=pizza&rejected=false
```

**Query Parameters:**
- `query` (optional): Search term for name or rejection reason
- `rejected` (optional): Filter by rejection status (true/false)

**Response:**
```json
[
  {
    "id": 123,
    "name": "Pizza Margherita",
    "submitted_at": "2024-01-01T12:00:00.000Z",
    "raw_data": { ... },
    "final_score": 6.85,
    "rejected": false,
    "rejection_reason": null,
    "requires_human_review": false,
    "reviewed": false,
    "price": 7,
    "messiness": 5,
    "healthiness": 5,
    "reasons": [
      {
        "step": 1,
        "type": "intake",
        "text": "Received food submission: Pizza Margherita. Beginning evaluation process."
      }
    ]
  }
]
```

## Review Queue

### Get Review Queue
```http
GET /review-queue
```

**Response:**
```json
[
  {
    "id": 125,
    "name": "Deep Fried Oreos",
    "submitted_at": "2024-01-01T13:00:00.000Z",
    "final_score": 3.2,
    "rejected": false,
    "requires_human_review": true,
    "reviewed": false,
    "price": 5,
    "messiness": 8,
    "heaviness": 9,
    "energy_boost": 2,
    "healthiness": 1,
    "reasons": [ ... ]
  }
]
```

### Mark Item as Reviewed
```http
POST /review/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "reviewedBy": "Chris"
}
```

**Response:**
```json
{
  "id": 125,
  "name": "Deep Fried Oreos",
  "reviewed": true,
  "reviewed_at": "2024-01-01T14:00:00.000Z",
  "reviewed_by": "Chris"
}
```

## Compliance

### Get Compliance Reports
```http
GET /compliance
```

**Response:**
```json
[
  {
    "id": 1,
    "classification_key": "high_healthiness",
    "total_submissions": 25,
    "flagged_for_review": 3,
    "pass_rate": 88.00,
    "compliant": true,
    "checked_at": "2024-01-01T15:00:00.000Z"
  },
  {
    "id": 2,
    "classification_key": "low_healthiness",
    "total_submissions": 22,
    "flagged_for_review": 8,
    "pass_rate": 63.64,
    "compliant": false,
    "checked_at": "2024-01-01T15:00:00.000Z"
  }
]
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Request succeeded
- `400 Bad Request` - Invalid input data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limits

Currently no rate limits implemented (demo system).

## Authentication

Currently no authentication required (demo system).

## CORS

CORS is enabled for all origins in development mode.

## Data Types

### Food Object
```typescript
{
  name: string,
  price: number (1-10),
  messiness: number (1-10),
  heaviness: number (1-10),
  energy_boost: number (1-10),
  healthiness: number (1-10),
  shareability: number (1-10),
  protein: number (1-10),
  spiciness: number (1-10),
  happiness: number (1-10),
  allergens: string[]
}
```

### Team Member
```typescript
{
  id: number,
  name: string,
  allergies: string[],
  healthiness_factor: number (1-10),
  created_at: timestamp
}
```

### Food Classification Types
Format: `{level}_{factor_name}`

**Levels:**
- `high`: 8-10
- `medium`: 4-7
- `low`: 1-3

**Factors:**
- price, messiness, heaviness, energy_boost, healthiness
- shareability, protein, spiciness, happiness

**Examples:**
- `high_healthiness`
- `medium_protein`
- `low_messiness`

## Database Schema Access

Direct database queries not exposed via API. Use the provided endpoints.

## WebSocket Support

Not currently implemented (future enhancement).

## Pagination

Search results limited to 50 items. Pagination not yet implemented.

## Bulk Operations

Evaluation endpoint accepts arrays of foods (bulk evaluation).

## Testing

Sample data files available in `/sample-data/`:
- `food-options.json` - 10 diverse food options
- `pineapple-test.json` - Includes pineapple pizza for rejection testing

## Integration Example

```javascript
// Upload and evaluate foods
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3001/api/evaluate', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log('Ranked foods:', data.foods);

// Search for specific food
const searchResponse = await fetch(
  'http://localhost:3001/api/search?query=pizza'
);
const results = await searchResponse.json();
console.log('Search results:', results);
```
