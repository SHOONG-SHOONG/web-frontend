import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../contexts/AuthContext.tsx";
import BASE_URL from "../../config.js";


const Logout = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoginUser } = useLogin();

  useEffect(() => {
    const clearClientData = () => {
      window.localStorage.removeItem("access");
      window.localStorage.removeItem("name");

      // HttpOnly 쿠키는 JS에서 삭제할 수 없지만, 일반 쿠키는 아래 방식으로 제거 가능
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.split("=");
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      setIsLoggedIn(false);
      setLoginUser(null);
    };

    const fetchLogout = async () => {
      try {
        const response = await fetch(`${BASE_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          alert("Logout successful");
        } else {
          alert("Logout failed");
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        clearClientData();
        navigate("/", { replace: true });
      }
    };

    fetchLogout();
  }, [navigate, setIsLoggedIn, setLoginUser]);

  return null;
};

export default Logout;
