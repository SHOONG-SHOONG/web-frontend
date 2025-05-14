import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";

const JoinForm = () => {
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [name, setname] = useState('');

    const fetchJoin = async (credentials) => {
        try {
            const response = await fetch("http://192.168.0.26:8080/api/join", {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials), // ✅ JSON으로 변환
            });

            if (response.ok) {
                alert("Join Successful");
                navigate("/login", { replace: true });
            } else {
                alert("Join Failed");
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const joinHandler = async (e) => {
        e.preventDefault();
        const credentials = {
            userEmail,
            userPassword,
            userName,
            name,
            userPhone,
            birthDay,
            registrationNumber,
            userAddress,
        };
        fetchJoin(credentials);
    };

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                let fullAddress = data.address;
                let extraAddress = '';

                if (data.addressType === 'R') {
                    if (data.bname !== '') extraAddress += data.bname;
                    if (data.buildingName !== '') extraAddress += `${extraAddress ? ', ' : ''}${data.buildingName}`;
                    fullAddress += extraAddress ? ` (${extraAddress})` : '';
                }

                setUserAddress(fullAddress);
            }
        }).open();
    };

    return (
        <div className="회원가입">
            <h1>회원가입</h1>
            <form onSubmit={joinHandler}>
                <p><span className='label'>아이디</span><input className='input-class' type="text" name="userName" value={userName} placeholder="username" onChange={(e) => setUserName(e.target.value)} /></p>
                <p><span className='label'>비밀번호</span><input className='input-class' type="password" autoComplete="off" name="userPassword" value={userPassword} placeholder="password" onChange={(e) => setUserPassword(e.target.value)} /></p>
                <p><span className='label'>이메일</span><input className='input-class' type="email" name="userEmail" value={userEmail} placeholder="email" onChange={(e) => setUserEmail(e.target.value)} /></p>
                <p><span className='label'>이름</span><input className='input-class' type="text" name="name" value={name} placeholder="name" onChange={(e) => setname(e.target.value)} /></p>
                <p><span className='label'>전화번호</span><input className='input-class' type="text" name="userPhone" value={userPhone} placeholder="010-0000-0000" onChange={(e) => setUserPhone(e.target.value)} /></p>
                <p><span className='label'>생년월일</span><input className='input-class' type="date" name="birthDay" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} /></p>
                <p><span className='label'>사업자 등록 번호</span><input className='input-class' type="text" name="registrationNumber" value={registrationNumber} placeholder="000-00-00000" onChange={(e) => setRegistrationNumber(e.target.value)} /></p>
                <p><span className='label'>주소</span>
                    <input
                        className='input-class'
                        type="text"
                        name="userAddress"
                        value={userAddress}
                        placeholder="주소"
                        onClick={handleAddressSearch}
                        readOnly
                    />
                </p>
                <input type="submit" value="회원가입" className="form-btn" />
            </form>
        </div>
    );
};

export default JoinForm;
