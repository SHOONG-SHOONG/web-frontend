import "./App.css";

// 페이지 컴포넌트 임포트
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./main/page.tsx";
// import OrderPage from "./order/page.tsx";
import CartPage from "./cart/page.tsx";
// import Home from "./pages/Home.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/item" element={<ItemPage />} /> */}
        {/* <Route path="/order" element={<OrderPage />} /> */}
        <Route path="/cart" element={<CartPage />} />
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;