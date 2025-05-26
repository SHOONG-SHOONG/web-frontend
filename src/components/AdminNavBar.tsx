// components/AdminNavBarPage.tsx
import React, { useState } from "react";
import {
  IconChevronRight,
  IconUserCircle,
  IconLogout,
  IconHome,
  IconBell,
  IconUsers,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";
import {
  AppShell,
  NavLink,
  Menu,
  UnstyledButton,
  Group,
  Text,
  Box,
  Image,
} from "@mantine/core";
import { useLocation, useNavigate, Link } from "react-router-dom";
import shoongImage from "../assets/shoong2.png";

export default function AdminNavBarPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "상품 관리", icon: IconBell, path: "/admin" },
    { label: "라이브쇼 관리", icon: IconUser, path: "/admin/live" },
    { label: "계정 관리", icon: IconSettings, path: "/admin/user" },
  ];

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 280,
        breakpoint: "sm",
      }}
    >

      <AppShell.Navbar p="xs">
        <AppShell.Section grow mt="md">
          {/* 로고 */}
          <Box px="md" mb="xl">
            <Link to="/">
              <Image src={shoongImage} w={90} />
            </Link>
          </Box>

          {navItems.map((item) => (
            <NavLink
              key={item.label}
              label={item.label}
              leftSection={<item.icon size="1rem" />}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              rightSection={<IconChevronRight size="0.8rem" />}
              styles={(theme) => ({
                root: {
                  borderRadius: "8px",
                  margin: "2px 8px",
                  "&[data-active]": {
                    backgroundColor: theme.colors.blue[0],
                    color: theme.colors.blue[7],
                    fontWeight: 600,
                  },
                  "&:hover": {
                    backgroundColor: theme.colors.gray[0],
                  },
                },
              })}
            />
          ))}
        </AppShell.Section>

        <AppShell.Section>
          <Box px="md" py="sm" style={{ borderTop: "1px solid #e9ecef" }}>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                  styles={{
                    root: {
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    },
                  }}
                >
                  <Group gap="sm">
                    <IconUserCircle size="1.5rem" />
                    <div>
                      <Text size="sm" fw={500}>
                        M
                      </Text>
                      <Text size="xs" c="dimmed">
                        Change account
                      </Text>
                    </div>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconLogout size="1rem" />}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>
    </AppShell >
  );
}
