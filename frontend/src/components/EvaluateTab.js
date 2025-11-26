import React, { useState } from 'react';

function FoodResultCard({ food, rank }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`food-card ${food.rejected ? 'rejected' : ''} ${food.requiresReview ? 'needs-review' : ''}`}>
      <div className="card-header">
        <div className="rank-badge">#{rank}</div>
        <h3>{food.name}</h3>
        {food.rejected ? (
          <div className="score rejected-badge">REJECTED</div>
        ) : (
          <div className="score">{food.finalScore}/10</div>
        )}
      </div>

      {food.rejected && (
        <div className="rejection-reason">
          <strong>Rejection Reason:</strong> {food.rejectionReason}
        </div>
      )}

      {food.requiresReview && !food.rejected && (
        <div className="review-flag">⚠️ Flagged for Human Review</div>
      )}

      {food.redFlags && food.redFlags.length > 0 && (
        <div className="red-flags">
          <strong>🚩 Red Flags:</strong> {food.redFlags.join(', ')}
        </div>
      )}

      {food.allergenIssues && food.allergenIssues.length > 0 && (
        <div className="allergen-warnings">
          <strong>⚠️ Allergen Warnings:</strong>
          <ul>
            {food.allergenIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <button 
        className="btn-secondary"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide' : 'Show'} Evaluation Steps
      </button>

      {showDetails && food.reasons && (
        <div className="evaluation-steps">
          <h4>AI Agent Evaluation Process:</h4>
          <ol>
            {food.reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function EvaluateTab({ selectedFile, onFileSelect, onEvaluate, loading, results }) {
  return (
    <div className="tab-content">
      <div className="upload-section">
        <h2>Upload Food Options (JSON)</h2>
        <div className="file-upload">
          <input
            type="file"
            accept=".json"
            onChange={onFileSelect}
            id="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {selectedFile ? selectedFile.name : 'Choose JSON file...'}
          </label>
        </div>
        <button
          onClick={onEvaluate}
          disabled={!selectedFile || loading}
          className="btn-primary"
        >
          {loading ? 'Evaluating...' : 'Evaluate Foods'}
        </button>

        <div className="format-info">
          <h3>Expected JSON Format:</h3>
          <pre>{`[
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
]`}</pre>
        </div>
      </div>

      {results && results.length > 0 && (
        <div className="results-section">
          <h2>Evaluation Results (Ranked)</h2>
          {results.map((food, index) => (
            <FoodResultCard key={food.id} food={food} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default EvaluateTab;
