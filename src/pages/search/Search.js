import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
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
// ProductCard 수정: 이미지, 제목, 가격 표시
const ProductCard = ({ title, price, imageUrl }) => (
  <Paper shadow="sm" radius="md" p="md" withBorder>
    <Box
      h={192}
      mb="sm"
      sx={{
        backgroundColor: '#F1F1F1',
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
  // 상태 관리
  const [keyword, setKeyword] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState(''); // ex: "price,asc"
  const [products, setProducts] = useState([]);
  // 페이지 관련 상태 (간단히 고정값 사용)
  const page = 0;
  const size = 20;
  // API 호출 함수
  const fetchProducts = async () => {
    try {
      const condition = {
        category: '',
        keyword: keyword,
        minPrice,
        maxPrice,
        sortBy,
        brandId: 0,
      };
      const pageable = {
        page,
        size,
        sort: sortBy ? [sortBy] : [],
      };
      const queryParams = new URLSearchParams();
      queryParams.append('condition', JSON.stringify(condition));
      queryParams.append('pageable', JSON.stringify(pageable));
      const response = await fetch(`/item/search?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // data.content 배열이 실제 상품 리스트
        setProducts(data.content || []);
      } else {
        alert('상품 검색 실패');
      }
    } catch (error) {
      console.error('검색 오류:', error);
    }
  };
  // 초기 렌더링 시 데이터 호출
  useEffect(() => {
    fetchProducts();
  }, []);
  // 검색 버튼 클릭 시 호출
  const onSearchClick = () => {
    fetchProducts();
  };
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
        <Box w={280} p="md" sx={{ border: '1px solid #E0E0E0', borderRadius: 8 }}>
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
                  onClick={() => setSortBy('price,asc')}
                  variant={sortBy === 'price,asc' ? 'filled' : 'light'}
                  size="xs"
                  radius="xl"
                >
                  가격 오름차순
                </Button>
                <Button
                  onClick={() => setSortBy('price,desc')}
                  variant={sortBy === 'price,desc' ? 'filled' : 'light'}
                  size="xs"
                  radius="xl"
                >
                  가격 내림차순
                </Button>
                <Button
                  onClick={() => setSortBy('rating,desc')}
                  variant={sortBy === 'rating,desc' ? 'filled' : 'light'}
                  size="xs"
                  radius="xl"
                >
                  평점순
                </Button>
              </Group>
            </Box>
            <Button onClick={onSearchClick} fullWidth>검색</Button>
          </Stack>
        </Box>
        {/* Main Content */}
        <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
          <SimpleGrid cols={4} spacing="lg">
            {products.length > 0 ? (
              products.map((item) => (
                <ProductCard
                  key={item.itemId}
                  title={item.itemName}
                  price={item.finalPrice}
                  imageUrl={item.itemImages?.[0]?.url}
                />
              ))
            ) : (
              <Text>검색 결과가 없습니다.</Text>
            )}
          </SimpleGrid>
        </Box>
      </Box>
      <FooterComponent />
    </>
  );
};
export default ProductPage;