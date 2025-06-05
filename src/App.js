import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import OAuth2Redirect from "./services/Oauth2Redirect.js";
import AuthProvider from "./contexts/AuthContext.tsx";
import CartProvider from "./contexts/CartContext.tsx";

import { Notifications } from "@mantine/notifications";
import ProtectedRoute from "./././routes/ProtectedRoute.tsx";

// 페이지들
import MainPage from "./apps/main/page.tsx";
import LoginPage from "./apps/login/LoginPage.tsx";
import LogoutPage from "./apps/login/LogoutPage.tsx";
import RegisterUserPage from "./apps/login/RegisterUserPage.tsx";
import RegisterBusinessPage from "./apps/login/RegisterBusinessPage.tsx";
import SellerItemPage from "./apps/seller/manageItem/page.tsx";
import CreateItemPage from "./apps/seller/createItem/page.tsx";
import ItemPage from "./apps/item/page.tsx";
import ItemDetailPage from "./apps/item/[itemId]/page.tsx";
import OrderPage from "./apps/order/page.tsx";
import OrderCompletePage from "./apps/order/complete.tsx";
import CartPage from "./apps/cart/page.tsx";
import LivePage from "./apps/live/[liveId]/page.tsx";
import BrandPage from "./apps/brand/page.tsx";
import SearchPage from "./apps/search/Search.tsx";
import AuthItemPage from "./apps/admin/authitem/page.tsx"
import AuthSellerPage from "./apps/admin/authseller/page.tsx"
import ReportPage from "./apps/admin/report/page.tsx"
import NotFoundPage from "./apps/error/NotFoundPage.tsx";
import ManageLivePage from "./apps/seller/manageLive/page.tsx";
import StatisticsPage from "./apps/admin/statistics/page.tsx";
import SellerMypge from "./apps/seller/sellerMypage/page.tsx";
import SellerNotificationPage from "./apps/seller/notification/page.tsx";

// 테스트용 페이지지
import Test from "./apps/login/CartViewer.tsx";
import LiveRegisterPage from "./apps/seller/registerLive/page.tsx";
import SellerUserPage from "./apps/seller/manageUser/page.tsx";
import RegisterBrandPage from "./apps/seller/registerBrand/page.tsx";
import ListLivePage from "./apps/live/listLive/page.tsx";
import Mypage from "./apps/mypage/page.tsx";

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Notifications position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* main */}
            <Route path="/" element={<MainPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/order/complete" element={<OrderCompletePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/test" element={<Test />} />
            <Route path="/live/:liveId" element={<LivePage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/brand/:brandId" element={<BrandPage />} />
            <Route path="/live" element={<ListLivePage />} />
            <Route path="/item/search" element={<SearchPage />} />

            {/* auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/register" element={<RegisterUserPage />} />
            <Route
              path="/register-business"
              element={<RegisterBusinessPage />}
            />
            <Route path="/oauth2-jwt-header" element={<OAuth2Redirect />} />
            <Route path="/mypage" element={<Mypage />} />

            {/* item */}
            <Route path="/item" element={<ItemPage />} />
            <Route path="/item/:itemId" element={<ItemDetailPage />} />

            {/* seller */}
            <Route path="/seller" element={<SellerItemPage />} />
            <Route path="/seller/item/create" element={<CreateItemPage />} />
            <Route path="/seller/live" element={<ManageLivePage />} />
            <Route path="/seller/regist-live" element={<LiveRegisterPage />} />
            <Route path="/seller/user" element={<SellerUserPage />} />
            <Route path="/seller/brand" element={<RegisterBrandPage />} />
            <Route path="/seller/mypage" element={<SellerMypge />} />
            <Route path="/seller/notification" element={<SellerNotificationPage />} />"

            {/* admin */}
            <Route path="/admin" element={<AuthItemPage />} />
            <Route path="/admin/seller" element={<AuthSellerPage />} />
            <Route path="/admin/report" element={<ReportPage />} />
            <Route path="/admin/statistics" element={<StatisticsPage />} />

            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
