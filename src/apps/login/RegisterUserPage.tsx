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
  Collapse,
  Box,
  Checkbox,
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
import BASE_URL from "../../config";
import React from "react";

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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [openedTerms, setOpenedTerms] = useState(false);
  const [openedPrivacy, setOpenedPrivacy] = useState(false);

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
        <Paper p={30} radius="md" w="100%" miw={320} maw={500}>
          <Text size="xl" fw={700} ta="center" mt="md" mb="lg">
            회원가입
          </Text>

          <form onSubmit={handleRegister}>
            <Stack>
              <TextInput
                size="md"
                radius="sm"
                label="아이디"
                placeholder="username"
                leftSection={<IconUser size={16} />}
                value={userName}
                onChange={(e) => setUserName(e.currentTarget.value)}
                required
              />

              <PasswordInput
                size="md"
                radius="sm"
                label="비밀번호"
                placeholder="Enter your password"
                leftSection={<IconLock size={16} />}
                value={userPassword}
                onChange={(e) => setUserPassword(e.currentTarget.value)}
                required
              />

              <PasswordInput
                size="md"
                radius="sm"
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
                size="md"
                radius="sm"
                label="이메일"
                placeholder="example@gmail.com"
                leftSection={<IconMail size={16} />}
                value={userEmail}
                onChange={(e) => setUserEmail(e.currentTarget.value)}
                type="email"
                required
              />

              <TextInput
                size="md"
                radius="sm"
                label="이름"
                placeholder="홍길동"
                leftSection={<IconUser size={16} />}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
              />

              <TextInput
                size="md"
                radius="sm"
                label="전화번호"
                placeholder="010-1234-5678"
                leftSection={<IconPhone size={16} />}
                value={userPhone}
                onChange={(e) => setUserPhone(e.currentTarget.value)}
                type="tel"
                required
              />

              <TextInput
                size="md"
                radius="sm"
                label="생년월일"
                placeholder="YYYY-MM-DD"
                leftSection={<IconCalendar size={16} />}
                value={birthDay}
                onChange={(e) => setBirthDay(e.currentTarget.value)}
                type="date"
                required
              />

              <TextInput
                size="md"
                radius="sm"
                label="주소"
                placeholder="주소 검색"
                leftSection={<IconMapPin size={16} />}
                value={userAddress}
                onClick={handleAddressSearch}
                readOnly
                required
              />

              <Divider my="xs" label="약관 동의" labelPosition="center" />

              <Stack spacing={4}>
                {/* 서비스 이용약관 */}
                <Flex direction="column">
                  <Flex align="center">
                    <Checkbox
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.currentTarget.checked)}
                      required
                    />
                    <Text size="sm" ml="xs">
                      <b>[필수]</b> 서비스 이용약관에 동의합니다.
                      <Anchor component="button" ml="sm" c="blue" onClick={() => setOpenedTerms((o) => !o)}>
                        더보기
                      </Anchor>
                    </Text>
                  </Flex>
                  <Collapse in={openedTerms}>
                    <Box bg="gray.1" p="sm" mt="xs" style={{ borderRadius: 6, fontSize: "13px" }}>
                      이 약관은 회사가 제공하는 모든 서비스에 적용됩니다. <br />
                      사용자는 서비스를 이용함에 있어 관련 법령을 준수해야 하며, 불법적이거나 부적절한 행위에 대한 책임은 사용자 본인에게 있습니다. <br />
                      자세한 사항은 회사 홈페이지 또는 고객센터를 통해 확인할 수 있습니다.
                    </Box>
                  </Collapse>
                </Flex>

                {/* 개인정보 수집 및 이용 동의 */}
                <Flex direction="column">
                  <Flex align="center">
                    <Checkbox
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.currentTarget.checked)}
                      required
                    />
                    <Text size="sm" ml="xs">
                      <b>[필수]</b> 개인정보 수집 및 이용에 동의합니다.
                      <Anchor component="button" ml="sm" c="blue" onClick={() => setOpenedPrivacy((o) => !o)}>
                        더보기
                      </Anchor>
                    </Text>
                  </Flex>
                  <Collapse in={openedPrivacy}>
                    <Box bg="gray.1" p="sm" mt="xs" style={{ borderRadius: 6, fontSize: "13px" }}>
                      수집 항목: 이름, 이메일, 전화번호, 주소 등 회원가입 및 서비스 제공에 필요한 정보 <br />
                      수집 목적: 회원 식별, 서비스 제공, 고객 대응 <br />
                      보유 기간: 회원 탈퇴 후 최대 5일까지 보관 후 삭제합니다.
                    </Box>
                  </Collapse>
                </Flex>

                {/* 선택 항목 */}
                <Flex align="center">
                  <Checkbox
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.currentTarget.checked)}
                  />
                  <Text size="sm" ml="xs">
                    <b>[선택]</b> 마케팅 정보 수신에 동의합니다.
                  </Text>
                </Flex>
              </Stack>

              <Button
                fullWidth
                mt="md"
                variant="filled"
                color="rgba(0, 0, 0, 1)"
                type="submit"
                h={45}
              >
                계정 만들기
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
