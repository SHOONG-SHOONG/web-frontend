import React from "react";
import {
  AppShell,
  Text,
  NavLink,
  Group,
  Title,
  Box,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBell,
  IconUser,
  IconSettings,
  IconChevronRight,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

export default function NavbarComponent({ activeNav, setActiveNav }) {
  const navItems = [
    { label: "상품 관리", icon: IconBell },
    { label: "라이브쇼 관리", icon: IconUser },
    { label: "계정 관리", icon: IconSettings },
  ];

  return (
    <AppShell.Navbar p="xs">
      <AppShell.Section grow mt="md">
        <Box px="md" mb="xl">
          <Title order={2} c="blue" fw={700} size="xl">
            shoong
          </Title>
        </Box>

        {navItems.map((item) => (
          <NavLink
            key={item.label}
            label={item.label}
            leftSection={<item.icon size="1rem" />}
            active={activeNav === item.label}
            onClick={() => setActiveNav(item.label)}
            rightSection={<IconChevronRight size="0.8rem" />}
            style={{
              borderRadius: "8px",
              margin: "2px 8px",
            }}
            styles={(theme) => ({
              root: {
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
  );
}
