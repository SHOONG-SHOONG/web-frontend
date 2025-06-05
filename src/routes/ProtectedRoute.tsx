import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    allowedStatus: string[]; // 예: ["ACTIVE"]
    children: JSX.Element;
}

export default function ProtectedRoute({ allowedStatus, children }: ProtectedRouteProps) {
    const userStatus = localStorage.getItem("userStatus");

    if (!userStatus || !allowedStatus.includes(userStatus)) {
        alert("접근 권한이 없습니다. 관리자 승인 후 이용해주세요.");
        return <Navigate to="/login" replace />;
    }

    return children;
}
