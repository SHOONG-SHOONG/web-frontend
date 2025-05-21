import "./App.css";

// 페이지 컴포넌트 임포트
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./main/main.tsx";
// import Home from "./pages/Home.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
