import React from 'react';
import type { Book } from '../types';
import PayPalIcon from './icons/PayPalIcon';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-emerald-900/50 hover:-translate-y-2 border border-emerald-300/20">
      <div className="relative h-64 sm:h-72">
        <img className="absolute inset-0 w-full h-full object-cover" src={book.coverImageUrl} alt={`Cover for ${book.title}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
           <h3 className="text-xl font-bold text-white tracking-tight">{book.title}</h3>
           <p className="text-sm text-slate-300">by {book.author}</p>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-slate-300 text-sm mb-4 flex-grow">
          {book.description || "No description provided."}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-emerald-800/50">
          <p className="text-2xl font-bold text-emerald-300">${book.price.toFixed(2)}</p>
          <div className="flex items-center space-x-2">
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-emerald-600 text-sm font-medium rounded-md shadow-sm text-emerald-200 hover:bg-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 transition-colors"
              aria-label={`Read a sample of ${book.title}`}
            >
              Read Sample
            </a>
            <a
              href={book.payPalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-900 bg-[#ffc439] hover:bg-[#f2b930] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[#ffc439] transition-colors"
              aria-label={`Buy ${book.title} with PayPal`}
            >
              <PayPalIcon className="w-5 h-5 mr-2" />
              Buy with PayPal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;