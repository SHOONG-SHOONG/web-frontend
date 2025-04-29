import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function KakaoCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    if (code) {
      // 백엔드에 인가코드 전달
      axios
        .post(
          "http://localhost:8088/api/auth/kakao",
          { code },
          { withCredentials: true }
        )
        .then((res) => {
          //   console.log(res.data.user.accessToken);
          window.history.replaceState({}, document.title, "/main");
          sessionStorage.setItem("access_token", res.data.user.accessToken);
          // user id도 저장해야하지않나?
          navigate("/main"); // 홈으로
        })
        .catch((err) => {
          console.error("로그인 실패", err);
        });
    }
  }, [location, navigate]);

  return <div>로그인 중...</div>;
}
export default KakaoCallback;
