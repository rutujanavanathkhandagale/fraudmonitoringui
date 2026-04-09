import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post("https://localhost:44372/api/Auth/forgot-password", { email });
      setMessage("Reset token sent! Redirecting...");
      setTimeout(() => navigate('/reset-password'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.Message || "Error sending token.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Enter registered email" 
            className="w-full p-2 border rounded shadow-sm"
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition">
            Send Reset Token
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm font-medium text-orange-600">{message}</p>}
      </motion.div>
    </div>
  );
}

export default ForgotPassword;