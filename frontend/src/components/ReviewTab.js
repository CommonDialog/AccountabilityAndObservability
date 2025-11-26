import React, { useState } from 'react';

function ReviewTab({ queue, onMarkReviewed }) {
  const [reviewerName, setReviewerName] = useState('');

  if (queue.length === 0) {
    return (
      <div className="tab-content">
        <h2>Human Review Queue</h2>
        <div className="no-results">No items currently require review.</div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h2>Human Review Queue ({queue.length} items)</h2>
      <div className="reviewer-input">
        <label>
          Your Name:
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Enter your name..."
          />
        </label>
      </div>

      {queue.map((item) => (
        <div key={item.id} className="review-item">
          <div className="card-header">
            <h3>{item.name}</h3>
            <div className="score">{item.final_score}/10</div>
          </div>

          <div className="ratings-grid">
            <div>Price: {item.price}/10</div>
            <div>Messiness: {item.messiness}/10</div>
            <div>Heaviness: {item.heaviness}/10</div>
            <div>Energy: {item.energy_boost}/10</div>
            <div>Health: {item.healthiness}/10</div>
            <div>Share: {item.shareability}/10</div>
            <div>Protein: {item.protein}/10</div>
            <div>Spicy: {item.spiciness}/10</div>
            <div>Happy: {item.happiness}/10</div>
          </div>

          {item.reasons && (
            <div className="evaluation-steps">
              <h4>AI Evaluation:</h4>
              <ol>
                {item.reasons.map((reason, idx) => (
                  <li key={idx}>
                    <strong>{reason.type}:</strong> {reason.text}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <button
            onClick={() => onMarkReviewed(item.id, reviewerName || 'Anonymous')}
            disabled={!reviewerName}
            className="btn-primary"
          >
            Approve & Mark as Reviewed
          </button>
        </div>
      ))}
    </div>
  );
}

export default ReviewTab;
