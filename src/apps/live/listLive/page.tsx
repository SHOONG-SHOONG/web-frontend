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
  Divider,
  Button,
} from "@mantine/core";
import HeaderComponent from "../../../components/Header.tsx";
import FooterComponent from "../../../components/Footer.tsx";
import { useNavigate } from "react-router-dom";
import TitleComponent from "../../main/components/titleComponent.tsx";
import STREAM_URL from "../../../config.js";
import { IconArrowNarrowUp } from "@tabler/icons-react";

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

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function ListLivePage() {
  const navigate = useNavigate();
  const [liveItem, setLiveItem] = useState<LiveItem | null>(null);
  const [latestLiveItems, setLatestLiveItems] = useState<LiveItem[]>([]);

  useEffect(() => {
    const fetchLatestLiveItems = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await fetch(`${STREAM_URL}/live/list`, {
          method: "GET",
          headers: {
            access: token || "",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data: LiveItem[] = await response.json();
        setLatestLiveItems(data);
      } catch (err) {
        console.error("최신 다시보기 정보 불러오기 실패:", err);
      }
    };

    const fetchLiveItem = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await fetch(`${STREAM_URL}/live/main`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            access: token || "",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data: LiveItem = await response.json();
        setLiveItem(data);
      } catch (err) {
        console.error("라이브 방송 정보 불러오기 실패:", err);
      }
    };

    fetchLiveItem();
    fetchLatestLiveItems();
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

          <Grid gutter="lg" mb={70}>
            {liveItem && (
              <Grid.Col span={3}>
                <Box
                  onClick={() => navigate(`/live/${liveItem.id}`)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <Image
                    src={liveItem.imageUrl || "https://placehold.co/400x500"}
                    alt={liveItem.title}
                    radius="md"
                    // h={400}
                    fit="cover"
                    style={{
                      width: "100%",            // ✅ 반응형 너비
                      aspectRatio: "3 / 4",     // ✅ 비율 유지
                      height: "auto",           // ✅ 고정 높이 제거
                      objectFit: "cover",       // ✅ 잘림 방지
                    }}
                  />
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
                  <Text mt="xs" size="sm" fw={600} lineClamp={2}>
                    {liveItem.title}
                  </Text>
                  <Flex mt="xs" align="center" gap="xs">
                    <Image
                      src={
                        liveItem.itemImageUrl || "https://placehold.co/60x60"
                      }
                      alt="상품 썸네일"
                      w={50}
                      h={50}
                      fit="cover"
                      radius="sm"
                    />
                    <Box>
                      <Text size="xs">{liveItem.itemName}</Text>
                      <Flex align="baseline" gap={6}>
                        {liveItem.discountRate > 0 && (
                          <Text size="sm" fw={700} color="red">
                            {Math.round(liveItem.discountRate * 100)}%
                          </Text>
                        )}
                        {liveItem.price !== null && (
                          <Text size="sm" fw={700}>
                            {(
                              liveItem.price *
                              (1 - liveItem.discountRate)
                            ).toLocaleString()}
                            원
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Grid.Col>
            )}
          </Grid>

          <Divider my="sm" />

          <TitleComponent label="다시보기" subLabel="지난 방송을 확인하세요." />

          <Grid gutter="lg" mb={70}>
            {latestLiveItems.length > 0 ? (
              latestLiveItems.map((live) => (
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
                      // h={400}
                      fit="cover"
                      style={{
                        width: "100%",            // ✅ 반응형 너비
                        aspectRatio: "3 / 4",     // ✅ 비율 유지
                        height: "auto",           // ✅ 고정 높이 제거
                        objectFit: "cover",       // ✅ 잘림 방지
                      }}
                    />

                    {/* 배지 */}
                    <Badge
                      color="gray"
                      variant="filled"
                      size="sm"
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 1,
                      }}
                    >
                      다시보기
                    </Badge>

                    {/* 방송 제목 */}
                    <Text mt="xs" size="sm" fw={600} lineClamp={2}>
                      {live.title}
                    </Text>

                    {/* 상품 요약 정보 */}
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
              ))
            ) : (
              <Text size="sm" c="gray.5" style={{ lineHeight: 1.6, maxWidth: 320 }}>
                최근 방송이 없습니다.
              </Text>
            )}
          </Grid>
        </Container>
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
