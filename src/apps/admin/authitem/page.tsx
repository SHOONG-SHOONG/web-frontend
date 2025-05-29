import React, { useEffect, useState } from "react";
import {
  AppShell,
  Container,
  Card,
  Title,
  Grid,
  Box,
  Text,
  Flex,
  Avatar,
  Group,
  Badge,
  Button,
  ActionIcon,
  Tooltip,
  Loader,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import AdminNavBarPage from "../../../components/AdminNavBar.tsx";
import BASE_URL from "../../../config"; // BASE_URL 불러오는 부분 확인 필요

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
              <Box>
                <Flex
                  justify="space-between"
                  pb="sm"
                  mb="sm"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <Text fw={500} w={140}>
                    상품이미지
                  </Text>
                  <Text fw={500} w={140}>
                    상품명
                  </Text>
                  <Text fw={500} w={100}>
                    카테고리
                  </Text>
                  <Text fw={500} w={100}>
                    가격
                  </Text>
                  <Text fw={500} w={100}>
                    할인률
                  </Text>
                  <Text fw={500} w={100}>
                    재고
                  </Text>
                  <Text fw={500} w={100}>
                    작업
                  </Text>
                </Flex>
                {items.map((item) => (
                  <Flex
                    key={item.itemId}
                    justify="center"
                    align="center"
                    py="sm"
                    style={{ borderBottom: "1px solid #f1f3f5" }}
                  >
                    {/* 상품 이미지 */}
                    <Group w={140}>
                      <Avatar
                        src={
                          item.imageUrls?.[0] || "https://placehold.co/60x60"
                        }
                        size="md"
                        radius="sm"
                      />
                    </Group>

                    {/* 상품 정보 */}
                    <Text w={140}>{item.itemName}</Text>
                    <Text w={140}>{item.category}</Text>
                    <Text w={100}>{item.price.toLocaleString()}원</Text>
                    <Text w={100}>{item.discountRate}%</Text>
                    <Text w={100}>{item.itemQuantity}개</Text>

                    {/* 작업 버튼 */}
                    <Group w={100}>
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
                  </Flex>
                ))}
              </Box>
            )}
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
