import { Button, Container, Text, Title, Stack, Center } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeaderComponent from "../../../components/Header.tsx";
import FooterComponent from "../../../components/Footer.tsx";

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

export default function SellerNotificationPage() {
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
            <Title order={2}>SHOONG에 가입해주셔서 감사합니다</Title>
            <Text ta="center" c="dimmed">
              검토 후 이메일로 가입 승인 메일을 보내드릴게요
              <br />
              최대 1영업일이 소요됩니다
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
