import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MessagingSystem from '../../components/shared/MessagingSystem';

const StudentProfile = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/student-profile/${studentId}`);
                setStudent(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching student profile:', error);
                setLoading(false);
            }
        };

        fetchStudent();
    }, [studentId]);

    if (loading) return <div className="text-center py-20">Loading...</div>;

    if (!student) return <div className="text-center py-20">Student not found.</div>;

    return (
        <div className="p-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">{student.name}</h2>
                <p>Email: {student.email}</p>
                <p>Location: {student.location || 'Not specified'}</p>
                <p>Subjects: {student.subjects?.join(', ') || 'Not specified'}</p>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Message {student.name}</h3>
                <MessagingSystem tutorId={null} studentId={studentId} />
            </div>
        </div>
    );
};

export default StudentProfile;