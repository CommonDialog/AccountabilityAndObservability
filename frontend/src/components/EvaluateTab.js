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

      {food.generationMetadata && (
        <div className="generation-metadata">
          <h4>🤖 AI Generation Details</h4>
          
          {food.generationMetadata.userBiasIndicators && food.generationMetadata.userBiasIndicators.length > 0 && (
            <div className="metadata-section">
              <h5>⚠️ User Input Bias Detection:</h5>
              <div className="bias-result biased">
                <p><strong>Bias Detected in Input:</strong></p>
                <ul>
                  {food.generationMetadata.userBiasIndicators.map((indicator, idx) => (
                    <li key={idx}>{indicator}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <div className="metadata-section">
            <h5>Claude's Generated JSON:</h5>
            <pre className="json-display">{JSON.stringify(food.generationMetadata.claudeResponse, null, 2)}</pre>
          </div>
          <div className="metadata-section">
            <h5>OpenAI Bias Check:</h5>
            <div className={`bias-result ${food.generationMetadata.biasCheck.biased ? 'biased' : 'not-biased'}`}>
              <p><strong>Biased:</strong> {food.generationMetadata.biasCheck.biased ? '⚠️ YES' : '✓ NO'}</p>
              <p><strong>Confidence:</strong> {food.generationMetadata.biasCheck.confidence}</p>
              <p><strong>Reason:</strong> {food.generationMetadata.biasCheck.reason}</p>
              {food.generationMetadata.biasCheck.concerns && food.generationMetadata.biasCheck.concerns.length > 0 && (
                <div>
                  <strong>Concerns:</strong>
                  <ul>
                    {food.generationMetadata.biasCheck.concerns.map((concern, idx) => (
                      <li key={idx}>{concern}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
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

function EvaluateTab({ selectedFile, onFileSelect, onEvaluate, loading, results, foodName, onFoodNameChange, onGenerateAndEvaluate, showNameSearch }) {
  return (
    <div className="tab-content">
      <div className="upload-section">
        <h2>{showNameSearch ? 'Enter Food Name or Upload JSON' : 'Upload Food Options (JSON)'}</h2>
        
        {showNameSearch && (
          <>
            <div className="food-name-section">
              <h3>Option 1: Enter Food Name</h3>
              <p className="helper-text">Let AI generate the ratings for you!</p>
              <div className="food-name-input">
                <label htmlFor="food-name-input">Name of Food:</label>
                <input
                  type="text"
                  id="food-name-input"
                  placeholder="e.g., Pizza Margherita, Chicken Wings, Sushi..."
                  value={foodName}
                  onChange={(e) => onFoodNameChange(e.target.value)}
                  className="food-name-field"
                />
              </div>
              <button
                onClick={onGenerateAndEvaluate}
                disabled={!foodName || loading}
                className="btn-primary"
              >
                {loading ? 'Generating & Evaluating...' : 'Generate & Evaluate Food'}
              </button>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>
          </>
        )}

        <div className="file-upload-section">
          <h3>{showNameSearch ? 'Option 2: Upload Food Options (JSON)' : 'Upload Food Options (JSON)'}</h3>
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
        </div>

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
