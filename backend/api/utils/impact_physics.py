# backend/api/utils/impact_physics.py
import math

JOULES_PER_GIGATON_TNT = 4.184e18

def _calculate_base_impact_energy(diameter_m, density_kgm3, velocity_ms, impact_angle_deg=45):
    """Calculates impact energy based on dynamic asteroid properties."""
    radius_m = diameter_m / 2
    volume_m3 = (4/3) * math.pi * (radius_m ** 3)
    mass_kg = density_kgm3 * volume_m3
    impact_angle_rad = math.radians(impact_angle_deg)
    effective_velocity_ms = velocity_ms * math.sin(impact_angle_rad)
    impact_energy_joules = 0.5 * mass_kg * (effective_velocity_ms ** 2)
    return impact_energy_joules / JOULES_PER_GIGATON_TNT

def _get_earthquake_comparison(magnitude):
    """Returns a famous historical earthquake for comparison."""
    comparisons = [
        {"name": "2011 Tōhoku (Japan)", "magnitude": 9.1, "year": 2011},
        {"name": "2004 Indian Ocean", "magnitude": 9.1, "year": 2004},
        {"name": "1964 Alaska", "magnitude": 9.2, "year": 1964},
        {"name": "1906 San Francisco", "magnitude": 7.9, "year": 1906},
        {"name": "2010 Haiti", "magnitude": 7.0, "year": 2010},
        {"name": "1989 Loma Prieta", "magnitude": 6.9, "year": 1989},
        {"name": "2023 Turkey-Syria", "magnitude": 7.8, "year": 2023},
    ]
    closest = min(comparisons, key=lambda x: abs(x['magnitude'] - magnitude))
    return f"{closest['name']} earthquake ({closest['year']})"

def _get_city_comparison(diameter_km):
    """Returns a famous city for size comparison."""
    cities = [
        {"name": "Vatican City", "size_km": 0.44},
        {"name": "Monaco", "size_km": 2.02},
        {"name": "Manhattan", "size_km": 3.7},
        {"name": "Paris city center", "size_km": 10.5},
        {"name": "London", "size_km": 15.0},
        {"name": "Los Angeles", "size_km": 30.0},
        {"name": "Tokyo metropolitan", "size_km": 50.0},
    ]
    closest = min(cities, key=lambda x: abs(x['size_km'] - diameter_km))
    return closest['name']

def calculate_land_impact_effects(energy_gt, elevation_m):
    # This function's logic remains the same, as it's already a pure calculator.
    # (The rest of the land impact calculation code is here, unchanged from the last version)
    energy_joules = energy_gt * JOULES_PER_GIGATON_TNT
    ground_type = "Competent Rock"; resistance_factor = 1.0
    if elevation_m < 500:
        ground_type = "Soft Soil / Sedimentary Rock"; resistance_factor = 0.75
    elif elevation_m >= 1500:
        ground_type = "Hard Crystalline Rock (Mountainous)"; resistance_factor = 1.3
    frequency_years = 10**((math.log10(energy_joules) - 9.0) / 0.9) if energy_joules > 1e9 else 1
    hurricane_comparison = round(energy_joules / 1.3e17)
    crater_diameter_km = 0.25 * (energy_gt**(1/3.4)) / (resistance_factor**0.6)
    fireball_radius_km = 0.4 * (energy_gt**(1/3.0))
    building_collapse_radius_km = 0.15 * (energy_gt**(1/3.0)) * 22
    seismic_magnitude = (math.log10(energy_joules * resistance_factor) - 4.8) / 1.5
    felt_radius_km = 10**((seismic_magnitude - 1.5) / 2) if seismic_magnitude > 1.5 else 0
    
    # Add contextual comparisons
    earthquake_comparison = _get_earthquake_comparison(seismic_magnitude)
    city_comparison = _get_city_comparison(crater_diameter_km)
    return {
        "impact_type": "land",
        "page_1_overview": { "impact_energy_gt": round(energy_gt, 2), "frequency_years_str": f"{int(frequency_years):,}", "hurricane_comparison": f"{int(hurricane_comparison):,}" },
        "page_2_crater": { "ground_type": ground_type, "diameter_km": round(crater_diameter_km, 2), "radius_km": round(crater_diameter_km / 2, 2), "depth_km": round(crater_diameter_km / 3, 2), "city_comparison": city_comparison },
        "page_3_thermal": { "fireball_radius_km": round(fireball_radius_km, 2), "clothes_fire_radius_km": round(fireball_radius_km * 1.5, 2), "trees_fire_radius_km": round(fireball_radius_km * 3.0, 2) },
        "page_4_shockwave": { "sound_db": round(20 * math.log10(energy_joules)) if energy_joules > 0 else 0, "building_collapse_radius_km": round(building_collapse_radius_km, 2), "peak_wind_kps": round(0.05 * (energy_gt**(1/3.0)) * 2, 2) },
        "page_5_seismic": { "magnitude": round(seismic_magnitude, 1), "felt_radius_km": round(felt_radius_km, 2), "earthquake_comparison": earthquake_comparison }
    }

def _get_tsunami_comparison(wave_height_m):
    """Returns a famous historical tsunami for comparison."""
    tsunamis = [
        {"name": "2004 Indian Ocean Tsunami", "height": 30, "year": 2004, "deaths": "230,000+"},
        {"name": "2011 Japan Tsunami", "height": 40, "year": 2011, "deaths": "18,000+"},
        {"name": "1958 Lituya Bay Mega-tsunami", "height": 524, "year": 1958, "deaths": "5"},
        {"name": "1755 Lisbon Tsunami", "height": 15, "year": 1755, "deaths": "60,000+"},
    ]
    closest = min(tsunamis, key=lambda x: abs(x['height'] - wave_height_m))
    return f"{closest['name']} ({closest['height']}m wave)"

def calculate_tsunami_effects(energy_gt, water_depth_m):
    # Calculate impact energy and base metrics
    energy_joules = energy_gt * JOULES_PER_GIGATON_TNT
    frequency_years = 10**((math.log10(energy_joules) - 9.0) / 0.9) if energy_joules > 1e9 else 1
    hurricane_comparison = round(energy_joules / 1.3e17)
    
    # Use ACTUAL water depth (should be positive when passed from views.py)
    actual_depth_m = abs(water_depth_m) if water_depth_m < 0 else water_depth_m
    
    # Categorize ocean depth
    depth_category = "Deep Ocean"
    depth_description = "Open ocean, far from shore"
    if actual_depth_m < 200: 
        depth_category = "Shallow Coastal Shelf"
        depth_description = "Near coastline - increased tsunami danger"
    elif actual_depth_m >= 200 and actual_depth_m < 2000:
        depth_category = "Continental Slope"
        depth_description = "Transition zone between shelf and deep ocean"
    else:
        depth_description = "Abyssal plain - deepest ocean regions"
    
    # Tsunami wave height calculation with proper scaling
    # More energy = higher waves, shallower depth = higher waves
    efficiency_factor = 2.5 if actual_depth_m < 200 else 1.0
    transient_crater_diameter_m = (0.32 * (energy_gt**(1/3.4))) * 1000
    transient_crater_depth_m = 0.3 * transient_crater_diameter_m
    
    # FIXED: Ensure initial wave height varies with depth and energy
    if actual_depth_m > transient_crater_depth_m:
        # Deep water - wave height proportional to crater depth
        initial_wave_height_m = (0.2 * transient_crater_depth_m) * efficiency_factor
    else:
        # Shallow water - wave height amplified by shallow depth
        initial_wave_height_m = (1.5 * transient_crater_depth_m * (200 / max(actual_depth_m, 10))) * efficiency_factor
    
    # Additional scaling factor based on energy for variety
    energy_scaling = 1 + (energy_gt / 100)  # Higher energy = higher waves
    initial_wave_height_m *= energy_scaling
    
    # Cap at realistic maximum
    initial_wave_height_m = min(initial_wave_height_m, 500)
    initial_wave_height_m = max(initial_wave_height_m, 5)  # Minimum 5m for asteroid impact
    
    danger_zone_radius_km = (transient_crater_diameter_m * (initial_wave_height_m / 20)**2 / 2) / 1000 if initial_wave_height_m > 20 else 50
    
    tsunami_comparison = _get_tsunami_comparison(initial_wave_height_m)
    
    return {
        "impact_type": "water",
        "page_1_overview": { "impact_energy_gt": round(energy_gt, 2), "frequency_years_str": f"{int(frequency_years):,}", "hurricane_comparison": f"{int(hurricane_comparison):,}" },
        "page_2_tsunami": { "ocean_depth_category": depth_category, "depth_description": depth_description, "water_depth_m": round(actual_depth_m, 2), "crater_depth_on_seafloor_m": round(transient_crater_depth_m, 2), "initial_wave_height_m": round(initial_wave_height_m, 2), "near_source_danger_zone_radius_km": round(danger_zone_radius_km), "tsunami_comparison": tsunami_comparison }
    }