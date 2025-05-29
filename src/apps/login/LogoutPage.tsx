import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../contexts/AuthContext.tsx";
import BASE_URL from "../../config.js";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoginUser } = useLogin();

  useEffect(() => {
    const clearClientLocalData = () => {
      window.localStorage.removeItem("access"); // LocalStorage에서 access 토큰 제거
      window.localStorage.removeItem("name"); // LocalStorage에서 사용자 이름 제거

      // HttpOnly 쿠키는 여기서 JavaScript로 삭제할 수 없습니다.
      // 서버에서 Max-Age=0으로 Set-Cookie 응답을 보내야만 삭제됩니다.
      console.log("클라이언트 로컬 데이터 (localStorage)를 정리합니다.");

      setIsLoggedIn(false);
      setLoginUser(null);
    };

    // **쿠키에서 특정 이름을 가진 값 찾기 함수**
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    const fetchLogout = async () => {
      try {
        console.log("------------------------------------------");
        console.log("1. 로그아웃 요청 시작: 서버에 '/logout' 엔드포인트로 POST 요청을 보냅니다.");
        console.log("2. 'credentials: \"include\"' 옵션으로 브라우저가 저장된 쿠키(refresh 토큰 포함)를 자동으로 요청 헤더에 담아 보낼 것입니다.");

        // ⭐ 추가: 요청 보내기 직전 refresh 쿠키 값 확인
        const refreshCookieValue = getCookie('refresh');
        if (refreshCookieValue) {
          console.log(`프론트엔드에서 확인된 'refresh' 쿠키 값: ${refreshCookieValue.substring(0, 30)}... (일부만 표시)`);
        } else {
          console.log("프론트엔드에서 'refresh' 쿠키를 찾을 수 없습니다.");
        }

        const response = await fetch(`${BASE_URL}/logout`, {
          method: "POST",
          credentials: "include", // ⭐ 이 옵션이 refresh 쿠키를 자동으로 포함시킵니다.
        });

        if (response.ok) {
          console.log("3. 서버 로그아웃 처리 성공: 서버로부터 2xx 응답을 받았습니다.");
          alert("로그아웃되었습니다.");
        } else {
          // 서버에서 200 OK 외 다른 응답 (예: 400 Bad Request, 401 Unauthorized)을 보낼 때
          const errorText = await response.text(); // 서버가 보낸 에러 메시지 읽기
          console.error(`3. 서버 로그아웃 실패: ${response.status} ${response.statusText}`);
          console.error(`서버 응답 본문: ${errorText}`); // ⭐ 추가: 서버 응답 본문 로그
          console.error("   (이 에러는 서버가 요청에 포함된 refresh 쿠키를 찾지 못했거나 유효하지 않다고 판단했을 때 발생할 수 있습니다.)");
          alert(`로그아웃에 실패했습니다. (상태: ${response.status})`);
        }
      } catch (error) {
        // 네트워크 오류 등 fetch 요청 자체에서 에러 발생 시
        console.error("3. 로그아웃 중 네트워크 오류 발생:", error);
        alert("네트워크 연결에 문제가 있어 로그아웃에 실패했습니다.");
      } finally {
        console.log("4. 서버 응답 성공/실패 여부와 관계없이 클라이언트 데이터 정리 및 페이지 이동.");
        clearClientLocalData(); // 클라이언트 로컬 스토리지 데이터 정리
        navigate("/", { replace: true }); // 메인 페이지로 이동
        console.log("------------------------------------------");
      }
    };

    fetchLogout();
  }, [navigate, setIsLoggedIn, setLoginUser]);

  return null;
};

export default LogoutPage;