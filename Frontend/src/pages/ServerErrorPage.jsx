import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ServerErrorPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // On mount, check if server is back
        api.get("/server-status")
            .then(() => {
                // If server responds, go to home
                navigate("/", { replace: true });
            })
            .catch(() => {
                // If still down, stay here
            });
    }, [navigate]);
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
            <h1 className="text-6xl mb-4">500 - Server Error</h1>
            <p className="text-2xl mb-8">Oops! Something went wrong on our end. Please try again later.</p>
        </div>
    );
};

export default ServerErrorPage;
