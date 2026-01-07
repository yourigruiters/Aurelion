import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-bg-main text-center p-8">
      <h1 className="text-4xl font-bold text-text-main mb-4">404</h1>
      <h2 className="text-2xl font-bold text-text-secondary mb-6">
        Page Not Found
      </h2>
      <p className="text-text-secondary mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => navigate("/overview")}>
        Back to Overview
      </Button>
    </div>
  );
};

export default NotFound;
