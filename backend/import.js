const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/teceze-pricebook';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema - using flexible schema to match JSON structure
const PriceSchema = new mongoose.Schema({
  region: String,
  country: String,
  supplier: String,
  currency: String,
  payment_terms: String,
  levels: {
    type: Map,
    of: {
      with_backfill: Number,
      without_backfill: Number
    }
  },
  dispatch: {
    full_day: Number,
    half_day: Number,
    per_hour: Number,
    incident_responses: {
      type: Map,
      of: Number
    },
    additional_hour: Number,
    project_short_monthly: [Number],
    project_long_monthly: [Number]
  }
}, { collection: 'pricebook' });

const Price = mongoose.model('Price', PriceSchema);

// Load JSON
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// Import data
(async () => {
  try {
    await Price.deleteMany({});
    await Price.insertMany(data.countries);
    console.log('Data imported successfully');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    mongoose.connection.close();
  }
})();