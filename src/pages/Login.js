import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogin } from '../contexts/AuthContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsLoggedIn, setLoginUser } = useLogin();

    const prevUrl = location.state || "/";
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loggedIn, setLoggedIn] = useState(false); // 상태 추가

    // 로그인 요청 함수
    const fetchLogin = async (credentials) => {
        try {
            const response = await fetch("http://192.168.0.26:8080/login", {
                method: 'POST',
                credentials: 'include',  // 쿠키 자동 포함
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(credentials),
            });

            if (response.ok) {
                alert('Login successful');
                const data = await response.json();
                const { name } = data;

                // 로그인 후 localStorage에 저장
                window.localStorage.setItem("access", response.headers.get("access"));
                window.localStorage.setItem("name", name);

                setIsLoggedIn(true);
                setLoginUser(name);
                setLoggedIn(true); // 로그인 상태 true 설정

                navigate(prevUrl, { replace: true });
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        const credentials = { username, password, email };
        fetchLogin(credentials);
    };

    // 장바구니 조회 요청 함수
    const fetchCart = async () => {
        try {
            const response = await fetch("http://192.168.0.26:8080/cart/get", {
                method: 'GET',
                credentials: 'include',  // 쿠키 자동 전송
            });

            if (response.ok) {
                const data = await response.json();
                console.log('장바구니 응답:', data);
                alert('장바구니 조회 성공 (콘솔 확인)');
            } else {
                alert('장바구니 조회 실패');
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    return (
        <div className='로그인'>
            <h1>로그인</h1>
            <form method='post' onSubmit={loginHandler}>
                <p><span className='label'>Username</span><input className='input-class' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='username' /></p>
                <p><span className='label'>Password</span><input className='input-class' type="password" autoComplete='off' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' /></p>
                <input type="submit" value="Login" className='form-btn' />
            </form>

            <div>
                <button className='form-btn' onClick={fetchCart}>
                    장바구니 조회 테스트
                </button>
            </div>

            <div className='social-login'>
                <h2>소셜 로그인</h2>
                <div>
                    <a href="http://192.168.0.16:8080/oauth2/authorization/kakao">
                        <img className='social-icon' src="google_icon.png" alt="kakao" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
