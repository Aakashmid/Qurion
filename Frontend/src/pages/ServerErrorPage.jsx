import React from 'react';


const ServerErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
            <h1 className="text-6xl mb-4">500 - Server Error</h1>
            <p className="text-2xl mb-8">Oops! Something went wrong on our end. Please try again later.</p>
        </div>
    );
};

export default ServerErrorPage;
