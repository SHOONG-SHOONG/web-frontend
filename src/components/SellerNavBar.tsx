import React from "react";
import {
  AppShell,
  NavLink,
  Menu,
  UnstyledButton,
  Group,
  Text,
  Box,
  Image,
  Flex,
  Divider,
  ScrollArea,
  rem,
  Indicator,
} from "@mantine/core";
import {
  IconChevronRight,
  IconUserCircle,
  IconLogout,
  IconBell,
  IconUser,
  IconSettings,
  IconPackage,
  IconSearch,
  IconHelpCircle,
  IconDeviceImac,
} from "@tabler/icons-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import shoongImage from "../assets/shoong2.png";
import { color } from "framer-motion";

export default function SellerNavBarPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "상품 관리", icon: IconPackage, path: "/seller" },
    { label: "라이브 관리", icon: IconDeviceImac, path: "/seller/live" },
    { label: "계정 설정", icon: IconSettings, path: "/seller/user" },
  ];

  return (
    <AppShell.Navbar w={250} p="md" withBorder>
      <Flex direction="column" justify="space-between" h="100%">
        <div>
          <Box mb="xl">
            <Link to="/">
              <Image src={shoongImage} w={110} radius="md" />
            </Link>
          </Box>

          <ScrollArea type="scroll" offsetScrollbars>
            <Box pr="sm">
              {navItems.map((item) => (
                <NavLink
                  w="15em"
                  key={item.label}
                  label={item.label}
                  leftSection={<item.icon size="1.1rem" />}
                  active={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  rightSection={<IconChevronRight size="0.9rem" />}
                  styles={(theme) => ({
                    root: {
                      borderRadius: theme.radius.md,
                      marginBottom: 6,
                      fontSize: rem(14),
                      padding: rem(10),
                      fontWeight: 500,
                      color: theme.colors.gray[7],
                      "&[data-active]": {
                        backgroundColor: theme.colors.blue[0],
                        color: theme.colors.blue[7],
                      },
                    },
                  })}
                />
              ))}

              <Divider my="md" />

              <NavLink
                label="알림"
                leftSection={<IconBell size="1.1rem" />}
                rightSection={
                  <Indicator inline label={"7"} size={16} color="red" />
                }
                styles={(theme) => ({
                  root: {
                    borderRadius: theme.radius.md,
                    fontSize: rem(14),
                    padding: rem(10),
                    color: theme.colors.gray[7],
                    "&:hover": {
                      backgroundColor: theme.colors.gray[0],
                    },
                  },
                })}
              />

              <NavLink
                label="도움말 & 지원"
                leftSection={<IconHelpCircle size="1.1rem" />}
                styles={(theme) => ({
                  root: {
                    borderRadius: theme.radius.md,
                    fontSize: rem(14),
                    padding: rem(10),
                    color: theme.colors.gray[7],
                    "&:hover": {
                      backgroundColor: theme.colors.gray[0],
                    },
                  },
                })}
              />
            </Box>
          </ScrollArea>
        </div>

        <Box>
          <Divider my="sm" />
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <Group>
                  <IconUserCircle size="1.5rem" />
                  <Box>
                    <Text size="sm" fw={500}>
                      Olivia Williams
                    </Text>
                    <Text size="xs" c="dimmed">
                      관리자 계정
                    </Text>
                  </Box>
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconLogout size="1rem" />}>
                로그아웃
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      </Flex>
    </AppShell.Navbar>
  );
}
