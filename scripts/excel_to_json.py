import pandas as pd
import json

# Read Excel file with proper column headers
excel_file = 'scripts/Teceze Global Pricebook v0.1.xlsx'
df = pd.read_excel(excel_file, skiprows=2)  # Skip to data rows

# Define proper column names based on the Excel structure (41 columns)
column_names = [
    'Region', 'Country', 'Supplier', 'Currency', 'Payment Terms',
    'L1 With Backfill', 'L1 Without Backfill', 'L2 With Backfill', 'L2 Without Backfill',
    'L3 With Backfill', 'L3 Without Backfill', 'L4 With Backfill', 'L4 Without Backfill',
    'L5 With Backfill', 'L5 Without Backfill', 'Full Day', 'Half Day', 'Per Hour',
    'Col18', 'Col19', 'Col20', '9x5x4 Incident Response', '24x7x4 Response to Site',
    'SBD Business Day', 'NBD Resolution', '2BD Resolution', '3BD Resolution',
    'Additional Hour', 'Col28', 'Col29', 'Col30',
    'L1 Short Term', 'L2 Short Term', 'L3 Short Term', 'L4 Short Term', 'L5 Short Term',
    'L1 Long Term', 'L2 Long Term', 'L3 Long Term', 'L4 Long Term', 'L5 Long Term'
]

# Assign column names
df.columns = column_names

# Initialize output structure
data = {
    "countries": [],
    "terms": [
        "All prices exclusive of taxes.",
        "5% Service Management fee on monthly billing.",
        "Travel >50km: $0.40/km extra.",
        "Business hours only; out-of-hours x1.5, weekends/holidays x2.",
        "Access denied: Full rate charged.",
        "Cancellation <24h: 50% charge.",
        "Transition costs at T&M.",
        "USA Tier 1 cities: Atlanta, Austin, etc."
    ],
    "descriptions": {
        "L1": "Basic troubleshooting (network connectivity, password reset, equipment install). Min 6 months exp.",
        "L2": "Advanced troubleshooting (logs, config routers/switches). Min 18 months exp.",
        "L3": "Complex resolution (diagnostics, packet capture, design). Min 2 years exp.",
        "L4": "Infrastructure mgmt, monitoring, security, vendor mgmt. 3-5 years exp.",
        "L5": "Architecture, critical support, optimization, project lead."
    }
}

# Map Excel rows to JSON
print(f"Processing {len(df)} rows from Excel...")
processed_count = 0
for _, row in df.iterrows():
    # Skip rows where country is NaN or empty
    if pd.isna(row['Country']) or str(row['Country']).strip() == '':
        continue
    processed_count += 1
    country_data = {
        "region": row['Region'],
        "country": row['Country'],
        "supplier": row['Supplier'],
        "currency": row['Currency'],
        "payment_terms": row['Payment Terms'],
        "levels": {
            "L1": {
                "with_backfill": float(row['L1 With Backfill']) if pd.notna(row['L1 With Backfill']) else 0,
                "without_backfill": float(row['L1 Without Backfill']) if pd.notna(row['L1 Without Backfill']) else 0
            },
            "L2": {
                "with_backfill": float(row['L2 With Backfill']) if pd.notna(row['L2 With Backfill']) else 0,
                "without_backfill": float(row['L2 Without Backfill']) if pd.notna(row['L2 Without Backfill']) else 0
            },
            "L3": {
                "with_backfill": float(row['L3 With Backfill']) if pd.notna(row['L3 With Backfill']) else 0,
                "without_backfill": float(row['L3 Without Backfill']) if pd.notna(row['L3 Without Backfill']) else 0
            },
            "L4": {
                "with_backfill": float(row['L4 With Backfill']) if pd.notna(row['L4 With Backfill']) else 0,
                "without_backfill": float(row['L4 Without Backfill']) if pd.notna(row['L4 Without Backfill']) else 0
            },
            "L5": {
                "with_backfill": float(row['L5 With Backfill']) if pd.notna(row['L5 With Backfill']) else 0,
                "without_backfill": float(row['L5 Without Backfill']) if pd.notna(row['L5 Without Backfill']) else 0
            }
        },
        "dispatch": {
            "full_day": float(row['Full Day']) if pd.notna(row['Full Day']) else 0,
            "half_day": float(row['Half Day']) if pd.notna(row['Half Day']) else 0,
            "per_hour": float(row['Per Hour']) if pd.notna(row['Per Hour']) else 0,
            "incident_responses": {
                "9x5x4": float(row['9x5x4 Incident Response']) if pd.notna(row['9x5x4 Incident Response']) else 0,
                "24x7x4": float(row['24x7x4 Response to Site']) if pd.notna(row['24x7x4 Response to Site']) else 0,
                "sbd": float(row['SBD Business Day']) if pd.notna(row['SBD Business Day']) else 0,
                "nbd": float(row['NBD Resolution']) if pd.notna(row['NBD Resolution']) else 0,
                "2bd": float(row['2BD Resolution']) if pd.notna(row['2BD Resolution']) else 0,
                "3bd": float(row['3BD Resolution']) if pd.notna(row['3BD Resolution']) else 0
            },
            "additional_hour": float(row['Additional Hour']) if pd.notna(row['Additional Hour']) else 0,
            "project_short_monthly": [
                float(row['L1 Short Term']) if pd.notna(row['L1 Short Term']) else 0,
                float(row['L2 Short Term']) if pd.notna(row['L2 Short Term']) else 0,
                float(row['L3 Short Term']) if pd.notna(row['L3 Short Term']) else 0,
                float(row['L4 Short Term']) if pd.notna(row['L4 Short Term']) else 0,
                float(row['L5 Short Term']) if pd.notna(row['L5 Short Term']) else 0
            ],
            "project_long_monthly": [
                float(row['L1 Long Term']) if pd.notna(row['L1 Long Term']) else 0,
                float(row['L2 Long Term']) if pd.notna(row['L2 Long Term']) else 0,
                float(row['L3 Long Term']) if pd.notna(row['L3 Long Term']) else 0,
                float(row['L4 Long Term']) if pd.notna(row['L4 Long Term']) else 0,
                float(row['L5 Long Term']) if pd.notna(row['L5 Long Term']) else 0
            ]
        }
    }
    data["countries"].append(country_data)

# Save to JSON
with open('backend/data.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Converted Excel to data.json - Processed {processed_count} countries")