# backend/api/utils/geo_utils.py

import requests


def get_elevation_for_point(latitude, longitude):
    """
    Queries the USGS Elevation Point Query Service for the elevation of a given point.
    Returns the elevation in meters, or None if the request fails.
    """
    api_url = f"https://epqs.nationalmap.gov/v1/json?x={longitude}&y={latitude}&units=Meters"

    try:
        response = requests.get(api_url, timeout=10)  # 10-second timeout
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)

        data = response.json()
        # The API nests the result, so we need to access it correctly
        elevation = data['value']
        return float(elevation)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching elevation data: {e}")
        return None  # Return None to indicate failure
    except (KeyError, ValueError) as e:
        print(f"Error parsing elevation data: {e}")
        return None