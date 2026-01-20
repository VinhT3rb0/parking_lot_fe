import React from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Parking Lot Service</h1>
            <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
                Find and book the perfect parking spot for your vehicle. Safe, secure, and convenient.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <Card hoverable className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
                    <p className="text-gray-500">Book your spot in seconds.</p>
                </Card>
                <Card hoverable className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Secure Parking</h3>
                    <p className="text-gray-500">24/7 surveillance for peace of mind.</p>
                </Card>
                <Card hoverable className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Best Rates</h3>
                    <p className="text-gray-500">Competitive pricing for all vehicle types.</p>
                </Card>
            </div>

            <div className="mt-12">
                <Button type="primary" size="large" onClick={() => navigate('/login')}>
                    Get Started
                </Button>
            </div>
        </div>
    );
};

export default Home;
