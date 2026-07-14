import { IoReload } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useCallback, useEffect, useState } from "react";

const ServerErrorPage = () => {
  const { retryServerConnection } = useAuth();
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);

  const handleRetry = useCallback(async () => {
    setIsCheckingConnection(true);

    try {
      await retryServerConnection();
    } finally {
      setIsCheckingConnection(false);
    }
  }, [retryServerConnection]);

  useEffect(() => {
    handleRetry();
  }, [handleRetry]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 px-5">
      <h1 className="text-5xl lg:text-6xl mb-4">500 - Server Error</h1>
      <p className="text-2xl mb-8">
        Oops! Something went wrong on our end. Please try again later.
      </p>
      <button
        className="mt-5 border px-4 py-1 lg:py-2 rounded-lg transition-colors hover:bg-gray-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        onClick={handleRetry}
        disabled={isCheckingConnection}
      >
        <IoReload className="text-xl" />
        {isCheckingConnection ? "Checking Connection..." : "Retry"}
      </button>
    </div>
  );
};

export default ServerErrorPage;
