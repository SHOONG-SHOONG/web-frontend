import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/main.tsx";
import LoginPage from './pages/login/login.tsx';
import AuthProvider from "./contexts/AuthContext.tsx";  // 경로 맞게 수정
import RegisterUserPage from "./pages/login/join.tsx";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterUserPage />} /> 
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
