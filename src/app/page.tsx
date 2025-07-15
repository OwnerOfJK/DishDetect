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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dishwasher Fill Estimator
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Dishwasher Image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {imagePreview && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Image Preview:</h3>
              <div className="relative w-full max-w-md mx-auto">
                <Image
                  src={imagePreview}
                  alt="Uploaded dishwasher"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="text-center">
              <button
                onClick={handleEstimate}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Estimate Fill'}
              </button>
            </div>
          )}
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Results</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Labeled Image:</h3>
                <div className="relative w-full">
                  <Image
                    src={results.labeledImage || ''}
                    alt="Labeled dishwasher image"
                    width={400}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Fill Percentage:</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {results.fillPercentage}%
                  </div>
                  <p className="text-gray-600">
                    Estimated fill: {results.fillPercentage}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Detected Items:</h3>
                  <div className="space-y-1 text-sm">
                    {results.predictions.map((pred, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{pred.class}</span>
                        <span className="text-gray-500">
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
          </div>
        )}
      </div>
    </div>
  );
}
