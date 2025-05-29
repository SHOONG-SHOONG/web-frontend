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
} from "@mantine/core";

type ProductBoxProps = {
  itemId: number;
  title: string;
  price: number;
  discountRate?: number;
  imageUrl?: string;
};

const ProductBox = ({
  itemId,
  title,
  price,
  discountRate = 0,
  imageUrl,
}: ProductBoxProps) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/item/${itemId}`)}
      style={{
        width: 220,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <Image
        src={imageUrl || "https://placehold.co/300x300"}
        alt={`Image of ${title}`}
        height={260}
        fit="contain"
        mb={4}
      />
      <Text size="xs" c="gray">
        CRASH BAGGAGE
      </Text>
      <Text size="sm" fw={500} lh={1.3} lineClamp={2}>
        {title}
      </Text>
      <Text size="sm" fw={700}>
        ₩{price.toLocaleString()}
        {discountRate > 0 && (
          <Text span size="xs" c="red" ml={8}>
            {discountRate}% ↓
          </Text>
        )}
      </Text>
    </Box>
  );
};

type Product = {
  itemId: number;
  itemName: string;
  finalPrice: number;
  discountRate?: number;
  itemImages?: { url: string }[];
};

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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
          <Box style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
            {hasSearched ? (
              products.length > 0 ? (
                products.map((item) => (
                  <ProductBox
                    key={item.itemId}
                    itemId={item.itemId}
                    title={item.itemName}
                    price={item.finalPrice}
                    imageUrl={item.itemImages?.[0]?.url}
                    discountRate={item.discountRate ?? 0}
                  />
                ))
              ) : (
                <Text>검색 결과가 없습니다.</Text>
              )
            ) : (
              <Text>검색 조건을 입력하고 "검색" 버튼을 눌러주세요.</Text>
            )}
          </Box>
        </Box>
      </Box>

      <FooterComponent />
    </>
  );
};

export default SearchPage;
