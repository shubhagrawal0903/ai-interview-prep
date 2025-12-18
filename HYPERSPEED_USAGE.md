# Hyperspeed Component Integration

## Overview
The Hyperspeed component is a stunning 3D highway/racing animation built with Three.js and postprocessing effects. It creates a dynamic, futuristic background perfect for landing pages.

## Files Created
1. `src/components/Hyperspeed.tsx` - Main Hyperspeed component
2. `src/components/hyperspeedPresets.ts` - Six preset configurations
3. `src/app/home/page.tsx` - New landing page using Hyperspeed

## Usage

### Basic Usage
```tsx
import Hyperspeed from '@/components/Hyperspeed';
import { hyperspeedPresets } from '@/components/hyperspeedPresets';

<Hyperspeed effectOptions={hyperspeedPresets.one} />
```

### Available Presets
- `hyperspeedPresets.one` - Turbulent distortion with blue/purple cars
- `hyperspeedPresets.two` - Mountain distortion with red/blue cars
- `hyperspeedPresets.three` - XY distortion with dark red/cream cars
- `hyperspeedPresets.four` - Long race distortion with pink/cyan cars
- `hyperspeedPresets.five` - Turbulent distortion with orange/blue cars
- `hyperspeedPresets.six` - Deep distortion with red/cream cars

### Custom Configuration
You can create custom configurations by passing options:

```tsx
<Hyperspeed 
  effectOptions={{
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3
    }
  }} 
/>
```

## Navigation Structure

### Updated Routes
- `/home` - New landing page with Hyperspeed background
- `/` - Practice page (interview questions)
- `/dashboard` - User dashboard

### Header Navigation
The header now includes:
- **Home** → `/home` (Hyperspeed landing page)
- **Practice** → `/` (Interview practice)
- **Dashboard** → `/dashboard` (Only visible when logged in)

## Interactive Features

### Speed Up Effect
The Hyperspeed effect speeds up when you:
- Click and hold the mouse
- Touch and hold on mobile devices

This creates a "warp speed" effect with increased FOV and faster movement.

## Performance Notes
- The component uses `dynamic import` with `ssr: false` to avoid server-side rendering issues
- Three.js and postprocessing effects are optimized for modern browsers
- The animation is GPU-accelerated using WebGL

## Customization Tips

### Changing Colors
Colors are specified as hexadecimal numbers:
```tsx
colors: {
  leftCars: [0xd856bf, 0x6750a2, 0xc247ac], // Pink/purple gradient
  rightCars: [0x03b3c3, 0x0e5ea5, 0x324555], // Cyan/blue gradient
  sticks: 0x03b3c3 // Cyan light sticks
}
```

### Distortion Types
Available distortion effects:
- `turbulentDistortion` - Smooth, wavy motion
- `mountainDistortion` - Up and down hills
- `xyDistortion` - Side-to-side movement
- `LongRaceDistortion` - Long curves
- `deepDistortion` - Deep perspective shifts

## Dependencies Installed
```bash
npm install three postprocessing
npm install --save-dev @types/three
```

## Tips for Best Results
1. **Container Size**: The Hyperspeed component fills its parent container, so make sure the parent has a defined height
2. **Z-Index Layering**: Use proper z-index values to layer content over the background
3. **Overlay**: Add a semi-transparent overlay for better text readability
4. **Performance**: On slower devices, consider reducing `lightPairsPerRoadWay` and `totalSideLightSticks`

## Example Integration (Current Home Page)
```tsx
<div className="relative w-full h-screen overflow-hidden">
  {/* Hyperspeed Background */}
  <div className="absolute inset-0 z-0">
    <Hyperspeed effectOptions={hyperspeedPresets.one} />
  </div>

  {/* Overlay for readability */}
  <div className="absolute inset-0 z-10 bg-linear-to-b from-black/60 via-transparent to-black/80" />

  {/* Content */}
  <div className="relative z-20 h-full">
    {/* Your content here */}
  </div>
</div>
```

## Enjoy your futuristic landing page! 🚀
