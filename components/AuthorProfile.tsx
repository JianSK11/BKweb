// Fix: Created the AuthorProfile component to resolve syntax errors from placeholder content.
import React from 'react';
import type { User } from '../types';
import UserIcon from './icons/UserIcon';

interface AuthorProfileProps {
  user: User;
  children: React.ReactNode;
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({ user, children }) => {
  return (
    <section id="author-portal" className="mb-12">
      <div className="flex items-center space-x-4 mb-6 pb-2 border-b-2 border-emerald-800/50">
        <UserIcon className="w-8 h-8 text-emerald-300" />
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
          Author Portal
        </h2>
      </div>
      <div className="bg-gray-800/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-emerald-300/10">
        <p className="text-lg text-slate-300 mb-6">
          Welcome back, <span className="font-semibold text-emerald-200">{user.name}</span>. Add a new tome to your enchanted library.
        </p>
        {children}
      </div>
    </section>
  );
};

export default AuthorProfile;
