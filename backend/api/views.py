from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

#from .utils.impact_physics import calculate_impact_effects # Import the logic
from core.db_client import db # Import the DB client (for future use)

from .utils.geo_utils import get_elevation_for_point # Import the new geo utility
from .utils.impact_physics import _calculate_base_impact_energy, calculate_land_impact_effects, calculate_tsunami_effects
@api_view(['GET'])
def get_routes(request):
    """Returns a list of available API routes."""
    routes = [
        'GET /api/',
        'POST /api/simulate/',
    ]
    return Response(routes)


@api_view(['POST'])
def simulate_impact(request):
    try:
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
        # Get population density, default to a rural value (50) if not provided
        population_density = int(request.data.get('population_density', 50))
    except (TypeError, ValueError):
        return Response({"error": "Invalid or missing parameters."}, status=400)

    elevation = get_elevation_for_point(latitude, longitude)

    if elevation is None:
        print("Warning: Elevation API failed. Defaulting to land impact.")
        elevation = 1

    impact_energy_mt = _calculate_base_impact_energy()

    if elevation >= 0:
        # Pass the population density to the land impact function
        effects = calculate_land_impact_effects(impact_energy_mt, population_density)
    else:
        water_depth = abs(elevation)
        effects = calculate_tsunami_effects(impact_energy_mt, water_depth)

    response_data = {
        "impact_location": {"latitude": latitude, "longitude": longitude, "elevation_m": elevation},
        "simulation_results": effects
    }

    return Response(response_data)
# Create your views here.
