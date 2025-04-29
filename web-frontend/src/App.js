import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/login/page.tsx";
import KakaoCallback from "./auth/callback/page.tsx";
import MainPage from "./main/page.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/callback" element={<KakaoCallback />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
