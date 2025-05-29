import fetchReissue from "./fetchReissue";

/**
 * 권한이 필요한 페이지 접근 시 액세스 토큰을 검증하고 필요한 경우 재발급합니다.
 * @param {string} url - 접근하려는 페이지의 URL.
 * @param {Function} navigate - React Router의 navigate 함수.
 * @param {Object} location - React Router의 location 객체.
 * @returns {Promise<string | undefined>} - 응답 텍스트 또는 undefined.
 */
const fetchAuthorizedPage = async (url, navigate, location) => {
  try {
    console.log("권한이 있는 페이지 접근 시 access 토큰을 검증");

    const accessToken = window.localStorage.getItem("access");

    const response = await fetch(url, {
      method: "POST",
      credentials: "include", // 쿠키를 요청에 포함
      headers: {
        access: accessToken ?? "", // access 토큰 헤더에 추가 (null 또는 undefined 시 빈 문자열)
      },
    });

    if (response.ok) {
      // 응답이 성공적이면 (2xx 상태 코드)
      return await response.text(); // 응답 본문을 텍스트로 반환
    } else {
      // 응답이 실패하면 (예: 401 Unauthorized)
      console.log("액세스 토큰 검증 실패. 리프레시 토큰 재발급 시도.");
      const reissueSuccess = await fetchReissue(); // 리프레시 토큰으로 액세스 토큰 재발급 시도

      if (reissueSuccess) {
        // 재발급 성공 시
        console.log("리프레시 토큰 재발급 성공. 다시 권한 페이지 접근 시도.");
        // 재귀 호출: 새로 발급받은 토큰으로 다시 원래 요청을 보냄
        return fetchAuthorizedPage(url, navigate, location);
      } else {
        // 재발급 실패 시 (리프레시 토큰도 만료되었거나 유효하지 않음)
        alert("세션이 만료되었거나 권한이 없는 사용자입니다. 다시 로그인해주세요.");
        // 로그인 페이지로 리디렉션, 현재 경로를 state에 담아 로그인 후 돌아올 수 있도록 함
        navigate("/login", { state: location.pathname, replace: true });
        return undefined; // undefined 반환
      }
    }
  } catch (error) {
    // 네트워크 오류 등 예외 발생 시
    console.error("fetchAuthorizedPage 에러 발생:", error);
    alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    return undefined; // undefined 반환
  }
};

export default fetchAuthorizedPage;