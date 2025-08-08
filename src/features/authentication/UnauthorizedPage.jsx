import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <h1 className="text-4xl font-bold">403 - Unauthorized</h1>
            <p className="mt-4 text-lg">You do not have permission to view this page.</p>
            <Link to="/" className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                Go to Homepage
            </Link>
        </div>
    );
};

export default UnauthorizedPage;