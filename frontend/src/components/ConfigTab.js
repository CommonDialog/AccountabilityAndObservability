import React, { useState, useEffect } from 'react';

function ConfigTab({ config, onUpdateConfig }) {
  const [weights, setWeights] = useState(null);
  const [reviewThreshold, setReviewThreshold] = useState('');
  const [reviewPercentage, setReviewPercentage] = useState('');

  useEffect(() => {
    if (config) {
      setWeights(config.rating_weights);
      setReviewThreshold(config.review_threshold);
      setReviewPercentage(config.review_percentage);
    }
  }, [config]);

  if (!config) {
    return (
      <div className="tab-content">
        <div className="error-banner">Unable to load configuration. Please ensure the database is properly configured.</div>
      </div>
    );
  }

  const updateWeight = (factor, value) => {
    const newWeights = { ...weights, [factor]: parseFloat(value) };
    setWeights(newWeights);
    onUpdateConfig('rating_weights', newWeights);
  };

  const updateReviewThreshold = () => {
    onUpdateConfig('review_threshold', reviewThreshold);
  };

  const updateReviewPercentage = () => {
    onUpdateConfig('review_percentage', reviewPercentage);
  };

  return (
    <div className="tab-content">
      <h2>Algorithm Configuration</h2>
      <p>Adjust the importance of different factors in food evaluation</p>

      {weights && (
        <div className="config-section">
          <h3>Rating Weights</h3>
          <div className="weights-grid">
            {Object.entries(weights).map(([factor, weight]) => (
              <div key={factor} className="weight-control">
                <label>
                  {factor.replace(/_/g, ' ').toUpperCase()}:
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => updateWeight(factor, e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="config-section">
        <h3>Review Configuration</h3>
        <div className="form-group">
          <label>
            Review Threshold (foods below this score are flagged):
            <input
              type="number"
              value={reviewThreshold}
              onChange={(e) => setReviewThreshold(e.target.value)}
              onBlur={updateReviewThreshold}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Review Percentage (% of all submissions randomly flagged):
            <input
              type="number"
              value={reviewPercentage}
              onChange={(e) => setReviewPercentage(e.target.value)}
              onBlur={updateReviewPercentage}
            />
          </label>
        </div>
      </div>

      <div className="algorithm-visibility">
        <h3>Algorithm Transparency</h3>
        <div className="algorithm-description">
          <h4>Scoring Formula:</h4>
          <pre>{`Final Score = (
  (price × weight_price) +
  (messiness × weight_messiness) +
  (heaviness × weight_heaviness) +
  (energy_boost × weight_energy) +
  (healthiness × weight_health) +
  (shareability × weight_share) +
  (protein × weight_protein) +
  (spiciness × weight_spicy) +
  (happiness × weight_happy) +
  (nutritional_score × weight_health)
) / total_weights

+ team_healthiness_adjustment
+ late_night_bonus
  (energy_boost × 0.1 - heaviness × 0.05)`}</pre>
        </div>
      </div>
    </div>
  );
}

export default ConfigTab;
