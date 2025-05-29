import React, { useEffect, useState } from "react";
import {
  AppShell,
  Container,
  Card,
  Title,
  Box,
  Text,
  Flex,
  Avatar,
  Group,
  ActionIcon,
  Tooltip,
  Loader,
  Table,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import AdminNavBarPage from "../../../components/AdminNavBar.tsx";
import BASE_URL from "../../../config";

interface Item {
  itemId: number;
  itemName: string;
  price: number;
  discountRate: number;
  description: string;
  itemQuantity: number;
  category: string;
  createdAt: string;
  discountExpiredAt: string;
  status: string;
  brandId: number;
  brandName: string;
  imageUrls: string[];
}

export default function AuthItemPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await fetch(`${BASE_URL}/admin/pending/items`, {
          headers: { access: token || "" },
        });
        const data = await res.json();
        console.log(data);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
    };
    fetchItems();
  }, []);

  const handleApprove = async (itemId: number) => {
    const token = localStorage.getItem("access");
    try {
      await fetch(`${BASE_URL}/admin/${itemId}/item/approve`, {
        method: "POST",
        headers: { access: token || "" },
      });
      setItems(
        (prev) => prev?.filter((item) => item.itemId !== itemId) || null
      );
    } catch (err) {
      console.error("승인 실패:", err);
    }
  };

  const handleReject = async (itemId: number) => {
    const token = localStorage.getItem("access");
    try {
      await fetch(`${BASE_URL}/admin/${itemId}/item/reject`, {
        method: "POST",
        headers: { access: token || "" },
      });
      setItems(
        (prev) => prev?.filter((item) => item.itemId !== itemId) || null
      );
    } catch (err) {
      console.error("거절 실패:", err);
    }
  };

  return (
    <AppShell layout="default">
      <AdminNavBarPage />
      <AppShell.Main>
        <Box py="xl" px="xl">
          <Container>
            <Flex justify="space-between" align="center">
              <Title order={2}>상품 관리</Title>
            </Flex>
          </Container>
        </Box>
        <Container py="xl">
          <Title order={4} mb="md">
            승인 대기 상품 목록
          </Title>
          <Card withBorder p="lg" radius="md">
            {!items ? (
              <Flex justify="center" align="center" py="xl">
                <Loader size="lg" />
              </Flex>
            ) : items.length === 0 ? (
              <Text ta="center">대기중인 상품이 없습니다.</Text>
            ) : (
              <Table highlightOnHover withColumnBorders striped>
                <thead>
                  <tr>
                    <th>상품이미지</th>
                    <th>상품명</th>
                    <th>카테고리</th>
                    <th>가격</th>
                    <th>할인률</th>
                    <th>재고</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.itemId}>
                      <td>
                        <Group>
                          <Avatar
                            src={
                              item.imageUrls?.[0] ||
                              "https://placehold.co/60x60"
                            }
                            size="md"
                            radius="sm"
                          />
                        </Group>
                      </td>
                      <td>{item.itemName}</td>
                      <td>{item.category}</td>
                      <td>{item.price.toLocaleString()}원</td>
                      <td>{(item.discountRate * 100).toFixed(0)}%</td>
                      <td>{item.itemQuantity}개</td>
                      <td>
                        <Group gap="xs">
                          <Tooltip label="승인">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              radius="xl"
                              onClick={() => handleApprove(item.itemId)}
                            >
                              <IconCheck size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="거절">
                            <ActionIcon
                              variant="light"
                              color="red"
                              radius="xl"
                              onClick={() => handleReject(item.itemId)}
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
