import React from "react";
import { Box, Text, Stack, Group, Anchor } from "@mantine/core";

export default function FooterComponent() {
  return (
    <Box bg="black" c="white" py="xl" mt="xl" w="100%" h={350}>
      <Box
        ta="center"
        style={{
          maxWidth: "100%",
          padding: "0 24px",
          margin: "0 auto",
        }}
      >
        <Stack gap="xs">
          <Text fw={700} size="lg">
            Shoong
          </Text>
          <Text size="sm">
            Shoong | 대표자 : 김슝 | 사업자번호 : 123-34-56789
          </Text>
          <Text size="sm">
            통신판매업 : 0000-서울중구-0000호 | 개인정보보호책임자 : 김슝 |
            이메일 : shoong@shoong.ai
          </Text>
          <Text size="sm">
            전화번호 : 00-0000-0000 | 주소 : 서울시 중구 을지로 000
          </Text>
          <Group gap="lg" mt="xs" ta="center">
            <Anchor href="#" c="white" size="xs">
              이용약관
            </Anchor>
            <Anchor href="#" c="white" size="xs">
              개인정보처리방침
            </Anchor>
          </Group>
          <Text size="xs" mt="sm" c="dimmed">
            © 2024 Shoong. All Rights Reserved.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
