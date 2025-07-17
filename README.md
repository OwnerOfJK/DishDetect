# DishDetect

A web application that estimates dishwasher fill percentage using a fine-tuned RF-DETR model for object detection with an LLM integration.

Deployed at: https://vercel.com/jhkallers-projects/dishwash-object-detector

<img width="1289" height="621" alt="Screenshot 2025-07-16 at 14 03 00" src="https://github.com/user-attachments/assets/9517a464-05ce-48ce-a37b-ca194c013317" />

## Features

- **Image Upload**  
  Upload JPG or PNG images of loaded dishwashers directly from your device.

- **Custom Object Detection**  
  Runs server-side dishware detection using a fine-tuned **RF-DETR model** trained on a self-annotated dishwasher dataset.  
  → [View the model on Roboflow](https://universe.roboflow.com/enterrobo/measure-washingmachine)

- **Detection Performance**  
  Model metrics on validation set:  
  - **mAP@50**: 80.5%  
  - **Precision**: 74.1%  
  - **Recall**: 83.0%

- **Fill Estimation**  
  Calculates fill rate by categorizing detected items into large, medium, and small compartments and applying a **weighted scoring algorithm**.

- **LLM-Based Suggestions**  
  Uses OpenAI to analyze detection results and provide **natural language suggestions** for how to best utilize the remaining capacity.

- **Visual Feedback**  
  Displays uploaded images with bounding boxes, fill percentage, and actionable recommendations.

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
