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
  Button,
  Skeleton,
  Stack,
} from "@mantine/core";
import {
  IconChevronDown,
  IconArrowNarrowUp,
  IconChevronUp,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import TitleComponent from "./components/titleComponent.tsx";
import BASE_URL from "../../config.js";
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
  liveId: number;
  itemId: number;
  title: string;
  imageUrl: string;
  itemName: string;
  itemImageUrl: string;
  price: number;
  discountRate: number;
  status: string;
  liveDate: string;
  liveStartTime: string;
  liveEndTime: string;
}

const categoryMap: Record<string, string> = {
  여행: "TRAVEL",
  항공: "FLIGHT",
  숙박: "ACCOMMODATION",
  캠핑: "CAMPING",
  교통: "TRANSPORT",
};

const LiveSkeletonCard = () => (
  <Box style={{ width: "100%", maxWidth: 300 }}>
    <Skeleton height={400} radius="md" />
    <Stack gap="xs" mt="sm">
      <Skeleton height={16} width="60%" />
      <Skeleton height={14} width="80%" />
      <Skeleton height={14} width="50%" />
    </Stack>
  </Box>
);

const ProductSkeletonCard = () => (
  <Box style={{ width: "100%", maxWidth: 300 }}>
    <Skeleton height={320} radius="md" />
    <Stack gap="xs" mt="sm">
      <Skeleton height={12} width="30%" />
      <Skeleton height={16} width="90%" />
      <Skeleton height={14} width="60%" />
    </Stack>
  </Box>
);

export default function MainPage() {
  const navigate = useNavigate();
  const [bestItems, setBestItems] = useState<Item[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>();
  const [loginUser, setLoginUser] = useState<string | null>("");
  const [currentLiveItem, setCurrentLiveItem] = useState<LiveItem | null>(null);
  const [endedLiveItems, setEndedLiveItems] = useState<LiveItem[]>([]);
  const mergedLiveItems = [
    ...(currentLiveItem ? [currentLiveItem] : []),
    ...endedLiveItems,
  ];
  const [allBestItems, setAllBestItems] = useState<Item[]>([]);
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [showAllItems, setShowAllItems] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchCurrentLive = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${BASE_URL}/live/main`, {
        method: "GET",
        headers: { Accept: "*/*", access: token || "" },
        credentials: "include",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: LiveItem = await response.json();
      setCurrentLiveItem(data);
    } catch (err) {
      console.error("현재 라이브 정보 불러오기 실패:", err);
    }
  };

  const fetchEndedLives = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${BASE_URL}/live/list`, {
        method: "GET",
        headers: { Accept: "*/*", access: token || "" },
        credentials: "include",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: LiveItem[] = await response.json();
      setEndedLiveItems(data);
    } catch (err) {
      console.error("종료된 라이브 불러오기 실패:", err);
    }
  };

  const fetchBestItems = async () => {
    try {
      const params = new URLSearchParams({
        sortBy: "wishlist",
        page: "0",
        size: "20",
        sort: "wishlistCount,DESC",
      });

      const response = await fetch(
        `${BASE_URL}/item/search?${params.toString()}`,
        {
          method: "GET",
          headers: { Accept: "*/*" },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const items = data.content || [];

      setAllBestItems(items);
      setVisibleItems(items.slice(0, 4)); // 초기 4개
    } catch (err) {
      console.error("Error fetching best items:", err);
    }
  };

  const toggleShowAll = () => {
    if (showAllItems) {
      // 접기
      setVisibleItems(allBestItems.slice(0, 4));
    } else {
      // 더보기
      setVisibleItems(allBestItems);
    }
    setShowAllItems(!showAllItems);
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
    fetchBestItems();
    fetchCurrentLive();
    fetchEndedLives();
  }, []);

  return (
    <>
      <HeaderComponent />
      <Box
        w="100%"
        h={45}
        style={{
          background: "#409fff",
          color: "white",
          padding: "10px 0",
          textAlign: "center",
        }}
      >
        지금 가입하면 50% 할인 쿠폰 증정
      </Box>

      <Container size="lg" py="lg">
        <Box
          bg="white"
          p="xl"
          style={{
            overflow: "hidden",
          }}
        >
          <Image
            src="/assets/b2.png"
            alt="메인 배너"
            radius="md"
            w="100%"
            style={{
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      </Container>

      <Container size="lg" py="md">
        <TitleComponent
          label="SHOONG LIVE"
          subLabel="지금 방송 중이거나 종료된 방송을 한 눈에!"
        />
        <Grid gutter="lg" mb={70}>
          {mergedLiveItems.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
              <Grid.Col span={{ base: 6, md: 3 }} key={idx}>
                <LiveSkeletonCard />
              </Grid.Col>
            ))
            : mergedLiveItems.map((live) => (
              <Grid.Col span={{ base: 6, md: 3 }} key={live.liveId}>
                {/* 기존 live 카드 렌더링 코드 */}
                <Box
                  onClick={() => navigate(`/live/${live.liveId}`)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <Image
                    src={live.imageUrl || "https://placehold.co/400x500"}
                    alt={live.title}
                    radius="md"
                    fit="cover"
                    style={{
                      width: "100%",
                      aspectRatio: "3 / 4",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                  <Badge
                    color={live.status === "ONGOING" ? "red" : "gray"}
                    variant="filled"
                    size="sm"
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      zIndex: 1,
                    }}
                  >
                    {live.status === "ONGOING" ? "LIVE" : "종료됨"}
                  </Badge>
                  <Text mt="xs" size="sm" fw={600} lineClamp={2}>
                    {live.title}
                  </Text>
                  <Flex mt="xs" align="center" gap="xs">
                    <Image
                      src={live.itemImageUrl || "https://placehold.co/60x60"}
                      alt="상품 썸네일"
                      w={50}
                      h={50}
                      fit="cover"
                      radius="sm"
                    />
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="xs">{live.itemName}</Text>
                      <Flex align="baseline" gap={6}>
                        {live.discountRate > 0 && (
                          <Text size="sm" fw={700} color="red">
                            {Math.round(live.discountRate * 100)}%
                          </Text>
                        )}
                        {live.price !== null && (
                          <>
                            {live.discountRate > 0 && (
                              <Text size="xs" td="line-through" c="dimmed">
                                {live.price.toLocaleString()}원
                              </Text>
                            )}
                            <Text size="sm" fw={700}>
                              {(
                                live.price *
                                (1 - live.discountRate)
                              ).toLocaleString()}
                              원
                            </Text>
                          </>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Grid.Col>
            ))}
        </Grid>

        <Flex justify="space-between" align="center" mt="xl" mb="sm">
          <TitleComponent
            label="BEST SELLER"
            subLabel="가장 많이 팔리는 아이템을 한 눈에!"
          />
          <Button
            variant="transparent"
            size="sm"
            color="gray"
            onClick={toggleShowAll}
            leftSection={
              showAllItems ? (
                <IconChevronUp size={18} />
              ) : (
                <IconChevronDown size={18} />
              )
            }
          >
            {showAllItems ? "접기" : "더보기"}
          </Button>
        </Flex>

        <Grid gutter="xl">
          {visibleItems.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
              <Grid.Col span={{ base: 6, md: 3 }} key={idx}>
                <ProductSkeletonCard />
              </Grid.Col>
            ))
            : visibleItems.map((item) => (
              <Grid.Col span={{ base: 6, md: 3 }} key={item.itemId}>
                <Box
                  onClick={() =>
                    navigate(`/item/${item.itemId}`, { state: item })
                  }
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  {/* 이미지 + 흐리게 처리 + SOLD OUT 뱃지 */}
                  <Box style={{ position: "relative" }}>
                    <Image
                      src={
                        item.itemImages?.[0]?.url ||
                        "https://placehold.co/400x400"
                      }
                      alt={item.itemName}
                      radius="md"
                      height={320}
                      fit="cover"
                      style={{
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        filter:
                          item.status === "SOLD_OUT"
                            ? "grayscale(60%) opacity(60%)"
                            : "none",
                      }}
                    />
                    {item.status === "SOLD_OUT" && (
                      <Badge
                        color="dark"
                        variant="filled"
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          zIndex: 1,
                        }}
                      >
                        SOLD OUT
                      </Badge>
                    )}
                  </Box>
                  {/* 카테고리 표시 */}
                  <Text size="xs" c="dimmed" mt={10}>
                    {categoryMap[item.category] || ""}
                  </Text>

                  {/* 상품명 */}
                  <Text size="sm" fw={600} mt={4} mb={4}>
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

        <CountdownBanner />

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
            <Accordion.Control>배송은 얼마나 걸리나요?</Accordion.Control>
            <Accordion.Panel>2~3일 정도 후에 배송됩니다.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>

      <Button
        onClick={scrollToTop}
        variant="filled"
        color="#409fff"
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 999,
          width: 50,
          height: 50,
          borderRadius: "50%",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconArrowNarrowUp size={30} />
      </Button>

      <FooterComponent />
    </>
  );
}
