const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Load JSON data (use absolute path for serverless compatibility)
const dataFilePath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// Static terms and descriptions
const terms = [
  "All prices exclusive of taxes.",
  "5% Service Management fee on monthly billing.",
  "Travel >50km: $0.40/km extra.",
  "Business hours only; out-of-hours x1.5, weekends/holidays x2.",
  "Access denied: Full rate charged.",
  "Cancellation <24h: 50% charge.",
  "Transition costs at T&M.",
  "USA Tier 1 cities: Atlanta, Austin, etc."
];

const descriptions = {
  L1: "Basic troubleshooting (network connectivity, password reset, equipment install). Min 6 months exp.",
  L2: "Advanced troubleshooting (logs, config routers/switches). Min 18 months exp.",
  L3: "Complex resolution (diagnostics, packet capture, design). Min 2 years exp.",
  L4: "Infrastructure mgmt, monitoring, security, vendor mgmt. 3-5 years exp.",
  L5: "Architecture, critical support, optimization, project lead."
};

// API Endpoints
app.get('/countries', (req, res) => {
  const { region } = req.query;
  let countries = data.countries;
  
  if (region) {
    countries = countries.filter(c => c.region === region);
  }
  
  const result = countries.map(c => ({
    country: c.country,
    region: c.region
  }));
  
  res.json(result);
});

// Fixed route structure to handle different service types properly
app.get('/prices/:country/:service/*', (req, res) => {
  const { country, service } = req.params;
  const pathParts = req.params[0].split('/').filter(part => part !== ''); // Remove empty parts
  
  console.log(`Request: ${country}/${service}/${pathParts.join('/')}`);
  
  const countryData = data.countries.find(c => c.country === country);
  if (!countryData) {
    return res.status(404).json({ error: 'Country not found' });
  }

  let priceValue, description;
  
  try {
    if (service === 'yearly') {
      // yearly/:level/:backfill
      const [level, backfill] = pathParts;
      if (!level || !backfill) {
        return res.status(400).json({ error: 'Missing level or backfill parameter for yearly service' });
      }
      priceValue = countryData.levels[level][`${backfill}_backfill`];
      description = descriptions[level];
    } 
    else if (service === 'dispatch') {
      // dispatch/:level
      const [level] = pathParts;
      if (!level) {
        return res.status(400).json({ error: 'Missing level parameter for dispatch service' });
      }
      priceValue = countryData.dispatch.full_day;
      description = `Dispatch for ${level}`;
    } 
    else if (service === 'incident') {
      // incident/:responseType
      const [responseType] = pathParts;
      if (!responseType) {
        return res.status(400).json({ error: 'Missing responseType parameter for incident service' });
      }
      priceValue = countryData.dispatch.incident_responses[responseType];
      description = `Incident response: ${responseType.toUpperCase()}`;
    } 
    else if (service === 'project') {
      // project/:level/:projectType
      const [level, projectType] = pathParts;
      if (!level || !projectType) {
        return res.status(400).json({ error: 'Missing level or projectType parameter for project service' });
      }
      const levelIndex = ['L1', 'L2', 'L3', 'L4', 'L5'].indexOf(level);
      if (levelIndex === -1) {
        return res.status(400).json({ error: 'Invalid level parameter' });
      }
      priceValue = countryData.dispatch[`project_${projectType}_monthly`][levelIndex];
      description = `${projectType} project monthly rate for ${level}`;
    } 
    else {
      return res.status(400).json({ error: 'Invalid service type' });
    }

    if (priceValue === undefined || priceValue === null) {
      return res.status(404).json({ error: 'Price not found for the specified parameters' });
    }

    res.json({
      value: priceValue,
      currency: countryData.currency,
      payment_terms: countryData.payment_terms,
      description,
      terms
    });
  } catch (error) {
    console.error('Error processing price request:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', countries: data.countries.length });
});

// Start server only when running locally (not in Vercel serverless)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`Loaded ${data.countries.length} countries`);
  });
}

module.exports = app;