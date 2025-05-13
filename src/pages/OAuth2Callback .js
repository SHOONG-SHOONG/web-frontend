import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext";  // 로그인 상태 관리

const OAuth2Callback = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setLoginUser } = useLogin();
    const [queryParams] = useSearchParams();  // URL 쿼리 파라미터 사용

    useEffect(() => {
        const fetchJwt = async () => {
            try {
                // JWT 요청을 백엔드로 보냄
                const response = await fetch("http://192.168.0.26:8080/oauth2-jwt-header", {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    // JWT 토큰을 헤더에서 가져오기
                    window.localStorage.setItem("access", response.headers.get("access"));

                    // 쿼리 파라미터에서 'name'을 가져와 localStorage에 저장
                    const name = queryParams.get("name");
                    window.localStorage.setItem("name", name);

                    // 로그인 상태 업데이트
                    setIsLoggedIn(true);
                    setLoginUser(name);
                } else {
                    alert("접근할 수 없는 페이지입니다.");
                }

                // 홈으로 리다이렉트
                navigate("/", { replace: true });
            } catch (error) {
                console.log("error: ", error);
            }
        };

        fetchJwt();
    }, [queryParams, navigate, setIsLoggedIn, setLoginUser]);

    return null;  // 화면에 아무것도 렌더링하지 않음
};

export default OAuth2Callback;
