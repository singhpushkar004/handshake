import React from "react";
import "../../assets/css/NotFound.css";


const Notfound = () => {
  return (
    <div className="notfound-container d-flex align-items-center justify-content-center text-center">
      <div>
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a href="/" className="btn btn-light btn-lg mt-3 custom-btn">
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default Notfound;
