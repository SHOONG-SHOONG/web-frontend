// import React from "react";
// import {
//   Box,
//   Button,
//   Container,
//   Flex,
//   Image,
//   Table,
//   Text,
//   Title,
//   Stack,
//   UnstyledButton,
//   Group,
// } from "@mantine/core";
// import { IconBox, IconBroadcast, IconUser } from "@tabler/icons-react";
// import { Link } from "react-router-dom";
// import AdminNavBarPage from "../../../components/AdminNavBar.tsx";

// export default function AdminItemPage() {
//   const items = [
//     {
//       id: 1,
//       name: "상품명",
//       price: 20000,
//       discount: 10,
//       stock: 100,
//       image: null,
//       seller: "판매중",
//     },
//   ];

//   return (
//     <Flex>
//       {/* 사이드바 */}
//       <AdminNavBarPage />

//       {/* 메인 콘텐츠 */}
//       <Box style={{ flex: 1 }} bg="#fefefe">
//         <Container py="xl">
//           <Flex justify="space-between" align="center" mb="md">
//             <Title order={4}>상품목록 (0/10)</Title>
//             <Link to="/admin/item/create">
//               <Button color="#3b5bdb" radius="md" size="sm">
//                 상품 등록
//               </Button>
//             </Link>
//           </Flex>

//           <Table withColumnBorders highlightOnHover striped>
//             <thead>
//               <tr>
//                 <th style={{ textAlign: "center" }}>상품 이미지</th>
//                 <th style={{ textAlign: "center" }}>상품명</th>
//                 <th style={{ textAlign: "center" }}>판매상태</th>
//                 <th style={{ textAlign: "center" }}>정가</th>
//                 <th style={{ textAlign: "center" }}>할인(%)</th>
//                 <th style={{ textAlign: "center" }}>재고</th>
//                 <th style={{ textAlign: "center" }}>작업</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item) => (
//                 <tr key={item.id}>
//                   <td style={{ textAlign: "center" }}>
//                     <Box
//                       w={60}
//                       h={60}
//                       bg="#f1f3f5"
//                       style={{
//                         borderRadius: 8,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Image
//                         src={
//                           item.image ||
//                           "https://placehold.co/60x60?text=\uD83C\uDF04"
//                         }
//                         alt=""
//                         width={40}
//                       />
//                     </Box>
//                   </td>
//                   <td style={{ textAlign: "center" }}>{item.name}</td>
//                   <td style={{ textAlign: "center" }}>{item.seller}</td>
//                   <td style={{ textAlign: "center" }}>
//                     {item.price.toLocaleString()}
//                   </td>
//                   <td style={{ textAlign: "center" }}>{item.discount}</td>
//                   <td style={{ textAlign: "center" }}>{item.stock}</td>
//                   <td style={{ textAlign: "center" }}>
//                     <Group justify="center">
//                       <Button size="xs" variant="light" color="#3b5bdb">
//                         수정
//                       </Button>
//                       <Button size="xs" variant="light" color="red">
//                         삭제
//                       </Button>
//                     </Group>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Container>
//       </Box>
//     </Flex>
//   );
// }

import React, { useState } from "react";
import {
  AppShell,
  Text,
  NavLink,
  Container,
  Table,
  Badge,
  Button,
  Avatar,
  Group,
  Title,
  Box,
  Card,
  Flex,
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
import NavbarComponent from "../../../components/NavBar.tsx";

export default function AdminItemPage() {
  const [activeNav, setActiveNav] = useState("상품 관리");

  const navItems = [
    { label: "상품 관리", icon: IconBell },
    { label: "라이브쇼 관리", icon: IconUser },
    { label: "계정 관리", icon: IconSettings },
  ];

  const productData = [
    {
      id: 1,
      image: null,
      name: "상품명",
      category: "판매중",
      price: "20,000",
      discount: 10,
      stock: 100,
      status: "수정",
      action: "삭제",
    },
  ];

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 280,
        breakpoint: "sm",
      }}
    >
      {/* <NavbarComponent activeNav={undefined} setActiveNav={undefined} /> */}
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

      <AppShell.Main
        style={{
          backgroundColor: "#f8f9fa",
        }}
      >
        <Container size="xl" px={0}>
          <Flex justify="space-between" align="center" mb="lg">
            <Title order={3} fw={600}>
              상품목록 (0/10)
            </Title>
            <Button
              variant="filled"
              size="sm"
              radius="md"
              styles={{
                root: {
                  backgroundColor: "#4c6ef5",
                  "&:hover": {
                    backgroundColor: "#364fc7",
                  },
                },
              }}
            >
              상품 등록
            </Button>
          </Flex>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Table
              horizontalSpacing="md"
              verticalSpacing="sm"
              highlightOnHover
              style={{ fontSize: "14px" }}
            >
              <Table.Thead>
                <Table.Tr style={{ borderBottom: "2px solid #e9ecef" }}>
                  <Table.Th
                    style={{
                      padding: "16px",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    상품 이미지
                  </Table.Th>
                  <Table.Th
                    style={{
                      padding: "16px",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    상품명
                  </Table.Th>
                  <Table.Th
                    style={{
                      padding: "16px",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    판매상태
                  </Table.Th>
                  <Table.Th
                    style={{
                      padding: "16px",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    정가
                  </Table.Th>
                  <Table.Th
                    style={{
                      padding: "16px",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    할인(%)
                  </Table.Th>
                  <Table.Th
                    style={{
                      padding: "16px",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    재고
                  </Table.Th>
                  <Table.Th
                    style={{
                      padding: "16px",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    작업
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {productData.map((product) => (
                  <Table.Tr key={product.id}>
                    <Table.Td style={{ padding: "16px" }}>
                      <Avatar
                        size="lg"
                        radius="md"
                        color="gray"
                        variant="filled"
                        styles={{
                          root: {
                            backgroundColor: "#f8f9fa",
                            border: "2px dashed #dee2e6",
                          },
                        }}
                      >
                        ?
                      </Avatar>
                    </Table.Td>
                    <Table.Td style={{ padding: "16px" }}>
                      <Text fw={500}>{product.name}</Text>
                    </Table.Td>
                    <Table.Td style={{ padding: "16px" }}>
                      <Badge
                        variant="light"
                        color="green"
                        size="md"
                        radius="sm"
                      >
                        {product.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ padding: "16px" }}>
                      <Text fw={500}>{product.price}</Text>
                    </Table.Td>
                    <Table.Td style={{ padding: "16px" }}>
                      <Text>{product.discount}</Text>
                    </Table.Td>
                    <Table.Td style={{ padding: "16px" }}>
                      <Text>{product.stock}</Text>
                    </Table.Td>
                    <Table.Td style={{ padding: "16px" }}>
                      <Group gap="xs">
                        <Button
                          variant="light"
                          color="blue"
                          size="xs"
                          radius="sm"
                        >
                          {product.status}
                        </Button>
                        <Button
                          variant="light"
                          color="red"
                          size="xs"
                          radius="sm"
                        >
                          {product.action}
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
