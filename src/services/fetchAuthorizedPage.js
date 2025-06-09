import fetchReissue from "./fetchReissue";


const fetchAuthorizedPage = async (url, navigate, location) => {
  try {
    console.log("권한이 있는 페이지 접근 시 access 토큰을 검증");

    const accessToken = window.localStorage.getItem("access");

    const response = await fetch(url, {
      method: "POST",
      credentials: "include", // 쿠키를 요청에 포함
      headers: {
        access: accessToken ?? "", 
      },
    });

    if (response.ok) {
      return await response.text(); 
    } else {
      console.log("액세스 토큰 검증 실패. 리프레시 토큰 재발급 시도.");
      const reissueSuccess = await fetchReissue(); 

      if (reissueSuccess) {
        console.log("리프레시 토큰 재발급 성공. 다시 권한 페이지 접근 시도.");
        return fetchAuthorizedPage(url, navigate, location);
      } else {
        alert("세션이 만료되었거나 권한이 없는 사용자입니다. 다시 로그인해주세요.");
        navigate("/login", { state: location.pathname, replace: true });
        return undefined; 
      }
    }
  } catch (error) {
    console.error("fetchAuthorizedPage 에러 발생:", error);
    alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    return undefined; 
  }
};

export default fetchAuthorizedPage;