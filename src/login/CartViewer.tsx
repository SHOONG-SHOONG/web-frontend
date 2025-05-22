import { useState } from "react";
import BASE_URL from "../config";

const CartViewer = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 장바구니 조회 요청 핸들러
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`${BASE_URL}/cart/get`, {
        method: "GET",
        headers: {
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log("장바구니 응답:", data);
      setCartItems(data);
      setError(null);
      alert("장바구니 조회 성공");
    } catch (err: any) {
      console.error("에러 발생:", err);
      setError(err.message || "장바구니 조회 중 오류 발생");
      setCartItems([]);
    }
  };

  return (
    <div>
      <h1>장바구니 조회</h1>
      <button onClick={fetchCart}>장바구니 가져오기</button>

      {error && <p style={{ color: "red" }}>에러: {error}</p>}

      {cartItems.length > 0 && (
        <ul style={{ marginTop: "1rem" }}>
          {cartItems.map((item, index) => (
            <li key={index}>
              {JSON.stringify(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartViewer;
