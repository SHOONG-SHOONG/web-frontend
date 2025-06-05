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
  Stepper,
  Collapse,
  Box,
  Checkbox,
} from "@mantine/core";
import {
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconBuilding,
  IconMapPin,
  IconBuildingStore,
  IconBrandRedhat,
  IconCheck,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
import React from "react";
import { showNotification } from "@mantine/notifications";

// Daum Postcode API를 위한 전역 선언 (public/index.html에 스크립트를 추가하는 것이 일반적)
declare global {
  interface Window {
    daum: any;
  }
}

export default function RegisterBusinessPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleNextStep = () => {
    if (
      !agreeTerms ||
      !agreePrivacy
    ) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    setErrorMessage("");
    setActive(1);
  };

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
        // alert("판매자 회원가입 성공!");
        navigate("/seller/notification", { replace: true });
      } else {
        // alert("판매자 회원가입 실패!");
        const errorData = await response.json();
        console.error("Business Join Failed:", errorData);
        showNotification({
          title: "가입 실패",
          message: errorData.message || "판매자 회원가입에 실패했습니다.",
          color: "red",
          autoClose: 3000, // 3초 뒤 자동 종료
        });
      }
    } catch (error) {
      console.error("Error during business join:", error);
      // alert("판매자 회원가입 중 오류가 발생했습니다.");
      showNotification({
        title: "오류 발생",
        message: "판매자 회원가입 중 문제가 발생했습니다.",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleBusinessRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userPassword !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      alert("필수 항목에 동의해주세요.");
      return;
    }

    if ((name?.trim().toLowerCase() || "") === "admin") {
      setErrorMessage("admin 아이디는 사용할 수 없습니다.");
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
            판매자 회원가입
          </Text>

          <Stepper active={active} onStepClick={setActive} breakpoint="sm" size="sm" my="xl">
            <Stepper.Step icon={<IconCheck size={18} />} label="1단계" description="약관동의" />
            <Stepper.Step icon={<IconUser size={18} />} label="2단계" description="기본 정보 입력" />
            <Stepper.Completed><Text ta="center" fw={500}>가입이 완료되었습니다.</Text></Stepper.Completed>
          </Stepper>

          <form onSubmit={handleBusinessRegister}>
            <Stack>
              {active === 0 && (
                <>
                  <Divider my="xs" label="약관 동의" labelPosition="center" />

                  <Stack spacing={4}>
                    {/* 서비스 이용약관 */}
                    <Flex direction="column">
                      <Flex align="center" mb="xs">
                        <Checkbox
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.currentTarget.checked)}
                          required
                        />
                        <Text size="sm" ml="xs">
                          <b>[필수]</b> 서비스 이용약관에 동의합니다.
                        </Text>
                      </Flex>
                      <Box bg="gray.1" p="sm" style={{ borderRadius: 6, fontSize: "13px" }}>
                        이 약관은 회사가 제공하는 모든 서비스에 적용됩니다. <br />
                        사용자는 서비스를 이용함에 있어 관련 법령을 준수해야 하며, 불법적이거나 부적절한 행위에 대한 책임은 사용자 본인에게 있습니다. <br />
                        자세한 사항은 회사 홈페이지 또는 고객센터를 통해 확인할 수 있습니다.
                      </Box>
                    </Flex>

                    {/* 개인정보 수집 및 이용 동의 */}
                    <Flex direction="column" mt="sm">
                      <Flex align="center" mb="xs">
                        <Checkbox
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.currentTarget.checked)}
                          required
                        />
                        <Text size="sm" ml="xs">
                          <b>[필수]</b> 개인정보 수집 및 이용에 동의합니다.
                        </Text>
                      </Flex>
                      <Box bg="gray.1" p="sm" style={{ borderRadius: 6, fontSize: "13px" }}>
                        수집 항목: 이름, 이메일, 전화번호, 주소 등 회원가입 및 서비스 제공에 필요한 정보 <br />
                        수집 목적: 회원 식별, 서비스 제공, 고객 대응 <br />
                        보유 기간: 회원 탈퇴 후 최대 5일까지 보관 후 삭제합니다.
                      </Box>
                    </Flex>

                    {/* 선택 항목 */}
                    <Flex align="center" mt="sm">
                      <Checkbox
                        checked={agreeMarketing}
                        onChange={(e) => setAgreeMarketing(e.currentTarget.checked)}
                      />
                      <Text size="sm" ml="xs">
                        <b>[선택]</b> 마케팅 정보 수신에 동의합니다.
                      </Text>
                    </Flex>
                  </Stack>
                  <Button fullWidth mt="xl" color="rgba(0, 0, 0, 1)" onClick={handleNextStep}>
                    다음
                  </Button>
                </>
              )}

              {active === 1 && (
                <>
                  <TextInput
                    size="md"
                    radius="sm"
                    label="사업자명(아이디)"
                    placeholder="회사명 또는 상호"
                    leftSection={<IconBuildingStore size={16} />}
                    value={userName}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      // 한글 제거
                      const onlyAlphaNumeric = value.replace(/[^a-zA-Z0-9]/g, "");
                      setUserName(onlyAlphaNumeric);
                    }}
                    required
                  />

                  {/* 에러 메시지 출력 */}
                  {errorMessage && (
                    <Text color="red" size="sm" mt="xs">
                      {errorMessage}
                    </Text>
                  )}

                  <TextInput
                    size="md"
                    radius="sm"
                    label="대표자 이름"
                    placeholder="홍길동"
                    leftSection={<IconUser size={16} />}
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
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

                  <Text size="sm" c="dimmed" mt="sm">
                    가입 신청이 완료되면 관리자의 승인 후 가입이 완료됩니다. 승인 결과는 이메일로 안내드립니다.
                  </Text>

                  <Button
                    fullWidth
                    mt="xl"
                    type="submit"
                    variant="filled"
                    color="rgba(0, 0, 0, 1)"
                  >
                    사업자 계정 만들기
                  </Button>
                </>
              )}
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