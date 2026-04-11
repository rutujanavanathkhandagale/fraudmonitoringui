import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalForm from "../../components/Customer/PersonalForm";
import AccountForm from "../../components/Customer/AccountForm";
import KYCForm from "../../components/Customer/KYCForm";
import "../../style/Customer/onboarding.css";

const CustomerOnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ personal: {}, account: {}, kyc: {} });
  const navigate = useNavigate();

  const handleNext = (data) => {
    if (step === 1) {
      setFormData({ ...formData, personal: data });
      setStep(2);
    } else if (step === 2) {
      setFormData({ ...formData, account: data });
      setStep(3);
    }
  };

  const handleSubmit = async (data) => {
    const finalData = { ...formData, kyc: data };
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // RegistrationId

    if (!token) {
      alert("You must be logged in to onboard.");
      return;
    }

    try {
      const res = await fetch("https://localhost:7181/api/Customer/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...finalData, registrationId: userId }),
      });

      const responseData = await res.json();
      if (res.ok) {
        const customerId = responseData.customerId;
        localStorage.setItem("customerId", customerId);
        localStorage.setItem("customerName", responseData.firstName + " " + responseData.lastName);
        navigate(`/dashboard/${customerId}`);
      } else {
        alert(responseData.message || "Onboarding failed");
      }
    } catch (err) {
      alert("Network error during onboarding");
    }
  };

  return (
    <div className="onboarding-container">
      {/* Progress Header */}
      <div className="onboarding-header">
        <div className={`onboarding-step ${step === 1 ? "active" : ""}`} onClick={() => setStep(1)}>
          Personal Info
        </div>
        <div className={`onboarding-step ${step === 2 ? "active" : ""}`} onClick={() => setStep(2)}>
          Account Details
        </div>
        <div className={`onboarding-step ${step === 3 ? "active" : ""}`} onClick={() => setStep(3)}>
          KYC Verification
        </div>
      </div>

      {/* Step rendering */}
      <div className="form-section">
        {step === 1 && <PersonalForm data={formData.personal} onNext={handleNext} />}
        {step === 2 && <AccountForm data={formData.account} onNext={handleNext} />}
        {step === 3 && <KYCForm data={formData.kyc} onSubmit={handleSubmit} />}
      </div>
    </div>
  );
};

export default CustomerOnboardingForm;
