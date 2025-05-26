// import React, { useState } from "react";
// import {
//   AppShell,
//   Text,
//   NavLink,
//   Container,
//   Table,
//   Badge,
//   Button,
//   Avatar,
//   Group,
//   Title,
//   Box,
//   Card,
//   Flex,
//   Menu,
//   UnstyledButton,
// } from "@mantine/core";
// import {
//   IconBell,
//   IconUser,
//   IconSettings,
//   IconChevronRight,
//   IconLogout,
//   IconUserCircle,
// } from "@tabler/icons-react";
// import { useNavigate } from "react-router-dom";
// import NavbarComponent from "../../../components/NavBar.tsx";
// import AdminNavBarPage from "../../../components/AdminNavBar.tsx";

// export default function AdminItemPage() {
//   const [activeNav, setActiveNav] = useState("상품 관리");
//   const navigate = useNavigate();

//   const navItems = [
//     { label: "상품 관리", icon: IconBell },
//     { label: "라이브쇼 관리", icon: IconUser },
//     { label: "계정 관리", icon: IconSettings },
//   ];

//   const productData = [
//     {
//       id: 1,
//       image: null,
//       name: "상품명",
//       category: "판매중",
//       price: "20,000",
//       discount: 10,
//       stock: 100,
//       status: "수정",
//       action: "삭제",
//     },
//   ];

//   return (
//     <AppShell layout="default">
//       <AdminNavBarPage />
//       <AppShell.Main
//         style={{
//           backgroundColor: "#f8f9fa",
//         }}
//       >
//         <Container size="xl" px={0}>
//           <Flex justify="space-between" align="center" mb="lg">
//             <Title order={3} fw={600}>
//               상품목록 (0/10)
//             </Title>
//             <Button
//               variant="filled"
//               size="sm"
//               radius="md"
//               onClick={() => navigate("/admin/item/create")}
//               styles={{
//                 root: {
//                   backgroundColor: "#4c6ef5",
//                   "&:hover": {
//                     backgroundColor: "#364fc7",
//                   },
//                 },
//               }}
//             >
//               상품 등록
//             </Button>
//           </Flex>

//           <Card shadow="sm" padding="lg" radius="md" withBorder>
//             <Table
//               horizontalSpacing="md"
//               verticalSpacing="sm"
//               highlightOnHover
//               style={{ fontSize: "14px" }}
//             >
//               <Table.Thead>
//                 <Table.Tr style={{ borderBottom: "2px solid #e9ecef" }}>
//                   <Table.Th
//                     style={{
//                       padding: "16px",
//                       fontWeight: 600,
//                       color: "#495057",
//                     }}
//                   >
//                     상품 이미지
//                   </Table.Th>
//                   <Table.Th
//                     style={{
//                       padding: "16px",
//                       fontWeight: 600,
//                       color: "#495057",
//                     }}
//                   >
//                     상품명
//                   </Table.Th>
//                   <Table.Th
//                     style={{
//                       padding: "16px",
//                       fontWeight: 600,
//                       color: "#495057",
//                     }}
//                   >
//                     판매상태
//                   </Table.Th>
//                   <Table.Th
//                     style={{
//                       padding: "16px",
//                       fontWeight: 600,
//                       color: "#495057",
//                     }}
//                   >
//                     정가
//                   </Table.Th>
//                   <Table.Th
//                     style={{
//                       padding: "16px",
//                       fontWeight: 600,
//                       color: "#495057",
//                     }}
//                   >
//                     할인(%)
//                   </Table.Th>
//                   <Table.Th
//                     style={{
//                       padding: "16px",
//                       fontWeight: 600,
//                       color: "#495057",
//                     }}
//                   >
//                     재고
//                   </Table.Th>
//                   <Table.Th
//                     style={{
//                       padding: "16px",
//                       fontWeight: 600,
//                       color: "#495057",
//                     }}
//                   >
//                     작업
//                   </Table.Th>
//                 </Table.Tr>
//               </Table.Thead>
//               <Table.Tbody>
//                 {productData.map((product) => (
//                   <Table.Tr key={product.id}>
//                     <Table.Td style={{ padding: "16px" }}>
//                       <Avatar
//                         size="lg"
//                         radius="md"
//                         color="gray"
//                         variant="filled"
//                         styles={{
//                           root: {
//                             backgroundColor: "#f8f9fa",
//                             border: "2px dashed #dee2e6",
//                           },
//                         }}
//                       >
//                         ?
//                       </Avatar>
//                     </Table.Td>
//                     <Table.Td style={{ padding: "16px" }}>
//                       <Text fw={500}>{product.name}</Text>
//                     </Table.Td>
//                     <Table.Td style={{ padding: "16px" }}>
//                       <Badge
//                         variant="light"
//                         color="green"
//                         size="md"
//                         radius="sm"
//                       >
//                         {product.category}
//                       </Badge>
//                     </Table.Td>
//                     <Table.Td style={{ padding: "16px" }}>
//                       <Text fw={500}>{product.price}</Text>
//                     </Table.Td>
//                     <Table.Td style={{ padding: "16px" }}>
//                       <Text>{product.discount}</Text>
//                     </Table.Td>
//                     <Table.Td style={{ padding: "16px" }}>
//                       <Text>{product.stock}</Text>
//                     </Table.Td>
//                     <Table.Td style={{ padding: "16px" }}>
//                       <Group gap="xs">
//                         <Button
//                           variant="light"
//                           color="blue"
//                           size="xs"
//                           radius="sm"
//                         >
//                           {product.status}
//                         </Button>
//                         <Button
//                           variant="light"
//                           color="red"
//                           size="xs"
//                           radius="sm"
//                         >
//                           {product.action}
//                         </Button>
//                       </Group>
//                     </Table.Td>
//                   </Table.Tr>
//                 ))}
//               </Table.Tbody>
//             </Table>
//           </Card>
//         </Container>
//       </AppShell.Main>
//     </AppShell>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  AppShell,
  Text,
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
  Accordion,
  Image,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AdminNavBarPage from "../../../components/AdminNavBar.tsx";

interface ItemImage {
  id: number;
  url: string;
  createdAt: string;
}

interface Item {
  itemId: number;
  brandId: number;
  itemName: string;
  price: number;
  discountRate: number;
  finalPrice: number;
  wishlistCount: number;
  description: string;
  itemQuantity: number;
  category: string;
  discountExpiredAt: string;
  status: string;
  itemImages: ItemImage[];
}

export default function AdminItemPage() {
  const [activeNav, setActiveNav] = useState("상품 관리");
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await fetch("http://192.168.0.6:8080/admin/item-list", {
          method: "GET",
          headers: {
            access: token || "",
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("상품 불러오기 실패");
        const data: Item[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchItems();
  }, []);

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
    <AppShell layout="default">
      <AdminNavBarPage />
      <AppShell.Main style={{ backgroundColor: "#f8f9fa" }}>
        <Container size="xl" px={0}>
          <Flex justify="space-between" align="center" mb="lg">
            <Title order={3} fw={600}>
              상품목록 (0/10)
            </Title>
            <Button
              variant="filled"
              size="sm"
              radius="md"
              onClick={() => navigate("/admin/item/create")}
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
                  <Table.Th style={{ padding: "16px", fontWeight: 600, color: "#495057" }}>
                    상품 이미지
                  </Table.Th>
                  <Table.Th style={{ padding: "16px", fontWeight: 600, color: "#495057" }}>
                    상품명
                  </Table.Th>
                  <Table.Th style={{ padding: "16px", fontWeight: 600, color: "#495057" }}>
                    판매상태
                  </Table.Th>
                  <Table.Th style={{ padding: "16px", fontWeight: 600, color: "#495057" }}>
                    정가
                  </Table.Th>
                  <Table.Th style={{ padding: "16px", fontWeight: 600, color: "#495057" }}>
                    할인(%)
                  </Table.Th>
                  <Table.Th style={{ padding: "16px", fontWeight: 600, color: "#495057" }}>
                    재고
                  </Table.Th>
                  <Table.Th style={{ padding: "16px", fontWeight: 600, color: "#495057" }}>
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
                      <Badge variant="light" color="green" size="md" radius="sm">
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
                        <Button variant="light" color="blue" size="xs" radius="sm">
                          {product.status}
                        </Button>
                        <Button variant="light" color="red" size="xs" radius="sm">
                          {product.action}
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {/* 아코디언 상품 리스트 */}
            <Box mt="xl">
              <Title order={5} mb="sm">상품 상세 보기</Title>
              {items.length === 0 ? (
                <Text color="dimmed">상품이 없습니다.</Text>
              ) : (
                <Accordion multiple defaultValue={[]}>
                  {items.map((item) => (
                    <Accordion.Item key={item.itemId} value={item.itemId.toString()}>
                      <Accordion.Control>{item.itemName}</Accordion.Control>
                      <Accordion.Panel>
                        <Group>
                          <Image
                            src={item.itemImages?.[0]?.url}
                            width={80}
                            alt={item.itemName}
                          />
                          <Box>
                            <Text>카테고리: {item.category}</Text>
                            <Text>정가: {item.price.toLocaleString()}원</Text>
                            <Text>할인율: {item.discountRate}%</Text>
                            <Text>재고: {item.itemQuantity}개</Text>
                            <Text>상태: {item.status}</Text>
                          </Box>
                        </Group>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Box>
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
