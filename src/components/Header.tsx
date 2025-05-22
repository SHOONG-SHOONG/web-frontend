import React from "react";
import { Box, Flex, Group, Image } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

const menus = [
  { label: "홈", value: "home", path: "/" },
  { label: "카테고리", value: "category", path: "/item" },
  { label: "라이브", value: "live", path: "/live" },
];

export default function HeaderComponent() {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <Box px="lg" py="sm" style={{ borderBottom: "1px solid #eee" }}>
      <Flex justify="space-between" align="center">
        {/* 로고 */}
        <Box w={220} mt={5}>
          <Link to="/">
            <Image src={shoongImage} w={90} />{" "}
          </Link>
          {/* <Text fw={900} size="lg" c="blue">
            Shoong
          </Text> */}
        </Box>

        {/* 중앙 메뉴 */}
        <Box style={{ flex: 1 }}>
          <Group justify="center" gap="lg">
            {menus.map((menu) => (
              <Link
                key={menu.value}
                to={menu.path}
                style={{
                  fontWeight: activePath === menu.path ? 700 : 500,
                  color: activePath === menu.path ? "#3c5bdc" : "#868e96",
                  borderBottom:
                    activePath === menu.path ? "2px solid #3c5bdc" : "none",
                  paddingBottom: 4,
                  textDecoration: "none",
                }}
              >
                {menu.label}
              </Link>
            ))}
          </Group>
        </Box>

        {/* 오른쪽 메뉴 */}
        <Group gap="sm" w={220} justify="flex-end">
          <IconSearch size={16} />
          <Link
            to="/login"
            style={{ color: "#868e96", fontSize: 14, textDecoration: "none" }}
          >
            로그인
          </Link>
          <Link
            to="/cart"
            style={{ color: "#868e96", fontSize: 14, textDecoration: "none" }}
          >
            장바구니
          </Link>
        </Group>
      </Flex>
    </Box>
  );
}
