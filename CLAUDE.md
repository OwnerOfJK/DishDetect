# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dishwasher fill estimation web application built with Next.js. Users upload photos of loaded dishwashers, and the app uses Roboflow object detection (via `inferencejs`) to detect dishware, then estimates fill percentage using OpenAI's API.

## Key Dependencies

- **Next.js 15.4.1**: Main framework using App Router
- **React 19.1.0**: UI library
- **inferencejs 1.0.21**: Browser-based object detection inference
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
│   ├── layout.tsx         # Root layout with font configuration
│   ├── page.tsx           # Main page (currently default Next.js template)
│   └── globals.css        # Global styles
```

## Architecture Overview

The application follows a standard Next.js App Router pattern:

1. **Frontend**: React components in `src/app/` directory
2. **Object Detection**: Client-side inference using `inferencejs` library
3. **Fill Estimation**: Server-side API calls to OpenAI (API routes to be implemented)
4. **Styling**: TailwindCSS with custom font configuration (Geist fonts)

## Current State

The project is in initial setup phase with:
- Basic Next.js scaffold with App Router
- TailwindCSS configured
- TypeScript setup with path aliases (`@/*` → `./src/*`)
- Dependencies installed but core features not yet implemented

## Implementation Notes

- Use `inferencejs` for browser-based object detection to avoid server costs
- Implement OpenAI integration via Next.js API routes
- Follow the workflow: Image Upload → Roboflow Detection → OpenAI Estimation → Display Results
- The app requires Roboflow model configuration (model name, version, publishable key)
- OpenAI API will process detection results to estimate fill percentage (0-100)

## Key Features to Implement

1. Image upload interface with preview
2. Roboflow model integration using Web Workers
3. OpenAI API integration for fill percentage estimation
4. Results display with labeled images and percentage
5. Error handling for API failures and unsupported file types