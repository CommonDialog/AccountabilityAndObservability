import React, { useState } from 'react';
import { toast } from 'react-toastify';

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
    const allergy = window.prompt('Enter allergen:');
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

export default TeamTab;
