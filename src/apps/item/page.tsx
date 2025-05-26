import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FooterComponent from "../../components/Footer.tsx";
import HeaderComponent from "../../components/Header.tsx";
import {
  Box,
  Container,
  Grid,
  Image,
  Text,
  Card,
  Badge,
  Flex,
  Button,
  Tooltip,
  TextInput,
} from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import BASE_URL from "../../config.js";

// filter
const categories = [
  {
    label: "전체",
    value: "",
    icon: "⭐️",
    url: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/star_2b50.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/star_2b50.png",
  },
  {
    label: "여행",
    value: "TRAVEL",
    icon: "🏖️",
    url: "https://em-content.zobj.net/source/microsoft-teams/363/palm-tree_1f334.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/palm-tree_1f334.png",
  },
  {
    label: "숙박",
    value: "STAY",
    icon: "🛏️",
    url: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/bed_1f6cf-fe0f.png",
    murl: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/bed_1f6cf-fe0f.png",
  },
  {
    label: "항공",
    value: "AIR",
    icon: "✈️",
    url: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/airplane-departure_1f6eb.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/airplane-departure_1f6eb.png",
  },
  {
    label: "캠핑",
    value: "CAMP",
    icon: "🏕",
    url: "https://em-content.zobj.net/source/microsoft-teams/363/camping_1f3d5-fe0f.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/camping_1f3d5-fe0f.png",
  },
  {
    label: "교통",
    value: "CAR",
    icon: "🚗",
    url: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/automobile_1f697.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/automobile_1f697.png",
  },
];

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

interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export default function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [selected, setSelected] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const fetchItemListByKeyword = async (keyword: string) => {
    try {
      const token = localStorage.getItem("access");

      const page = 0;
      const size = 10;
      const sort = "itemId,desc";

      const url = `${BASE_URL}/item/search?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}&size=${size}&sort=${sort}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      setItems(data.content);
      setPageInfo(data.page);
      setError(null);
    } catch (err: any) {
      console.error("상품 목록 불러오기 실패:", err);
      setError(err.message || "상품 조회 중 오류 발생");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemListByCategory = async (category: string) => {
    try {
      const token = localStorage.getItem("access");

      const page = 0;
      const size = 10;
      const sort = "itemId,desc";

      const url = `http://192.168.0.6:8080/item/search?category=${encodeURIComponent(
        category
      )}&page=${page}&size=${size}&sort=${sort}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      setItems(data.content);
      setPageInfo(data.page);
      setError(null);
    } catch (err: any) {
      console.error("카테고리별 상품 불러오기 실패:", err);
      setError(err.message || "상품 조회 중 오류 발생");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemListByKeyword("");
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <HeaderComponent />

      <Container size="lg" py="xl">
        {/* Filter */}
        <Flex
          mb={32}
          gap={24}
          wrap="nowrap"
          style={{ overflowX: "auto", paddingBottom: 8 }}
          justify="center"
        >
          {categories.map((cat) => (
            <Box
              key={cat.value}
              onClick={() => {
                setSelected(cat.value);
                fetchItemListByCategory(cat.value);
              }}
              style={{ textAlign: "center", cursor: "pointer", minWidth: 72 }}
            >
              <Box
                w={50}
                h={50}
                style={{
                  borderRadius: "50%",
                  fontSize: 33,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <span className="tossface">{cat.icon}</span>
              </Box>
              <Text
                mt={6}
                size="xs"
                fw={selected === cat.value ? 700 : 400}
                truncate
              >
                {cat.label}
              </Text>
            </Box>
          ))}
        </Flex>

        {/* 상품 목록 */}
        <Grid gutter="xl" mt={40}>
          {items.map((item) => (
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

        {/* 위로가기 버튼 */}
        <Box style={{ position: "fixed", bottom: 30, right: 30 }}>
          <Tooltip label="위로 가기" position="left" withArrow>
            <Button
              size="md"
              radius="xl"
              color="blue"
              onClick={handleScrollTop}
            >
              <IconArrowUp size={16} />
            </Button>
          </Tooltip>
        </Box>
      </Container>

      <FooterComponent />
    </>
  );
}
