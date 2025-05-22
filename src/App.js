import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./app/main/page.tsx";
import LoginPage from "./app/login/LoginPage.tsx";
import LogoutPage from "./app/login/LogoutPage.tsx";
import RegisterUserPage from "./app/login/RegisterUserPage.tsx";
import RegisterBusinessPage from "./app/login/RegisterBusinessPage.tsx";
import OAuth2Redirect from "./services/Oauth2Redirect.js";
import AuthProvider from "./contexts/AuthContext.tsx";
import AdminItemPage from "./admin/registerItem/page.tsx";
import ItemRegisterPage from "./admin/manageItem/page.tsx";
import ItemPage from "./item/page.tsx";
import ItemDetailPage from "./item/[itemId]/page.tsx";

// 추가된 페이지들
import OrderPage from "./order/page.tsx";
import CartPage from "./cart/page.tsx";
import Test from "./login/CartViewer.tsx"; // 임시로 사용 중이라면 유지
import LivePage from "./live/page.tsx";
import BrandPage from "./brand/page.tsx";
import ProductPage from "./apps/search/Search.js";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/item" element={<ItemPage />} />
          <Route path="/item/:itemId" element={<ItemDetailPage />} />
          <Route path="/admin" element={<ItemRegisterPage />} />
          <Route path="/admin/regist-item" element={<AdminItemPage />} />
          <Route path="/register" element={<RegisterUserPage />} />
          <Route path="/register-business" element={<RegisterBusinessPage />} />
          <Route path="/oauth2-jwt-header" element={<OAuth2Redirect />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/item/search" element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
