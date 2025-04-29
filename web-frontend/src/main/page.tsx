import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function MainPage() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");

    if (accessToken) {
      sessionStorage.setItem("access_token", accessToken);
      console.log("Access Token 저장 완료!", accessToken);
    }
  }, [location]);

  return (
    <div>
      <h1>메인 페이지</h1>
    </div>
  );
}

export default MainPage;
