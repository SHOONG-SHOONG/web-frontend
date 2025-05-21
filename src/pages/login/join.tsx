import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Group,
  Text,
  Anchor,
  Center,
  Stack,
  Divider,
} from "@mantine/core";
import { IconMail, IconLock, IconUser, IconPhone, IconCalendar, IconBuilding, IconMapPin } from "@tabler/icons-react"; // 필요한 아이콘 추가
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";

// Daum Postcode API를 위한 전역 선언 (선택 사항, public/index.html에 스크립트를 추가하는 것이 더 일반적입니다.)
declare global {
  interface Window {
    daum: any;
  }
}

export default function RegisterUserPage() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 필드 추가
  const [userName, setUserName] = useState(''); // 가입 시 사용할 사용자 아이디 (username)
  const [name, setName] = useState(''); // 사용자의 실제 이름
  const [userPhone, setUserPhone] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState(''); // 사업자 등록 번호 (사용자 가입에서는 사용되지 않을 수 있지만, JoinForm에서 가져왔습니다)
  const [userAddress, setUserAddress] = useState('');


  const fetchJoin = async (credentials: any) => {
    try {
      const response = await fetch(`${BASE_URL}/join`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials), // JSON으로 변환
      });

      if (response.ok) {
        alert("회원가입 성공!");
        navigate("/login", { replace: true });
      } else {
        alert("회원가입 실패!");
        // 실패 시 서버 응답 메시지를 확인하여 사용자에게 더 구체적인 피드백을 줄 수 있습니다.
        const errorData = await response.json();
        console.error("Join Failed:", errorData);
      }
    } catch (error) {
      console.error("Error during join:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userPassword !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const credentials = {
      userEmail,
      userPassword,
      userName, // 아이디
      name, // 실제 이름
      userPhone,
      birthDay,
      registrationNumber, // 사용자 가입 시 필요 없으면 제거하거나 빈 문자열로 유지
      userAddress,
    };
    await fetchJoin(credentials);
  };

  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
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
    } else {
      alert("다음 주소 검색 API 스크립트가 로드되지 않았습니다.");
      console.error("Daum Postcode API script not loaded.");
    }
  };

  return (
    <Center h="100vh">
      <Paper shadow="md" p={30} radius="md" withBorder w={400}>
        <Text size="xl" fw={700} ta="center" mt="md" mb="lg">
          회원가입
        </Text>

        <form onSubmit={handleRegister}>
          <Stack>
            <TextInput
              label="아이디"
              placeholder="username"
              leftSection={<IconUser size={16} />}
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
              required
            />

            <PasswordInput
              label="비밀번호"
              placeholder="Enter your password"
              leftSection={<IconLock size={16} />}
              value={userPassword}
              onChange={(e) => setUserPassword(e.currentTarget.value)}
              required
            />

            <PasswordInput
              label="비밀번호 확인"
              placeholder="Enter your password again"
              leftSection={<IconLock size={16} />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              required
              error={userPassword !== confirmPassword ? "비밀번호가 일치하지 않습니다." : undefined}
            />

            <TextInput
              label="이메일"
              placeholder="example@gmail.com"
              leftSection={<IconMail size={16} />}
              value={userEmail}
              onChange={(e) => setUserEmail(e.currentTarget.value)}
              type="email"
              required
            />

            <TextInput
              label="이름"
              placeholder="홍길동"
              leftSection={<IconUser size={16} />}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
            />

            <TextInput
              label="전화번호"
              placeholder="010-1234-5678"
              leftSection={<IconPhone size={16} />}
              value={userPhone}
              onChange={(e) => setUserPhone(e.currentTarget.value)}
              type="tel" // 전화번호 타입
              required
            />

            <TextInput
              label="생년월일"
              placeholder="YYYY-MM-DD"
              leftSection={<IconCalendar size={16} />}
              value={birthDay}
              onChange={(e) => setBirthDay(e.currentTarget.value)}
              type="date" // 날짜 입력 타입
              required
            />

            {/* 사용자 가입 시 사업자 등록 번호가 필요 없다면 이 필드는 제거하거나 주석 처리하세요. */}
            <TextInput
              label="사업자 등록 번호"
              placeholder="000-00-00000"
              leftSection={<IconBuilding size={16} />}
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.currentTarget.value)}
              // required={false} // 사용자 가입 시 필수가 아님
            />

            <Group grow> {/* 주소 검색 버튼과 입력 필드를 같은 줄에 정렬 */}
              <TextInput
                label="주소"
                placeholder="주소 검색"
                leftSection={<IconMapPin size={16} />}
                value={userAddress}
                onClick={handleAddressSearch}
                readOnly // 사용자가 직접 입력하지 못하도록 읽기 전용
                required
              />
              <Button onClick={handleAddressSearch} variant="light">
                주소 검색
              </Button>
            </Group>


            <Button fullWidth mt="xl" color="blue" type="submit">
              계정 만들기
            </Button>
          </Stack>
        </form>

        <Divider my="lg" />

        <Text size="sm" ta="center">
          이미 계정이 있으신가요?{" "}
          <Anchor component="button" onClick={() => navigate("/login")}>
            로그인
          </Anchor>
        </Text>
      </Paper>
    </Center>
  );
}