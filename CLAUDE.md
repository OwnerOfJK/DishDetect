# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dishwasher fill estimation web application built with Next.js. Users upload photos of loaded dishwashers, and the app uses Roboflow object detection API to detect dishware items, then calculates fill percentage using mathematical formulas and provides suggestions via OpenAI's API.

## Key Dependencies

- **Next.js 15.4.1**: Main framework using App Router
- **React 19.1.0**: UI library
- **TailwindCSS 4**: Styling framework
- **TypeScript 5**: Type safety

## Common Commands

### Development
```bash
npm run dev --turbopack    # Start development server with turbopack
npm run build              # Build production version
npm run start              # Start production server
npm run lint               # Run ESLint
```

### Testing
The project currently has no test framework configured. Check with the user before adding test dependencies.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── estimate-fill/
│   │       └── route.ts   # API route for fill calculation and suggestions
│   ├── layout.tsx         # Root layout with font configuration
│   ├── page.tsx           # Main application page with UI
│   └── globals.css        # Global styles
```

## Architecture Overview

The application follows a standard Next.js App Router pattern:

1. **Frontend**: React components in `src/app/page.tsx` with image upload and results display
2. **Object Detection**: Server-side Roboflow API calls via fetch
3. **Fill Estimation**: Mathematical calculation based on detected items with weighted scoring
4. **Suggestions**: OpenAI API integration for capacity recommendations
5. **Styling**: TailwindCSS with custom font configuration (Geist fonts)

## Current State

The project is fully functional with:
- Complete image upload interface with preview
- Roboflow API integration for object detection
- Mathematical fill percentage calculation (no longer using OpenAI for math)
- OpenAI integration for capacity suggestions
- Results display with labeled images, fill percentage, and suggestions
- Dark theme UI with responsive layout

## Implementation Notes

### Fill Calculation Logic
The app uses mathematical formulas instead of AI for fill percentage:
- **Large items** (max 14): l_plate, l_bowl
- **Medium items** (max 16): m_plate, m_bowl, m_cup, tea_cup  
- **Small items** (max 20): s_plate, s_bowl, s_cup, glass
- **Weighted scoring**: Large (50%), Medium (30%), Small (20%)

### API Integration
- **Roboflow**: Uses server-side API calls with private key
- **OpenAI**: Only for capacity suggestions, not mathematical calculations
- **Environment Variables**: Requires NEXT_PUBLIC_ROBOFLOW_MODEL_NAME, NEXT_PUBLIC_ROBO_PRIVATE_API_KEY, OPENAI_API_KEY

### UI Features
- Dual-panel layout with upload on left, results on right
- Real-time image preview
- Processing states and error handling
- Labeled image display with bounding boxes
- Detected items list with confidence scores
- Fill percentage with large display
- Capacity suggestions from OpenAI