# backend/api/utils/impact_physics.py

import math

# --- Shared Constants ---
IMPACTOR_DIAMETER_M = 370
IMPACTOR_DENSITY_KGM3 = 3000
IMPACTOR_VELOCITY_MS = 12600
JOULES_PER_MEGATON_TNT = 4.184e15  # Changed to Megatons for bigger numbers


def _calculate_base_impact_energy(impact_angle_deg=45):
    """Helper function to calculate the core impact energy in Megatons of TNT."""
    radius_m = IMPACTOR_DIAMETER_M / 2
    volume_m3 = (4 / 3) * math.pi * (radius_m ** 3)
    mass_kg = IMPACTOR_DENSITY_KGM3 * volume_m3

    impact_angle_rad = math.radians(impact_angle_deg)
    effective_velocity_ms = IMPACTOR_VELOCITY_MS * math.sin(impact_angle_rad)

    impact_energy_joules = 0.5 * mass_kg * (effective_velocity_ms ** 2)
    return impact_energy_joules / JOULES_PER_MEGATON_TNT


def calculate_land_impact_effects(impact_energy_megatons, population_density):
    """Calculates effects for a land impact, now including more detail."""
    impact_energy_joules = impact_energy_megatons * JOULES_PER_MEGATON_TNT

    # Seismic Effects
    seismic_magnitude = (math.log10(impact_energy_joules) - 4.8) / 1.5

    def get_earthquake_context(magnitude):
        if magnitude >= 9.0: return "a catastrophic, world-altering event (like the 2011 Tōhoku earthquake)."
        if magnitude >= 8.0: return "a great earthquake (like the 1906 San Francisco earthquake)."
        if magnitude >= 7.0: return "a major earthquake (like the 2010 Haiti earthquake)."
        return "a strong earthquake."

    # Crater Dimensions
    crater_diameter_km = 1.16 * (impact_energy_megatons) ** (1 / 3.4)
    crater_depth_km = crater_diameter_km / 3  # Approximation

    # NEW: Thermal Radiation Effects
    # Radius for 3rd-degree burns
    thermal_radius_km = 2.5 * (impact_energy_megatons) ** (1 / 3.0)

    # NEW: Air Blast / Shockwave Effects
    # Calculating overpressure at various distances
    air_blast_effects = []
    distances_km = [5, 10, 20, 50]
    for dist in distances_km:
        # Simplified formula for overpressure in PSI
        overpressure_psi = (13 * impact_energy_megatons) / (dist ** 3) + 14.7  # Adding atmospheric pressure
        context = "Light damage"
        if overpressure_psi > 16:
            context = "Most residential buildings collapse"
        elif overpressure_psi > 15.7:
            context = "Reinforced concrete buildings damaged"
        elif overpressure_psi > 15.2:
            context = "Universal window shattering"
        air_blast_effects.append({
            "distance_km": dist,
            "overpressure_psi": round(overpressure_psi - 14.7, 2),  # Show gauge pressure
            "context": context
        })

    # NEW: Population Estimate
    # Lethal zone is approximated by the thermal radiation radius
    lethal_area_km2 = math.pi * (thermal_radius_km ** 2)
    estimated_affected_population = int(lethal_area_km2 * population_density)

    return {
        "impact_type": "land",
        "impact_energy_mt": round(impact_energy_megatons, 2),
        "population_density_used": population_density,
        "estimated_affected_population": estimated_affected_population,
        "crater": {
            "diameter_km": round(crater_diameter_km, 2),
            "depth_km": round(crater_depth_km, 2)
        },
        "thermal_radiation": {
            "radius_3rd_degree_burns_km": round(thermal_radius_km, 2)
        },
        "air_blast": air_blast_effects,
        "seismic": {
            "magnitude": round(seismic_magnitude, 1),
            "context": get_earthquake_context(seismic_magnitude)
        }
    }


def calculate_tsunami_effects(impact_energy_megatons, water_depth_m):
    """Calculates effects for a water impact."""
    # Step 1: Transient water crater
    transient_crater_diameter_m = (2.1 * (impact_energy_megatons) ** (1 / 3.4)) * 1000
    transient_crater_depth_m = 0.3 * transient_crater_diameter_m

    # Step 2: Initial wave height
    initial_wave_height_m = (0.2 * transient_crater_depth_m) if water_depth_m > transient_crater_depth_m else (
                1.5 * water_depth_m)

    # Step 3: Wave propagation and timing
    wave_propagation = []
    wave_speed_ms = math.sqrt(9.81 * max(1, water_depth_m))  # Speed of shallow water wave
    distances_km = [10, 100, 500]
    for dist_km in distances_km:
        dist_m = dist_km * 1000
        if dist_m > 0:
            wave_height_at_dist = initial_wave_height_m * math.sqrt(transient_crater_diameter_m / (2 * dist_m))
            arrival_time_min = (dist_m / wave_speed_ms) / 60
            wave_propagation.append({
                "distance_km": dist_km,
                "wave_height_m": round(wave_height_at_dist, 2),
                "arrival_time_min": round(arrival_time_min)
            })

    return {
        "impact_type": "water",
        "impact_energy_mt": round(impact_energy_megatons, 2),
        "water_depth_m": round(water_depth_m, 2),
        "tsunami_generation": {
            "initial_wave_height_m": round(initial_wave_height_m, 2),
            "propagation": wave_propagation
        }
    }