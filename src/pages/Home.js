import { useLogin } from "../contexts/AuthContext";

const Home = () => {
    const { isLoggedIn, loginUser } = useLogin();

    // ✅ 장바구니 조회 요청 버튼 클릭 핸들러
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("access"); // accessToken 꺼내기

            const response = await fetch("http://localhost:8080/api/cart", {
                method: 'GET',
                headers: {
                    'access': token, // 서버가 읽는 헤더 이름 그대로 사용
                },
                credentials: 'include', // 쿠키도 함께 보냄
            });

            if (response.ok) {
                const data = await response.json();
                console.log('장바구니 응답:', data);
                alert('장바구니 조회 성공 (콘솔 확인)');
            } else {
                alert('장바구니 조회 실패');
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    return (
        <div>
            <h1>Home</h1>

            {isLoggedIn && (
                <>
                    <span>{loginUser}님 환영합니다.</span>
                    <br />
                    <button onClick={fetchCart}>장바구니 조회</button>
                </>
            )}

          
        </div>
    );
};

export default Home;
