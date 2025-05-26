import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Image,
  Text,
  Title,
  Accordion,
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
import BASE_URL from "../../config.js";
import { useLogin } from "../../contexts/AuthContext.tsx";
import CountdownBanner from "./components/CountdownBanner.tsx";

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
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>();
  const [loginUser, setLoginUser] = useState<string | null>("");

  const fetchLiveItems = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`${BASE_URL}/live/main`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          access: token || "",
        },
        credentials: "include",
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
        `${BASE_URL}/item/search?${params.toString()}`,
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

  const checkLogin = async () => {
    const token = localStorage.getItem("access");
    const name = localStorage.getItem("name");

    if (token && name) {
      setIsLoggedIn(true);
      setLoginUser(name);
    } else {
      setIsLoggedIn(false);
      setLoginUser(null);
    }
  };

  useEffect(() => {
    checkLogin();
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
        h={45}
        style={{
          background: "#4d6ef4",
          color: "white",
          padding: "10px 0",
          textAlign: "center",
        }}
      >
        지금 가입하면 50% 할인 쿠폰 증정
      </Box>

      {/* LIVE 방송 */}
      <Container size="lg" py="md">
        <TitleComponent
          label="SHOONG LIVE"
          subLabel="지금 방송 중인 상품을 만나보세요."
        />

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

        {/* 특가 배너 */}
        <CountdownBanner />

        {/* 자주 묻는 질문 */}
        <Title order={4} mt={80} mb="md">
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
              라이브 탭을 클릭하여 실시간 방송 중인 라이브 방송에 참여할 수
              있습니다.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="q2">
            <Accordion.Control>상품 구매는 어떻게 하나요?</Accordion.Control>
            <Accordion.Panel>
              상품 탭에 접속하여 구매를 진행할 수 있습니다.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="q3">
            <Accordion.Control>반품 정책은 어떻게 되나요?</Accordion.Control>
            <Accordion.Panel>
              상품의 상태에 따라 다른 조치로 처리됩니다.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="q4">
            <Accordion.Control>배송은 얼마나 걸린가요?</Accordion.Control>
            <Accordion.Panel>2~3일 정도 후에 배송됩니다.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>

      {/* Footer */}
      <FooterComponent />
    </>
  );
}
