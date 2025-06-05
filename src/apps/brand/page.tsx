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
  Stack,
  Divider,
  Center,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../config.js";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";

interface Item {
  itemId: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface BrandData {
  brandName: string;
  brandDescription: string;
  logoUrl: string;
  items: Item[];
}

export default function BrandPage() {
  const { brandId } = useParams();
  const navigate = useNavigate();

  const [brandData, setBrandData] = useState<BrandData | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch(`${BASE_URL}/brand/summary/${brandId}`);
        if (!res.ok) throw new Error("브랜드 정보를 가져오는 데 실패했습니다.");
        const data = await res.json();
        setBrandData(data);
      } catch (err) {
        console.error("브랜드 정보 조회 실패:", err);
      }
    };



    fetchBrand();
  }, [brandId]);

  if (!brandId) {
    return <Text color="red">유효하지 않은 브랜드 경로입니다.</Text>;
  }

  if (!brandData) {
    return <Text>로딩 중...</Text>;
  }

  return (
    <>
      <HeaderComponent />

      <Container size="lg" pt={30}>
        <Box mb={50}>
          <Grid gutter="xl" align="center">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Box
                style={{
                  padding: 12,
                  border: "2px solid #e0e0e0",
                  borderRadius: "999px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                  width: 150,
                  height: 150,
                  margin: "0 auto",
                }}
              >
                <Image
                  src={brandData.logoUrl}
                  alt="브랜드 로고"
                  radius="xl"
                  width={120}
                  height={120}
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="xs">
                <Title order={2} fw={700}>
                  {brandData.brandName}
                </Title>
                <Text size="md" color="dimmed" lh={1.6}>
                  {brandData.brandDescription || "브랜드 설명이 없습니다."}
                </Text>
                <Badge color="blue" size="lg" variant="light" w="fit-content">
                  # {brandData.brandName}와 함께
                </Badge>
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>

        <Divider my={30} label="상품 목록" labelPosition="center" />

        {brandData.items.length === 0 ? (
          <Center pb={60}>
            <Text color="dimmed">등록된 상품이 없습니다.</Text>
          </Center>
        ) : (
          <Grid gutter="md" pb={60}>
            {brandData.items.map((item) => (
              <Grid.Col span={{ base: 6, md: 3 }} key={item.itemId}>
                <Box
                  onClick={() => navigate(`/item/${item.itemId}`, { state: item })}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={item.imageUrl || "https://placehold.co/400x400"}
                    alt={item.name}
                    radius="sm"
                    height={320}
                    fit="cover"
                    style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                  />

                  <Text size="sm" mb="xs" mt="sm">
                    {item.name}
                  </Text>

                  <Text size="sm" fw={700}>
                    {item.price.toLocaleString()}원
                  </Text>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>

      <FooterComponent />
    </>
  );
}
