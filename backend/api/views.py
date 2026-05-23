"""API views for asteroid impact simulation.

This module exposes a single POST endpoint `simulate_impact` which:
- Accepts latitude and longitude in the request body.
- Fetches asteroid parameters from NASA's NEO API (SPK ID 3542519 used here).
- Retrieves elevation for the target point.
- Runs impact physics calculators from the `utils` package.
- Estimates affected population.

The original file became corrupted; this is a clean, defensive reimplementation
that relies on the existing utility modules in `api/utils`.
"""

import os
import requests
import re

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .utils.geo_utils import get_elevation_for_point
from .utils.impact_physics import (
    _calculate_base_impact_energy,
    calculate_land_impact_effects,
    calculate_tsunami_effects,
)
from .utils.population_utils import (
    find_nearest_cities,
    calculate_affected_population,
)


@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
def simulate_impact(request):
    """Main endpoint for asteroid impact simulation.

    Expects JSON body with 'latitude' and 'longitude'. Returns a JSON
    summary of asteroid parameters, simulation results and population impact.
    """
    print('\n' + '=' * 60)
    print('🚀 NEW IMPACT SIMULATION REQUEST')

    # Validate coordinates
    try:
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
    except (TypeError, ValueError):
        print('❌ ERROR: Invalid coordinates provided')
        return Response({"error": "Invalid or missing latitude/longitude."}, status=status.HTTP_400_BAD_REQUEST)

    print(f'📍 Target Coordinates: ({latitude}, {longitude})')

    # Fetch asteroid data from NASA
    api_key = os.getenv('NASA_API_KEY', 'DEMO_KEY')
    nasa_url = f"https://api.nasa.gov/neo/rest/v1/neo/3542519?api_key={api_key}"
    print('\n🛰️  STEP 1: Fetching NASA NEO Data...')
    try:
        nasa_response = requests.get(nasa_url, timeout=5)  # Reduced from 10 to 5 seconds
        nasa_response.raise_for_status()
        nasa_data = nasa_response.json()
        print('   ✅ NASA data received')
    except requests.exceptions.RequestException as e:
        print(f"❌ NASA API ERROR: {e}")
        return Response({"error": "Could not connect to NASA's NEO database. Please try again later."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    # Parse asteroid parameters
    try:
        diameter_m = nasa_data['estimated_diameter']['meters']['estimated_diameter_max']
        velocity_kps = float(nasa_data['close_approach_data'][0]['relative_velocity']['kilometers_per_second'])
        velocity_ms = velocity_kps * 1000.0
        asteroid_name = nasa_data.get('name', 'Unknown')
        density_kgm3 = 3000  # conservative default for stony asteroid
        # Include orbital data if available so frontend can render accurate orbit
        orbital_data = nasa_data.get('orbital_data', {})
        
        print(f'\n🛰️  ORBITAL DATA FROM NASA API:')
        if orbital_data:
            print(f'   ✅ Orbital data exists! Keys: {list(orbital_data.keys())}')
            print(f'   Semi-major axis: {orbital_data.get("semi_major_axis", "N/A")} AU')
            print(f'   Eccentricity: {orbital_data.get("eccentricity", "N/A")}')
            print(f'   Inclination: {orbital_data.get("inclination", "N/A")}°')
            print(f'   RAAN: {orbital_data.get("ascending_node_longitude", "N/A")}°')
            print(f'   Arg Perihelion: {orbital_data.get("perihelion_argument", "N/A")}°')
            print(f'   Mean Anomaly: {orbital_data.get("mean_anomaly", "N/A")}°')
            print(f'   Epoch: {orbital_data.get("epoch_osculation", "N/A")}')
        else:
            print(f'   ❌ NO ORBITAL DATA in NASA response!')
        
        # Build a cleaned orbital elements dict with common numeric fields (if present)
        orbital_clean = {}
        try:
            # semi-major axis (AU)
            if 'semi_major_axis' in orbital_data:
                orbital_clean['a_au'] = float(orbital_data.get('semi_major_axis'))
            elif 'semimajor_axis' in orbital_data:
                orbital_clean['a_au'] = float(orbital_data.get('semimajor_axis'))

            # eccentricity
            if 'eccentricity' in orbital_data:
                orbital_clean['e'] = float(orbital_data.get('eccentricity'))

            # inclination (deg)
            if 'inclination' in orbital_data:
                orbital_clean['i_deg'] = float(orbital_data.get('inclination'))

            # RAAN / ascending node longitude (deg)
            if 'ascending_node_longitude' in orbital_data:
                orbital_clean['raan_deg'] = float(orbital_data.get('ascending_node_longitude'))

            # argument of perihelion (deg)
            if 'perihelion_argument' in orbital_data:
                orbital_clean['argp_deg'] = float(orbital_data.get('perihelion_argument'))

            # mean anomaly may include degree symbol or text
            raw_M = orbital_data.get('mean_anomaly') or orbital_data.get('mean_anom')
            if raw_M:
                # keep only digits, minus, dot
                m = re.search(r"-?[0-9]+\.?[0-9]*", str(raw_M))
                if m:
                    orbital_clean['M_deg'] = float(m.group(0))

            # Try to determine an epoch: prefer orbital epoch if present, otherwise first close approach epoch
            epoch_ms = None
            # Some fields may contain Julian Date (epoch_osculation) or ISO date strings
            if 'epoch_osculation' in orbital_data:
                try:
                    # If epoch_osculation looks like a JD value (large > 2400000), convert to unix ms
                    val = float(orbital_data.get('epoch_osculation'))
                    if val > 2400000:
                        # Julian Date to unix ms
                        epoch_ms = int((val - 2440587.5) * 86400000)
                except Exception:
                    epoch_ms = None

            # Fallback: NASA close approach epoch (milliseconds) from first close approach entry
            if epoch_ms is None:
                try:
                    ca0 = nasa_data.get('close_approach_data', [])[0]
                    epoch_ms = int(ca0.get('epoch_date_close_approach'))
                except Exception:
                    epoch_ms = None

            if epoch_ms is not None:
                orbital_clean['epoch_unix_ms'] = epoch_ms
                
            # Log what we successfully parsed
            print(f'\n   📊 PARSED ORBITAL ELEMENTS:')
            if orbital_clean:
                for key, value in orbital_clean.items():
                    print(f'      {key}: {value}')
            else:
                print(f'      ⚠️  No orbital elements were parsed!')
                
        except Exception as e:
            print(f"⚠️ Warning parsing orbital_data: {e}")
    except (KeyError, IndexError, TypeError, ValueError) as e:
        print(f"❌ NASA DATA PARSING ERROR: {e}")
        return Response({"error": "Failed to parse asteroid data from NASA."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(f"✅ NASA Data Retrieved: Asteroid={asteroid_name}, diameter={diameter_m:.2f} m, velocity={velocity_kps:.2f} km/s")

    # Fetch elevation
    print('\n🌍 STEP 2: Fetching Elevation Data...')
    elevation = get_elevation_for_point(latitude, longitude)
    if elevation is None:
        print('❌ ERROR: Could not fetch elevation data')
        return Response({"error": "Could not fetch geological data for this location. Please try another spot."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    print(f'✅ Elevation Retrieved: {elevation:.2f} m')
    impact_type = 'land' if elevation > 0 else 'water'
    print(f'   Impact Type: {"🏔️  LAND" if elevation > 0 else "🌊 WATER"}')

    # Compute base impact energy
    print('\n💥 STEP 3: Calculating Impact Effects...')
    impact_energy_gt = _calculate_base_impact_energy(diameter_m, density_kgm3, velocity_ms)
    print(f'   Impact Energy: {impact_energy_gt:.2f} Gigatons TNT')

    if elevation > 0:
        print('   Calculating land impact effects...')
        effects = calculate_land_impact_effects(impact_energy_gt, elevation)
        print(f'   ✅ Land Impact: Crater {effects["page_2_crater"]["diameter_km"]:.2f} km diameter')
    else:
        print('   Calculating tsunami effects...')
        effects = calculate_tsunami_effects(impact_energy_gt, abs(elevation))
        print(f'   ✅ Water Impact: Tsunami {effects["page_2_tsunami"]["initial_wave_height_m"]:.2f} m wave')

    # Population impact
    print('\n👥 STEP 4: Calculating Population Impact...')
    nearest_cities = find_nearest_cities(latitude, longitude, max_distance=3000, max_cities=8)  # Reduced from 5000km/10 cities
    print(f'   Found {len(nearest_cities)} major cities within 3000km')

    danger_zones = {}
    if elevation > 0:
        danger_zones = {
            'crater': effects['page_2_crater'].get('radius_km', 0),
            'fireball': effects['page_3_thermal'].get('fireball_radius_km', 0),
            'thermal': effects['page_3_thermal'].get('trees_fire_radius_km', 0),
            'shockwave': effects['page_4_shockwave'].get('building_collapse_radius_km', 0),
            'seismic': effects['page_5_seismic'].get('felt_radius_km', 0),
        }
    else:
        danger_zones = {
            'tsunami': effects['page_2_tsunami'].get('near_source_danger_zone_radius_km', 0),
        }

    population_impact = calculate_affected_population(latitude, longitude, danger_zones)
    print(f'   ✅ Estimated {population_impact.get("total_affected_millions", 0):.2f}M people affected')

    # Assemble response
    print('\n📦 STEP 5: Assembling Response...')
    response_data = {
        "impact_location": {"latitude": latitude, "longitude": longitude, "elevation_m": round(elevation, 2)},
        "asteroid_details": {"name": asteroid_name, "diameter_m": round(diameter_m), "velocity_kps": round(velocity_kps), "orbital_data": orbital_data, "orbital_elements": orbital_clean},
        "simulation_results": effects,
        "population_impact": {
            "nearest_cities": nearest_cities[:5],
            "total_affected_millions": population_impact.get("total_affected_millions", 0),
            "affected_cities_by_zone": population_impact.get("affected_cities", {}),
            "nearest_major_city": population_impact.get("nearest_major_city"),
        },
    }

    print('✅ Response assembled successfully')
    print('=' * 60)
    print('✅ SIMULATION COMPLETE - Sending to frontend')
    print('=' * 60 + '\n')

    return Response(response_data, status=status.HTTP_200_OK)