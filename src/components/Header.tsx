import React, { useState } from "react";
import { Box, Flex, Text, Group, Anchor } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const menus = [
  { label: "홈", value: "home" },
  { label: "카테고리", value: "category" },
  { label: "라이브", value: "live" },
];

export default function HeaderComponent() {
  const [active, setActive] = useState("home");

  return (
    <Box px="lg" py="xs" style={{ borderBottom: "1px solid #eee" }}>
      <Flex justify="space-between" align="center">
        {/* 왼쪽: 로고 */}
        <Box w={190}>
          <Text fw={900} size="lg" c="blue">
            Shoong
          </Text>
        </Box>

        {/* 중앙: Anchor 기반 메뉴 */}
        <Box style={{ flex: 1 }}>
          <Group justify="center" gap="lg">
            {menus.map((menu) => (
              <Anchor
                key={menu.value}
                component="button"
                size="md"
                fw={active === menu.value ? 700 : 500}
                c={active === menu.value ? "blue" : "gray"}
                style={{
                  borderBottom:
                    active === menu.value ? "2px solid #3B61FF" : "none",
                  paddingBottom: 4,
                }}
                onClick={() => setActive(menu.value)}
              >
                {menu.label}
              </Anchor>
            ))}
          </Group>
        </Box>

        {/* 오른쪽: 검색 및 로그인 메뉴 */}
        <Group gap="sm" w={190} justify="flex-end">
          <IconSearch size={16} />
          <Anchor href="#" underline="never" c="gray" size="sm">
            로그인
          </Anchor>
          <Anchor href="#" underline="never" c="gray" size="sm">
            회원가입
          </Anchor>
          <Anchor href="#" underline="never" c="gray" size="sm">
            장바구니
          </Anchor>
        </Group>
      </Flex>
    </Box>
  );
}
