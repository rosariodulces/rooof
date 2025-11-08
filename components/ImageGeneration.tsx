import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import Card from './common/Card';

const ImageGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageData = await generateImage(prompt);
      setGeneratedImage(imageData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image. ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Roofing Inspiration Generator</h2>
        <p className="text-gray-400 mb-6">Describe a home and roof style to generate inspirational concepts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt-gen" className="sr-only">Prompt</label>
          <textarea
            id="prompt-gen"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A modern two-story house with a dark metal standing-seam roof, evening light"
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-orange text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:bg-brand-orange/70 disabled:cursor-not-allowed hover:bg-brand-orange-dark transition-colors"
        >
          {isLoading ? <><Spinner /> <span className="ml-2">Generating...</span></> : 'Generate Idea'}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

      <div className="mt-8">
        {generatedImage && (
          <div className="flex flex-col items-center">
             <h3 className="text-lg font-semibold text-white mb-4">Generated Concept:</h3>
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt="Generated"
              className="rounded-lg shadow-lg max-w-full h-auto border-4 border-gray-600"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageGeneration;