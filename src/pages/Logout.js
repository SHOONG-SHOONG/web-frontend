import { useNavigate } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext";

const Logout = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setLoginUser } = useLogin();

    const clearClientData = () => {
        // 로컬스토리지 삭제
        window.localStorage.removeItem("access");
        window.localStorage.removeItem("name");

        // 쿠키 삭제 시도 (HttpOnly 쿠키는 삭제 불가)
        document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });

        setIsLoggedIn(false);
        setLoginUser(null);
    };

    const fetchLogout = async () => {
        try {
            const response = await fetch("http://192.168.0.16:8080/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                alert("logout successful");
            } else {
                alert("logout failed");
            }

            // 성공 여부와 상관없이 클라이언트 측 정보 정리
            clearClientData();
            navigate("/", { replace: true });

        } catch (error) {
            console.log("error: ", error);
            // 네트워크 오류나 예외가 발생해도 정리
            clearClientData();
            navigate("/", { replace: true });
        }
    };

    fetchLogout();
    return null;
};

export default Logout;
