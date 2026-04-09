import React, { useState } from 'react';
import axios from 'axios';

function ResetPassword() {
  const [formData, setFormData] = useState({ email: '', token: '', newPassword: '' });
  const [status, setStatus] = useState('');

  async function handleReset(e) {
    e.preventDefault();
    try {
      await axios.post("https://localhost:44372/api/Auth/reset-password", formData);
      setStatus("Password reset successful! You can now login.");
    } catch (err) {
      setStatus("Error: Invalid token or link expired.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-xl w-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Set New Password</h2>
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" required 
               onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="text" placeholder="Reset Token" className="w-full p-2 border rounded" required 
               onChange={e => setFormData({...formData, token: e.target.value})} />
        <input type="password" placeholder="New Password" className="w-full p-2 border rounded" required 
               onChange={e => setFormData({...formData, newPassword: e.target.value})} />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold transition hover:bg-indigo-700">
          Update Password
        </button>
        {status && <p className="text-center text-sm text-blue-600">{status}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;