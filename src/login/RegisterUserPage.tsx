import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Text,
  Anchor,
  Stack,
  Divider,
  Container,
  Flex,
} from "@mantine/core";
import {
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconCalendar,
  IconBuilding,
  IconMapPin,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

declare global {
  interface Window {
    daum: any;
  }
}

export default function RegisterUserPage() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [userAddress, setUserAddress] = useState("");

  const fetchJoin = async (credentials: any) => {
    try {
      const response = await fetch(`${BASE_URL}/join`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        alert("회원가입 성공!");
        navigate("/login", { replace: true });
      } else {
        alert("회원가입 실패!");
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
      userName,
      name,
      userPhone,
      birthDay,
      registrationNumber,
      userAddress,
    };
    await fetchJoin(credentials);
  };

  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          let fullAddress = data.address;
          let extraAddress = "";

          if (data.addressType === "R") {
            if (data.bname !== "") extraAddress += data.bname;
            if (data.buildingName !== "")
              extraAddress += `${extraAddress ? ", " : ""}${data.buildingName}`;
            fullAddress += extraAddress ? ` (${extraAddress})` : "";
          }
          setUserAddress(fullAddress);
        },
      }).open();
    } else {
      alert("다음 주소 검색 API 스크립트가 로드되지 않았습니다.");
      console.error("Daum Postcode API script not loaded.");
    }
  };

  return (
    <Container size="xs" my={60}>
      <Flex justify="center">
        <Paper
          shadow="md"
          p={30}
          radius="md"
          withBorder
          w="100%"
          miw={320}
          maw={500}
        >
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
                error={
                  userPassword !== confirmPassword
                    ? "비밀번호가 일치하지 않습니다."
                    : undefined
                }
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
                type="tel"
                required
              />

              <TextInput
                label="생년월일"
                placeholder="YYYY-MM-DD"
                leftSection={<IconCalendar size={16} />}
                value={birthDay}
                onChange={(e) => setBirthDay(e.currentTarget.value)}
                type="date"
                required
              />


              <TextInput
                label="주소"
                placeholder="주소 검색"
                leftSection={<IconMapPin size={16} />}
                value={userAddress}
                onClick={handleAddressSearch}
                readOnly
                required
              />

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
      </Flex>
    </Container>
  );
}
