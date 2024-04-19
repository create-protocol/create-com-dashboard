import React, { useState } from 'react';
import "./model.css"; // Ensure this path is correct
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = ({ isOpen, message, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Email submission function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch("https://create-com-backend.vercel.app/sendData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        setEmail("")
        toast.success("Email submitted successfully!", {
          onClose: () => {
            setEmail("");
            // Delay the modal close by 2 seconds to allow users to see the message
            setTimeout(onClose, 2000);
          }
        });
      } else {
        toast.error("Failed to submit email.");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      toast.error("Error submitting email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <span className="modal-close-icon" onClick={onClose}>&times;</span>
        <p>{message}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email for early access"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading} style={{background:"black"}}>Get Access</button>
        </form>
        {isLoading && <p>Loading...</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Modal;
