import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext";

const OAuth2Redirect = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setLoginUser } = useLogin();

    useEffect(() => {
        const fetchJwt = async () => {
            try {
                const response = await fetch("http://192.168.0.26:8080/oauth2-jwt-header", {
                    method: "POST",
                    credentials: "include", // 쿠키 포함
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json(); // ✅ JSON 형식으로 받기
                    const { access, refresh, name } = data;

                    // 로컬스토리지에 저장
                    localStorage.setItem("access", access);
                    localStorage.setItem("refresh", refresh);
                    localStorage.setItem("name", name);

                    // 로그인 상태 반영
                    setIsLoggedIn(true);
                    setLoginUser(name);

                    // 홈으로 이동
                    navigate("/", { replace: true });
                } else {
                    alert("로그인에 실패했습니다.");
                    navigate("/login", { replace: true });
                }
            } catch (error) {
                console.error("JWT 요청 실패:", error);
                alert("서버와의 통신에 실패했습니다.");
                navigate("/login", { replace: true });
            }
        };

        fetchJwt();
    }, [navigate, setIsLoggedIn, setLoginUser]);

    return null;
};

export default OAuth2Redirect;
