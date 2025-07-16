# Dishwasher Fill Estimator

A web application that estimates dishwasher fill percentage using AI-powered object detection and mathematical analysis.

<img width="1289" height="621" alt="Screenshot 2025-07-16 at 14 03 00" src="https://github.com/user-attachments/assets/9517a464-05ce-48ce-a37b-ca194c013317" />

## Features

- **Image Upload**: Upload JPG or PNG images of loaded dishwashers
- **Object Detection**: Uses Roboflow API for server-side dishware detection
- **Fill Estimation**: Mathematical calculation based on detected items with weighted scoring
- **AI Suggestions**: OpenAI provides recommendations for remaining capacity
- **Visual Results**: Shows labeled images with bounding boxes, fill percentage, and suggestions

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create `.env.local` file with your credentials:
   ```bash
   # Roboflow Configuration
   NEXT_PUBLIC_ROBOFLOW_MODEL_NAME=your-model-name
   NEXT_PUBLIC_ROBO_PRIVATE_API_KEY=your-private-api-key
   
   # OpenAI Configuration (for suggestions only)
   OPENAI_API_KEY=your-openai-api-key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Usage

1. Upload an image of a loaded dishwasher (JPG or PNG)
2. Click "Estimate Fill" to run analysis
3. View results showing:
   - Labeled image with detected items
   - Fill percentage calculation
   - List of detected items with confidence scores
   - AI suggestions for remaining capacity

## Fill Calculation Logic

The app uses mathematical formulas with weighted scoring:

- **Large items** (max 14, weight 50%): l_plate, l_bowl
- **Medium items** (max 16, weight 30%): m_plate, m_bowl, m_cup, tea_cup
- **Small items** (max 20, weight 20%): s_plate, s_bowl, s_cup, glass

Final percentage = (Large% × 0.5) + (Medium% × 0.3) + (Small% × 0.2)

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: TailwindCSS 4
- **Object Detection**: Roboflow API
- **AI Suggestions**: OpenAI GPT-4o
- **Language**: TypeScript

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── estimate-fill/
│   │       └── route.ts      # Fill calculation and OpenAI suggestions
│   ├── page.tsx              # Main application UI
│   ├── layout.tsx            # App layout with fonts
│   └── globals.css           # Global styles
```
