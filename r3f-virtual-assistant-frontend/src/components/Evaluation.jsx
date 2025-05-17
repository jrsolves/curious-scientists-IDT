import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Evaluation() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    rating: '',
    comments: '',
  });

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent accidental page reload
    if (!feedback.rating) {
      alert("Please select a rating before submitting.");
      return;
    }
    console.log("📝 Evaluation submitted:", feedback);
    navigate('/'); // redirect or thank-you page
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📋 Final Evaluation</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p>1. How would you rate your learning experience?</p>
          <select
            name="rating"
            value={feedback.rating}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-2"
            required
          >
            <option value="">Select a rating</option>
            <option value="5">⭐️⭐️⭐️⭐️⭐️ - Excellent</option>
            <option value="4">⭐️⭐️⭐️⭐️ - Good</option>
            <option value="3">⭐️⭐️⭐️ - Okay</option>
            <option value="2">⭐️⭐️ - Needs Improvement</option>
            <option value="1">⭐️ - Poor</option>
          </select>
        </div>

        <div className="mb-4">
          <p>2. Any comments or suggestions?</p>
          <textarea
            name="comments"
            value={feedback.comments}
            onChange={handleChange}
            rows="4"
            className="border p-2 rounded w-full mt-2"
            placeholder="Your feedback is appreciated..."
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
          }}
          onMouseDown={(e) => e.stopPropagation()} // avoids click interference
        >
          ✅ Submit Evaluation
        </button>
      </form>
    </div>
  );
}
