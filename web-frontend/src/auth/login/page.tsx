import React from "react";

function LoginPage() {
  const rest_api_key = process.env.REACT_APP_REST_API_KEY;
  const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
  const kakaoauthurl = `http://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLogin = () => {
    window.location.href = kakaoauthurl;
  };

  return (
    <>
      <button onClick={handleLogin}>카카오 로그인</button>
    </>
  );
}

export default LoginPage;
