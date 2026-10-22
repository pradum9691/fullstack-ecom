import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "./utils/api";
import { loginSuccess, logoutSuccess } from "./store/slices/authSlice";
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        dispatch(
          loginSuccess({
            user: res.data.data,
            token,
          })
        );
      } catch (err) {
        dispatch(logoutSuccess());
      }
    };

    fetchMe();
  }, []);

  return <>
  <AppRoutes />
   <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
  </>;
}

export default App;