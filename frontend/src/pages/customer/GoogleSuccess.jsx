import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import { toast } from "react-toastify";

const GoogleSuccess = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const userParam = params.get("user");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token || !userParam) return;
    const user = JSON.parse(decodeURIComponent(userParam));

  
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    
    dispatch(
      loginSuccess({
        user,
        token,
      })
    );
    toast.success("login successful");

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  }, [token, userParam, dispatch, navigate]);

  return <p>Logging in...</p>;
};

export default GoogleSuccess;
