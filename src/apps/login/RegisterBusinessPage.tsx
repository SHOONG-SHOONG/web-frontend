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
  Group, // Group 컴포넌트 추가 (주소 검색 버튼과 입력 필드 정렬용)
} from "@mantine/core";
import {
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconCalendar,
  IconBuilding, // 사업자 관련 아이콘
  IconMapPin,
  IconBuildingStore, // 사업자 아이콘 (이미 로그인 페이지에서 사용됨)
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";

// Daum Postcode API를 위한 전역 선언 (public/index.html에 스크립트를 추가하는 것이 일반적)
declare global {
  interface Window {
    daum: any;
  }
}

export default function RegisterBusinessPage() {
  const navigate = useNavigate();

  // 사업자 회원가입에 필요한 상태들
  const [businessEmail, setBusinessEmail] = useState(""); // 이메일
  const [businessPassword, setBusinessPassword] = useState(""); // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인
  const [businessName, setBusinessName] = useState(""); // 사업자명 (회사 이름)
  const [representativeName, setRepresentativeName] = useState(""); // 대표자 이름
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState(""); // 회사 전화번호
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState(""); // 사업자 등록 번호 (이미지에서 확인)
  const [businessAddress, setBusinessAddress] = useState(""); // 사업장 주소
  const [businessType, setBusinessType] = useState(""); // 업종 (필요 시 추가)

  const fetchBusinessJoin = async (credentials: any) => {
    try {
      const response = await fetch(`${BASE_URL}/business-join`, { // 사업자 회원가입용 엔드포인트 변경 (예시)
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        alert("사업자 회원가입 성공!");
        navigate("/login", { replace: true });
      } else {
        alert("사업자 회원가입 실패!");
        const errorData = await response.json();
        console.error("Business Join Failed:", errorData);
      }
    } catch (error) {
      console.error("Error during business join:", error);
      alert("사업자 회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleBusinessRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (businessPassword !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const credentials = {
      businessEmail,
      businessPassword,
      businessName,
      representativeName,
      businessPhoneNumber,
      businessRegistrationNumber,
      businessAddress,
      businessType, // 필요 시 포함
    };
    await fetchBusinessJoin(credentials);
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
          setBusinessAddress(fullAddress);
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
            사업자 회원가입
          </Text>

          <form onSubmit={handleBusinessRegister}>
            <Stack>
              <TextInput
                label="사업자명"
                placeholder="회사명 또는 상호"
                leftSection={<IconBuildingStore size={16} />}
                value={businessName}
                onChange={(e) => setBusinessName(e.currentTarget.value)}
                required
              />

              <TextInput
                label="대표자 이름"
                placeholder="홍길동"
                leftSection={<IconUser size={16} />}
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.currentTarget.value)}
                required
              />

              <TextInput
                label="이메일"
                placeholder="business@example.com"
                leftSection={<IconMail size={16} />}
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.currentTarget.value)}
                type="email"
                required
              />

              <PasswordInput
                label="비밀번호"
                placeholder="Enter your password"
                leftSection={<IconLock size={16} />}
                value={businessPassword}
                onChange={(e) => setBusinessPassword(e.currentTarget.value)}
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
                  businessPassword !== confirmPassword
                    ? "비밀번호가 일치하지 않습니다."
                    : undefined
                }
              />

              <TextInput
                label="사업자 등록 번호"
                placeholder="000-00-00000"
                leftSection={<IconBuilding size={16} />}
                value={businessRegistrationNumber}
                onChange={(e) =>
                  setBusinessRegistrationNumber(e.currentTarget.value)
                }
                required
              />

              <TextInput
                label="전화번호"
                placeholder="02-1234-5678 또는 010-1234-5678"
                leftSection={<IconPhone size={16} />}
                value={businessPhoneNumber}
                onChange={(e) => setBusinessPhoneNumber(e.currentTarget.value)}
                type="tel"
                required
              />

              {/* 주소 검색 필드 */}
              <Group grow>
                <TextInput
                  label="사업장 주소"
                  placeholder="사업장 주소 검색"
                  leftSection={<IconMapPin size={16} />}
                  value={businessAddress}
                  onClick={handleAddressSearch}
                  readOnly
                  required
                />
              </Group>

              {/* 필요 시 업종 필드 추가 */}
              {/*
              <TextInput
                label="업종"
                placeholder="서비스업, 제조업 등"
                leftSection={<IconCategory size={16} />} // 적절한 아이콘 선택
                value={businessType}
                onChange={(e) => setBusinessType(e.currentTarget.value)}
              />
              */}

              <Button fullWidth mt="xl" color="blue" type="submit">
                사업자 계정 만들기
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