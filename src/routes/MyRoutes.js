import { Routes, Route } from 'react-router-dom';
import JoinForm from '../pages/Join';
import LoginForm from '../pages/Login';
import Home from '../pages/Home';
import OAuth2Redirect from '../services/Oauth2Redirect';
import Admin from '../pages/Admin';
import Logout from '../pages/Logout';
import Stream from '../pages/Stream'; // Stream 페이지 가져오기
import { useLogin } from '../contexts/AuthContext';

const MyRoutes = () => {
  const { isLoggedIn } = useLogin();
  // 로그인 여부에 따라서 조건부 라우팅
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {!isLoggedIn && <Route path="/login" element={<LoginForm />} />}
      {!isLoggedIn && <Route path="/join" element={<JoinForm />} />}
      {isLoggedIn && <Route path="/logout" element={<Logout />} />}
      <Route path="/admin" element={<Admin />} />
      <Route path="/oauth2-jwt-header" element={<OAuth2Redirect />} />
      
      {/* 스트림 경로 추가 - 로그인된 사용자만 접근 가능 */}
      {isLoggedIn && <Route path="/stream/:streamKey" element={<Stream />} />}
    </Routes>
  );
}

export default MyRoutes;