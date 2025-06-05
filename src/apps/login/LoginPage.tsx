import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Group,
  Text,
  Tabs,
  Divider,
  Anchor,
  Center,
  Stack,
  Flex,
  Box,
} from "@mantine/core";
import { IconUser, IconLock, IconBuildingStore } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../../contexts/AuthContext.tsx";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import BASE_URL from "../../config.js";
import React from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn, setLoginUser } = useLogin();

  const prevUrl = location.state || "/";
  const [tab, setTab] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("서버에서 받은 이름:", data.name);
        const { name, brandName, userStatus } = data;

        window.localStorage.setItem("userStatus", userStatus);

        if (data.userStatus === "PENDING") {
          setErrorMessage("가입 승인 대기 중입니다. 관리자 승인을 기다려주세요.");
          return;
        }

        if (data.userStatus === "INACTIVE") {
          setErrorMessage("비활성화된 계정입니다. 관리자에게 문의하세요.");
          return;
        }

        window.localStorage.setItem(
          "access",
          response.headers.get("access") || ""
        );
        window.localStorage.setItem("name", encodeURIComponent(name));

        setIsLoggedIn(true);
        setLoginUser(name);

        // alert("로그인 성공!");

        if (data.name.toLowerCase() === "admin") {
          navigate("/admin"); // 관리자 페이지로 이동
          return; // 더 이상 아래 코드 실행되지 않도록 종료
        }
        // 사업자 로그인
        if (tab === "biz") {
          if (!brandName) {
            navigate("/seller/mypage", { replace: true }); // 브랜드 등록
          } else {
            navigate("/seller", { replace: true }); // 셀러 메인
          }
        } else {
          navigate(prevUrl, { replace: true }); // 사용자
        }
      } else if (response.status === 401) {
        setErrorMessage("아이디 또는 비밀번호가 다릅니다.");
      } else {
        alert("로그인에 실패했습니다. 관리자에게 문의하세요.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchLogin({ username, password });
  };

  return (
    <>
      {/* Header */}
      <HeaderComponent />
      <Center h="100vh">
        <Paper p={30} radius="md" w={500}>
          <Text size="30px" fw={600} ta="center" mb="40">
            SHOONG LOG-IN
          </Text>

          <Tabs
            mt="md"
            mb="lg"
            color="rgba(0, 0, 0, 1)"
            variant="pills"
            radius="sm"
            defaultValue="gallery"
            value={tab}
            onChange={(value) => {
              if (value !== null) setTab(value);
            }}
          >
            <Tabs.List grow>
              <Tabs.Tab value="user" leftSection={<IconUser size={20} />}>
                사용자
              </Tabs.Tab>
              <Tabs.Tab value="biz" leftSection={<IconBuildingStore size={20} />}>
                사업자
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <form onSubmit={loginHandler}>
            <Stack>
              <TextInput
                size="md"
                radius="sm"
                label="아이디"
                placeholder="id"
                leftSection={<IconUser size={16} />}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
              />

              <PasswordInput
                size="md"
                radius="sm"
                label="비밀번호"
                placeholder="password"
                leftSection={<IconLock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />

              <Group justify="space-between" mt="xs">
                {/* 왼쪽 묶음 */}
                <Box>
                  {errorMessage && (
                    <Text color="red" size="sm">
                      {errorMessage}
                    </Text>
                  )}
                </Box>

                {/* 오른쪽 링크 */}
                <Anchor href="#" size="sm" c="gray">
                  비밀번호 찾기
                </Anchor>
              </Group>

              <Button
                fullWidth
                mt="md"
                variant="filled"
                color="rgba(0, 0, 0, 1)"
                type="submit"
                h={45}
              >
                로그인
              </Button>

              <Button
                fullWidth
                color="#FEE500"
                component="a"
                href={`${BASE_URL}/oauth2/authorization/kakao`}
                leftSection={
                  <img
                    // public 디렉토리 기준의 절대 경로로 다시 한번 확인하고 수정하세요!
                    // 예: /kakao_login_medium_narrow.png
                    src="/kakao_login_medium_wide.png" // <<< 이 부분은 실제 이미지 경로에 맞게
                    alt="Kakao"
                    // width={18} 속성을 제거합니다.
                    style={{
                      width: '100%',     // 부모 요소의 너비를 꽉 채움
                      height: '100%',    // 부모 요소의 높이를 꽉 채움
                      objectFit: 'cover', // <<< 이 부분을 'cover'로 설정!
                      // 추가: 이미지가 부모 요소의 좌우 중앙에 오도록 할 수 있습니다. (flexbox 환경에서)
                      // Mantine의 leftSection이 flexbox를 사용한다면 이미지가 자연스럽게 중앙 정렬될 수 있습니다.
                    }}
                  />
                }
                style={{ background: "#FEE500", color: "black" }}
                h={45} // 버튼의 높이 (이미지가 들어갈 공간의 높이에 영향)
              >
              </Button>
            </Stack>
          </form>

          <Divider my="lg" />

          <Text size="sm" ta="center">
            계정이 없으신가요?{" "}
            <Anchor
              component={Link}
              to={tab === "biz" ? "/register-business" : "/register"}
              c="gray"
            >
              회원가입
            </Anchor>
          </Text>
        </Paper>
      </Center>

      {/* Footer */}
      <FooterComponent />
    </>
  );
}
