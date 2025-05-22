import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import OAuth2Redirect from "./services/Oauth2Redirect.js";
import AuthProvider from "./contexts/AuthContext.tsx";

// 페이지들들
import MainPage from "./apps/main/page.tsx";
import LoginPage from "./apps/login/LoginPage.tsx";
import LogoutPage from "./apps/login/LogoutPage.tsx";
import RegisterUserPage from "./apps/login/RegisterUserPage.tsx";
import RegisterBusinessPage from "./apps/login/RegisterBusinessPage.tsx";
import AdminItemPage from "./apps/admin/registerItem/page.tsx";
import ItemRegisterPage from "./apps/admin/manageItem/page.tsx";
import ItemPage from "./apps/item/page.tsx";
import ItemDetailPage from "./apps/item/[itemId]/page.tsx";
import OrderPage from "./apps/order/page.tsx";
import CartPage from "./apps/cart/page.tsx";
import LivePage from "./apps/live/page.tsx";
import BrandPage from "./apps/brand/page.tsx";
import ProductPage from "./apps/search/Search.js";

// 테스트용 페이지지
import Test from "./apps/login/CartViewer.tsx"; // 임시로 사용 중이라면 유지
import LiveListPage from "./apps/admin/manageLive/page.tsx";
import LiveRegisterPage from "./apps/admin/registerLive/page.tsx";
import AdminUserPage from "./apps/admin/manageUser/page.tsx";
import RegisterBrandPage from "./apps/admin/registerBrand/page.tsx";


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
          <Route path="/brand/:brandId" element={<BrandPage />} />
          <Route path="/item/search" element={<ProductPage />} />
          <Route path="/admin/live" element={<LiveListPage />} />
          <Route path="/admin/regist-live/" element={<LiveRegisterPage />} />
          <Route path="/admin/user" element={<AdminUserPage />} />
          <Route path="/admin/brand" element={<RegisterBrandPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
