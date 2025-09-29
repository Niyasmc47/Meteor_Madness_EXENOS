# Meteor Madness: Impactor-2025

**A NASA Space Apps Challenge 2025 Project**

This project is an interactive, data-driven web application that simulates the effects of a hypothetical asteroid, "Impactor-2025," striking a user-chosen location on Earth. The simulation is highly dynamic, adapting its calculations based on the real-world geography and geology of the impact site, leveraging data from NASA and the U.S. Geological Survey (USGS).

The application provides a detailed breakdown of the aftermath, including crater dimensions, thermal effects, air blast shockwaves, seismic magnitude, and tsunami generation, making it a powerful educational tool for visualizing the complex consequences of an asteroid impact.

## The Challenge

This project directly addresses the ["Meteor Madness"](https://www.spaceappschallenge.org/2025/challenges/meteor-madness/) challenge. Our goal is to create a tool that is not only visually engaging but also grounded in scientific reality, using a rich stack of NASA and partner datasets to model a realistic impact scenario.

## Key Features

-   **Interactive Global Map:** Users can select any point on Earth to simulate an impact.
-   **Dynamic Geological Modeling:** The backend intelligently queries the USGS Elevation API to determine the impact site's elevation. This data is then used to model the ground type (e.g., Soft Sedimentary Rock, Hard Crystalline Mountain Rock), which dynamically alters the crater size and seismic energy transfer.
-   **Land vs. Water Scenarios:**
    -   **Land Impacts:** The simulation calculates crater dimensions (diameter, radius, depth), fireball radius for 3rd-degree burns, air blast overpressure at various distances, and seismic magnitude.
    -   **Water Impacts:** The simulation models tsunami wave generation, calculating initial wave height, propagation to different distances, and arrival times. It also provides a visual "danger zone" on the map.
-   **Data-Driven Simulation:** The fictional "Impactor-2025" is based on the physical characteristics (size, velocity, density) of the real Potentially Hazardous Asteroid **99942 Apophis**, using data from NASA's NEO API.
-   **Rich, Contextual Data:** To make the results understandable, the simulation compares seismic effects to famous historical earthquakes and tsunami heights to major historical events.
-   **Interactive Sidepanel:** A detailed sidepanel provides a complete report of the simulation results, updating in real-time with each new impact.

## Tech Stack

-   **Frontend:** React (with Vite), Tailwind CSS for styling, Leaflet for the interactive map, and Axios for API communication.
-   **Backend:** Python with the Django framework and Django REST Framework for building the API.
-   **Database:**
    -   **MongoDB:** Used for application-specific data, accessed via `pymongo`.
    -   **SQLite:** Used by Django for its internal applications (admin, auth).

## NASA & Partner Data Resources Used

-   **NASA Near-Earth Object (NEO) Web Service API:** Provides the base physical characteristics (size, velocity) for our asteroid model.
-   **USGS National Map Elevation Data:** Utilized via the real-time **Elevation Point Query Service API**. This is the core dataset enabling our dynamic land vs. water differentiation and our geological ground-type modeling.
-   **U.S. Geological Survey (USGS) Earthquake Catalog:** Referenced to provide relatable context for the seismic magnitude of a land-based impact.
-   **Scientific Models & Scaling Laws:** The backend simulation engine is built upon established academic formulas (e.g., from H.J. Melosh, Collins et al.) for calculating impact effects, ensuring the results are scientifically plausible.

## Project Setup

### Prerequisites

-   Python 3.8+
-   Node.js 16+ and npm
-   A running MongoDB instance (e.g., from MongoDB Atlas).

### Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies: `pip install -r requirements.txt`
4.  Create a `.env` file in the `backend` directory and add your MongoDB connection string:
    ```
    MONGO_URI=your_mongodb_connection_string
    ```
5.  Run Django's initial migrations (this creates `db.sqlite3` for internal apps):
    ```bash
    python manage.py migrate
    ```
6.  Start the development server:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory in a new terminal: `cd frontend`
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser to `http://localhost:5173`.