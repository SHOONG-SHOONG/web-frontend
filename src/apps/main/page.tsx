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
  itemId: number;
}

export default function MainPage() {
  const navigate = useNavigate();
  const [bestItems, setBestItems] = useState<Item[]>([]);
  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const [liveItemDetails, setLiveItemDetails] = useState<Record<number, Item>>(
    {}
  );

  useEffect(() => {
    const fetchLiveAndItems = async () => {
      try {
        const response = await fetch("http://192.168.0.6:8080/live/main", {
          headers: { Accept: "*/*" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const liveData: LiveItem[] = await response.json();
        setLiveItems(liveData);

        // 각 라이브에 연결된 상품 정보 불러오기
        const detailFetches = liveData.map((live) =>
          fetch(`http://192.168.0.6:8080/item/${live.itemId}`)
            .then((res) => {
              if (!res.ok) throw new Error("Item fetch failed");
              return res.json();
            })
            .then((item: Item) => ({ itemId: live.itemId, item }))
            .catch((err) => {
              console.error(`Error loading item ${live.itemId}:`, err);
              return null;
            })
        );

        const details = await Promise.all(detailFetches);
        const detailMap: Record<number, Item> = {};
        details.forEach((d) => {
          if (d) detailMap[d.itemId] = d.item;
        });
        setLiveItemDetails(detailMap);
      } catch (err) {
        console.error("라이브 및 상품 정보 불러오기 실패:", err);
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
    fetchLiveAndItems();
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
        <Title order={3} mt="xl" mb="sm">
          LIVE 방송
        </Title>
        <Grid gutter="md" mb={70}>
          {liveItems.map((live) => {
            const item = liveItemDetails[live.itemId];
            return (
              <Grid.Col span={3} key={live.id}>
                <Card
                  shadow="sm"
                  padding="sm"
                  radius="md"
                  withBorder
                  onClick={() => navigate(`/live/${live.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Badge color="blue" variant="filled" size="sm">
                    LIVE
                  </Badge>

                  <Image
                    src={live.imageUrl || "https://placehold.co/240x320"}
                    alt={live.title}
                    mt="xs"
                    radius="sm"
                  />

                  <Text mt="xs" fw={600} ta="center" size="sm">
                    {live.title}
                  </Text>

                  {item && (
                    <Flex
                      mt="sm"
                      gap="xs"
                      justify="center"
                      align="center"
                      direction="row"
                      wrap="wrap"
                    >
                      <Image
                        src={
                          item.itemImages?.[0]?.url ||
                          "https://placehold.co/60x60"
                        }
                        alt="상품 이미지"
                        radius="sm"
                        w={45}
                      />
                      <Text size="xs" fw={500}>
                        {item.itemName}
                      </Text>
                      <Text size="xs" c="red">
                        {item.discountRate * 100}%{" "}
                        <Text span fw={700} c="black">
                          {item.finalPrice.toLocaleString()}원
                        </Text>
                      </Text>
                    </Flex>
                  )}
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>

        {/* 실시간 Best 상품 */}
        <Flex justify="space-between" align="center" mt="xl" mb="md">
          <Title order={3}>실시간 Best 상품</Title>
          <Anchor href="#" size="xs" c="dimmed">
            &gt; 더보기
          </Anchor>
        </Flex>

        <Grid gutter="md" mb={70}>
          {bestItems.map((item) => (
            <Grid.Col span={4} key={item.itemId}>
              <Card
                padding="sm"
                radius="md"
                withBorder
                onClick={() =>
                  navigate(`/item/${item.itemId}`, { state: item })
                }
                style={{ cursor: "pointer" }}
              >
                <Card.Section>
                  <Image
                    src={
                      item.itemImages?.[0]?.url ||
                      "https://placehold.co/300x300"
                    }
                    alt={item.itemName}
                    height={160}
                    fit="cover"
                  />
                </Card.Section>

                <Text mt="xs" fw={600} size="sm">
                  {item.itemName}
                </Text>

                <Flex mt="xs" align="baseline" gap="xs">
                  <Text size="xs" c="red" fw={600}>
                    {item.discountRate > 0 ? `${item.discountRate}%` : ""}
                  </Text>
                  <Text size="xs" td="line-through" c="dimmed">
                    {item.discountRate > 0
                      ? `${item.price.toLocaleString()}원`
                      : ""}
                  </Text>
                  <Text size="sm" fw={700}>
                    {item.finalPrice.toLocaleString()}원
                  </Text>
                </Flex>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* 자주 묻는 질문 */}
        <Title order={4} mt="xl" mb="md">
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
