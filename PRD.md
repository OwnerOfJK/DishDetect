# 🧱 PRD.md — Dishwasher Fill Estimation Web App

## 📌 Overview

This web app allows users to upload a photo of a loaded dishwasher. It runs the image through a Roboflow object detection model using `inferencejs` (in-browser inference), then estimates the fill percentage based on a predefined capacity using OpenAI. The app displays both the labeled image and the estimated fill percentage.

---

## 🎯 Goals

- Enable users to estimate dishwasher fill percentage with a single image.
- Visualize detected dishware in a labeled image.
- Use AI to infer fill percentage based on object detection counts.
- Ensure a fast, intuitive experience.

---

## 🧩 Key Features

### 1. Image Upload UI
- Upload image (JPG, PNG).
- Image preview shown.
- “Estimate” button triggers detection + analysis.

### 2. Roboflow Inference via `inferencejs`
- Inference is run **entirely in-browser** using `inferencejs`.
- Uses Web Workers to load the model and run predictions without blocking the UI.
- Requires:
  - **Model name**
  - **Model version**
  - **Publishable key** from Roboflow

- Output:
  - Array of predictions (class names and bounding boxes)

### 3. Fill Estimation via OpenAI
- Prediction data is formatted into a prompt.
- Prompt is sent to an OpenAI model (e.g. GPT-4o).
- Returns a **single number** (0–100) representing estimated fill percentage.

### 4. Display Output
- Show:
  - Labeled image with bounding boxes.
  - Fill percentage in large text (e.g., “Estimated fill: 42”).

---

## 🛠️ Tech Stack

| Component           | Technology                          |
|--------------------|--------------------------------------|
| Frontend           | React (optional: Next.js, Tailwind)  |
| Inference Engine   | [`inferencejs`](https://www.npmjs.com/package/inferencejs) |
| LLM Inference      | OpenAI API (GPT-4o)                  |

---

## 📦 Workflow Logic

```
    A[User uploads image] --> B[Click "Estimate"]
    B --> C[Run model using inferencejs]
    C --> D[Receive predictions]
    D --> E[Format prompt for OpenAI]
    E --> F[Call OpenAI API]
    F --> G[Receive fill percentage]
    G --> H[Display labeled image + fill %]
```

