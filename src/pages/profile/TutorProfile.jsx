import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MessagingSystem from '../../components/shared/MessagingSystem';

const TutorProfile = () => {
    const { tutorId } = useParams();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutor = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/tutor-profile/${tutorId}`);
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
        <div className="p-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">{tutor.name}</h2>
                <p>Email: {tutor.email}</p>
                <p>Location: {tutor.location || 'Not specified'}</p>
                <p>Subjects: {tutor.subjects?.join(', ') || 'Not specified'}</p>
                <p>Average Rating: {tutor.ratings?.length ? (tutor.ratings.reduce((a, b) => a + b, 0) / tutor.ratings.length).toFixed(1) : 'No ratings yet'}</p>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Message {tutor.name}</h3>
                <MessagingSystem tutorId={tutorId} studentId={null} />
            </div>
        </div>
    );
};

export default TutorProfile;