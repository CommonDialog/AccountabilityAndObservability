import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import EvaluateTab from './components/EvaluateTab';
import SearchTab from './components/SearchTab';
import ReviewTab from './components/ReviewTab';
import TeamTab from './components/TeamTab';
import ConfigTab from './components/ConfigTab';
import ComplianceTab from './components/ComplianceTab';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [activeTab, setActiveTab] = useState('evaluate');
  const [team, setTeam] = useState([]);
  const [config, setConfig] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [foodName, setFoodName] = useState('');
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
      const errorMsg = `Error loading team: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/config`);
      if (!response.ok) throw new Error('Failed to load config');
      const data = await response.json();
      setConfig(data);
    } catch (err) {
      const errorMsg = `Error loading configuration: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const loadReviewQueue = async () => {
    try {
      const response = await fetch(`${API_URL}/review-queue`);
      if (!response.ok) throw new Error('Failed to load review queue');
      const data = await response.json();
      setReviewQueue(data);
    } catch (err) {
      const errorMsg = `Error loading review queue: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const loadCompliance = async () => {
    try {
      const response = await fetch(`${API_URL}/compliance`);
      if (!response.ok) throw new Error('Failed to load compliance data');
      const data = await response.json();
      setComplianceData(data);
    } catch (err) {
      const errorMsg = `Error loading compliance data: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const handleEvaluate = async () => {
    if (!selectedFile) {
      const errorMsg = 'Please select a JSON file to upload';
      setError(errorMsg);
      toast.error(errorMsg);
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
      setFoodName('');
      loadReviewQueue();
      loadCompliance();
      toast.success(`Successfully evaluated ${data.foods.length} food item(s)!`);
    } catch (err) {
      const errorMsg = `Error evaluating food: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAndEvaluate = async () => {
    if (!foodName) {
      const errorMsg = 'Please enter a food name';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setEvaluationResults(null);

    try {
      // Step 1: Generate food JSON from name using Claude API
      toast.info('Generating food ratings with AI...');
      const generateResponse = await fetch(`${API_URL}/generate-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodName }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Failed to generate food data');
      }

      const generatedData = await generateResponse.json();
      
      // Store generation metadata for display
      const generationMetadata = {
        claudeResponse: generatedData.foods,
        biasCheck: generatedData.biasCheck,
        userBiasIndicators: generatedData.userBiasIndicators || [],
        foodName: foodName
      };
      
      // Step 2: Evaluate the generated food
      toast.info('Evaluating food...');
      const evaluateResponse = await fetch(`${API_URL}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foods: generatedData.foods }),
      });

      if (!evaluateResponse.ok) {
        const errorData = await evaluateResponse.json();
        throw new Error(errorData.error || 'Evaluation failed');
      }

      const data = await evaluateResponse.json();
      
      // Attach generation metadata to results
      const resultsWithMetadata = data.foods.map(food => ({
        ...food,
        generationMetadata
      }));
      
      setEvaluationResults(resultsWithMetadata);
      setFoodName('');
      loadReviewQueue();
      loadCompliance();
      toast.success(`Successfully generated and evaluated ${foodName}!`);
    } catch (err) {
      const errorMsg = `Error: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
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
      toast.success(`Found ${data.length} result(s)`);
    } catch (err) {
      const errorMsg = `Error searching: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
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
      toast.success('Team member updated successfully!');
    } catch (err) {
      const errorMsg = `Error updating team member: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
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
      toast.success('Configuration updated successfully!');
    } catch (err) {
      const errorMsg = `Error updating configuration: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
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
      toast.success('Item marked as reviewed!');
    } catch (err) {
      const errorMsg = `Error marking as reviewed: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

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
            foodName={foodName}
            onFoodNameChange={setFoodName}
            onGenerateAndEvaluate={handleGenerateAndEvaluate}
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

export default App;
