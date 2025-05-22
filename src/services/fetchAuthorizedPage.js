import fetchReissue from "./fetchReissue";
import { NavigateFunction, Location } from "react-router-dom";

// 권한이 있는 페이지 접근 시 access 토큰을 검증
const fetchAuthorizedPage = async (
  url: string,
  navigate: NavigateFunction,
  location: Location
): Promise<string | undefined> => {
  try {
    console.log("권한이 있는 페이지 접근 시 access 토큰을 검증");

    const accessToken = window.localStorage.getItem("access");

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        access: accessToken ?? "", // null 방지
      },
    });

    if (response.ok) {
      return await response.text();
    } else {
      const reissueSuccess = await fetchReissue();
      if (reissueSuccess) {
        // 🔁 재귀 시 return 추가
        return fetchAuthorizedPage(url, navigate, location);
      } else {
        alert("관리자가 아닙니다.");
        navigate("/login", { state: location.pathname });
      }
    }
  } catch (error) {
    console.log("error: ", error);
  }
  return;
};

export default fetchAuthorizedPage;
