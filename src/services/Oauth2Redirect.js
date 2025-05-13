import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext";

const OAuth2Redirect = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setLoginUser } = useLogin();
    const [queryParams] = useSearchParams(); // ✅ 훅은 최상단에서 호출!

    useEffect(() => {
        const fetchJwt = async () => {
            try {
                // 1. access 토큰을 가져오는 요청
                const response = await fetch("http://192.168.0.26:8080/oauth2-jwt-header", {
                    method: "POST",
                    credentials: "include",
                });

                if (!response.ok) {
                    alert("접근할 수 없는 페이지입니다.");
                    navigate("/", { replace: true });
                    return;
                }

                // 2. access 토큰을 헤더에서 꺼내서 저장
                const accessToken = response.headers.get("access");
                if (accessToken) {
                    window.localStorage.setItem("access", accessToken);
                }

                // 3. 유저 이름 가져오기
                const name = queryParams.get("name") ?? "사용자";
                window.localStorage.setItem("name", name);
                setIsLoggedIn(true);
                setLoginUser(name);

                // 4. 쿠키 만료 처리 요청
                await fetch("http://192.168.0.26:8080/expire-access-cookie", {
                    method: "POST",
                    credentials: "include",
                });

                // 5. 홈으로 이동
                navigate("/", { replace: true });
            } catch (error) {
                console.error("JWT fetch error: ", error);
                alert("로그인 처리 중 문제가 발생했습니다.");
                navigate("/", { replace: true });
            }
        };

        fetchJwt();
    }, [queryParams, navigate, setIsLoggedIn, setLoginUser]);

    return null;
};

export default OAuth2Redirect;
