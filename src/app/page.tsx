'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    predictions: Array<{
      class: string;
      confidence: number;
      bbox: { x: number; y: number; width: number; height: number };
    }>;
    fillPercentage: number;
    labeledImage: string | null;
  } | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResults(null);
    }
  };

  const handleEstimate = async () => {
    if (!selectedImage || !imagePreview) return;

    setIsProcessing(true);

    try {
      // Build Roboflow API URL
      const model = process.env.NEXT_PUBLIC_ROBOFLOW_MODEL_NAME;
      const apiKey = process.env.NEXT_PUBLIC_ROBO_PRIVATE_API_KEY;
      const apiUrl = `https://serverless.roboflow.com/${model}/1?api_key=${apiKey}&format=image_and_json&stroke=2&labels=true`;

      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", selectedImage);

      // Send image to Roboflow
      const roboflowResponse = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!roboflowResponse.ok) {
        const errorText = await roboflowResponse.text();
        throw new Error(`Roboflow API request failed: ${roboflowResponse.status} - ${errorText}`);
      }

      const roboflowData = await roboflowResponse.json();
      const predictions = roboflowData.predictions || [];

      // Convert labeled image (base64) to a usable image src
      let labeledImage = null;
      if (roboflowData.visualization) {
        labeledImage = `data:image/jpeg;base64,${roboflowData.visualization}`;
      }

      // Estimate fill percentage using OpenAI
      const fillResponse = await fetch("/api/estimate-fill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ predictions }),
      });

      if (!fillResponse.ok) {
        throw new Error("Failed to estimate fill percentage");
      }

      const { fillPercentage } = await fillResponse.json();

      // Set results
      setResults({
        predictions,
        fillPercentage,
        labeledImage,
      });
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen bg-black py-4 px-4">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">
          Dishwasher Fill Estimator
        </h1>
        
        <div className="flex gap-4 flex-1 min-h-0">
          <div className="flex-1 bg-gray-900 rounded-lg shadow-lg p-4 flex flex-col">
            <div className="mb-3">
              <label className="block text-lg font-medium text-gray-200 mb-1">
                Upload Dishwasher Image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>

            {imagePreview && (
              <div className="mb-3 flex-1">
                <div className="relative w-full h-full justify-center items-center flex">
                  <Image
                    src={imagePreview}
                    alt="Uploaded dishwasher"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            )}

            {selectedImage && (
              <div className="text-center mt-auto">
                <button
                  onClick={handleEstimate}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Estimate Fill'}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-gray-900 rounded-lg shadow-lg p-4 flex flex-col">
            
            {results ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-medium mb-1 text-white">Fill Percentage:</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {results.fillPercentage}%
                  </div>
                </div>

              <div className="flex flex-1">
                <div className="flex-1">
                  <h3 className="text-base font-medium mb-1 text-white">Labeled Image:</h3>
                    <Image
                      src={results.labeledImage || ''}
                      alt="Labeled dishwasher image"
                      width={300}
                      height={200}
                      className="rounded-lg"
                    />
                </div>
              
                <div className="w-48">
                  <h3 className="text-base font-medium mb-1 text-white">Detected Items:</h3>
                  <div className="space-y-1 text-sm max-h-100 overflow-y-auto bg-gray-800 rounded p-2">
                    {results.predictions.map((pred, index) => (
                      <div key={index} className="flex justify-between text-gray-300">
                        <span className="truncate">{pred.class}</span>
                        <span className="text-gray-500 ml-2">
                          {(pred.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                    {results.predictions.length === 0 && (
                      <p className="text-gray-500 italic">No items detected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <p className="text-lg text-center">
                  Upload an image and click `Estimate Fill` to see results
                </p>
                <div className="mt-8 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Labeled image will appear here</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Fill percentage calculation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Detected dishware items</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
