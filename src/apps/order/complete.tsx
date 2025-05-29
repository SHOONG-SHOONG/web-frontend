import {
    Container,
    Title,
    Text,
    Box,
    Stack,
    Flex,
    Divider,
    Button,
    Image,
  } from "@mantine/core";
  import React, { useEffect, useState } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import HeaderComponent from "../../components/Header.tsx";
  import FooterComponent from "../../components/Footer.tsx";
  import { PlaneEmoji, CloudEmoji, LuggageEmoji } from "../error/NotFoundPage.tsx";
  import BASE_URL from "../../config";
  
  type OrderItemDetailDto = {
    orderItemId: number;
    orderId: number;
    itemId: number;
    itemName: string;
    imageUrl: string;
    quantity: number;
    price: number;
  };
  
  type OrderDto = {
    orderId: number;
    totalPrice: number;
    orderDate: string;
    orderAddress: string;
    orderItems: OrderItemDetailDto[];
  };
  
  export default function OrderCompletePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDto>();
  
    const orderId = location.state?.orderId;
  
    useEffect(() => {
      if (!orderId) {
        alert("잘못된 접근입니다.");
        navigate("/");
        return;
      }
  
      const fetchOrder = async () => {
        const token = localStorage.getItem("access");
        const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
          method: "GET",
          headers: {
            access: token || "",
          },
          credentials: "include",
        });
  
        if (!res.ok) {
          alert("주문 정보를 불러오지 못했습니다.");
          navigate("/");
          return;
        }
  
        const data = await res.json();
        setOrder(data);
        console.log(order?.orderAddress);
      };
  
      fetchOrder();
    }, [orderId, navigate]);
  
    if (!order) return null;
  
    return (
      <>
        <HeaderComponent />
  
        <Container size="xs" py="xl">
          <Flex direction="column" align="center" gap="md" mb="lg">
            <Text fz={64}>
                <PlaneEmoji /> <CloudEmoji /> <LuggageEmoji />
            </Text>
            <Title order={2}>주문이 완료되었습니다!</Title>
            <Text c="gray">
              주문해주셔서 감사합니다. 아래 주문 정보를 확인해주세요.
            </Text>
          </Flex>
  
          <Box
            p="lg"
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <Stack gap="sm">
              <Flex justify="space-between">
                <Text fw={600}>주문번호</Text>
                <Text>{order.orderId}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fw={600}>주문일자</Text>
                <Text>{new Date(order.orderDate).toLocaleString()}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fw={600}>배송지</Text>
                <Text>{order.orderAddress}</Text>
              </Flex>
              <Divider my="sm" />
              <Flex justify="space-between">
                <Text fw={600}>총 결제 금액</Text>
                <Text fw={700} size="lg">
                  {order.totalPrice.toLocaleString()}원
                </Text>
              </Flex>
            </Stack>
          </Box>
  
          <Button
            mt="xl"
            fullWidth
            size="lg"
            color="dark"
            onClick={() => navigate("/")}
          >
            쇼핑 계속하기
          </Button>
        </Container>
  
        <FooterComponent />
      </>
    );
  }
  