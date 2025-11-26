import React from 'react';

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

export default ComplianceTab;
