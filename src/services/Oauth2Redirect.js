import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext";

const OAuth2Redirect = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setLoginUser } = useLogin();
    const [queryParams] = useSearchParams();

    useEffect(() => {
        const name = queryParams.get("name");
        const accessToken = getCookie("access");

        if (accessToken) {
            window.localStorage.setItem("access", accessToken);
            if (name) {
                window.localStorage.setItem("name", name);
                setLoginUser(name);
            }
            setIsLoggedIn(true);
        } else {
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
        }

        navigate("/", { replace: true });
    }, [queryParams, navigate, setIsLoggedIn, setLoginUser]);

    return null;
};

function getCookie(name) {
  const cookie = document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export default OAuth2Redirect;
