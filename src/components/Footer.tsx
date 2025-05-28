import React from "react";
import { Box, Text, Stack, Group, ActionIcon, } from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandFacebook,
} from "@tabler/icons-react";

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
          <Text c="gray.4" size="sm">
            Shoong | 대표자 : 푸슝파슝 | 사업자번호 : 123-34-56789
          </Text>
          <Text c="gray.4" size="sm">
            통신판매업 : 0000-서울중구-0000호 | 개인정보보호책임자 : 푸슝파슝 |
            이메일 : shoong@shoong.ai
          </Text>
          <Text c="gray.4" size="sm">
            전화번호 : 00-0000-0000 | 주소 : 서울시 중구 을지로 000
          </Text>
          <Group gap="lg" mt="xs" ta="center">
            <Text c="gray.4" size="xs" style={{ cursor: "pointer" }}>
              이용약관
            </Text>
            <Text c="gray.4" size="xs" style={{ cursor: "pointer" }}>
              개인정보처리방침
            </Text>
          </Group>

          {/* SNS 아이콘 */}
          <Group spacing="xs" mt="xs">
            <ActionIcon
              size="lg"
              variant="light"
              color="gray"
              component="a"
              href="https://instagram.com"
              target="_blank"
            >
              <IconBrandInstagram size={20} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              variant="light"
              color="gray"
              component="a"
              href="https://youtube.com"
              target="_blank"
            >
              <IconBrandYoutube size={20} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              variant="light"
              color="gray"
              component="a"
              href="https://facebook.com"
              target="_blank"
            >
              <IconBrandFacebook size={20} />
            </ActionIcon>
          </Group>

          <Text size="xs" mt="sm" c="dimmed">
            © 2025 Shoong. All Rights Reserved.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
