import { useState } from "react";
import { Link } from 'react-router-dom';
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
} from "@mantine/core";
import { IconUser, IconLock, IconBuildingStore } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext.tsx";
import BASE_URL from "../config.js";


export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn, setLoginUser } = useLogin();

  const prevUrl = location.state || "/";
  const [tab, setTab] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const fetchLogin = async (credentials: { username: string; password: string }) => {
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
        const { name } = data;

        window.localStorage.setItem("access", response.headers.get("access") || "");
        window.localStorage.setItem("name", name);

        setIsLoggedIn(true);
        setLoginUser(name);

        alert("Login successful");
        navigate(prevUrl, { replace: true });
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchLogin({ username, password });
  };

  return (
    <Center h="100vh">
      <Paper shadow="md" p={30} radius="md" withBorder w={400}>
        <Tabs
          value={tab}
          onChange={(value) => {
            if (value !== null) setTab(value);
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="user" leftSection={<IconUser size={14} />}>
              사용자
            </Tabs.Tab>
            <Tabs.Tab value="biz" leftSection={<IconBuildingStore size={14} />}>
              사업자
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <Text size="xl" fw={700} ta="center" mt="md" mb="lg">
          로그인
        </Text>

        <form onSubmit={loginHandler}>
          <Stack>
            <TextInput
              label="사용자 아이디"
              placeholder="your-username"
              leftSection={<IconUser size={16} />}
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />

            <PasswordInput
              label="비밀번호"
              placeholder="Enter your password"
              leftSection={<IconLock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />

            <Group justify="space-between" mt="xs">
              <div />
              <Anchor href="#" size="sm">
                비밀번호 찾기
              </Anchor>
            </Group>

            <Button fullWidth mt="md" color="blue" type="submit">
              로그인
            </Button>

            <Button
              fullWidth
              color="yellow"
              mt="sm"
              component="a"
              href={`${BASE_URL}/oauth2/authorization/kakao`}
              leftSection={
                <img
                  src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                  width={18}
                  alt="Kakao"
                />
              }
              style={{ color: "black" }}
            >
              카카오로 로그인
            </Button>
          </Stack>
        </form>

        <Divider my="lg" />

        <Text size="sm" ta="center">
          계정이 없으신가요?{" "}
          <Anchor
            component={Link}
            to={tab === "biz" ? "/register-business" : "/register"}
          >
            회원가입
          </Anchor>
        </Text>

      </Paper>
    </Center>
  );
}