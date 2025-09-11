import React, { useState } from 'react';
import type { Book } from '../types';
import PlusIcon from './icons/PlusIcon';
import SparklesIcon from './icons/SparklesIcon';
import { generateBookDescription } from '../services/geminiService';

interface BookFormProps {
  onAddBook: (book: Omit<Book, 'id' | 'pdfUrl' | 'author'> & { pdfFile: File }) => void;
}

const BookForm: React.FC<BookFormProps> = ({ onAddBook }) => {
  const [title, setTitle] = useState('');
  const authorName = "Sakila Kumari";
  const [price, setPrice] = useState('');
  const [payPalLink, setPayPalLink] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError(null);
    } else {
      setPdfFile(null);
      setError('Please upload a valid PDF file.');
    }
  };

  const handleGenerateDescription = async () => {
    if (!title) {
      setError('Please enter a title before generating a description.');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const generatedDesc = await generateBookDescription(title, authorName);
      setDescription(generatedDesc);
    } catch (err: any)
{
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !coverImage || !pdfFile || !payPalLink) {
      setError('Please fill out all fields and upload a cover image and PDF.');
      return;
    }
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Please enter a valid price.');
      return;
    }
    if (!payPalLink.startsWith('https://')) {
        setError('Please enter a valid PayPal link (e.g., https://...).');
        return;
    }

    onAddBook({
      title,
      price: priceNumber,
      description,
      coverImageUrl: coverImage,
      payPalLink,
      pdfFile,
    });

    // Reset form
    setTitle('');
    setPrice('');
    setPayPalLink('');
    setDescription('');
    setCoverImage(null);
    setPdfFile(null);
    setError(null);
    (document.getElementById('cover-upload') as HTMLInputElement).value = '';
    (document.getElementById('pdf-upload') as HTMLInputElement).value = '';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-emerald-300/20">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 mb-6">Add a New Tome</h2>
      {error && <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md relative mb-4" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 rounded-md px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none" required />
           <div className="w-full bg-gray-900/70 text-gray-300 border border-gray-700 rounded-md px-3 py-2 flex items-center">Author: {authorName}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="number" placeholder="Price ($)" value={price} onChange={(e) => setPrice(e.target.value)} min="0.01" step="0.01" className="w-full bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 rounded-md px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none" required />
          <input type="url" placeholder="Your PayPal.me or Buy Now link" value={payPalLink} onChange={(e) => setPayPalLink(e.target.value)} className="w-full bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 rounded-md px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none" required />
        </div>
        <div className="relative">
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 rounded-md px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none" />
          <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute top-2 right-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed">
            <SparklesIcon className={`-ml-0.5 mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Summoning...' : 'Generate with AI'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cover Image</label>
            <input id="cover-upload" type="file" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-200 hover:file:bg-emerald-600/50" accept="image/png, image/jpeg" onChange={handleImageUpload} required />
             {coverImage && <img src={coverImage} alt="Cover preview" className="mt-2 h-16 w-auto rounded-md" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Book PDF</label>
            <input id="pdf-upload" type="file" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-200 hover:file:bg-emerald-600/50" accept="application/pdf" onChange={handlePdfUpload} required />
            {pdfFile && <p className="mt-2 text-xs text-gray-400">Selected: {pdfFile.name}</p>}
          </div>
        </div>
        <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 transition-all transform hover:scale-105">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Tome to Library
        </button>
      </form>
    </div>
  );
};

export default BookForm;