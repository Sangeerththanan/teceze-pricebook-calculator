# Teceze Pricebook Calculator

A web application for calculating IT support service pricing across different regions and countries based on the Teceze Global Pricebook.

## Features

- **Multi-Region Support**: Calculate prices for different regions (APAC, Europe, Americas, etc.)
- **Service Types**: Support for yearly contracts, dispatch services, incident response, and project support
- **Support Levels**: L1 through L5 support levels with different pricing
- **Backfill Options**: With or without backfill pricing for yearly contracts
- **Response Types**: Various incident response timeframes (9x5x4, 24x7x4, SBD, NBD, etc.)
- **Project Types**: Short-term and long-term project support pricing

## Technology Stack

- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Data**: JSON-based (can be extended to MongoDB)
- **Styling**: Custom CSS with responsive design

## Project Structure

```
teceze-pricebook-calculator/
├── backend/
│   ├── data.json              # Price data (converted from Excel)
│   ├── index.js               # Express server (JSON-based)
│   ├── import.js              # MongoDB import script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── App.css            # Styling
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── public/
│   │   └── vite.svg           # Vite logo
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   ├── eslint.config.js       # ESLint configuration
│   └── package.json
└── scripts/
    ├── excel_to_json.py       # Excel to JSON converter
    ├── examine_excel.py       # Excel examination utility
    └── Teceze Global Pricebook v0.1.xlsx
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3 (for Excel conversion)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sangeerththanan/teceze-pricebook-calculator.git
   cd teceze-pricebook-calculator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

> **📖 For detailed startup instructions and troubleshooting, see [STARTUP-GUIDE.md](STARTUP-GUIDE.md)**

#### Option 1: Quick Start (Windows)
Double-click `start-app.bat` to automatically start both servers.

#### Option 2: Individual Servers
- **Backend**: Double-click `start-backend.bat`
- **Frontend**: Double-click `start-frontend.bat`

#### Option 3: Manual Start

1. **Start the backend server**
   ```bash
   cd backend
   node index.js
   ```
   The backend will run on http://localhost:3001

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:5173

3. **Open your browser**
   Navigate to http://localhost:5173 to use the calculator

#### Option 4: Using npm scripts
```bash
# Install all dependencies first
npm run install-all

# Start both servers
npm start
```

#### ⚠️ PowerShell Issues?
If you get PowerShell execution policy errors, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Usage

1. **Select Region**: Choose from available regions (APAC, Europe, etc.)
2. **Select Country**: Pick a country from the selected region
3. **Choose Service Type**: 
   - **Yearly Support**: Annual contract pricing with backfill options
   - **Dispatch Service**: On-site dispatch pricing
   - **Incident Response**: Emergency response pricing
   - **Project Support**: Project-based pricing (short/long term)
4. **Configure Options**: Select support level, backfill options, response types, etc.
5. **Calculate**: Click "Calculate Price" to get the pricing information

## Data Management

### Converting Excel to JSON

The Excel pricebook can be converted to JSON format using the provided Python script:

```bash
cd scripts
python excel_to_json.py
```

This will generate `backend/data.json` with all the pricing data.

### MongoDB Integration (Optional)

For production use with MongoDB:

1. **Set up MongoDB connection**
   ```bash
   # Create .env file in backend directory
   echo "MONGO_URI=mongodb://localhost:27017/teceze-pricebook" > backend/.env
   ```

2. **Import data to MongoDB**
   ```bash
   cd backend
   npm run import
   ```

3. **Use MongoDB server**
   ```bash
   node index.js  # The main server file
   ```

## API Endpoints

### GET /countries
Get list of countries, optionally filtered by region.

**Query Parameters:**
- `region` (optional): Filter by region

**Response:**
```json
[
  {
    "country": "Australia",
    "region": "APAC"
  }
]
```

### GET /prices/:country/:service/:level?/:backfill?/:responseType?/:projectType?
Get pricing information for a specific service.

**Parameters:**
- `country`: Country name
- `service`: Service type (yearly, dispatch, incident, project)
- `level`: Support level (L1, L2, L3, L4, L5) - required for yearly, dispatch, project
- `backfill`: Backfill option (with, without) - required for yearly
- `responseType`: Response type (9x5x4, 24x7x4, sbd, nbd, 2bd, 3bd) - required for incident
- `projectType`: Project type (short, long) - required for project

**Response:**
```json
{
  "value": 48000,
  "currency": "USD",
  "payment_terms": "60 Days",
  "description": "Basic troubleshooting (network connectivity, password reset, equipment install). Min 6 months exp.",
  "terms": [
    "All prices exclusive of taxes.",
    "5% Service Management fee on monthly billing.",
    "..."
  ]
}
```

## Deployment

### Frontend Deployment

Build the frontend for production:

```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

### Backend Deployment

For production deployment:

1. Set environment variables
2. Use a process manager like PM2
3. Set up reverse proxy (nginx)
4. Configure SSL certificates

## Development

### Adding New Features

1. **New Service Types**: Add to the service options in `App.jsx`
2. **New Pricing Logic**: Update the API endpoint in `index.js`
3. **UI Improvements**: Modify `App.jsx` and `App.css`

### Data Updates

1. Update the Excel file with new pricing
2. Run the conversion script: `python scripts/excel_to_json.py`
3. Restart the backend server

## License

This project is developed for TECEZE assessment purposes.

## Contact

For questions or support, please contact the development team.