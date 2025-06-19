// src/pages/Signup.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../lib/auth';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCred = await signUp(email, password);
      console.log('User signed up:', userCred.user);
      alert('Signup successful!');
      navigate('/'); // 🚀 Redirect after signup
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSignup} className="p-6 space-y-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        required
        className="w-full border px-3 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="w-full border px-3 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Sign Up
      </button>
    </form>
  );
}

export default Signup;
