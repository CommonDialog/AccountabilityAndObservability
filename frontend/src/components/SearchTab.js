import React, { useState } from 'react';

function SearchResultCard({ food }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`food-card ${food.rejected ? 'rejected' : ''}`}>
      <div className="card-header">
        <h3>{food.name}</h3>
        <div className="metadata">
          {new Date(food.submitted_at).toLocaleString()}
        </div>
        {food.rejected ? (
          <div className="score rejected-badge">REJECTED</div>
        ) : (
          <div className="score">{food.final_score}/10</div>
        )}
      </div>

      {food.rejected && (
        <div className="rejection-reason">
          <strong>Why it failed:</strong> {food.rejection_reason}
        </div>
      )}

      {!food.rejected && (
        <div className="ratings-grid">
          <div>Price: {food.price}/10</div>
          <div>Messiness: {food.messiness}/10</div>
          <div>Heaviness: {food.heaviness}/10</div>
          <div>Energy: {food.energy_boost}/10</div>
          <div>Health: {food.healthiness}/10</div>
          <div>Share: {food.shareability}/10</div>
          <div>Protein: {food.protein}/10</div>
          <div>Spicy: {food.spiciness}/10</div>
          <div>Happy: {food.happiness}/10</div>
        </div>
      )}

      {food.allergens && food.allergens.length > 0 && (
        <div className="allergens">
          <strong>Allergens:</strong> {food.allergens.join(', ')}
        </div>
      )}

      <button 
        className="btn-secondary"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide' : 'Show'} Decision Process
      </button>

      {showDetails && food.reasons && (
        <div className="evaluation-steps">
          <h4>Decision Process:</h4>
          <ol>
            {food.reasons.map((reason, idx) => (
              <li key={idx}>
                <strong>{reason.type}:</strong> {reason.text}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function SearchTab({ query, onQueryChange, showRejected, onShowRejectedChange, onSearch, loading, results }) {
  return (
    <div className="tab-content">
      <h2>Search Food History</h2>
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search by name or rejection reason..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="search-input"
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showRejected}
            onChange={(e) => onShowRejectedChange(e.target.checked)}
          />
          Only show rejected foods
        </label>
        <button onClick={onSearch} disabled={loading} className="btn-primary">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results && results.length === 0 && (
        <div className="no-results">No foods found matching your criteria.</div>
      )}

      {results && results.length > 0 && (
        <div className="search-results">
          <h3>Found {results.length} result(s)</h3>
          {results.map((food) => (
            <SearchResultCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchTab;
