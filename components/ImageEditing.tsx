import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './common/Spinner';
import Card from './common/Card';

const ROOF_TYPES = ['Tile Roof', 'Metal Roof', 'Concrete Roof', 'Shingle Roof', 'Slate Roof', 'Wood Shake Roof'];

const ImageEditing: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ file: File, preview: string } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // To track which button is loading
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOriginalImage({ file, preview: URL.createObjectURL(file) });
      setEditedImage(null);
      setError(null);
      setPrompt('');
    }
  };

  const handleSubmit = async (currentPrompt: string, actionId: string) => {
    if (!originalImage || !currentPrompt.trim()) {
      setError('Please upload an image and provide instructions.');
      return;
    }
    setIsLoading(true);
    setLoadingAction(actionId);
    setError(null);
    setEditedImage(null);

    try {
      const { data, mimeType } = await fileToBase64(originalImage.file);
      const result = await editImage(data, mimeType, currentPrompt);
      setEditedImage(result);
    } catch (err)
 {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(prompt, 'prompt');
  };
  
  const handleRoofTypeClick = (roofType: string) => {
    let roofPrompt = `Change the roof in this image to a ${roofType.toLowerCase()}`;
    if (roofType === 'Concrete Roof') {
      roofPrompt = 'Change the roof in this image to look like it is made of concrete tiles.';
    }
    setPrompt(roofPrompt);
    handleSubmit(roofPrompt, roofType);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const FileUploader = () => (
     <div className="w-full">
        <label htmlFor="file-upload-edit" className="relative block w-full border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-brand-orange transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="mt-2 block text-sm font-semibold text-gray-200">
                Upload a photo of your home
            </span>
            <span className="mt-1 block text-xs text-gray-400">
                PNG or JPG
            </span>
            <input
                id="file-upload-edit"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                disabled={isLoading}
            />
        </label>
    </div>
  );

  return (
    <Card>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Roof Replacement Visualizer</h2>
        <p className="text-gray-400 mt-2">See how a new roof could look on your home instantly.</p>
      </div>
      
      {!originalImage ? <FileUploader /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="flex flex-col space-y-6">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="prompt-edit" className="block text-sm font-medium text-gray-300 mb-2">Custom Changes</label>
                <textarea
                  id="prompt-edit"
                  rows={3}
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder="e.g., Change the gutters to black, add solar panels"
                  className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full bg-brand-orange text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:bg-brand-orange/70 disabled:cursor-not-allowed hover:bg-brand-orange-dark transition-colors"
              >
                {loadingAction === 'prompt' ? <><Spinner /> <span className="ml-2">Applying...</span></> : 'Apply Custom Edit'}
              </button>
            </form>

            <div>
                <div className="relative my-2 flex items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>
                <p className="text-gray-300 mt-2 font-semibold text-center">Try a New Roof Material</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {ROOF_TYPES.map(type => (
                <button 
                  key={type} 
                  onClick={() => handleRoofTypeClick(type)} 
                  disabled={isLoading} 
                  className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition disabled:bg-gray-800 disabled:cursor-not-allowed flex justify-center items-center text-sm"
                >
                  {loadingAction === type ? <Spinner/> : type}
                </button>
              ))}
            </div>
          </div>

          {/* Image Display Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-white mb-4">Before</h3>
              <div className="relative w-full aspect-square">
                 <img src={originalImage.preview} alt="Original" className="rounded-lg shadow-lg w-full h-full object-cover border-4 border-gray-600" />
                 {isLoading && (
                    <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center rounded-lg">
                        <Spinner/>
                    </div>
                 )}
              </div>
            </div>
             <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-white mb-4">After</h3>
               <div className="w-full aspect-square bg-gray-700/50 rounded-lg border-4 border-gray-600 flex items-center justify-center">
                {editedImage ? (
                  <img src={`data:image/png;base64,${editedImage}`} alt="Edited" className="rounded-lg shadow-lg w-full h-full object-cover" />
                ) : (
                    <p className="text-gray-400 px-4 text-center">Your new roof will appear here</p>
                )}
               </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 mt-6 text-center font-semibold">{error}</p>}
      
    </Card>
  );
};

export default ImageEditing;