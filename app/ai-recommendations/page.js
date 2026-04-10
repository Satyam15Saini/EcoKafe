'use client';

import { useState } from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import './style.css';

export default function AIRecommendationsPage() {
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    budget: 500,
    location: '',
    allergies: '',
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const dietaryOptions = [
    { id: 'vegan', label: 'Vegan', emoji: '🌱' },
    { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
    { id: 'glutenfree', label: 'Gluten-Free', emoji: '🌾' },
    { id: 'dairyfree', label: 'Dairy-Free', emoji: '🥛' },
    { id: 'lowcarb', label: 'Low-Carb', emoji: '🥩' },
    { id: 'organic', label: 'Organic', emoji: '🍃' }
  ];

  const toggleDietaryOption = (id) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(id)
        ? prev.dietaryRestrictions.filter(item => item !== id)
        : [...prev.dietaryRestrictions, id]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBudgetChange = (e) => {
    setPreferences(prev => ({
      ...prev,
      budget: parseInt(e.target.value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!preferences.location.trim()) {
      setError('Please enter your location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: preferences.location,
          budget: preferences.budget,
          dietary: preferences.dietaryRestrictions,
          userPreference: preferences.additionalNotes,
          allergies: preferences.allergies
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      setResults(data.recommendations || data);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPreferences({
      dietaryRestrictions: [],
      budget: 500,
      location: '',
      allergies: '',
      additionalNotes: ''
    });
    setResults(null);
    setError('');
  };

  if (results) {
    return (
      <>
        <Navbar />
        <div className="ai-recommendations-container">
        <section className="results-section">
          <div className="results-wrapper">
            <div className="results-header">
              <h2>🎯 Your Perfect Cafés</h2>
              <p>Based on your preferences and culinary desires</p>
            </div>

            {Array.isArray(results) && results.length > 0 ? (
              <div className="recommendations-grid">
                {results.map((recommendation, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="rank-badge">#{index + 1}</div>

                    <div className="card-header">
                      <h3>{recommendation.cafeName}</h3>
                    </div>

                    <p className="card-reason">{recommendation.reason}</p>

                    <div className="card-stats">
                      <div className="stat-item">
                        <span className="stat-label">Match</span>
                        <span className="stat-value">{recommendation.matchScore}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Avg Price</span>
                        <span className="stat-value">₹{recommendation.averagePrice}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Rating</span>
                        <span className="stat-value">⭐{recommendation.rating}</span>
                      </div>
                    </div>

                    {recommendation.ecoFactor && (
                      <div className="eco-factor">
                        <span className="eco-icon">🌍</span>
                        <div>
                          <h4>Eco Impact</h4>
                          <p>{recommendation.ecoFactor}</p>
                        </div>
                      </div>
                    )}

                    {recommendation.specialtyItems && recommendation.specialtyItems.length > 0 && (
                      <div className="food-items">
                        <h4>🍽️ Specialty Items</h4>
                        <div className="items-list">
                          {recommendation.specialtyItems.map((item, idx) => (
                            <span key={idx} className="item-tag">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button className="book-btn" onClick={() => window.location.href = `/cafe/${recommendation.cafeId}`}>
                      <span>Explore Café</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">😔</span>
                <h2>No Matches Found</h2>
                <p>Try adjusting your preferences to find the perfect café for you</p>
                <button className="retry-btn" onClick={resetForm}>Try Again</button>
              </div>
            )}

            <div className="new-search-section">
              <button className="new-search-btn" onClick={resetForm}>
                🔍 New Search
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="ai-recommendations-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <div className="gradient-blob blob-3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ Powered by AI</span>
          </div>
          <h1 className="hero-title">Discover Your Perfect Café</h1>
          <p className="hero-subtitle">
            Tell us your preferences, dietary needs, and budget. Our AI will find the most sustainable and delicious restaurants tailored just for you.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="form-section">
        <div className="form-wrapper">
          <form className="preference-form" onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#fca5a5',
                fontWeight: '600'
              }}>
                {error}
              </div>
            )}

            {/* Dietary Restrictions */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🍽️</span>
                Dietary Preferences
              </label>
              <div className="diet-options">
                {dietaryOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    className={`diet-card ${preferences.dietaryRestrictions.includes(option.id) ? 'active' : ''}`}
                    onClick={() => toggleDietaryOption(option.id)}
                  >
                    <span className="diet-emoji">{option.emoji}</span>
                    <span className="diet-label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Slider */}
            <div className="form-group">
              <div className="input-label-wrapper">
                <label className="form-label">
                  <span className="label-icon">💰</span>
                  Monthly Budget
                </label>
                <span className="budget-value">₹{preferences.budget}</span>
              </div>
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={preferences.budget}
                  onChange={handleBudgetChange}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>₹100</span>
                  <span>₹5000</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                <span className="label-icon">📍</span>
                Your Location / City
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g., Mumbai, Bangalore, Delhi..."
                  value={preferences.location}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <div className="input-underline"></div>
              </div>
            </div>

            {/* Allergies */}
            <div className="form-group">
              <label htmlFor="allergies" className="form-label">
                <span className="label-icon">⚠️</span>
                Allergies & Intolerances
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  placeholder="e.g., nuts, shellfish, soy..."
                  value={preferences.allergies}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <div className="input-underline"></div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                <span className="label-icon">📝</span>
                Additional Notes
              </label>
              <div className="textarea-wrapper">
                <textarea
                  id="notes"
                  name="additionalNotes"
                  placeholder="Your favorite cuisines, must-have dishes, ambiance preferences, sustainability priorities..."
                  value={preferences.additionalNotes}
                  onChange={handleInputChange}
                  className="form-textarea"
                ></textarea>
                <div className="textarea-underline"></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              <div className="btn-content">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Finding Perfect Cafés...</span>
                  </>
                ) : (
                  <>
                    <span>Find My Perfect Café</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Info Cards */}
          <div className="info-cards">
            <div className="info-card">
              <span className="info-icon">🤖</span>
              <h3>AI-Powered</h3>
              <p>Smart matching based on your unique preferences</p>
            </div>
            <div className="info-card">
              <span className="info-icon">🌱</span>
              <h3>Eco-Conscious</h3>
              <p>Discover sustainable dining options</p>
            </div>
            <div className="info-card">
              <span className="info-icon">⭐</span>
              <h3>Top Rated</h3>
              <p>Highly reviewed restaurants in your city</p>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          <h2>Analyzing Your Preferences</h2>
          <p>Our AI is finding the perfect cafés for you...</p>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}
