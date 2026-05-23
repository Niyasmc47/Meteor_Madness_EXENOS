# backend/api/utils/geo_utils.py
import requests

def get_elevation_for_point(latitude, longitude):
    """
    Queries the Open-Meteo Elevation API for the elevation of a given point.
    Returns the elevation in meters, or None if the request fails.
    """
    # This is the new, simpler, and more reliable API URL.
    api_url = f"https://api.open-meteo.com/v1/elevation?latitude={latitude}&longitude={longitude}"
    
    print(f"--- Calling Geo Utils (Open-Meteo) ---")
    print(f"Attempting to fetch elevation from URL: {api_url}")
    
    try:
        response = requests.get(api_url, timeout=15)
        
        print(f"Open-Meteo API responded with Status Code: {response.status_code}")
        
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)
        
        data = response.json()
        
        print(f"Received JSON data: {data}")

        # Open-Meteo returns the data in a simple format: {"elevation": [123.0]}
        # We need to get the 'elevation' key, which is a list, and take the first item.
        elevation_list = data.get('elevation')
        
        if elevation_list and len(elevation_list) > 0:
            elevation = elevation_list[0]
            print(f"Successfully parsed elevation: {elevation} meters")
            return float(elevation)
        else:
            print("!!!!!! ERROR: 'elevation' key not found or empty in JSON response. !!!!!!")
            return None
            
    except requests.exceptions.Timeout:
        print("!!!!!! ERROR: The request to Open-Meteo API timed out. !!!!!!")
        return None
    except requests.exceptions.RequestException as e:
        print(f"!!!!!! ERROR: A request error occurred: {e} !!!!!!")
        return None
    except (ValueError, KeyError) as e: 
        print(f"!!!!!! ERROR: Could not parse JSON response. Error: {e} !!!!!!")
        print(f"Response Body: {response.text}")
        return None