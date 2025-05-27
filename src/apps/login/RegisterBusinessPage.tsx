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
  Group,
  FileInput,
} from "@mantine/core";
import {
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconBuilding,
  IconMapPin,
  IconBuildingStore,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
import React from "react";

// Daum Postcode API를 위한 전역 선언 (public/index.html에 스크립트를 추가하는 것이 일반적)
declare global {
  interface Window {
    daum: any;
  }
}

export default function RegisterBusinessPage() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandImageFile, setBrandImageFile] = useState<File | null>(null);


  const fetchBusinessJoin = async (credentials: any) => {
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
      registrationNumber,
      userAddress,
    };
    await fetchBusinessJoin(credentials);
    await fetchBrandRegister();
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

  const fetchBrandRegister = async () => {
    if (!brandImageFile) {
      alert("브랜드 이미지를 등록해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", brandImageFile);

    try {
      const response = await fetch(
        `${BASE_URL}/brand/create?name=${encodeURIComponent(brandName)}&description=${encodeURIComponent(brandDescription)}`,
        {
          method: "POST",
          headers: {
            access: localStorage.getItem("access") || "",
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("브랜드 등록 실패");

      alert("브랜드가 등록되었습니다.");
    } catch (err) {
      console.error("브랜드 등록 에러:", err);
      alert("브랜드 등록에 실패했습니다.");
    }
  };



  return (
    <Container size="xs" my={60}>
      <Flex justify="center">
        <Paper p={30} radius="md" w="100%" miw={320} maw={500}>
          <Text size="xl" fw={700} ta="center" mt="md" mb="lg">
            사업자 회원가입
          </Text>

          <form onSubmit={handleBusinessRegister}>
            <Stack>
              <TextInput
                size="md"
                radius="sm"
                label="사업자명"
                placeholder="회사명 또는 상호"
                leftSection={<IconBuildingStore size={16} />}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
              />

              <TextInput
                size="md"
                radius="sm"
                label="대표자 이름"
                placeholder="홍길동"
                leftSection={<IconUser size={16} />}
                value={userName}
                onChange={(e) => setUserName(e.currentTarget.value)}
                required
              />

              <TextInput
                size="md"
                radius="sm"
                label="이메일"
                placeholder="business@example.com"
                leftSection={<IconMail size={16} />}
                value={userEmail}
                onChange={(e) => setUserEmail(e.currentTarget.value)}
                type="email"
                required
              />

              <PasswordInput
                size="md"
                radius="sm"
                label="비밀번호"
                placeholder="비밀번호"
                leftSection={<IconLock size={16} />}
                value={userPassword}
                onChange={(e) => setUserPassword(e.currentTarget.value)}
                required
              />

              <PasswordInput
                size="md"
                radius="sm"
                label="비밀번호 확인"
                placeholder="비밀번호 확인"
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
                size="md"
                radius="sm"
                label="사업자 등록 번호"
                placeholder="000-00-00000"
                leftSection={<IconBuilding size={16} />}
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.currentTarget.value)}
                required
              />

              <TextInput
                size="md"
                radius="sm"
                label="전화번호"
                placeholder="02-1234-5678 또는 010-1234-5678"
                leftSection={<IconPhone size={16} />}
                value={userPhone}
                onChange={(e) => setUserPhone(e.currentTarget.value)}
                type="tel"
                required
              />

              {/* 주소 검색 필드 */}
              <Group grow>
                <TextInput
                  size="md"
                  radius="sm"
                  label="사업장 주소"
                  placeholder="사업장 주소 검색"
                  leftSection={<IconMapPin size={16} />}
                  value={userAddress}
                  onClick={handleAddressSearch}
                  readOnly
                  required
                />
              </Group>

              <TextInput
                size="md"
                radius="sm"
                label="브랜드명"
                placeholder="브랜드명"
                value={brandName}
                onChange={(e) => setBrandName(e.currentTarget.value)}
                required
              />

              <TextInput
                size="md"
                radius="sm"
                label="브랜드 설명"
                placeholder="브랜드에 대한 설명"
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.currentTarget.value)}
                required
              />

              <FileInput
                size="md"
                radius="sm"
                label="브랜드 대표 이미지"
                placeholder="이미지를 업로드하세요"
                value={brandImageFile}
                onChange={setBrandImageFile}
                accept="image/png,image/jpeg"
                required
              />


              <Button
                fullWidth
                mt="xl"
                type="submit"
                variant="filled"
                color="rgba(0, 0, 0, 1)"
              >
                사업자 계정 만들기
              </Button>
            </Stack>
          </form>

          <Divider my="lg" />

          <Text size="sm" ta="center">
            이미 계정이 있으신가요?{" "}
            <Anchor
              component="button"
              onClick={() => navigate("/login")}
              c="gray"
            >
              로그인
            </Anchor>
          </Text>
        </Paper>
      </Flex>
    </Container>
  );
}
