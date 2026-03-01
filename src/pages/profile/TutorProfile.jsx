import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import MessagingSystem from '../../components/shared/MessagingSystem';
import RatingSystem from '../../components/shared/RatingSystem';

const TutorProfile = () => {
    const { tutorId } = useParams();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutor = async () => {
            try {
                // লোকাল স্টোরেজ থেকে টোকেন সংগ্রহ
                const token = localStorage.getItem('access-token');

                const response = await axios.get(` https://etuition-bd-server.vercel.app//tutor-profile/${tutorId}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                setTutor(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tutor profile:', error);
                setLoading(false);
            }
        };

        fetchTutor();
    }, [tutorId]);

    if (loading) return <div className="text-center py-20">Loading...</div>;

    if (!tutor) return <div className="text-center py-20">Tutor not found.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4 text-center">{tutor.name}</h2>
                <p className="text-lg">Email: {tutor.email}</p>
                <p className="text-lg">Location: {tutor.location || 'Not specified'}</p>
                <p className="text-lg">Subjects: {tutor.subjects?.join(', ') || 'Not specified'}</p>
                <p className="text-lg">Average Rating: {tutor.ratings?.length ? (tutor.ratings.reduce((a, b) => a + b, 0) / tutor.ratings.length).toFixed(1) : 'No ratings yet'}</p>
            </div>

            <div className="mt-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-center">Message {tutor.name}</h3>
                <MessagingSystem tutorId={tutorId} studentId={null} />
            </div>

            <div className="mt-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-center">Rate {tutor.name}</h3>
                <RatingSystem tutorId={tutorId} />
            </div>
        </div>
    );
};

export default TutorProfile;