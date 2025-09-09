# 🚀 TECEZE Pricebook Calculator - Startup Guide

## ⚠️ Important: PowerShell Execution Policy

If you see this error:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Fix it by running this command in PowerShell as Administrator:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🎯 Quick Start (3 Methods)

### Method 1: Double-Click Startup (Easiest)
1. **Double-click** `start-app.bat` in the project root
2. Wait for both servers to start
3. Open browser to http://localhost:5173

### Method 2: PowerShell Script
1. **Right-click** on `start-app.ps1` → "Run with PowerShell"
2. Wait for both servers to start
3. Open browser to http://localhost:5173

### Method 3: Manual Start (2 Terminals)

#### Terminal 1 - Backend:
```powershell
cd D:\Applications\teceze-pricebook-calculator\backend
node index.js
```
You should see:
```
Backend running on port 3001
Loaded 173 countries
```

#### Terminal 2 - Frontend:
```powershell
cd D:\Applications\teceze-pricebook-calculator\frontend
npm run dev
```
You should see:
```
VITE v4.4.0  ready in 500 ms
➜  Local:   http://localhost:5173/
```

## 🔧 Troubleshooting

### Backend Not Starting?
1. Check if port 3001 is free:
   ```powershell
   netstat -an | findstr :3001
   ```
2. If port is in use, kill the process:
   ```powershell
   Get-Process | Where-Object {$_.ProcessName -eq "node"}
   Stop-Process -Id <PID>
   ```

### Frontend Not Starting?
1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```
2. Check if port 5173 is free:
   ```powershell
   netstat -an | findstr :5173
   ```

### API 404 Errors?
1. Make sure backend is running on port 3001
2. Test backend health:
   ```powershell
   Invoke-RestMethod -Uri 'http://localhost:3001/health' -Method Get
   ```

### CORS Errors?
- Backend has CORS enabled
- Make sure frontend is calling `http://localhost:3001`

## 📋 Verification Checklist

✅ **Backend Running**: http://localhost:3001/health returns `{"status":"OK","countries":173}`  
✅ **Frontend Running**: http://localhost:5173 shows the calculator interface  
✅ **Data Loaded**: Backend shows "Loaded 173 countries"  
✅ **No Console Errors**: Browser console shows no 404 or CORS errors  

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Countries API**: http://localhost:3001/countries

## 🎮 How to Use

1. **Select Region** (APAC, Europe, etc.)
2. **Select Country** (Australia, Japan, etc.)
3. **Choose Service Type**:
   - **Yearly Support**: Annual contracts with backfill options
   - **Dispatch Service**: On-site support
   - **Incident Response**: Emergency response times
   - **Project Support**: Short/long term projects
4. **Configure Options** (Level, Backfill, Response Type, etc.)
5. **Click Calculate** to get pricing

## 🆘 Still Having Issues?

1. **Check Node.js**: `node --version` should show v16+
2. **Check npm**: `npm --version` should work
3. **Restart Everything**: Close all terminals, restart, try again
4. **Check Firewall**: Windows Firewall might be blocking ports

## 📞 Support

If you're still having issues:
1. Check the browser console for errors
2. Check the terminal output for error messages
3. Verify all files are present in the project directory
4. Make sure you're in the correct directory when running commands
