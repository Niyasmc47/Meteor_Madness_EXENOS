# backend/api/utils/population_utils.py
import math
import requests

def calculate_distance(lat1, lng1, lat2, lng2):
    """Calculate distance between two points in kilometers using Haversine formula"""
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

def find_nearest_cities_geonames(latitude, longitude, search_radius_degrees=10):
    """
    Find major cities near a location using GeoNames API.
    
    Args:
        latitude: Target latitude
        longitude: Target longitude
        search_radius_degrees: How many degrees to search in each direction (default 10)
    
    Returns:
        List of cities with name, country, population, and distance
    """
    # Calculate bounding box
    north = latitude + search_radius_degrees
    south = latitude - search_radius_degrees
    east = longitude + search_radius_degrees
    west = longitude - search_radius_degrees
    
    # GeoNames API endpoint
    username = "niyas36et"  # Your GeoNames username
    url = f"http://api.geonames.org/citiesJSON?north={north}&south={south}&east={east}&west={west}&username={username}"
    
    print(f'   🌐 Fetching cities from GeoNames API...')
    print(f'   Bounding box: N={north:.2f}, S={south:.2f}, E={east:.2f}, W={west:.2f}')
    
    try:
        # Use HTTP instead of HTTPS to avoid SSL certificate issues
        response = requests.get(url, timeout=8)  # Reduced from 15 to 8 seconds
        response.raise_for_status()
        data = response.json()
        
        if 'geonames' not in data:
            print(f'   ⚠️  No cities found in GeoNames response')
            return []
        
        cities = []
        for city_data in data['geonames']:
            try:
                city_lat = float(city_data.get('lat', 0))
                city_lng = float(city_data.get('lng', 0))
                city_pop = int(city_data.get('population', 0))
                
                # Calculate distance
                distance = calculate_distance(latitude, longitude, city_lat, city_lng)
                
                cities.append({
                    'name': city_data.get('name', 'Unknown'),
                    'country': city_data.get('countrycode', 'Unknown'),
                    'population': city_pop / 1_000_000,  # Convert to millions
                    'lat': city_lat,
                    'lng': city_lng,
                    'distance_km': round(distance, 1)
                })
            except (ValueError, TypeError) as e:
                print(f'   ⚠️  Error parsing city data: {e}')
                continue
        
        # Sort by population (largest first)
        cities.sort(key=lambda x: x['population'], reverse=True)
        
        print(f'   ✅ Found {len(cities)} cities from GeoNames')
        return cities
        
    except requests.exceptions.Timeout:
        print(f'   ❌ GeoNames API request timed out')
        return []
    except requests.exceptions.RequestException as e:
        print(f'   ❌ GeoNames API error: {e}')
        return []
    except Exception as e:
        print(f'   ❌ Unexpected error fetching cities: {e}')
        return []

def find_nearest_cities(latitude, longitude, max_distance=5000, max_cities=10):
    """
    Find nearest major cities within max_distance km using GeoNames API.
    Falls back to searching larger area if few cities found.
    """
    # Try with 10 degree search radius first
    cities = find_nearest_cities_geonames(latitude, longitude, search_radius_degrees=10)
    
    # If we got very few results, try a larger search area
    if len(cities) < 5:
        print(f'   📍 Only {len(cities)} cities found, expanding search...')
        cities = find_nearest_cities_geonames(latitude, longitude, search_radius_degrees=20)
    
    # Filter by max_distance and limit to max_cities
    filtered_cities = [city for city in cities if city['distance_km'] <= max_distance]
    
    # Sort by distance (closest first)
    filtered_cities.sort(key=lambda x: x['distance_km'])
    
    return filtered_cities[:max_cities]

def calculate_affected_population(latitude, longitude, danger_zones):
    """
    Estimate population affected based on danger zones
    danger_zones should be a dict like:
    {
        'crater': radius_km,
        'fireball': radius_km,
        'thermal': radius_km,
        'shockwave': radius_km,
        'seismic': radius_km
    }
    """
    affected_cities = {}
    total_affected = 0
    
    # Get the maximum danger zone radius to fetch cities
    max_radius = max(danger_zones.values()) if danger_zones else 5000
    
    # Fetch cities from GeoNames within the largest danger zone
    all_nearby_cities = find_nearest_cities(latitude, longitude, max_distance=max_radius, max_cities=50)
    
    for zone_name, radius_km in danger_zones.items():
        if radius_km and radius_km > 0:
            affected_cities[zone_name] = []
            
            for city in all_nearby_cities:
                distance = city['distance_km']
                
                if distance <= radius_km:
                    # Population affected decreases with distance
                    distance_factor = 1 - (distance / radius_km)
                    affected_pop = city['population'] * distance_factor
                    
                    affected_cities[zone_name].append({
                        'name': city['name'],
                        'country': city['country'],
                        'distance_km': round(distance, 1),
                        'population_affected_millions': round(affected_pop, 2),
                        'severity': 'Extreme' if distance_factor > 0.7 else 'Severe' if distance_factor > 0.4 else 'Moderate'
                    })
                    
                    if zone_name == 'shockwave' or zone_name == 'seismic':
                        total_affected += affected_pop
    
    # Get nearest city for reference
    nearest_city = find_nearest_cities(latitude, longitude, max_cities=1)
    
    return {
        'total_affected_millions': round(total_affected, 2),
        'affected_cities': affected_cities,
        'nearest_major_city': nearest_city[0] if nearest_city else None
    }

def get_casualty_estimates(population_affected_millions, impact_type, zone_type):
    """Estimate casualties based on zone type"""
    casualties = {
        'crater': 1.0,  # 100% fatality in crater zone
        'fireball': 0.95,  # 95% fatality from thermal radiation
        'thermal': 0.6,  # 60% casualties from burns
        'shockwave': 0.3,  # 30% casualties from building collapse
        'seismic': 0.1,  # 10% casualties from earthquakes
        'tsunami': 0.4  # 40% in tsunami zone
    }
    
    fatality_rate = casualties.get(zone_type, 0.1)
    estimated_deaths = population_affected_millions * fatality_rate
    estimated_injured = population_affected_millions * (1 - fatality_rate) * 0.5
    
    return {
        'estimated_deaths_millions': round(estimated_deaths, 3),
        'estimated_injured_millions': round(estimated_injured, 3),
        'fatality_rate_percent': round(fatality_rate * 100, 1)
    }
