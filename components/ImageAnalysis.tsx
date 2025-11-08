import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './common/Spinner';
import Card from './common/Card';

const ImageAnalysis: React.FC = () => {
  const [image, setImage] = useState<{ file: File, preview: string } | null>(null);
  const [prompt, setPrompt] = useState('Analyze this roof for signs of damage, such as missing shingles, cracks, or water pooling.');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage({ file, preview: URL.createObjectURL(file) });
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !prompt.trim()) {
      setError('Please upload a roof image and provide instructions.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const { data, mimeType } = await fileToBase64(image.file);
      const result = await analyzeImage(data, mimeType, prompt);
      setAnalysisResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to analyze image. ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">AI Damage Inspector</h2>
        <p className="text-gray-400 mb-6">Upload a photo of a roof to identify potential areas of concern.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file-upload-analysis" className="block text-sm font-medium text-gray-300 mb-2">Upload Roof Photo</label>
          <input
            id="file-upload-analysis"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-brand-orange-dark cursor-pointer"
            disabled={isLoading}
          />
        </div>

        {image && (
          <div>
            <label htmlFor="prompt-analysis" className="block text-sm font-medium text-gray-300 mb-2">Analysis Instructions</label>
            <textarea
              id="prompt-analysis"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What should the AI look for?"
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              disabled={isLoading}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !image || !prompt.trim()}
          className="w-full bg-brand-orange text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:bg-brand-orange/70 disabled:cursor-not-allowed hover:bg-brand-orange-dark transition-colors"
        >
          {isLoading ? <><Spinner /> <span className="ml-2">Inspecting...</span></> : 'Inspect Roof'}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {image && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-white mb-4">Uploaded Roof:</h3>
            <img src={image.preview} alt="Uploaded" className="rounded-lg shadow-lg max-w-full h-auto border-4 border-gray-600"/>
          </div>
        )}
        {analysisResult && (
          <div className="bg-gray-900/50 p-4 rounded-lg">
             <h3 className="text-lg font-semibold text-white mb-4">Inspection Report:</h3>
             <p className="text-gray-300 whitespace-pre-wrap">{analysisResult}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageAnalysis;