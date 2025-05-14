import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import BASE_URL from "../config"; // BASE_URL을 import

const Home = () => {
    const [cartItems, setCartItems] = useState([]); // 장바구니 아이템 상태 추가
    const [streamKey, setStreamKey] = useState(''); // 스트림 키 상태 추가
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

    // ✅ 장바구니 조회 요청 버튼 클릭 핸들러
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("access"); // accessToken 꺼내기

            const response = await fetch(`${BASE_URL}/cart/get`, {
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

    // 스트림 키 입력 폼 제출 핸들러
    const handleStreamSubmit = (e) => {
        e.preventDefault();
        if (streamKey.trim()) {
            navigate(`/stream/${streamKey}`); // 스트림 페이지로 이동
        } else {
            alert('스트림 키를 입력해주세요.');
        }
    };

    return (
        <div>
            <h1>Home</h1>

            {/* 로그인 상태 확인 없이 장바구니 조회 기능과 스트림 키 입력 폼 제공 */}
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

            {/* 스트림 키 입력 폼 추가 */}
            <div style={{ marginTop: '20px', padding: '15px', borderTop: '1px solid #ccc' }}>
                <h2>라이브 방송 시청</h2>
                <form onSubmit={handleStreamSubmit}>
                    <input
                        type="text"
                        value={streamKey}
                        onChange={(e) => setStreamKey(e.target.value)}
                        placeholder="스트림 키 입력"
                        style={{ padding: '8px', marginRight: '10px' }}
                    />
                    <button 
                        type="submit"
                        style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        방송 시청하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;
