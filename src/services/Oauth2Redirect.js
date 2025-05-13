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
                const response = await fetch("http://192.168.0.26:8080/oauth2-jwt-header", {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    // 헤더에서 access 토큰만 따로 로컬스토리지에 저장
                    const accessToken = response.headers.get("access");
                    window.localStorage.setItem("access", accessToken);

                    // 이름을 URL의 쿼리 파라미터에서 가져와 로컬스토리지에 저장
                    const name = queryParams.get("name");
                    window.localStorage.setItem("name", name);

                    setIsLoggedIn(true);
                    setLoginUser(name);
                } else {
                    alert("접근할 수 없는 페이지입니다.");
                }

                navigate("/", { replace: true });
            } catch (error) {
                console.log("error: ", error);
            }
        };

        fetchJwt();
    }, [queryParams, navigate, setIsLoggedIn, setLoginUser]);

    return null;
};

export default OAuth2Redirect;
