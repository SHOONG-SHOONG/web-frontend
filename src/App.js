import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./main/page.tsx";       // develop 쪽 경로 유지
import LoginPage from './login/LoginPage.tsx';
import LogoutPage from './login/LogoutPage.tsx';
import RegisterUserPage from "./login/RegisterUserPage.tsx";
//import ItemPage from "./item/page.tsx";
import AuthProvider from "./contexts/AuthContext.tsx";
import OAuth2Redirect from '../src/services/Oauth2Redirect';
import RegisterBusinessPage from "./login/RegisterBusinessPage.tsx"; // ✅ 비즈니스 유저 로그인
import Test from "./login/CartViewer.tsx";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/register" element={<RegisterUserPage />} />
          <Route path="/register-business" element={<RegisterBusinessPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/oauth2-jwt-header" element={<OAuth2Redirect />} />

          {/* ✅ 추가 */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
