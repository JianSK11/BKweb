// Fix: Created this file to define shared types and resolve import errors.
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImageUrl: string;
  pdfUrl: string;
  payPalLink: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface User {
  name: string;
  email: string;
  picture: string;
}