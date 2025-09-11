import React, { useState, useRef, useEffect } from 'react';
import { generateFoxResponse } from '../services/geminiService';
import type { Book, ChatMessage } from '../types';
import FoxIcon from './icons/FoxIcon';
import SparklesIcon from './icons/SparklesIcon';

interface FoxAssistantProps {
  books: Book[];
}

const FoxAssistant: React.FC<FoxAssistantProps> = ({ books }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await generateFoxResponse(newMessages, books);
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === 'model') {
            lastMessage.parts[0].text = modelResponse;
            return [...prev.slice(0, -1), lastMessage];
          }
          return prev;
        });
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-300 z-50 animate-pulse"
        aria-label="Open AI Assistant"
      >
        <FoxIcon className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-gray-800/80 backdrop-blur-xl border border-emerald-300/20 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <header className="p-4 bg-gray-900/50 border-b border-emerald-800/50 flex items-center justify-between">
            <div className="flex items-center">
              <FoxIcon className="w-6 h-6 text-orange-400 mr-3" />
              <h3 className="font-bold text-lg text-emerald-200">Foxxy</h3>
            </div>
            <button onClick={toggleChat} className="text-gray-400 hover:text-white">&times;</button>
          </header>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-xs md:max-w-sm ${msg.role === 'user' ? 'bg-emerald-800/80 text-white' : 'bg-gray-700/80 text-gray-200'}`}>
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex justify-start">
                  <div className="p-3 rounded-lg bg-gray-700/80 text-gray-200 flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-2 animate-spin text-orange-400"/>
                    <span>Foxxy is thinking...</span>
                  </div>
              </div>
            )}
            {error && <div className="text-red-400 text-sm p-2 bg-red-900/50 rounded-md">{error}</div>}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-emerald-800/50 bg-gray-900/50">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the books..."
                className="w-full bg-gray-700/80 text-white placeholder-gray-400 border border-gray-600 rounded-full py-2 pl-4 pr-12 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default FoxAssistant;