# backend/api/utils/impact_physics.py
import math

IMPACTOR_DIAMETER_M = 370
IMPACTOR_DENSITY_KGM3 = 3000
IMPACTOR_VELOCITY_MS = 12600
JOULES_PER_GIGATON_TNT = 4.184e18

def _calculate_base_impact_energy(impact_angle_deg=45):
    radius_m = IMPACTOR_DIAMETER_M / 2
    volume_m3 = (4/3) * math.pi * (radius_m ** 3)
    mass_kg = IMPACTOR_DENSITY_KGM3 * volume_m3
    impact_angle_rad = math.radians(impact_angle_deg)
    effective_velocity_ms = IMPACTOR_VELOCITY_MS * math.sin(impact_angle_rad)
    impact_energy_joules = 0.5 * mass_kg * (effective_velocity_ms ** 2)
    return impact_energy_joules / JOULES_PER_GIGATON_TNT

def calculate_land_impact_effects(energy_gt, elevation_m):
    energy_joules = energy_gt * JOULES_PER_GIGATON_TNT
    
    # --- Amplified Geological Model ---
    ground_type = "Competent Rock"
    resistance_factor = 1.0 # Baseline
    if elevation_m < 500:
        ground_type = "Soft Soil / Sedimentary Rock"
        resistance_factor = 0.75 # Lower resistance -> bigger crater, less seismic shock
    elif elevation_m >= 1500:
        ground_type = "Hard Crystalline Rock (Mountainous)"
        resistance_factor = 1.3 # Higher resistance -> smaller crater, more seismic shock

    # Crater (size is now highly dependent on geology)
    crater_diameter_km = 0.25 * (energy_gt)**(1/3.4) / (resistance_factor**0.6)
    
    # Seismic (energy transfer is now highly dependent on geology)
    seismic_magnitude = (math.log10(energy_joules * resistance_factor) - 4.8) / 1.5
    
    # Fireball & Thermal (independent of ground type)
    fireball_radius_km = 0.4 * (energy_gt)**(1/3.0)
    
    # Shockwave & Wind (independent of ground type)
    building_collapse_radius_km = 0.15 * (energy_gt)**(1/3.0) * 22

    return {
        "impact_type": "land",
        "ground_type": ground_type,
        "impact_energy_gt": round(energy_gt, 2),
        "crater": {
            "label": "Crater",
            "diameter_km": round(crater_diameter_km, 2),
            "visualization_radius_km": round(crater_diameter_km / 2, 2)
        },
        "fireball": {
            "label": "Fireball",
            "text": f"A {round(fireball_radius_km * 2, 2)} km wide fireball...",
            "visualization_radius_km": round(fireball_radius_km, 2)
        },
        "shockwave": {
            "label": "Shockwave",
            "text": "Damage to residential structures...",
            "visualization_radius_km": round(building_collapse_radius_km, 2)
        },
        "seismic": {
            "label": "Earthquake",
            "magnitude": round(seismic_magnitude, 1),
            "context": f"Similar to a major earthquake."
        }
    }

def calculate_tsunami_effects(energy_gt, water_depth_m):
    # --- Amplified Oceanographic Model ---
    depth_category = "Deep Ocean"
    if water_depth_m < 200:
        depth_category = "Shallow Coastal Shelf"

    transient_crater_diameter_m = (0.32 * (energy_gt)**(1/3.4)) * 1000
    transient_crater_depth_m = 0.3 * transient_crater_diameter_m

    # Shallow water impacts are terrifyingly efficient tsunami generators
    efficiency_factor = 2.5 if depth_category == "Shallow Coastal Shelf" else 1.0
    initial_wave_height_m = ((0.2 * transient_crater_depth_m) if water_depth_m > transient_crater_depth_m else (1.5 * water_depth_m)) * efficiency_factor

    danger_zone_radius_km = (transient_crater_diameter_m * (initial_wave_height_m / 20)**2 / 2) / 1000 if initial_wave_height_m > 20 else 0
    
    return {
        "impact_type": "water",
        "ocean_depth_category": depth_category,
        "impact_energy_gt": round(energy_gt, 2),
        "tsunami": {
            "label": "Tsunami",
            "initial_wave_height_m": round(initial_wave_height_m, 2),
            "context": "Generates a catastrophic local or ocean-wide tsunami.",
            "visualization_radius_km": round(danger_zone_radius_km)
        }
    }