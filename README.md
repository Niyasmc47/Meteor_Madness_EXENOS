# ☄️ Meteor Madness EXENOS

Welcome to **Meteor Madness EXENOS** – an interactive, scientifically-grounded web application that simulates asteroid impacts on Earth. Built with a powerful Django backend and a stunning React 3D frontend, this simulator provides real-time asteroid data fetched from NASA's NEO API and visualizes the devastating geological and populated impacts of near-Earth objects.

## ✨ Features

- **Interactive 3D Globe & 2D Map**: Choose your target by clicking anywhere on the fully 3D interactive Earth or switch to a 2D topographic map view.
- **Cinematic Visuals**: Experience a dramatic, slow-motion, spiraling asteroid descent sequence powered by React Three Fiber, complete with a fiery atmospheric trail and shockwave camera shake.
- **NASA API Integration**: Pulls live asteroid characteristics (diameter, velocity, orbital elements) dynamically from the NASA Near Earth Object Web Service (NeoWs).
- **Advanced Physics Engine**: Calculates kinetic impact energy in Gigatons of TNT based on asteroid mass and velocity.
- **Geological Effects**:
  - **Land Impacts**: Computes crater diameter, fireball radius, thermal radiation zones (clothing/trees ignition), and seismic shockwave radii (building collapse).
  - **Water Impacts**: Automatically detects ocean depths and computes initial tsunami wave heights and near-source danger zones.
- **Population Impact Analysis**: Estimates the number of people affected by pulling nearest city data and calculating overlapping danger zones.

## 🛠️ Tech Stack

### Frontend
- **React.js** (via Vite)
- **Tailwind CSS** (for styling)
- **React Three Fiber / Drei** (for 3D WebGL rendering)
- **Leaflet / React-Leaflet** (for 2D Map visualizations)

### Backend
- **Python / Django** (RESTful API)
- **Django REST Framework**
- **NASA APIs** (for NEO data)
- **Open-Meteo / Geological APIs** (for elevation and geological data)

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- `pip` and `venv`

### 1. Clone the repository
```bash
git clone https://github.com/Niyasmc47/Meteor_Madness_EXENOS.git
cd Meteor_Madness_EXENOS
```

### 2. Backend Setup
Navigate to the backend folder, create a virtual environment, and install dependencies.
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

*Note: You may need to create a `.env` file inside the `backend` directory with your `NASA_API_KEY` (defaults to DEMO_KEY if not provided).*

### 3. Frontend Setup
Navigate to the frontend folder and install the node modules.
```bash
cd ../frontend
npm install
```

---

## 🎮 Running the Application

To run the simulator locally, you need to run both the backend and frontend servers simultaneously.

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```
*The backend API will run on `http://localhost:8000`*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*The frontend will run on `http://localhost:5173`*

Open your browser and navigate to `http://localhost:5173/simulator` to start launching impacters!

---

## 📂 Project Structure

```text
Meteor_Madness_EXENOS/
├── backend/
│   ├── api/                  # Django app containing physics calculators & views
│   ├── core/                 # Django project settings
│   ├── manage.py             # Django entry point
│   └── requirements.txt      # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/       # 3D and 2D React Components (Asteroid3D, Earth3D, Map, etc.)
    │   ├── services/         # Axios API communication with backend
    │   ├── Simulator.jsx     # Main Simulation UI layout
    │   └── App.jsx           # React Router setup
    ├── index.html            # Vite entry point
    ├── package.json          # Node dependencies
    └── tailwind.config.js    # Tailwind configuration
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
