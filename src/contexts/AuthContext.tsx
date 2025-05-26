import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: string | null;
  setLoginUser: React.Dispatch<React.SetStateAction<string | null>>;
}

// 기본값 undefined로 두고, useLogin 훅에서 체크함
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!window.localStorage.getItem("access")
  );
  // const [loginUser, setLoginUser] = useState<string | null>(
  //   window.localStorage.getItem("name")
  // );
  const [loginUser, setLoginUser] = useState<string | null>(() => {
    const raw = window.localStorage.getItem("name");
    return raw ? decodeURIComponent(raw) : null;
  });

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, loginUser, setLoginUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useLogin must be used within AuthProvider");
  }
  return context;
};

export default AuthProvider;
