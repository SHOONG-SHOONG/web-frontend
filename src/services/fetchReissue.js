import { Cookies } from "react-cookie";
import BASE_URL from "../config"; 

const fetchReissue = async () => {
    try {
        const response = await fetch(`${BASE_URL}/reissue`, {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) { // 토큰 재발급 성공
            window.localStorage.setItem('access', response.headers.get("access"));
            return true;
        } else { // 토큰 재발급 실패
            window.localStorage.removeItem("access");
            const cookies = new Cookies();
            cookies.set("refresh", null, { maxAge: 0 });
        }
    } catch (error) {
        console.log("error: ", error);
    }
    return false;
}

export default fetchReissue;
