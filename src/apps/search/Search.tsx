import React, { useState, useEffect } from "react";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import BASE_URL from "../../config.js";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Group,
  Image,
  RangeSlider,
  Stack,
  Text,
  TextInput,
  Grid,
  Badge,
  Flex,
  Skeleton,
} from "@mantine/core";

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

const categoryMap: Record<string, string> = {
  여행: "TRAVEL",
  항공: "FLIGHT",
  숙박: "ACCOMMODATION",
  캠핑: "CAMPING",
  교통: "TRANSPORT",
};

const ProductBox = ({
  item,
}: {
  item: Item;
}) => {
  const navigate = useNavigate();
  return (
    <Grid.Col span={{ base: 6, md: 3 }} key={item.itemId}>
      <Box
        onClick={() => navigate(`/item/${item.itemId}`)}
        style={{ cursor: "pointer", position: "relative" }}
      >
        <Box style={{ position: "relative" }}>
          <Image
            src={item.itemImages?.[0]?.url || "https://placehold.co/400x400"}
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

        <Text size="xs" c="dimmed" mt={10}>
          {categoryMap[item.category] || ""}
        </Text>

        <Text size="sm" fw={600} mt={4} mb={4} lineClamp={2}>
          {item.itemName}
        </Text>

        <Flex align="center" gap={6}>
          {item.discountRate > 0 && (
            <Text size="sm" fw={700} color="red">
              {Math.round(item.discountRate * 100)}%
            </Text>
          )}
          {item.discountRate > 0 && (
            <Text size="xs" td="line-through" c="dimmed">
              {item.price.toLocaleString()}원
            </Text>
          )}
          <Text size="sm" fw={700}>
            {item.finalPrice.toLocaleString()}원
          </Text>
        </Flex>
      </Box>
    </Grid.Col>
  );
};

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState("");
  const [products, setProducts] = useState<Item[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const page = 0;
  const size = 20;

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("category", "");
      queryParams.append("keyword", keyword);
      queryParams.append("minPrice", String(minPrice));
      queryParams.append("maxPrice", String(maxPrice));
      queryParams.append("sortBy", sortBy);
      queryParams.append("brandId", "0");
      queryParams.append("page", String(page));
      queryParams.append("size", String(size));

      const response = await fetch(
        `${BASE_URL}/item/search?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data.content || []);
      } else {
        alert("상품 검색 실패");
      }
    } catch (error) {
      console.error("검색 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchClick = () => {
    setHasSearched(true);
    fetchProducts();
  };

  useEffect(() => {
    if (hasSearched) {
      fetchProducts();
    }
  }, [sortBy]);

  return (
    <>
      <HeaderComponent />

      <Box
        px="xl"
        py="xl"
        bg="white"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          alignItems: "flex-start",
          gap: "60px",
        }}
      >
        {/* Sidebar */}
        <Box w={240} style={{ fontSize: 14 }}>
          <Text fw={600} size="30px" mb={40} mt={10}>
            CATEGORY
          </Text>
          <Stack gap={20}>
            <Box mb={10}>
              <Text fw={600} size="sm" mb={4}>
                키워드
              </Text>
              <TextInput
                value={keyword}
                onChange={(e) => setKeyword(e.currentTarget.value)}
                placeholder="검색어 입력"
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearchClick();
                }}
              />
            </Box>

            <Box mb={30}>
              <Text fw={600} size="sm" mb={4}>
                가격
              </Text>
              <RangeSlider
                color="rgba(0, 0, 0, 1)"
                size="sm"
                value={[minPrice, maxPrice]}
                onChange={(val) => {
                  setMinPrice(val[0]);
                  setMaxPrice(val[1]);
                }}
                min={0}
                max={200000}
                step={10000}
                marks={[
                  { value: 0, label: "₩0" },
                  { value: 100000, label: "₩100,000" },
                  { value: 200000, label: "₩200,000" },
                ]}
              />
            </Box>

            <Box>
              <Text fw={600} size="sm" mb={7}>
                정렬
              </Text>
              <Group gap="xs" justify="center">
                <Button
                  onClick={() => setSortBy("priceAsc")}
                  variant={sortBy === "priceAsc" ? "filled" : "outline"}
                  size="xs"
                  color="rgba(0, 0, 0, 1)"
                >
                  가격 낮은 순
                </Button>
                <Button
                  onClick={() => setSortBy("priceDesc")}
                  variant={sortBy === "priceDesc" ? "filled" : "outline"}
                  size="xs"
                  color="rgba(0, 0, 0, 1)"
                >
                  가격 높은 순
                </Button>
              </Group>
            </Box>

            <Button
              onClick={onSearchClick}
              fullWidth
              variant="filled"
              color="indigo"
              radius="xl"
              mt={10}
            >
              검색
            </Button>
          </Stack>
        </Box>

        {/* Product Listing */}
        <Box style={{ flex: 1 }}>
          {!hasSearched ? (
            <Box
              style={{
                height: 380,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 16,
                color: "#444",
              }}
            >
              <Box
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#f1f3f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/751/751463.png"
                  w={40}
                  h={40}
                  alt="No Result"
                  style={{ opacity: 0.6 }}
                />
              </Box>

              <Text fw={700} size="xl" c="gray.8">
                원하는 상품을 검색해보세요
              </Text>

              <Text size="sm" c="gray.5" style={{ lineHeight: 1.6, maxWidth: 320 }}>
                키워드, 가격, 정렬 기준으로<br />
                다양한 상품을 찾아보세요.
              </Text>
            </Box>
          ) : isLoading ? (
            <Grid gutter="xl">
              {Array.from({ length: 8 }).map((_, i) => (
                <Grid.Col span={{ base: 6, md: 3 }} key={`skeleton-${i}`}>
                  <Box>
                    <Skeleton height={320} radius="md" />
                    <Skeleton height={12} mt={12} width="60%" />
                    <Skeleton height={14} mt={6} width="80%" />
                    <Skeleton height={18} mt={6} width="50%" />
                  </Box>
                </Grid.Col>
              ))}
            </Grid>
          ) : products.length > 0 ? (
            <Grid gutter="xl">
              {products.map((item) => (
                <ProductBox key={item.itemId} item={item} />
              ))}
            </Grid>
          ) : (
            <Box
              style={{
                height: 380,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 12,
                color: "#666",
              }}
            >
              <Image
                src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                w={64}
                h={64}
                alt="No Result"
                style={{ opacity: 0.5 }}
              />
              <Text fw={600} size="lg">
                검색 결과가 없습니다
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                입력한 키워드에 맞는 상품이 없어요.
                <br />
                다른 조건이나 키워드로 다시 검색해보세요!
              </Text>
            </Box>

          )}
        </Box>
      </Box>

      <FooterComponent />
    </>
  );
};

export default SearchPage;
