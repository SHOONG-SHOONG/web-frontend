import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CallBackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");
    // const name = params.get("name");

    if (accessToken) {
      sessionStorage.setItem("access_token", accessToken);
      //   sessionStorage.setItem("user", JSON.stringify({ name }));
      console.log("access_token 저장 완료");
      navigate("/main");
    } else {
      console.warn("유효하지 않은 로그인 정보");
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
}

export default CallBackPage;
