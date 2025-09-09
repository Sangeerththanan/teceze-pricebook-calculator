import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// API base URL configurable via Vite env var
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function App() {
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedBackfill, setSelectedBackfill] = useState('');
  const [selectedResponseType, setSelectedResponseType] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/countries`)
      .then(res => {
      const regionList = [...new Set(res.data.map(c => c.region))];
        setRegions(regionList);
      })
      .catch(err => {
        console.error('Error fetching regions:', err);
        setError('Failed to load regions');
    });
  }, []);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedCountry('');
    setCountries([]);
    setPrice(null);
    setError('');
    
    if (region) {
      axios.get(`${API_BASE_URL}/countries?region=${region}`)
        .then(res => setCountries(res.data.map(c => c.country)))
        .catch(err => {
          console.error('Error fetching countries:', err);
          setError('Failed to load countries');
        });
    }
  };

  const handleCalculate = () => {
    if (!selectedCountry || !selectedService) {
      setError('Please select country and service');
      return;
    }
    
    setLoading(true);
    setError('');
    
    let url = `${API_BASE_URL}/prices/${selectedCountry}/${selectedService}`;
    
    if (selectedService === 'yearly' && selectedLevel && selectedBackfill) {
      url += `/${selectedLevel}/${selectedBackfill}`;
    } else if (selectedService === 'dispatch' && selectedLevel) {
      url += `/${selectedLevel}`;
    } else if (selectedService === 'incident' && selectedResponseType) {
      // Fixed: Remove the empty level parameter that was causing //
      url += `/${selectedResponseType}`;
    } else if (selectedService === 'project' && selectedProjectType && selectedLevel) {
      // Fixed: Reorder parameters to match server expectation
      url += `/${selectedLevel}/${selectedProjectType}`;
    }
    
    console.log('Making request to:', url); // Debug log
    
    axios.get(url)
      .then(res => {
        setPrice(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error calculating price:', err);
        setError('Failed to calculate price');
        setLoading(false);
      });
  };

  const resetForm = () => {
    setSelectedRegion('');
    setSelectedCountry('');
    setSelectedService('');
    setSelectedLevel('');
    setSelectedBackfill('');
    setSelectedResponseType('');
    setSelectedProjectType('');
    setPrice(null);
    setError('');
  };

  return (
    <div className="app">
      <header className="app-header">
      <h1>Teceze Pricebook Calculator</h1>
        <p>Calculate pricing for IT support services across different regions and countries</p>
      </header>

      <main className="app-main">
        <div className="calculator-form">
          <div className="form-group">
            <label htmlFor="region">Region:</label>
            <select 
              id="region" 
              value={selectedRegion} 
          onChange={handleRegionChange}
            >
              <option value="">Select Region</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <select 
              id="country" 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
          disabled={!selectedRegion}
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="service">Service Type:</label>
            <select 
              id="service" 
              value={selectedService} 
              onChange={(e) => {
                setSelectedService(e.target.value);
                setSelectedLevel('');
                setSelectedBackfill('');
                setSelectedResponseType('');
                setSelectedProjectType('');
            setPrice(null);
          }}
            >
              <option value="">Select Service</option>
              <option value="yearly">Yearly Support</option>
              <option value="dispatch">Dispatch Service</option>
              <option value="incident">Incident Response</option>
              <option value="project">Project Support</option>
            </select>
          </div>

          {(selectedService === 'yearly' || selectedService === 'dispatch' || selectedService === 'project') && (
            <div className="form-group">
              <label htmlFor="level">Support Level:</label>
              <select 
                id="level" 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(e.target.value)}
            disabled={!selectedService}
              >
                <option value="">Select Level</option>
                <option value="L1">L1 - Basic Support</option>
                <option value="L2">L2 - Advanced Support</option>
                <option value="L3">L3 - Complex Resolution</option>
                <option value="L4">L4 - Infrastructure Management</option>
                <option value="L5">L5 - Architecture & Leadership</option>
              </select>
            </div>
          )}

          {selectedService === 'yearly' && (
            <div className="form-group">
              <label htmlFor="backfill">Backfill Option:</label>
              <select 
                id="backfill" 
                value={selectedBackfill} 
                onChange={(e) => setSelectedBackfill(e.target.value)}
            disabled={!selectedLevel}
              >
                <option value="">Select Backfill</option>
                <option value="with">With Backfill</option>
                <option value="without">Without Backfill</option>
              </select>
            </div>
          )}

          {selectedService === 'incident' && (
            <div className="form-group">
              <label htmlFor="responseType">Response Type:</label>
              <select 
                id="responseType" 
                value={selectedResponseType} 
                onChange={(e) => setSelectedResponseType(e.target.value)}
            disabled={!selectedService}
              >
                <option value="">Select Response Type</option>
                <option value="9x5x4">9x5x4 Response</option>
                <option value="24x7x4">24x7x4 Response</option>
                <option value="sbd">Same Business Day</option>
                <option value="nbd">Next Business Day</option>
                <option value="2bd">2 Business Days</option>
                <option value="3bd">3 Business Days</option>
              </select>
            </div>
          )}

          {selectedService === 'project' && (
            <div className="form-group">
              <label htmlFor="projectType">Project Type:</label>
              <select 
                id="projectType" 
                value={selectedProjectType} 
                onChange={(e) => setSelectedProjectType(e.target.value)}
            disabled={!selectedLevel}
              >
                <option value="">Select Project Type</option>
                <option value="short">Short Term</option>
                <option value="long">Long Term</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button 
              onClick={handleCalculate} 
              disabled={loading}
              className="calculate-btn"
            >
              {loading ? 'Calculating...' : 'Calculate Price'}
            </button>
            <button onClick={resetForm} className="reset-btn">
              Reset
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {price && (
          <div className="price-result">
            <h2>Price Calculation Result</h2>
            <div className="price-details">
              <div className="price-value">
                <span className="currency">{price.currency}</span>
                <span className="amount">{price.value?.toLocaleString()}</span>
              </div>
              <div className="price-info">
                <p><strong>Payment Terms:</strong> {price.payment_terms}</p>
                <p><strong>Description:</strong> {price.description}</p>
              </div>
            </div>
            
            <details className="terms-section">
              <summary>Terms & Conditions</summary>
              <ul>
                {price.terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;