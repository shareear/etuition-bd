import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const RatingSystem = ({ tutorId, onRatingSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);

    const handleRatingSubmit = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/rate-tutor`, {
                tutorId,
                rating
            });
            if (response.status === 200) {
                onRatingSubmit(rating);
                alert('Rating submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit rating. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex">
                {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                        <label key={index}>
                            <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                onClick={() => setRating(ratingValue)}
                                className="hidden"
                            />
                            <FaStar
                                className={`cursor-pointer text-2xl ${ratingValue <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                            />
                        </label>
                    );
                })}
            </div>
            <button
                onClick={handleRatingSubmit}
                className="mt-4 btn btn-primary text-white font-bold uppercase"
            >
                Submit Rating
            </button>
        </div>
    );
};

export default RatingSystem;