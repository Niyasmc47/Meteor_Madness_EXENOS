from rest_framework.decorators import api_view
from rest_framework.response import Response

# Custom utility imports
from .utils.geo_utils import get_elevation_for_point
from .utils.impact_physics import _calculate_base_impact_energy, calculate_land_impact_effects, \
    calculate_tsunami_effects

# Import the database client (useful for future features like logging)
from core.db_client import db


@api_view(['GET'])
def get_routes(request):
    """
    Provides a simple list of the available API endpoints.
    """
    routes = {
        "GET /api/": "Shows available routes.",
        "POST /api/simulate/": {
            "description": "Runs the impact simulation.",
            "body": {
                "latitude": "float",
                "longitude": "float",
                "population_density": "int (optional, defaults to 50)"
            }
        }
    }
    return Response(routes)


@api_view(['POST'])
def simulate_impact(request):
    try:
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
        # --- REMOVE the population_density line ---
    except (TypeError, ValueError):
        return Response({"error": "Invalid or missing latitude/longitude parameters."}, status=400)

    elevation = get_elevation_for_point(latitude, longitude)

    if elevation is None:
        print("Warning: Elevation API failed. Defaulting to a generic land impact.")
        elevation = 1

    impact_energy_gt = _calculate_base_impact_energy()

    if elevation >= 0:
        # --- REMOVE population_density from this function call ---
        effects = calculate_land_impact_effects(impact_energy_gt, elevation)
    else:
        water_depth = abs(elevation)
        effects = calculate_tsunami_effects(impact_energy_gt, water_depth)

    response_data = {
        "impact_location": {"latitude": latitude, "longitude": longitude, "elevation_m": round(elevation, 2)},
        "simulation_results": effects
    }

    return Response(response_data)