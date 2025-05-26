// import React from "react";
// import {
//   IconChevronRight,
//   IconUserCircle,
//   IconLogout,
//   IconBell,
//   IconUser,
//   IconSettings,
// } from "@tabler/icons-react";
// import {
//   AppShell,
//   NavLink,
//   Menu,
//   UnstyledButton,
//   Group,
//   Text,
//   Box,
//   Image,
// } from "@mantine/core";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import shoongImage from "../assets/shoong2.png";

// export default function AdminNavBarPage() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navItems = [
//     { label: "상품 관리", icon: IconBell, path: "/admin" },
//     { label: "라이브쇼 관리", icon: IconUser, path: "/admin/live" },
//     { label: "계정 관리", icon: IconSettings, path: "/admin/user" },
//   ];

//   return (
//     <AppShell
//       padding="md"
//       navbar={{
//         width: 280,
//         breakpoint: "sm",
//       }}
//     >
//       <AppShell.Navbar p="xs">
//         <AppShell.Section grow mt="md">
//           {/* 로고 */}
//           <Box px="md" mb="xl">
//             <Link to="/">
//               <Image src={shoongImage} w={90} />
//             </Link>
//           </Box>

//           {navItems.map((item) => (
//             <NavLink
//               key={item.label}
//               label={item.label}
//               leftSection={<item.icon size="1rem" />}
//               active={location.pathname === item.path}
//               onClick={() => navigate(item.path)}
//               rightSection={<IconChevronRight size="0.8rem" />}
//               styles={(theme) => ({
//                 root: {
//                   borderRadius: "8px",
//                   margin: "2px 8px",
//                   "&[data-active]": {
//                     backgroundColor: theme.colors.blue[0],
//                     color: theme.colors.blue[7],
//                     fontWeight: 600,
//                   },
//                   "&:hover": {
//                     backgroundColor: theme.colors.gray[0],
//                   },
//                 },
//               })}
//             />
//           ))}
//         </AppShell.Section>

//         <AppShell.Section>
//           <Box px="md" py="sm" style={{ borderTop: "1px solid #e9ecef" }}>
//             <Menu shadow="md" width={200}>
//               <Menu.Target>
//                 <UnstyledButton
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     width: "100%",
//                     padding: "8px",
//                     borderRadius: "8px",
//                   }}
//                   styles={{
//                     root: {
//                       "&:hover": {
//                         backgroundColor: "#f8f9fa",
//                       },
//                     },
//                   }}
//                 >
//                   <Group gap="sm">
//                     <IconUserCircle size="1.5rem" />
//                     <div>
//                       <Text size="sm" fw={500}>
//                         M
//                       </Text>
//                       <Text size="xs" c="dimmed">
//                         Change account
//                       </Text>
//                     </div>
//                   </Group>
//                 </UnstyledButton>
//               </Menu.Target>

//               <Menu.Dropdown>
//                 <Menu.Item leftSection={<IconLogout size="1rem" />}>
//                   Logout
//                 </Menu.Item>
//               </Menu.Dropdown>
//             </Menu>
//           </Box>
//         </AppShell.Section>
//       </AppShell.Navbar>
//     </AppShell>
//   );
// }

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
} from "@mantine/core";
import {
  IconChevronRight,
  IconUserCircle,
  IconLogout,
  IconBell,
  IconUser,
  IconSettings,
  IconPackage,
} from "@tabler/icons-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import shoongImage from "../assets/shoong2.png";

export default function AdminNavBarPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "대시보드", icon: IconPackage, path: "/admin" },
    { label: "라이브쇼 관리", icon: IconUser, path: "/admin/live" },
    { label: "계정 관리", icon: IconSettings, path: "/admin/user" },
  ];

  return (
    <AppShell.Navbar w={280} p="md" withBorder>
      <Flex direction="column" justify="space-between" h="100%">
        <div>
          <Box mb="lg">
            <Link to="/">
              <Image src={shoongImage} w={100} radius="md" />
            </Link>
          </Box>

          {navItems.map((item) => (
            <NavLink
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
                  fontSize: "14px",
                  padding: "10px 12px",
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
                      관리자
                    </Text>
                    <Text size="xs" c="dimmed">
                      계정 설정
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
