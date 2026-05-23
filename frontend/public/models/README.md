# Asteroid 3D Models Folder

Place your asteroid `.obj` files here!

## Quick Links to Free Asteroid Models:

### NASA Models (Most Realistic!)
- Bennu: https://nasa3d.arc.nasa.gov/detail/as4-bennu-2
- Vesta: https://nasa3d.arc.nasa.gov/detail/jpl-vesta-v2
- Itokawa: https://nasa3d.arc.nasa.gov/detail/itokawa

### Free Downloads:
- Sketchfab: https://sketchfab.com/search?q=asteroid&type=models
- TurboSquid: https://www.turbosquid.com/Search/3D-Models/free/asteroid
- Free3D: https://free3d.com/3d-models/asteroid

---

## How to Use:

1. Download an asteroid `.obj` file
2. Place it here: `frontend/public/models/asteroid.obj`
3. Update `Scene3D.jsx`:
```jsx
<Asteroid3D 
  modelPath="/models/asteroid.obj"
  ...
/>
```

That's it! Your custom asteroid will load automatically! 🚀
