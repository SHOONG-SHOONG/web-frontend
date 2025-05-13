import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext";

const OAuth2Redirect = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setLoginUser } = useLogin();
    const [queryParams] = useSearchParams(); // ✅ 훅은 최상단에서 호출!

    // useEffect에서 비동기 작업 처리
    useEffect(() => {
        const fetchJwt = async () => {
            try {
                const response = await fetch("http://192.168.0.26:8080/oauth2-jwt-header", {
                    method: "GET",
                    credentials: "include",
                    redirect: "manual", // 리다이렉트를 수동으로 처리
                });

                // 응답이 성공적이면 처리
                if (response.ok) {
                    // 응답 헤더에서 access 토큰을 저장
                    const accessToken = response.headers.get("access");
                    window.localStorage.setItem("access", accessToken);

                    // queryParams에서 'name'을 가져와 로컬 스토리지에 저장
                    const name = queryParams.get("name");
                    window.localStorage.setItem("name", name);

                    // 로그인 상태 업데이트
                    setIsLoggedIn(true);
                    setLoginUser(name);
                } else {
                    alert("접근할 수 없는 페이지입니다.");
                }

                // 리다이렉트 후 홈으로 이동
                navigate("/", { replace: true });
            } catch (error) {
                console.error("Error fetching JWT:", error);
            }
        };

        fetchJwt(); // 비동기 함수 호출
    }, [queryParams, navigate, setIsLoggedIn, setLoginUser]); // 의존성 배열

    return null;
};

export default OAuth2Redirect;
