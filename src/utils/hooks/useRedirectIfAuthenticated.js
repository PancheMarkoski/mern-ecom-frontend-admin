import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const useRedirectIfAuthenticated = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isChecking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/admin");
    } else {
      setChecking(false);
    }
  }, [user, isLoading, navigate]);

  return isChecking;
};
