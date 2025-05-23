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

// filter 처리 하기
const categories = [
  { label: "전체", value: "", icon: "⚪️" },
  { label: "여행", value: "TRAVEL", icon: "🏖️" },
  { label: "숙박", value: "STAY", icon: "🛏️" },
  { label: "항공", value: "AIR", icon: "✈️" },
  { label: "캠핑", value: "CAMP", icon: "⛺" },
  { label: "교통", value: "CAR", icon: "🚗" },
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

  useEffect(() => {
    fetchItemListByKeyword("");
  }, []);

  const fetchItemListByKeyword = async (keyword: string) => {
    try {
      const token = localStorage.getItem("access");

      const page = 0;
      const size = 10;
      const sort = "itemId,desc";

      const url = `http://192.168.0.6:8080/item/search?keyword=${encodeURIComponent(
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
      const sort = "itemId,desc"; // sort="string" 말고 실제 정렬 기준 명시

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
        {/* 검색창 */}
        <TextInput
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchItemListByKeyword(searchKeyword);
          }}
          mb="lg"
        />

        {/* 카테고리 필터 */}
        <Flex justify="center" gap="lg" wrap="wrap" mb="lg">
          {categories.map((cat) => (
            <Box
              key={cat.value}
              onClick={() => {
                setSelected(cat.value);
                fetchItemListByCategory(cat.value);
              }}
              style={{
                cursor: "pointer",
                textAlign: "center",
                fontWeight: selected === cat.value ? 700 : 500,
                color: selected === cat.value ? "black" : "#999",
              }}
            >
              <Text fz={30}>{cat.icon}</Text>
              <Text fz="sm">{cat.label}</Text>
            </Box>
          ))}
        </Flex>

        {/* 상품 목록 */}
        {/* <Grid gutter="md" mt={40}>
          {items.map((item) => (
            <Grid.Col span={{ base: 6, md: 4 }} key={item.itemId}>
              <Card
                withBorder
                shadow="xs"
                radius="md"
                padding="sm"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/item/${item.itemId}`, { state: item })
                }
              >
                {item.discountRate > 0 && (
                  <Badge color="red" variant="filled" size="sm">
                    {item.discountRate * 100}%
                  </Badge>
                )}

                {item.status === "SOLD_OUT" && (
                  <Badge color="gray" variant="filled" size="sm" mt="xs">
                    품절
                  </Badge>
                )}

                <Image
                  src={
                    item.itemImages?.[0]?.url || "https://placehold.co/600x600"
                  }
                  alt={item.itemName}
                  radius="sm"
                  height={200}
                  fit="cover"
                  mt="sm"
                />

                <Text mt="sm" fw={600} size="sm">
                  {item.itemName}
                </Text>

                <Flex mt="xs" align="baseline" gap="xs">
                  {item.discountRate > 0 && (
                    <Text size="xs" td="line-through" c="dimmed">
                      {item.price.toLocaleString()}원
                    </Text>
                  )}
                  <Text size="sm" fw={700}>
                    {item.finalPrice.toLocaleString()}원
                  </Text>
                </Flex>
              </Card>
            </Grid.Col>
          ))}
        </Grid> */}
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
