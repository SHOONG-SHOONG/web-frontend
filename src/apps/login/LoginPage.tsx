import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useLogin } from "../../contexts/AuthContext.tsx";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import BASE_URL from "../../config.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setIsLoggedIn, setLoginUser, setRole } = useLogin();

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
        const { name, brandName, userStatus } = data;

        if (userStatus === "PENDING") {
          setErrorMessage(
            "가입 승인 대기 중입니다. 관리자 승인을 기다려주세요."
          );
          return;
        }

        if (userStatus === "INACTIVE") {
          setErrorMessage("비활성화된 계정입니다. 관리자에게 문의하세요.");
          return;
        }

        window.localStorage.setItem(
          "access",
          response.headers.get("access") || ""
        );
        window.localStorage.setItem("name", encodeURIComponent(name));
        window.localStorage.setItem("userStatus", userStatus);

        // role 지정: ADMIN, STREAMER, CLIENT
        const role =
          name.toLowerCase() === "admin"
            ? "ADMIN"
            : tab === "biz"
              ? "STREAMER"
              : "CLIENT";

        window.localStorage.setItem("role", role);
        setRole(role);

        setIsLoggedIn(true);
        setLoginUser(name);

        // 이동
        if (role === "ADMIN") {
          navigate("/admin");
        } else if (role === "STREAMER") {
          if (!brandName) {
            navigate("/seller/mypage", { replace: true }); // 브랜드 등록 필요
          } else {
            navigate("/seller", { replace: true });
          }
        } else {
          navigate(prevUrl, { replace: true });
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
            value={tab}
            onChange={(value) => value && setTab(value)}
          >
            <Tabs.List grow>
              <Tabs.Tab value="user" leftSection={<IconUser size={20} />}>
                사용자
              </Tabs.Tab>
              <Tabs.Tab
                value="biz"
                leftSection={<IconBuildingStore size={20} />}
              >
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
                <Box>
                  {errorMessage && (
                    <Text color="red" size="sm">
                      {errorMessage}
                    </Text>
                  )}
                </Box>
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
                    src="/kakao_login_medium_wide.png"
                    alt="Kakao"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                }
                style={{ background: "#FEE500", color: "black" }}
                h={45}
              />
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
      <FooterComponent />
    </>
  );
}
