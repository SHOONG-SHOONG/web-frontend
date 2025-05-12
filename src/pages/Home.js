import { useLogin } from "../contexts/AuthContext";
import { useState } from "react";

const Home = () => {
    const { isLoggedIn, loginUser } = useLogin();
    const [cartItems, setCartItems] = useState([]); // 장바구니 아이템 상태 추가

    // ✅ 장바구니 조회 요청 버튼 클릭 핸들러
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("access"); // accessToken 꺼내기
            
            const response = await fetch("http://192.168.0.16:8080/cart/get", {
                method: 'GET',
                headers: {
                    'access': token, // 서버가 읽는 헤더 이름 그대로 사용
                },
                credentials: 'include', // 쿠키도 함께 보냄
            });

            if (response.ok) {
                const data = await response.json();
                console.log('장바구니 응답:', data);
                setCartItems(data); // 받아온 데이터를 상태에 저장
                alert('장바구니 조회 성공');
            } else {
                alert('장바구니 조회 실패');
            }
        } catch (error) {
            console.error('에러 발생:', error);
            alert('장바구니 조회 중 오류 발생');
        }
    };

    return (
        <div>
            <h1>Home</h1>

            {isLoggedIn ? (
                <>
                    <span>{loginUser}님 환영합니다.</span>
                    <br />
                    <button onClick={fetchCart}>장바구니 조회</button>
                    
                    {/* 장바구니가 조회된 경우, 장바구니 내용 출력 */}
                    {cartItems.length > 0 && (
                        <div>
                            <h2>장바구니 목록</h2>
                            <ul>
                                {cartItems.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - {item.quantity}개 - {item.price}원
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <p>로그인 후 이용 가능합니다.</p>
            )}
        </div>
    );
};

export default Home;
