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
                const response = await fetch("http://localhost:8080/oauth2-jwt-header", {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    // access 토큰을 응답 헤더에서 가져옴
                    window.localStorage.setItem("access", response.headers.get("access"));

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
