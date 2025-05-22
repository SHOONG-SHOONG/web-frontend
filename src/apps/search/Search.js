import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import BASE_URL from '../../config';

import {
  Box,
  Button,
  Group,
  Image,
  Paper,
  RangeSlider,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

const ProductCard = ({ title, price, imageUrl }) => (
  <Paper shadow="sm" radius="md" p="md" withBorder>
    <Box
      h={192}
      mb="sm"
      sx={{
        backgroundColor: '#f1f1f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src={imageUrl || "https://placehold.co/100x100"}
        alt={`Image of ${title}`}
        width={80}
        height={80}
        fit="contain"
        withPlaceholder
      />
    </Box>
    <Text size="sm" lineClamp={2}>{title}</Text>
    <Text fw={700}>₩{price?.toLocaleString() || 0}</Text>
  </Paper>
);

const ProductPage = () => {
  const [keyword, setKeyword] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState('');
  const [products, setProducts] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const page = 0;
  const size = 20;

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append('category', '');
      queryParams.append('keyword', keyword);
      queryParams.append('minPrice', String(minPrice));
      queryParams.append('maxPrice', String(maxPrice));
      queryParams.append('sortBy', sortBy);
      queryParams.append('brandId', '0');
      queryParams.append('page', String(page));
      queryParams.append('size', String(size));

      if (sortBy) {
        queryParams.append('sort', sortBy);
      }

      const response = await fetch(`${BASE_URL}/item/search?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.content || []);
      } else {
        alert('상품 검색 실패');
      }
    } catch (error) {
      console.error('검색 오류:', error);
    }
  };

  const onSearchClick = () => {
    setHasSearched(true);
    fetchProducts();
  };

  // sortBy가 바뀌면 검색 자동 실행
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
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '70px',
          width: '100vw',
          maxWidth: '100vw',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Sidebar */}
        <Box w={280} p="md" sx={{ border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <Stack>
            <Box mb={32}>
              <Text fw={600} size="sm" mb={4}>키워드</Text>
              <TextInput
                value={keyword}
                onChange={(e) => setKeyword(e.currentTarget.value)}
                placeholder="검색어 입력"
              />
            </Box>

            <Box mb={32}>
              <Text fw={600} size="sm" mb={4}>가격</Text>
              <RangeSlider
                color="rgba(77, 97, 255, 1)"
                value={[minPrice, maxPrice]}
                onChange={(val) => {
                  setMinPrice(val[0]);
                  setMaxPrice(val[1]);
                }}
                min={0}
                max={200000}
                step={10000}
                marks={[
                  { value: 0, label: '₩0' },
                  { value: 100000, label: '₩100,000' },
                  { value: 200000, label: '₩200,000' },
                ]}
              />
            </Box>

            <Box mb={32}>
              <Text fw={600} size="sm" mb={4}>정렬</Text>
              <Group spacing="xs">
                <Button
                  onClick={() => setSortBy('priceAsc')}
                  variant={sortBy === 'priceAsc' ? 'filled' : 'light'}
                  size="xs"
                  radius="xl"
                >
                  가격 낮은 순 
                </Button>
                <Button
                  onClick={() => setSortBy('priceDesc')}
                  variant={sortBy === 'priceDesc' ? 'filled' : 'light'}
                  size="xs"
                  radius="xl"
                >
                  가격 높은 순 
                </Button>
              </Group>
            </Box>

            <Button onClick={onSearchClick} fullWidth>검색</Button>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
          {hasSearched ? (
            products.length > 0 ? (
              <SimpleGrid cols={4} spacing="lg">
                {products.map((item) => (
                  <ProductCard
                    key={item.itemId}
                    title={item.itemName}
                    price={item.finalPrice}
                    imageUrl={item.itemImages?.[0]?.url}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Text>검색 결과가 없습니다.</Text>
            )
          ) : (
            <Text>검색 조건을 입력하고 "검색" 버튼을 눌러주세요.</Text>
          )}
        </Box>
      </Box>

      <FooterComponent />
    </>
  );
};

export default ProductPage;
