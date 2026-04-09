import React, { useState } from 'react';
import axios from 'axios';

function VerifyEmail() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState('');

  async function handleGenerateOtp() {
    try {
      await axios.post("https://localhost:44372/api/Auth/generate-otp", { email });
      setStep(2);
      setMsg("Check your email for the 6-digit code.");
    } catch (err) {
      setMsg("Email not found.");
    }
  }

  async function handleVerifyOtp() {
    try {
      await axios.post("https://localhost:44372/api/Auth/verify-email", { email, otp });
      setMsg("Success! Email verified.");
    } catch (err) {
      setMsg("Invalid or expired OTP.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="bg-white p-8 rounded-xl w-96 shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-slate-800">Verify Your Identity</h2>
        
        {step === 1 ? (
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={e => setEmail(e.target.value)} />
            <button onClick={handleGenerateOtp} className="w-full bg-indigo-600 text-white py-2 rounded">Send OTP</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input type="text" placeholder="6-Digit OTP" className="w-full p-2 border rounded text-center text-xl" onChange={e => setOtp(e.target.value)} />
            <button onClick={handleVerifyOtp} className="w-full bg-green-600 text-white py-2 rounded">Verify Code</button>
          </div>
        )}
        <p className="mt-4 text-center text-sm text-red-500 font-semibold">{msg}</p>
      </div>
    </div>
  );
}

export default VerifyEmail;