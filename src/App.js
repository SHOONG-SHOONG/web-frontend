import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./main/page.tsx";       // develop 쪽 경로 유지
import LoginPage from './pages/login/login.tsx';
import RegisterUserPage from "./pages/login/join.tsx";
import ItemPage from "./item/page.tsx";
import AuthProvider from "./contexts/AuthContext.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterUserPage />} />
          <Route path="/item" element={<ItemPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
