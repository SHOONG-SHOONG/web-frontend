import React, { useState } from "react";
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
} from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";

// filter 처리 하기
const categories = [
  { label: "전체", value: "all", icon: "⚪️" },
  { label: "여행", value: "travel", icon: "🏖️" },
  { label: "숙박", value: "stay", icon: "🛏️" },
  { label: "항공", value: "air", icon: "✈️" },
  { label: "캠핑", value: "camp", icon: "⛺" },
  { label: "교통", value: "car", icon: "🚗" },
];

// sample data
const items = [
  {
    id: 1,
    title: "캠핑의자",
    original: "65,000원",
    sale: "76,500원",
    discount: "10%",
    image: "https://placehold.co/600x600?text=cc",
  },
  {
    id: 2,
    title: "라이브 쇼케이스 스마트폰 거치대",
    original: "4,000원",
    sale: "3,500원",
    discount: "12%",
    image: "https://placehold.co/600x600?text=aa",
  },
  {
    id: 3,
    title: "실시간 방송용 LED 조명",
    original: "3,000원",
    sale: "2,900원",
    discount: "3%",
    image: "https://placehold.co/600x600?text=ll",
  },
  {
    id: 4,
    title: "라이브 스트리밍 마이크",
    sale: "2,000원",
    image: "https://placehold.co/600x600?text=mm",
  },
  {
    id: 5,
    title: "고퀄리티 핸드폰",
    sale: "1,000원",
    badge: "품절",
    image: "https://placehold.co/600x600?text=ss",
  },
];

export default function ItemPage() {
  const [selected, setSelected] = useState("all");
  const navigate = useNavigate();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <HeaderComponent />

      <Container size="lg" py="xl">
        {/* 카테고리 필터 */}
        <Flex justify="center" gap="lg" wrap="wrap" mb="lg" mt={20}>
          {categories.map((cat) => (
            <Box
              key={cat.value}
              onClick={() => setSelected(cat.value)}
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
        <Grid gutter="md" mt={40}>
          {items.map((item, i) => (
            <Grid.Col span={{ base: 6, md: 4 }} key={i}>
              <Card
                withBorder
                shadow="xs"
                radius="md"
                padding="sm"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/item/${item.id}`, { state: item })}
              >
                {item.discount && (
                  <Badge color="red" variant="filled" size="sm">
                    {item.discount}
                  </Badge>
                )}
                {item.badge && (
                  <Badge color="gray" variant="filled" size="sm" mt="xs">
                    {item.badge}
                  </Badge>
                )}

                <Image
                  src={item.image}
                  alt={item.title}
                  radius="sm"
                  height={200}
                  fit="cover"
                  mt="sm"
                />

                <Text mt="sm" fw={600} size="sm">
                  {item.title}
                </Text>

                <Flex mt="xs" align="baseline" gap="xs">
                  {item.original && (
                    <Text size="xs" td="line-through" c="dimmed">
                      {item.original}
                    </Text>
                  )}
                  <Text size="sm" fw={700}>
                    {item.sale}
                  </Text>
                </Flex>
              </Card>
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
