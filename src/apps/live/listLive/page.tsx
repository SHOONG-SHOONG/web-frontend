import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Image,
  Text,
  Title,
  Flex,
  Badge,
  Card,
  Box,
  Tabs,
  Stack,
  Group,
  Anchor,
  Divider,
} from "@mantine/core";
import HeaderComponent from "../../../components/Header.tsx";
import FooterComponent from "../../../components/Footer.tsx";
import { useNavigate } from "react-router-dom";
import TitleComponent from "../../main/components/titleComponent.tsx";
import BASE_URL from "../../../config.js";

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

interface LiveItem {
  id: number;
  title: string;
  imageUrl: string;
  itemName: string;
  price: number;
  discountRate: number;
  itemImageUrl: string;
  status: string;
}

const menus = [
  { label: "홈", value: "home" },
  { label: "카테고리", value: "category" },
  { label: "라이브", value: "live" },
];

export default function ListLivePage() {
  const navigate = useNavigate();
  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const [liveItemDetails, setLiveItemDetails] = useState<Record<number, Item>>(
    {}
  );

  useEffect(() => {
    const fetchLiveItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/live/main`, {
          headers: { Accept: "*/*" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const liveData: LiveItem[] = await response.json();
        setLiveItems(liveData);
      } catch (err) {
        console.error("라이브 방송 정보 불러오기 실패:", err);
      }
    };

    fetchLiveItems();
  }, []);

  return (
    <>
      {/* Header */}
      <HeaderComponent />

      {/* 본문 내용 */}
      <Container size="lg" pt={30}>
        <Container size="lg" py="md">
          {/* LIVE 방송 */}
          <TitleComponent
            label="LIVE 방송"
            subLabel="지금 방송 중인 상품을 만나보세요."
          />
          {/* <Title order={3} mt="xl" mb="sm">
                        LIVE 방송
                        </Title> */}
          <Grid gutter="lg" mb={70}>
            {liveItems.map((live) => (
              <Grid.Col span={3} key={live.id}>
                <Box
                  onClick={() => navigate(`/live/${live.id}`)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  {/* 썸네일 이미지 */}
                  <Image
                    src={live.imageUrl || "https://placehold.co/400x500"}
                    alt={live.title}
                    radius="md"
                    h={400}
                    fit="cover"
                    style={{ aspectRatio: "3 / 4", objectFit: "cover" }}
                  />

                  {/* 시청 수 배지 */}
                  <Badge
                    color="red"
                    variant="filled"
                    size="sm"
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      zIndex: 1,
                    }}
                  >
                    live
                  </Badge>

                  {/* 방송 제목 */}
                  <Text mt="xs" size="sm" fw={600} lineClamp={2}>
                    {live.title}
                  </Text>

                  {/* 상품 요약 정보 (썸네일, 상품명, 가격 등) */}
                  <Flex mt="xs" align="center" gap="xs">
                    <Image
                      src={live.itemImageUrl || "https://placehold.co/60x60"}
                      alt="상품 썸네일"
                      w={50}
                      h={50}
                      fit="cover"
                      radius="sm"
                    />
                    <Box>
                      <Text size="xs">{live.itemName}</Text>
                      <Flex align="baseline" gap={6}>
                        {live.discountRate > 0 && (
                          <Text size="sm" fw={700} color="red">
                            {Math.round(live.discountRate * 100)}%
                          </Text>
                        )}
                        <Text size="sm" fw={700}>
                          {(
                            live.price *
                            (1 - live.discountRate)
                          ).toLocaleString()}
                          원
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
          <Divider my="sm" />
          <Title order={3}>다시보기</Title>
          <Text size="sm" c="dimmed">
            <Grid gutter="md" pt={10} mb={70}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Grid.Col span={3} key={i}>
                  <Card shadow="sm" padding="sm" radius="md" withBorder>
                    <Badge color="blue" variant="filled" size="sm">
                      LIVE
                    </Badge>

                    <Image
                      src={`https://placehold.co/240x320?text=Live+${i + 1}`}
                      alt="방송 이미지"
                      mt="xs"
                      radius="sm"
                    />

                    <Text mt="xs" fw={600} ta="center" size="sm">
                      라이브 방송 제목
                    </Text>

                    <Flex
                      mt="sm"
                      gap="xs"
                      justify="center"
                      align="center"
                      direction="row"
                      wrap="wrap"
                    >
                      <Image
                        src={`https://placehold.co/60x60?text=pr+${i + 1}`}
                        alt="상품 이미지"
                        radius="sm"
                        w={45}
                      />
                      <Text size="xs" fw={500}>
                        상품명
                      </Text>
                      <Text size="xs" c="red">
                        50%{" "}
                        <Text span fw={700} c="black">
                          19,800원
                        </Text>
                      </Text>
                    </Flex>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Text>
        </Container>

        {/* Footer */}
        <FooterComponent />
      </Container>
    </>
  );
}
