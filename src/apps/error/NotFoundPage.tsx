import { Button, Container, Text, Title, Stack, Center } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";

export const PlaneEmoji = () => (
  <motion.span
    className="tossface"
    animate={{ rotate: [0, -5, 5, -5, 0] }}
    transition={{ duration: 3, repeat: Infinity }}
    style={{ fontSize: "64px" }}
  >
    ✈️
  </motion.span>
);

export const CloudEmoji = () => (
  <motion.span
    className="tossface"
    animate={{ y: [0, -6, 0, 6, 0] }}
    transition={{ duration: 4, repeat: Infinity }}
    style={{ fontSize: "64px" }}
  >
    ☁️
  </motion.span>
);

export const LuggageEmoji = () => (
  <motion.span
    className="tossface"
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 2.5, repeat: Infinity }}
    style={{ fontSize: "64px" }}
  >
    🧳
  </motion.span>
);

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <HeaderComponent />
      <Container size="sm" py={80}>
        <Center>
          <Stack align="center">
            <Text fz={64}>
              <PlaneEmoji /> <CloudEmoji /> <LuggageEmoji />
            </Text>
            <Title order={2}>요청하신 페이지를 찾을 수 없습니다</Title>
            <Text ta="center" c="dimmed">
              주소가 잘못되었거나
              <br />
              여행지처럼 사라진 페이지예요.
            </Text>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              color="black"
            >
              메인으로 돌아가기
            </Button>
          </Stack>
        </Center>
      </Container>

      {/* Footer */}
      <FooterComponent />
    </>
  );
}
