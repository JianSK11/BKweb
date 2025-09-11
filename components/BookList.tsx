import React from 'react';
import type { Book } from '../types';
import BookCard from './BookCard';
import SearchIcon from './icons/SearchIcon';

interface BookListProps {
  books: Book[];
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BookList: React.FC<BookListProps> = ({ books, searchQuery, onSearchChange }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 mb-6 pb-2 border-b-2 border-emerald-800/50">Whispering Tomes</h2>
      
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search for a tome..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 rounded-md py-3 pl-10 pr-4 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16 px-4 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-300/20">
          <h3 className="text-xl font-medium text-emerald-200">No Tomes Found</h3>
          <p className="mt-2 text-slate-400">
            {searchQuery ? "Try a different search, or clear the search to see all tomes." : "The library is quiet. Add a new tome to begin filling the shelves."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;