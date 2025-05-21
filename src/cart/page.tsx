import {
    Box,
    Container,
    Flex,
    Grid,
    Group,
    Image,
    Stack,
    Text,
    Title,
    Button,
    Divider,
    Checkbox,
    Anchor,
  } from "@mantine/core";
import React, { useEffect, useState } from "react";
import HeaderComponent from "../components/Header.tsx";
import FooterComponent from "../components/Footer.tsx";

type CartItem = {
  id: number;
  name: string;
  price: number;
  discountRate: number;
  quantity: number;
  imageUrl: string;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // ✨ 실제 API 주소로 교체
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setCartItems(data));
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * (1 - item.discountRate) * item.quantity, 0);

  return (
    <>
      {/* Header */}
      <HeaderComponent/>

      {/* Content */}
      <Container size="lg" py="xl">
        <Title order={3} mb="xl" ta="center">
          장바구니
        </Title>

        <Box style={{ borderTop: "2px solid black", fontSize: 14 }}>
          <Grid
            align="center"
            py="xs"
            style={{
              fontWeight: 600,
              borderBottom: "1px solid #ddd",
              color: "#666",
            }}
          >
            <Grid.Col span={1}>
              <Checkbox defaultChecked />
            </Grid.Col>
            <Grid.Col span={5}>상품정보</Grid.Col>
            <Grid.Col span={2}>수량</Grid.Col>
            <Grid.Col span={2}>상품금액</Grid.Col>
            <Grid.Col span={2}>배송</Grid.Col>
          </Grid>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <Grid
              key={item.id}
              align="center"
              py="sm"
              style={{
                borderBottom: "1px solid #ddd",
                fontSize: 14,
              }}
            >
              <Grid.Col span={1}>
                <Checkbox defaultChecked />
              </Grid.Col>
              <Grid.Col span={5}>
                <Flex align="center" gap="sm">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={60}
                    height="auto"
                    radius="sm"
                  />
                  <Text fw={500}>{item.name}</Text>
                </Flex>
              </Grid.Col>
              <Grid.Col span={2}>
                <Flex align="center" gap="xs">
                  <Button size="xs" variant="default" onClick={() => updateQuantity(item.id, -1)}>
                    -
                  </Button>
                  <Text>{item.quantity}</Text>
                  <Button size="xs" variant="default" onClick={() => updateQuantity(item.id, 1)}>
                    +
                  </Button>
                </Flex>
              </Grid.Col>
              <Grid.Col span={2}>
                <Stack gap={0}>
                  <Text fw={700}>
                    {(item.price * (1 - item.discountRate)).toLocaleString()}원
                  </Text>
                  <Text size="xs" td="line-through" c="gray">
                    {item.price.toLocaleString()}원
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={2}>
                <Text fw={500}>무료배송</Text>
              </Grid.Col>
            </Grid>
          ))}
        </Box>

        {/* 가격 요약 */}
        <Box mt="xl" px="sm">
          <Grid align="center" py="md" style={{ fontWeight: 600 }}>
            <Grid.Col span={4} ta="center">
              <Text>총 주문 금액</Text>
              <Text fw={700} size="lg">
                {totalPrice.toLocaleString()}원
              </Text>
              <Text size="xs" c="gray">
                총 {cartItems.length}건
              </Text>
            </Grid.Col>
            <Grid.Col span={4} ta="center">
              <Text>총 배송비</Text>
              <Text fw={700} size="lg">
                무료
              </Text>
            </Grid.Col>
            <Grid.Col span={4} ta="center">
              <Text>총 결제 금액</Text>
              <Text fw={700} size="lg">
                {totalPrice.toLocaleString()}원
              </Text>
            </Grid.Col>
          </Grid>
        </Box>

        <Stack mt="md" bg="#f9f9f9" p="md" spacing="xs">
          <Text size="xs" c="gray">
            • 장바구니 상품은 최대 30일까지 저장됩니다.
          </Text>
          <Text size="xs" c="gray">
            • 가격, 할인 등 정보가 변경될 시점 주문이 불가할 수 있습니다.
          </Text>
          <Text size="xs" c="gray">
            • 옵션 선택 상품은 선택 이후에 옵션이 변경될 수 있으니 재확인해주세요.
          </Text>
          <Text size="xs" c="gray">
            • 결제 시점에 따라 상품 품절 시 주문이 불가합니다.
          </Text>
          <Text size="xs" c="gray">
            • 동일한 유형 상품이 포함될 수 있으며, 주문 완료 후 다른 유형의 상품은 추가되지 않습니다.
          </Text>
        </Stack>

        <Flex justify="space-between" mt="xl">
          <Button variant="default" size="lg" w="50%">
            쇼핑 계속하기
          </Button>
          <Button color="dark" size="lg" w="50%">
            {totalPrice.toLocaleString()}원 주문하기
          </Button>
        </Flex>
      </Container>

      <FooterComponent/>
    </>
  );
}
  