// Fix: Implemented the main App component to resolve module and syntax errors.
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';

import Header from './components/Header';
import BookList from './components/BookList';
import AuthorProfile from './components/AuthorProfile';
import BookForm from './components/BookForm';
import FoxAssistant from './components/FoxAssistant';
import AboutAuthor from './components/AboutAuthor';
import type { Book, User } from './types';


// Extend the Window interface to include google for the Google Identity Services
declare global {
  interface Window {
    google?: any;
  }
}

// Mock initial data. In a real app, this would come from a database.
const initialBooks: Book[] = [
    {
        id: '1',
        title: 'The Whispering Woods',
        author: 'Sakila Kumari',
        description: 'A young sorceress must venture into a forest that steals memories to find a cure for her village\'s mysterious slumber.',
        price: 12.99,
        coverImageUrl: 'https://placehold.co/600x800/042f2e/a7f3d0?text=The+Whispering+Woods',
        pdfUrl: '#', // Placeholder link
        payPalLink: '#', // Placeholder link
    },
    {
        id: '2',
        title: 'The Starlight Compass',
        author: 'Sakila Kumari',
        description: 'Two siblings discover a magical compass that leads them to a city in the clouds, but a sky pirate is hot on their trail.',
        price: 14.50,
        coverImageUrl: 'https://placehold.co/600x800/27272a/a7f3d0?text=The+Starlight+Compass',
        pdfUrl: '#', // Placeholder link
        payPalLink: '#', // Placeholder link
    },
];

// This would be in your .env.local file
const AUTHOR_EMAIL = process.env.REACT_APP_AUTHOR_EMAIL || 'author@example.com'; 
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCredentialResponse = (response: any) => {
    try {
      const decoded: any = jwtDecode(response.credential);
      const newUser: User = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };
      // For this app, only the author can log in to the portal
      if (newUser.email === AUTHOR_EMAIL) {
         setUser(newUser);
      } else {
         alert("Access denied. This portal is for the author only.");
         setUser(null);
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  };

  useEffect(() => {
    if (window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('signInDiv'),
        { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with', shape: 'pill' }
      );
      window.google.accounts.id.prompt(); // Also display the One Tap dialog
    } else if (!GOOGLE_CLIENT_ID) {
        console.warn("Google Client ID is not configured. Google Sign-In is disabled.");
    }
  }, []);

  const handleSignOut = () => {
    setUser(null);
    // You might also want to disable the one-tap prompt after sign out
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const handleAddBook = (newBookData: Omit<Book, 'id' | 'pdfUrl' | 'author'> & { pdfFile: File }) => {
    const newBook: Book = {
      ...newBookData,
      id: uuidv4(),
      author: 'Sakila Kumari', // Author is fixed
      pdfUrl: URL.createObjectURL(newBookData.pdfFile),
    };
    setBooks(prevBooks => [newBook, ...prevBooks]);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans bg-cover bg-center bg-fixed" style={{backgroundImage: "url('/background.jpg')"}}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <Header user={user} onSignOut={handleSignOut} />
        <main className="space-y-12 pb-12">
          {user && (
            <AuthorProfile user={user}>
              <BookForm onAddBook={handleAddBook} />
            </AuthorProfile>
          )}
          <AboutAuthor />
          <BookList
            books={filteredBooks}
            searchQuery={searchQuery}
            onSearchChange={e => setSearchQuery(e.target.value)}
          />
        </main>
      </div>
       <FoxAssistant books={books} />
    </div>
  );
};

export default App;