# backend/api/utils/impact_physics.py
import math

# --- Shared Constants ---
IMPACTOR_DIAMETER_M = 370
IMPACTOR_DENSITY_KGM3 = 3000
IMPACTOR_VELOCITY_MS = 12600
JOULES_PER_GIGATON_TNT = 4.184e18  # Switched to Gigatons


def _calculate_base_impact_energy(impact_angle_deg=45):
    radius_m = IMPACTOR_DIAMETER_M / 2
    volume_m3 = (4 / 3) * math.pi * (radius_m ** 3)
    mass_kg = IMPACTOR_DENSITY_KGM3 * volume_m3
    impact_angle_rad = math.radians(impact_angle_deg)
    effective_velocity_ms = IMPACTOR_VELOCITY_MS * math.sin(impact_angle_rad)
    impact_energy_joules = 0.5 * mass_kg * (effective_velocity_ms ** 2)
    return impact_energy_joules / JOULES_PER_GIGATON_TNT


def calculate_land_impact_effects(impact_energy_gigatons, elevation_m):
    energy_joules = impact_energy_gigatons * JOULES_PER_GIGATON_TNT

    # --- Page 1: Overview ---
    frequency_years = 10 ** ((math.log10(energy_joules) - 9.0) / 0.9)  # Simplified frequency model
    hurricane_energy_joules = 1.3e17  # Avg energy per day
    hurricane_comparison = round(energy_joules / hurricane_energy_joules)

    # --- Page 2: Crater ---
    ground_type = "Average Rock"
    resistance_factor = 1.0
    if elevation_m < 500:
        ground_type = "Soft Ground / Sedimentary Rock";
        resistance_factor = 0.8
    elif elevation_m >= 1500:
        ground_type = "Hard Crystalline Rock";
        resistance_factor = 1.2
    crater_diameter_km = 0.25 * (impact_energy_gigatons) ** (1 / 3.4) / (resistance_factor ** 0.5)
    crater_radius_km = crater_diameter_km / 2
    crater_depth_km = crater_diameter_km / 3

    # --- Page 3: Fireball & Thermal ---
    fireball_radius_km = 0.4 * (impact_energy_gigatons) ** (1 / 3.0)
    burn_2nd_degree_radius_km = fireball_radius_km * 2.5
    clothes_fire_radius_km = fireball_radius_km * 1.5
    trees_fire_radius_km = fireball_radius_km * 3.0

    # --- Page 4: Shockwave & Wind ---
    sound_db = 20 * math.log10(energy_joules)  # Very simplified
    lung_damage_radius_km = 0.15 * (impact_energy_gigatons) ** (1 / 3.0) * 30
    eardrum_rupture_radius_km = lung_damage_radius_km * 1.3
    building_collapse_radius_km = lung_damage_radius_km * 2.2
    peak_wind_kps = 0.05 * (impact_energy_gigatons) ** (1 / 3.0) * 2

    # --- Page 5: Seismic ---
    seismic_magnitude = (math.log10(energy_joules * resistance_factor) - 4.8) / 1.5
    felt_radius_km = 10 ** ((seismic_magnitude - 1.5) / 2)

    return {
        "impact_type": "land",
        "page_1_overview": {
            "impact_energy_gt": round(impact_energy_gigatons, 2),
            "frequency_years_str": f"{int(frequency_years):,}",
            "hurricane_comparison": f"{int(hurricane_comparison):,}"
        },
        "page_2_crater": {
            "ground_type": ground_type,
            "diameter_km": round(crater_diameter_km, 2),
            "radius_km": round(crater_radius_km, 2),
            "depth_km": round(crater_depth_km, 2)
        },
        "page_3_thermal": {
            "fireball_radius_km": round(fireball_radius_km, 2),
            "burn_2nd_degree_radius_km": round(burn_2nd_degree_radius_km, 2),
            "clothes_fire_radius_km": round(clothes_fire_radius_km, 2),
            "trees_fire_radius_km": round(trees_fire_radius_km, 2)
        },
        "page_4_shockwave": {
            "sound_db": round(sound_db),
            "lung_damage_radius_km": round(lung_damage_radius_km, 2),
            "eardrum_rupture_radius_km": round(eardrum_rupture_radius_km, 2),
            "building_collapse_radius_km": round(building_collapse_radius_km, 2),
            "peak_wind_kps": round(peak_wind_kps, 2)
        },
        "page_5_seismic": {
            "magnitude": round(seismic_magnitude, 1),
            "felt_radius_km": round(felt_radius_km, 2)
        }
    }


def calculate_tsunami_effects(impact_energy_gigatons, water_depth_m):
    energy_joules = impact_energy_gigatons * JOULES_PER_GIGATON_TNT

    # --- Page 1: Overview ---
    frequency_years = 10 ** ((math.log10(energy_joules) - 9.0) / 0.9)
    hurricane_energy_joules = 1.3e17
    hurricane_comparison = round(energy_joules / hurricane_energy_joules)

    # --- Page 2: Tsunami ---
    transient_crater_diameter_m = (0.32 * (impact_energy_gigatons) ** (1 / 3.4)) * 1000
    transient_crater_depth_m = 0.3 * transient_crater_diameter_m
    initial_wave_height_m = (0.2 * transient_crater_depth_m) if water_depth_m > transient_crater_depth_m else (
                1.5 * water_depth_m)
    danger_zone_radius_km = (transient_crater_diameter_m * (
                initial_wave_height_m / 20) ** 2 / 2) / 1000 if initial_wave_height_m > 20 else 0

    return {
        "impact_type": "water",
        "page_1_overview": {
            "impact_energy_gt": round(impact_energy_gigatons, 2),
            "frequency_years_str": f"{int(frequency_years):,}",
            "hurricane_comparison": f"{int(hurricane_comparison):,}"
        },
        "page_2_tsunami": {
            "crater_depth_on_seafloor_m": round(transient_crater_depth_m, 2),
            "initial_wave_height_m": round(initial_wave_height_m, 2),
            "near_source_danger_zone_radius_km": round(danger_zone_radius_km)
        }
    }