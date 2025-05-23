import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Image,
  Text,
  Title,
  Accordion,
  Card,
  Badge,
  Box,
  Flex,
  Anchor,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import TitleComponent from "./components/titleComponent.tsx";

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

export default function MainPage() {
  const navigate = useNavigate();
  const [bestItems, setBestItems] = useState<Item[]>([]);
  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const [liveItemDetails, setLiveItemDetails] = useState<Record<number, Item>>(
    {}
  );

  useEffect(() => {
    const fetchLiveItems = async () => {
      try {
        const response = await fetch("http://192.168.0.6:8080/live/main", {
          headers: { Accept: "*/*" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const liveData: LiveItem[] = await response.json();
        setLiveItems(liveData);
      } catch (err) {
        console.error("라이브 방송 정보 불러오기 실패:", err);
      }
    };

    const fetchBestItems = async () => {
      try {
        const params = new URLSearchParams({
          sortBy: "wishlist", // condition.sortBy
          page: "0",
          size: "6",
          sort: "wishlistCount,DESC",
        });

        const response = await fetch(
          `http://192.168.0.6:8080/item/search?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status} - ${errText}`);
        }

        const data = await response.json();
        setBestItems(data.content || []);
      } catch (err) {
        console.error("Error fetching best items:", err);
      }
    };

    fetchBestItems();
    fetchLiveItems();
  }, []);

  return (
    <>
      {/* Header */}
      <HeaderComponent />

      {/* Banner */}
      <Box
        w="100%"
        style={{
          background: "#3B61FF",
          color: "white",
          padding: "10px 0",
          textAlign: "center",
        }}
      >
        🎉 지금 가입하면 50% 할인 쿠폰 증정 🎉
      </Box>

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

        {/* 실시간 Best 상품 */}
        <Flex justify="space-between" align="center" mt="xl" mb="sm">
          <TitleComponent
            label="BEST SELLER"
            subLabel="가장 많이 팔리는 아이템을 한 눈에!"
          />
          <Anchor href="#" size="xs" c="dimmed">
            &gt; 더보기
          </Anchor>
        </Flex>
        <Grid gutter="xl">
          {bestItems.map((item) => (
            <Grid.Col span={{ base: 6, md: 3 }} key={item.itemId}>
              <Box
                onClick={() =>
                  navigate(`/item/${item.itemId}`, { state: item })
                }
                style={{ cursor: "pointer" }}
              >
                {/* 이미지 */}
                <Image
                  src={
                    item.itemImages?.[0]?.url || "https://placehold.co/400x400"
                  }
                  alt={item.itemName}
                  radius="md"
                  height={320}
                  fit="cover"
                  style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                />

                {/* 브랜드명 */}
                <Text mt="md" size="xs" fw={600}>
                  {/* 예시: 브랜드 ID에 따라 임의 지정 가능 */}
                  {item.brandId === 1
                    ? "PISCESS"
                    : item.brandId === 2
                    ? "ROUGH SIDE WHITE LABEL"
                    : item.brandId === 3
                    ? "NOTIA"
                    : "KINDERSALMON"}
                </Text>

                {/* 상품명 */}
                <Text size="sm" mb="xs">
                  {item.itemName}
                </Text>

                {/* 할인율 + 가격 */}
                <Flex align="center" gap={6}>
                  {item.discountRate > 0 && (
                    <Text size="sm" fw={700} color="red">
                      {item.discountRate * 100}%
                    </Text>
                  )}
                  <Text size="sm" fw={700}>
                    {item.finalPrice.toLocaleString()}원
                  </Text>
                </Flex>
              </Box>
            </Grid.Col>
          ))}
        </Grid>

        {/* 자주 묻는 질문 */}
        <Title order={4} mt={150} mb="md">
          자주 묻는 질문
        </Title>
        <Accordion
          chevronPosition="right"
          defaultValue={null}
          chevron={<IconChevronDown size={18} />}
          mb={70}
        >
          <Accordion.Item value="q1">
            <Accordion.Control>
              라이브 방송은 어떻게 참여하나요?
            </Accordion.Control>
            <Accordion.Panel>
              가입 후 방송 게시판에서 정보를 확인하세요.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="q2">
            <Accordion.Control>상품 구매는 어떻게 하나요?</Accordion.Control>
            <Accordion.Panel>
              개발자 방송을 시청하면 복잡할 수 있습니다.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="q3">
            <Accordion.Control>반통 정책은 어떻게 되나요?</Accordion.Control>
            <Accordion.Panel>
              상품의 상태에 따라 다른 조차로 처리됩니다.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="q4">
            <Accordion.Control>배송은 얼마나 걸린가요?</Accordion.Control>
            <Accordion.Panel>2~3일 정도 속에 배송됩니다.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>

      {/* Footer */}
      <FooterComponent />
    </>
  );
}
