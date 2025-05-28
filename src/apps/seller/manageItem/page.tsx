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
  Button,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import BASE_URL from "../../../config.js";
import { RingLoader } from "../../../components/RingLoader.tsx";

interface Item {
  itemId: number;
  itemName: string;
  category: string;
  price: number;
  discountRate: number;
  itemQuantity: number;
  finalPrice: number;
  itemImages: { url: string }[];
}

export default function SellerItemPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await fetch(`${BASE_URL}/admin/item-list`, {
          headers: { access: token || "" },
        });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
    };
    fetchItems();
  }, []);

  const totalQuantity = Array.isArray(items)
    ? items.reduce((sum, i) => sum + i.itemQuantity, 0)
    : 0;
  const avgDiscount =
    Array.isArray(items) && items.length > 0
      ? (
        items.reduce((sum, i) => sum + i.discountRate, 0) / items.length
      ).toFixed(1)
      : "0.0";
  const categoryCount = Array.isArray(items)
    ? new Set(items.map((i) => i.category)).size
    : 0;

  return (
    <AppShell layout="default">
      <SellerNavBarPage />
      <AppShell.Main style={{ backgroundColor: "#ffffff" }}>
        <Box py="xl" px="xl">
          <Container>
            <Flex justify="space-between" align="center">
              <Title order={2}>상품 관리</Title>
              <Button
                radius="lg"
                h={40}
                leftSection={<IconPlus size={16} />}
                color="black"
                variant="light"
                onClick={() => navigate("/seller/item/create")}
              >
                상품 등록
              </Button>
            </Flex>

            <Grid mt="lg">
              <Grid.Col span={3}>
                <Card radius="lg" shadow="sm" p="lg" withBorder bg="white">
                  <Text size="sm" c="dimmed">
                    총 상품 수
                  </Text>
                  <Title order={2}>{items ? items.length : 0}</Title>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card radius="lg" shadow="sm" p="lg" withBorder bg="white">
                  <Text size="sm" c="dimmed">
                    총 재고 수량
                  </Text>
                  <Title order={2}>{totalQuantity}</Title>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card radius="lg" shadow="sm" p="lg" withBorder bg="white">
                  <Text size="sm" c="dimmed">
                    카테고리 수
                  </Text>
                  <Title order={2}>{categoryCount}</Title>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card radius="lg" shadow="sm" p="lg" withBorder bg="white">
                  <Text size="sm" c="dimmed">
                    평균 할인율
                  </Text>
                  <Title order={2}>{avgDiscount}%</Title>
                </Card>
              </Grid.Col>
            </Grid>
          </Container>
        </Box>

        <Container py="xl">
          <Title order={4} mb="md">
            상품 목록
          </Title>
          <Card withBorder p="lg" radius="lg">
            {!items ? (
              <Flex justify="center" align="center" py="xl">
                <RingLoader />
              </Flex>
            ) : (
              <Box>
                <Flex
                  justify="space-between"
                  pb="sm"
                  mb="sm"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <Text fw={500} w={200}>
                    상품명
                  </Text>
                  <Text fw={500} w={120}>
                    카테고리
                  </Text>
                  <Text fw={500} w={100}>
                    정가
                  </Text>
                  <Text fw={500} w={100}>
                    할인율
                  </Text>
                  <Text fw={500} w={120}>
                    재고
                  </Text>
                  <Text fw={500} w={200}>
                    작업
                  </Text>
                </Flex>
                {items.map((item) => (
                  <Flex
                    key={item.itemId}
                    align="center"
                    justify="space-between"
                    py="sm"
                    style={{ borderBottom: "1px solid #f1f3f5" }}
                  >
                    <Group w={200}>
                      <Avatar
                        src={item.itemImages?.[0]?.url}
                        size="sm"
                        radius="xl"
                      />
                      <Text>{item.itemName}</Text>
                    </Group>
                    <Text w={120}>{item.category}</Text>
                    <Text w={100}>{item.price.toLocaleString()}원</Text>
                    <Text w={100}>{item.discountRate}%</Text>
                    <Text w={120}>{item.itemQuantity}개</Text>
                    <Group w={200}>
                      <Tooltip label="수정">
                        <ActionIcon variant="light" color="blue" radius="xl">
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="삭제">
                        <ActionIcon variant="light" color="red" radius="xl">
                          <IconTrash size={16} />
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
