import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Group,
  Image,
  Text,
  UnstyledButton,
  Badge,
  Tooltip,
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
import BASE_URL from "../config.js";
import { useNavigate } from "react-router-dom";

const menus = [
  { label: "홈", value: "home", path: "/" },
  { label: "카테고리", value: "category", path: "/item" },
  { label: "라이브", value: "live", path: "/live" },
];

export default function HeaderComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;
  const { isLoggedIn, loginUser } = useLogin();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!isLoggedIn) {
          setCartCount(0);
          return;
        }
        const token = localStorage.getItem("access");
        const response = await fetch(`${BASE_URL}/cart/get`, {
          method: "GET",
          headers: {
            access: token || "",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setCartCount(data.length);
        } else {
          setCartCount(0);
        }
      } catch (err: any) {
        console.error("장바구니 조회 실패:", err);
        setCartCount(0);
      }
    };
    fetchCart();
  }, [isLoggedIn]);

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
        <Box w={260}>
          <Link to="/">
            <Image src={shoongImage} w={100} />
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
                  fontSize: 17,
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: "none",
                  color: isActive ? "#4D6EF4" : "#888",
                  textTransform: "uppercase",
                  paddingBottom: 4,
                }}
              >
                {menu.label}
              </Link>
            );
          })}
        </Group>
        {/* 오른쪽 아이콘 메뉴 (크기 증가) */}
        <Group gap="lg" w={260} align="center" justify="flex-end">
          <Tooltip
            label="SEARCH"
            position="bottom"
            withArrow
            arrowPosition="center"
            transitionProps={{ transition: "pop" }}
          >
            <UnstyledButton component={Link} to="/item/search">
              <IconSearch size={22} />
            </UnstyledButton>
          </Tooltip>
          {isLoggedIn ? (
            <>
              <Tooltip
                label="MYPAGE"
                position="bottom"
                withArrow
                arrowPosition="center"
                transitionProps={{ transition: "pop" }}
              >
                <Text
                  size="lg"
                  fw={600}
                  mb={5}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/mypage");
                  }}
                >
                  {loginUser}님
                </Text>
              </Tooltip>
              <Tooltip
                label="LOGOUT"
                position="bottom"
                withArrow
                arrowPosition="center"
                transitionProps={{ transition: "pop" }}
              >
                <UnstyledButton component={Link} to="/logout">
                  <IconLogout size={22} />
                </UnstyledButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip
              label="LOGIN"
              position="bottom"
              withArrow
              arrowPosition="center"
              transitionProps={{ transition: "pop" }}
            >
              <UnstyledButton component={Link} to="/login">
                <IconUser size={22} />
              </UnstyledButton>
            </Tooltip>
          )}

          <Tooltip
            label="CART"
            position="bottom"
            withArrow
            arrowPosition="center"
            transitionProps={{ transition: "pop" }}
          >
            <UnstyledButton
              component={Link}
              to="/cart"
              style={{ position: "relative" }}
            >
              <IconShoppingBag size={22} />
              {cartCount > 0 && (
                <Badge
                  size="sm"
                  color="#4D6EF4"
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                  }}
                >
                  {cartCount}
                </Badge>
              )}
            </UnstyledButton>
          </Tooltip>
        </Group>
      </Flex>
    </Box>
  );
}
