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
import AdminItemPage from "./apps/admin/manageItem/page.tsx";
import CreateItemPage from "./apps/admin/createItem/page.tsx";
import ItemPage from "./apps/item/page.tsx";
import ItemDetailPage from "./apps/item/[itemId]/page.tsx";
import OrderPage from "./apps/order/page.tsx";
import CartPage from "./apps/cart/page.tsx";
import LivePage from "./apps/live/[liveId]/page.tsx";
import BrandPage from "./apps/brand/page.tsx";
import ProductPage from "./apps/search/Search.js";

// 테스트용 페이지지
import Test from "./apps/login/CartViewer.tsx"; // 임시로 사용 중이라면 유지
import LiveListPage from "./apps/admin/manageLive/page.tsx";
import LiveRegisterPage from "./apps/admin/registerLive/page.tsx";
import AdminUserPage from "./apps/admin/manageUser/page.tsx";
import RegisterBrandPage from "./apps/admin/registerBrand/page.tsx";
import ListLivePage from "./apps/live/listLive/page.tsx";
import ManageLivePage from "./apps/admin/manageLive/page.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* main */}
          <Route path="/" element={<MainPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/live/:liveId" element={<LivePage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/brand/:brandId" element={<BrandPage />} />
          <Route path="/item/search" element={<ProductPage />} />
          <Route path="/admin/live" element={<ManageLivePage />} />

          {/* auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/register" element={<RegisterUserPage />} />
          <Route path="/register-business" element={<RegisterBusinessPage />} />
          <Route path="/oauth2-jwt-header" element={<OAuth2Redirect />} />

          {/* item */}
          <Route path="/item" element={<ItemPage />} />
          <Route path="/item/:itemId" element={<ItemDetailPage />} />

          {/* admin */}
          <Route path="/admin" element={<AdminItemPage />} />
          <Route path="/admin/item/create" element={<CreateItemPage />} />
          <Route path="/admin/live" element={<LiveListPage />} />
          <Route path="/admin/regist-live/" element={<LiveRegisterPage />} />
          <Route path="/admin/user" element={<AdminUserPage />} />
          <Route path="/admin/brand" element={<RegisterBrandPage />} />
          <Route path="/live" element={<ListLivePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
