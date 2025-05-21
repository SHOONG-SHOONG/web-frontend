import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./main/page.tsx";
import LoginPage from "./login/LoginPage.tsx";
import LogoutPage from "./login/LogoutPage.tsx";
import RegisterUserPage from "./login/RegisterUserPage.tsx";
import RegisterBusinessPage from "./login/RegisterBusinessPage.tsx";
import OAuth2Redirect from "./services/Oauth2Redirect.js";
import AuthProvider from "./contexts/AuthContext.tsx";

// 추가된 페이지들
import OrderPage from "./order/page.tsx";
import CartPage from "./cart/page.tsx";
import Test from "./login/CartViewer.tsx"; // 임시로 사용 중이라면 유지

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        //<Route path="/item/:itemId" element={<ItemDetailPage />} />
        //<Route path="/admin" element={<AdminItemPage />} />
          <Route path="/register" element={<RegisterUserPage />} />
          <Route path="/register-business" element={<RegisterBusinessPage />} />
          <Route path="/oauth2-jwt-header" element={<OAuth2Redirect />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
