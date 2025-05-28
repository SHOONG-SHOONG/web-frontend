import React, { useEffect, useState } from "react";
import {
  AppShell,
  Container,
  Flex,
  Title,
  Button,
  Card,
  Grid,
  Box,
  Text,
  Badge,
  Image,
} from "@mantine/core";

import { useNavigate } from "react-router-dom";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import { RingLoader } from "../../../components/RingLoader.tsx";
import BASE_URL from "../../../config.js";

interface LiveItem {
  id: number;
  title: string;
  imageUrl: string;
  itemName: string;
  itemImageUrl: string;
  price: number;
  discountRate: number;
  status: string;
}

export default function ManageLivePage() {
  const navigate = useNavigate();
  const [lives, setLives] = useState<LiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLives = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`${BASE_URL}/live/my-lives`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: LiveItem[] = await response.json();
      console.log("라이브 응답 데이터", data);
      setLives(data);
    } catch (err) {
      console.error("현재 라이브 정보 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLives();
  }, []);

  return (
    <AppShell layout="default">
      <SellerNavBarPage />
      <AppShell.Main style={{ backgroundColor: "#fff" }}>
        <Container py="xl" px="xl">
          <Flex justify="space-between" align="center" mb="xl">
            <Title order={3} fw={600}>
              라이브 목록
            </Title>
            <Button
              radius="lg"
              h={40}
              color="black"
              variant="light"
              onClick={() => navigate("/seller/regist-live")}
            >
              라이브 등록
            </Button>
          </Flex>
          <Card withBorder p="lg" radius="lg">
            {loading ? (
              <Flex justify="center" align="center" py="xl">
                <RingLoader />
              </Flex>
            ) : lives.length === 0 ? (
              <Text ta="center" py="xl" c="dimmed">
                등록된 라이브가 없습니다.
              </Text>
            ) : (
              <Box>
                {/* 헤더 라인 */}
                <Grid
                  pb="sm"
                  mb="sm"
                  style={{
                    borderBottom: "1px solid #eee",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#495057",
                  }}
                >
                  <Grid.Col span={2} style={{ textAlign: "center" }}>
                    상태
                  </Grid.Col>
                  <Grid.Col span={5}>라이브 정보</Grid.Col>
                  <Grid.Col span={5}>상품 정보</Grid.Col>
                </Grid>

                {/* 라이브 리스트 */}
                {lives.map((live) => (
                  <Grid
                    key={live.id}
                    align="center"
                    py="md"
                    style={{ borderBottom: "1px solid #f1f3f5" }}
                  >
                    {/* 상태 Badge */}
                    <Grid.Col span={2} style={{ textAlign: "center" }}>
                      <Badge
                        color={
                          live.status === "대기"
                            ? "yellow"
                            : live.status === "ONGOING"
                              ? "green"
                              : "gray"
                        }
                        variant="light"
                      >
                        {live.status}
                      </Badge>
                    </Grid.Col>

                    {/* 라이브 정보 (썸네일 + 제목) */}
                    <Grid.Col span={5}>
                      <Flex gap="md" align="center">
                        <Image
                          src={live.imageUrl}
                          radius="md"
                          style={{
                            width: 100,
                            height: 120,
                            objectFit: "cover",
                          }}
                        />
                        <Box>
                          <Text fw={600} size="sm" mb={4}>
                            {live.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            라이브 ID: {live.id}
                          </Text>
                        </Box>
                      </Flex>
                    </Grid.Col>

                    {/* 상품 정보 (썸네일 + 이름/가격) */}
                    <Grid.Col span={5}>
                      <Flex gap="md" align="center">
                        <Image
                          src={live.itemImageUrl}
                          radius="md"
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                          }}
                        />
                        <Box>
                          <Text fw={600} size="sm" mb={4}>
                            {live.itemName}
                          </Text>
                          <Flex align="center" gap="sm">
                            <Text size="sm">
                              <s>{live.price.toLocaleString()}원</s>
                            </Text>
                            <Text size="sm" fw={700} c="red">
                              {Math.round(
                                live.price * (1 - live.discountRate)
                              ).toLocaleString()}
                              원
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                ))}
              </Box>
            )}
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
