import React from "react";
import {
  Box,
  Flex,
  Group,
  Image,
  Text,
  UnstyledButton,
  Badge,
} from "@mantine/core";
import {
  IconSearch,
  IconUser,
  IconLogout,
  IconShoppingBag,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import shoongImage from "../assets/shoong2.png";
import { useLogin } from "../contexts/AuthContext.tsx";

const menus = [
  { label: "홈", value: "home", path: "/" },
  { label: "카테고리", value: "category", path: "/item" },
  // live page
  { label: "라이브", value: "live", path: "/live" },
];

export default function HeaderComponent() {
  const location = useLocation();
  const activePath = location.pathname;
  const { isLoggedIn, loginUser } = useLogin();

  return (
    <Box
      px="xl"
      py={24}
      style={{
        borderBottom: "1px solid #ddd",
      }}
    >
      <Flex justify="space-between" align="center">
        {/* 로고 */}
        <Box w={120}>
          <Link to="/">
            <Image src={shoongImage} w={80} />
          </Link>
        </Box>

        {/* 중앙 메뉴 */}
        <Group gap="xl" style={{ flex: 1 }} justify="center">
          {menus.map((menu) => {
            const isActive = activePath === menu.path;

            return (
              <Link
                key={menu.path}
                to={menu.path}
                style={{
                  fontSize: 15,
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: "none",
                  color: isActive ? "#4d6ef4" : "#888",
                  textTransform: "uppercase",
                  paddingBottom: 4,
                }}
              >
                {menu.label}
              </Link>
            );
          })}
        </Group>

        {/* 오른쪽 아이콘 메뉴 */}
        <Group gap="lg" w={220} align="center" justify="flex-end">
          <UnstyledButton component={Link} to="/item/search">
            <IconSearch size={20} />
          </UnstyledButton>

          {isLoggedIn ? (
            <>
              <Text size="md" fw={500} mb={5}>
                {loginUser}님
              </Text>
              <UnstyledButton component={Link} to="/logout">
                <IconLogout size={20} />
              </UnstyledButton>
            </>
          ) : (
            <UnstyledButton component={Link} to="/login">
              <IconUser size={20} />
            </UnstyledButton>
          )}

          <UnstyledButton
            component={Link}
            to="/cart"
            style={{ position: "relative" }}
          >
            <IconShoppingBag size={20} />
            <Badge
              size="xs"
              color="#4d6ef4"
              style={{ position: "absolute", top: -6, right: -6 }}
            >
              0
            </Badge>
          </UnstyledButton>
        </Group>
      </Flex>
    </Box>
  );
}
