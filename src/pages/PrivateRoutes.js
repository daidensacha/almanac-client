import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { isAuth } from "../utils/helpers";


const PrivateRoutes = () => {
  // state
  const [loading, setLoading] = useState(true);
  // hooks
  const navigate = useNavigate();

  // check if user is logged in
  // by making API request or from localStorage
  useEffect(() => {
    setLoading(true);
    if (isAuth()) {
      setLoading(false);
    } else {
      setLoading(true);
      navigate("/signin");
    }
  }, [navigate]);

  return !loading && <Outlet />;
};

export default PrivateRoutes;