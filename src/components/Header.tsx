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
import { useMediaQuery } from "@mantine/hooks";
// import shoongImage from "../assets/shoong-logo.png";
import { useLogin } from "../contexts/AuthContext.tsx";
import BASE_URL from "../config.js";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

const menus = [
  { label: "홈", value: "home", path: "/" },
  { label: "카테고리", value: "category", path: "/item" },
  { label: "라이브", value: "live", path: "/live" },
];

export default function HeaderComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;
  const { isLoggedIn, loginUser, role } = useLogin();
  const [cartCount, setCartCount] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
        console.log("🔐 role", role);

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
      py={14}
      style={{
        borderBottom: "1px solid #ddd",
      }}
    >
      <Flex justify="space-between" align="center">
        {/* 로고 */}
        <Box w={260}>
          <Link to="/">
            <Image src="/assets/shoong-logo.png" w={isMobile ? 60 : 125} />
          </Link>
        </Box>
        {/* 중앙 메뉴 */}
        <Group
          gap={isMobile ? "sm" : "xl"}
          justify="center"
          wrap="nowrap"
          style={{
            flex: 1,
          }}
        >
          {menus.map((menu) => {
            const isActive = activePath === menu.path;
            return (
              <Link
                key={menu.path}
                to={menu.path}
                style={{
                  fontSize: isMobile ? 14 : 17,
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: "none",
                  color: isActive ? "#409fff" : "#888",
                  textTransform: "uppercase",
                  paddingBottom: 4,
                  whiteSpace: "nowrap",
                }}
              >
                {menu.label}
              </Link>
            );
          })}
        </Group>
        {/* 오른쪽 아이콘 메뉴 (크기 증가) */}
        <Group
          gap={isMobile ? "sm" : "lg"}
          w={260}
          align="center"
          justify="flex-end"
        >
          <Tooltip
            label="SEARCH"
            position="bottom"
            withArrow
            arrowPosition="center"
            transitionProps={{ transition: "pop" }}
          >
            <UnstyledButton component={Link} to="/item/search">
              <IconSearch size={isMobile ? 14 : 22} />
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
                  size={isMobile ? "sm" : "lg"}
                  fw={600}
                  mb={5}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (role === "STREAMER") {
                      navigate("/seller/mypage");
                    } else if (role === "CLIENT") {
                      navigate("/mypage");
                    } else {
                      showNotification({
                        title: "접근 제한",
                        message: "해당 마이페이지는 일반 사용자만 접근할 수 있습니다.",
                        color: "red",
                      });
                    }
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
                  <IconLogout size={isMobile ? 14 : 22} />
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
                <IconUser size={isMobile ? 14 : 22} />
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
              onClick={() => {
                if (role === "CLIENT") {
                  navigate("/cart");
                } else {
                  showNotification({
                    title: "접근 제한",
                    message: "장바구니는 일반 사용자만 이용할 수 있습니다.",
                    color: "red",
                  });
                }
              }}
              style={{ position: "relative", background: "none", border: "none" }}
            >
              <IconShoppingBag size={isMobile ? 14 : 22} />
              {cartCount > 0 && (
                <Badge
                  size="sm"
                  color="#409fff"
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
