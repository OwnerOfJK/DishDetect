# Dishwasher Fill Estimator

A simple web application that estimates dishwasher fill percentage using AI-powered object detection and analysis.

## Features

- **Image Upload**: Upload JPG or PNG images of loaded dishwashers
- **Object Detection**: Uses Roboflow's `inferencejs` for browser-based dishware detection
- **Fill Estimation**: OpenAI analyzes detected objects to estimate fill percentage
- **Visual Results**: Shows labeled images with bounding boxes and fill percentage

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   - `NEXT_PUBLIC_ROBOFLOW_MODEL_NAME`: Your Roboflow model name
   - `NEXT_PUBLIC_ROBOFLOW_MODEL_VERSION`: Your model version
   - `NEXT_PUBLIC_ROBOFLOW_PUBLISHABLE_KEY`: Your Roboflow publishable key
   - `OPENAI_API_KEY`: Your OpenAI API key

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Usage

1. Upload an image of a loaded dishwasher
2. Click "Estimate Fill" to run analysis
3. View results showing detected items and estimated fill percentage

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: TailwindCSS
- **Object Detection**: Roboflow's `inferencejs`
- **AI Analysis**: OpenAI GPT-4o
- **Language**: TypeScript

## Project Structure

```
src/
├── app/
│   ├── api/estimate-fill/    # OpenAI API integration
│   ├── utils/roboflow.ts     # Roboflow inference utilities
│   ├── config.ts             # Configuration settings
│   ├── page.tsx              # Main application page
│   └── layout.tsx            # App layout
```
