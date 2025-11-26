import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [activeTab, setActiveTab] = useState('evaluate');
  const [team, setTeam] = useState([]);
  const [config, setConfig] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [complianceData, setComplianceData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRejected, setShowRejected] = useState(false);

  useEffect(() => {
    loadTeam();
    loadConfig();
    loadReviewQueue();
    loadCompliance();
  }, []);

  const loadTeam = async () => {
    try {
      const response = await fetch(`${API_URL}/team`);
      if (!response.ok) throw new Error('Failed to load team');
      const data = await response.json();
      setTeam(data);
    } catch (err) {
      setError(`Error loading team: ${err.message}`);
    }
  };

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/config`);
      if (!response.ok) throw new Error('Failed to load config');
      const data = await response.json();
      setConfig(data);
    } catch (err) {
      setError(`Error loading configuration: ${err.message}`);
    }
  };

  const loadReviewQueue = async () => {
    try {
      const response = await fetch(`${API_URL}/review-queue`);
      if (!response.ok) throw new Error('Failed to load review queue');
      const data = await response.json();
      setReviewQueue(data);
    } catch (err) {
      setError(`Error loading review queue: ${err.message}`);
    }
  };

  const loadCompliance = async () => {
    try {
      const response = await fetch(`${API_URL}/compliance`);
      if (!response.ok) throw new Error('Failed to load compliance data');
      const data = await response.json();
      setComplianceData(data);
    } catch (err) {
      setError(`Error loading compliance data: ${err.message}`);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const handleEvaluate = async () => {
    if (!selectedFile) {
      setError('Please select a JSON file to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setEvaluationResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_URL}/evaluate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Evaluation failed');
      }

      const data = await response.json();
      setEvaluationResults(data.foods);
      setSelectedFile(null);
      loadReviewQueue();
      loadCompliance();
    } catch (err) {
      setError(`Error evaluating food: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (showRejected) params.append('rejected', 'true');

      const response = await fetch(`${API_URL}/search?${params}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(`Error searching: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeamMember = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update team member');
      loadTeam();
    } catch (err) {
      setError(`Error updating team member: ${err.message}`);
    }
  };

  const handleUpdateConfig = async (key, value) => {
    try {
      const response = await fetch(`${API_URL}/config/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) throw new Error('Failed to update configuration');
      loadConfig();
    } catch (err) {
      setError(`Error updating configuration: ${err.message}`);
    }
  };

  const handleMarkReviewed = async (id, reviewerName) => {
    try {
      const response = await fetch(`${API_URL}/review/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewedBy: reviewerName }),
      });

      if (!response.ok) throw new Error('Failed to mark as reviewed');
      loadReviewQueue();
    } catch (err) {
      setError(`Error marking as reviewed: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🍕 Late Night Dev Food Evaluator</h1>
        <p>AI-Powered Food Selection for Development Sessions</p>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'evaluate' ? 'active' : ''} 
          onClick={() => setActiveTab('evaluate')}
        >
          Evaluate Food
        </button>
        <button 
          className={activeTab === 'search' ? 'active' : ''} 
          onClick={() => setActiveTab('search')}
        >
          Search History
        </button>
        <button 
          className={activeTab === 'review' ? 'active' : ''} 
          onClick={() => setActiveTab('review')}
        >
          Review Queue {reviewQueue.length > 0 && `(${reviewQueue.length})`}
        </button>
        <button 
          className={activeTab === 'team' ? 'active' : ''} 
          onClick={() => setActiveTab('team')}
        >
          Team Settings
        </button>
        <button 
          className={activeTab === 'config' ? 'active' : ''} 
          onClick={() => setActiveTab('config')}
        >
          Algorithm Config
        </button>
        <button 
          className={activeTab === 'compliance' ? 'active' : ''} 
          onClick={() => setActiveTab('compliance')}
        >
          Compliance
        </button>
      </nav>

      <main className="content">
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        {activeTab === 'evaluate' && (
          <EvaluateTab
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onEvaluate={handleEvaluate}
            loading={loading}
            results={evaluationResults}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab
            query={searchQuery}
            onQueryChange={setSearchQuery}
            showRejected={showRejected}
            onShowRejectedChange={setShowRejected}
            onSearch={handleSearch}
            loading={loading}
            results={searchResults}
          />
        )}

        {activeTab === 'review' && (
          <ReviewTab
            queue={reviewQueue}
            onMarkReviewed={handleMarkReviewed}
          />
        )}

        {activeTab === 'team' && (
          <TeamTab
            team={team}
            onUpdateMember={handleUpdateTeamMember}
          />
        )}

        {activeTab === 'config' && (
          <ConfigTab
            config={config}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceTab
            data={complianceData}
          />
        )}
      </main>
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

function TeamTab({ team, onUpdateMember }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (member) => {
    setEditingId(member.id);
    setEditForm({
      allergies: member.allergies || [],
      healthiness_factor: member.healthiness_factor,
    });
  };

  const saveEdit = (id) => {
    onUpdateMember(id, editForm);
    setEditingId(null);
  };

  const addAllergy = () => {
    const allergy = prompt('Enter allergen:');
    if (allergy) {
      setEditForm({
        ...editForm,
        allergies: [...editForm.allergies, allergy],
      });
    }
  };

  const removeAllergy = (index) => {
    setEditForm({
      ...editForm,
      allergies: editForm.allergies.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="tab-content">
      <h2>Team Members</h2>
      <p>Configure team allergies and healthiness preferences</p>

      {team.length === 0 ? (
        <div className="error-banner">Unable to load team data. Please ensure the database is properly configured.</div>
      ) : (
        <div className="team-list">
          {team.map((member) => (
            <div key={member.id} className="team-card">
              <h3>{member.name}</h3>

              {editingId === member.id ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Allergies:</label>
                    <div className="allergies-list">
                      {editForm.allergies.map((allergy, idx) => (
                        <span key={idx} className="allergy-tag">
                          {allergy}
                          <button onClick={() => removeAllergy(idx)}>×</button>
                        </span>
                      ))}
                      <button onClick={addAllergy} className="btn-secondary">+ Add Allergy</button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Healthiness Factor (1-10):
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editForm.healthiness_factor}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          healthiness_factor: parseInt(e.target.value)
                        })}
                      />
                    </label>
                  </div>

                  <div className="button-group">
                    <button onClick={() => saveEdit(member.id)} className="btn-primary">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="member-info">
                  <div>
                    <strong>Allergies:</strong>{' '}
                    {member.allergies && member.allergies.length > 0
                      ? member.allergies.join(', ')
                      : 'None'}
                  </div>
                  <div>
                    <strong>Healthiness Factor:</strong> {member.healthiness_factor}/10
                  </div>
                  <button onClick={() => startEdit(member)} className="btn-secondary">Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

function ComplianceTab({ data }) {
  if (data.length === 0) {
    return (
      <div className="tab-content">
        <h2>Four-Fifths Rule Compliance</h2>
        <div className="no-results">
          No compliance checks have been performed yet. The system needs 20+ submissions
          of each food type before compliance tracking begins.
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h2>Four-Fifths Rule Compliance</h2>
      <p>Tracking adverse impact in food review rates across different classifications</p>

      <div className="compliance-info">
        <p>
          The four-fifths rule checks if any classification type has a review rate
          significantly lower than others. A classification is compliant if its pass rate
          (non-flagged items) is at least 80% of the highest pass rate.
        </p>
      </div>

      <div className="compliance-list">
        {data.map((item) => (
          <div
            key={item.id}
            className={`compliance-card ${item.compliant ? 'compliant' : 'non-compliant'}`}
          >
            <div className="card-header">
              <h3>{item.classification_key.replace(/_/g, ' ').toUpperCase()}</h3>
              <div className={`compliance-badge ${item.compliant ? 'pass' : 'fail'}`}>
                {item.compliant ? '✓ COMPLIANT' : '✗ NON-COMPLIANT'}
              </div>
            </div>
            <div className="compliance-stats">
              <div>Total Submissions: {item.total_submissions}</div>
              <div>Flagged for Review: {item.flagged_for_review}</div>
              <div>Pass Rate: {item.pass_rate}%</div>
              <div>Threshold: {item.compliant ? '≥' : '<'} 80%</div>
            </div>
            <div className="metadata">
              Checked: {new Date(item.checked_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
