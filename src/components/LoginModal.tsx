import React from "react";
import { Modal, Button, Text, Stack, Center } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function LoginModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton
      centered
      radius="md"
      size="md"
    >
      <Stack align="center">
        <Text
          size="40px"
          className="tossface emoji-wiggle"
          onClick={() => navigate("/login")}
        >
          🔒
        </Text>
        <Text fz="lg" fw={700} ta="center" mb={20}>
          로그인 후 이용 가능한 기능입니다
        </Text>

        <Button
          size="md"
          variant="light"
          color="indigo"
          w={280}
          radius="xl"
          mb={20}
          onClick={() => navigate("/login")}
        >
          로그인 페이지로 이동하기
        </Button>
      </Stack>
    </Modal>
  );
}
