# Meteor Madness: Impactor-2025

**A NASA Space Apps Challenge 2025 Project**

This project is an interactive, data-driven web application that simulates the effects of a hypothetical asteroid, "Impactor-2025," striking a user-chosen location on Earth. Using real data from NASA's Near-Earth Object (NEO) API and elevation data from the U.S. Geological Survey (USGS), our simulation engine realistically models different impact scenarios for both land and water.

## The Challenge

This project addresses the ["Meteor Madness"](https://www.spaceappschallenge.org/2025/challenges/meteor-madness/) challenge. Our goal is to create a tool that is not only engaging but also grounded in scientific reality, using NASA and USGS datasets to model and visualize the complex consequences of an asteroid impact.

## Features

-   **Interactive Map:** Users can select any location on a global map to target the impact.
-   **Dynamic Simulation Engine:** The backend intelligently determines if the impact is on land or in water by querying the USGS Elevation API.
    -   **Land Impacts:** Calculates and visualizes crater size, fireball radius, and seismic effects.
    -   **Water Impacts:** Calculates tsunami wave creation and propagation, estimating wave height at various distances from the impact site.
-   **Data-Driven Simulation:** "Impactor-2025" characteristics (diameter, velocity, density) are based on real data for Potentially Hazardous Asteroid 99942 Apophis.
-   **Contextual Data:** The calculated earthquake magnitude is compared to well-known historical earthquakes to make the data more relatable.

## Tech Stack

-   **Frontend:** React (with Vite), Tailwind CSS for styling, and Leaflet for the interactive map.
-   **Backend:** Python with the Django framework and Django REST Framework for building the API.
-   **Database:**
    -   **MongoDB:** Used for application-specific data (e.g., logging simulations), accessed via `pymongo`.
    -   **SQLite:** Used by Django for its internal applications (admin, auth).

## NASA & Partner Data Resources Used

-   **NASA Near-Earth Object (NEO) Web Service API:** To provide the base physical characteristics for our fictional "Impactor-2025."
-   **USGS National Map Elevation Data:** Utilized via the **Elevation Point Query Service API** to determine the impact site's elevation, allowing for differentiation between land and water impacts.
-   **U.S. Geological Survey (USGS) Earthquake Catalog:** Used as a reference to provide context for the seismic impact of a land-based event.
-   **Impact Physics Models:** Based on widely accepted academic formulas for calculating asteroid impact effects, including crater formation and tsunami generation.

## Project Setup

### Prerequisites

-   Python 3.8+
-   Node.js 16+ and npm
-   A running MongoDB instance (local or cloud-based like MongoDB Atlas).

### Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies from the requirements file:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `backend` directory and add your MongoDB connection string and NASA API Key:
    ```
    MONGO_URI=your_mongodb_connection_string
    NASA_API_KEY=your_nasa_api_key
    ```
5.  Run Django's initial migrations for its internal apps (this will create a `db.sqlite3` file):
    ```bash
    python manage.py migrate
    ```
6.  Start the development server:
    ```bash
    python manage.py runserver
    ```
    The backend will be available at `http://127.0.0.1:8000`.

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
4.  Open your browser to `http://localhost:5173` (or the address provided by Vite).