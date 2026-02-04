# How to Run the Mental Health Project

## Main Project (Static HTML/CSS/JS)

The main project is in the root directory (`D:\MentalHealth`). You have several options:

### Option 1: Open Directly in Browser
```cmd
cd D:\MentalHealth
start index.html
```

### Option 2: Using Python HTTP Server (if Python is installed)
```cmd
cd D:\MentalHealth
python -m http.server 8000
```
Then open browser to: `http://localhost:8000`

### Option 3: Using Node.js http-server (if Node.js is installed)
```cmd
cd D:\MentalHealth
npx http-server -p 8000
```
Then open browser to: `http://localhost:8000`

---

## React Project (in mentalhealth folder)

To run the React/Vite project:

```cmd
cd D:\MentalHealth\mentalhealth
npm run dev
```

This will start the Vite development server, usually at `http://localhost:5173`

---

## Quick Start Commands

**For Main Project (Static):**
```cmd
cd D:\MentalHealth
start index.html
```

**For React Project:**
```cmd
cd D:\MentalHealth\mentalhealth
npm run dev
```

