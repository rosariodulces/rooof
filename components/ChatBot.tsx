import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { startChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import Spinner from './common/Spinner';
import Card from './common/Card';

const ChatBot: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatSession(startChat());
    setMessages([
        { role: 'model', text: 'Welcome to Garcia Roofing! How can I assist you with your roofing questions today?' }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chatSession || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userInput });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[calc(100vh-14rem)] flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Garcia Roofing AI Assistant</h2>
      <div className="flex-grow overflow-y-auto pr-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-2 rounded-lg shadow ${
              msg.role === 'user' ? 'bg-brand-orange text-white' : 'bg-gray-700 text-gray-200'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg">
                    <Spinner />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about materials, warranties, etc..."
          className="flex-grow bg-gray-700 text-white placeholder-gray-400 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="bg-brand-orange text-white p-3 rounded-r-lg disabled:bg-brand-orange/70 disabled:cursor-not-allowed hover:bg-brand-orange-dark transition-colors"
          aria-label="Send message"
        >
          {isLoading ? <Spinner /> : 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          }
        </button>
      </form>
    </Card>
  );
};

export default ChatBot;