import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Card,
  Avatar,
  Group,
  Button,
  SimpleGrid,
  Flex,
  Grid,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import BASE_URL from "../../config.js";

interface User {
  user_id: number;
  brand_id?: number;
  user_email: string;
  user_password: string;
  user_name: string;
  user_phone: string;
  bdate: string;
  user_address: string;
  role: "CLIENT" | "ADMIN" | "SELLER";
  registration_number?: string;
  user_status: "ACTIVE" | "INACTIVE" | "PENDING";
  access_token?: string;
  kakao_id?: string;
}

interface OrderItem {
  orderItemId: number;
  orderId: number;
  itemId: number;
  itemName: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  orderAddress: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [orderList, setOrderList] = useState<Order[]>([]);

  // 실제 API 호출 대신 더미 데이터 사용
  useEffect(() => {
    fetchUserInfo();
    fetchOrderList();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`${BASE_URL}/mypage`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log(data);
      setUserInfo(data);
    } catch (err) {
      console.error("mypage", err);
    }
  };

  // 주문 내역 가져오기
  const fetchOrderList = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`${BASE_URL}/orders/list`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: Order[] = await response.json();
      console.log("order list", data);
      setOrderList(data);
    } catch (err) {
      console.error("order list", err);
    }
  };

  const sidebarItems = [
    { category: "나의 쇼핑정보", items: ["주문 내역", "교환/반품/취소 내역"] },
    {
      category: "나의 창여 내역",
      items: [
        "1:1 문의",
        "상품 Q&A",
        "상품리뷰",
        "이벤트 참여내역",
        "레볼 응모내역",
        "제한고 알림",
      ],
    },
    {
      category: "나의 정보 관리",
      items: ["회원정보 수정", "맞춤 혜택 수신 동의", "마일리지", "Point"],
    },
  ];

  return (
    <>
      <HeaderComponent />
      <Box
        style={{
          display: "flex",
          minHeight: "100vh",
        }}
      >
        {/* 메인 컨텐츠 */}
        <Box
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <Box style={{ width: "1000px", maxWidth: "100%" }}>
            {/* 프로필 상단 카드 */}
            <Card
              mb="xl"
              withBorder
              style={{ border: "1px solidrgb(0, 0, 0)" }}
            >
              <Box bg="black" c="white" p="lg">
                <Group justify="space-between">
                  <Group>
                    <Avatar
                      radius="xl"
                      color="gray"
                      size="lg"
                      style={{ backgroundColor: "#6c757d" }}
                    >
                      F
                    </Avatar>
                    <Box>
                      <Text fw={700} size="lg" style={{ fontSize: "16px" }}>
                        {/* {userInfo.user_name} */}
                      </Text>
                      <Text
                        size="sm"
                        style={{ fontSize: "12px", opacity: 0.8 }}
                      >
                        가입일 : 2023.02.12
                      </Text>
                    </Box>
                  </Group>
                  <Box style={{ textAlign: "right" }}>
                    <Group>
                      <Box>
                        <Text fw={600} size="sm" style={{ fontSize: "14px" }}>
                          STARTER
                        </Text>
                        <Text
                          size="xs"
                          style={{ fontSize: "11px", opacity: 0.7 }}
                        >
                          상품 구매 시 회원 등급이 변경됩니다.
                        </Text>
                      </Box>
                    </Group>
                  </Box>
                </Group>
              </Box>

              <SimpleGrid cols={4} mt="md" style={{ textAlign: "center" }}>
                <Box>
                  <Text fw={600} style={{ fontSize: "12px", color: "#666" }}>
                    Point
                  </Text>
                  <Text fw={700} style={{ fontSize: "16px" }}>
                    0P
                  </Text>
                </Box>
                <Box>
                  <Text fw={600} style={{ fontSize: "12px", color: "#666" }}>
                    쿠폰
                  </Text>
                  <Text fw={700} style={{ fontSize: "16px" }}>
                    1장
                  </Text>
                </Box>
                <Box>
                  <Text fw={600} style={{ fontSize: "12px", color: "#666" }}>
                    리뷰
                  </Text>
                  <Text fw={700} style={{ fontSize: "16px" }}>
                    0개
                  </Text>
                </Box>
              </SimpleGrid>
            </Card>

            {/* 주문 내역 섹션 */}
            <Box mb="xl">
              <Box
                style={{ borderTop: "2px solid black" }}
                mb={20}
                mt={10}
              ></Box>
              <Group justify="space-between" mb="md">
                <Text fw={600} style={{ fontSize: "16px" }}>
                  주문 내역{" "}
                </Text>
                <Group
                  style={{ fontSize: "12px", color: "#666", cursor: "pointer" }}
                >
                  <Text>전체보기</Text>
                  <IconChevronRight size={14} />
                </Group>
              </Group>

              <SimpleGrid cols={4} spacing="lg" mb="md">
                {[
                  { label: "결제완료", count: 0 },
                  { label: "상품준비중", count: 0 },
                  { label: "배송중", count: 0 },
                  { label: "배송완료", count: 0 },
                ].map((item) => (
                  <Box ta="center" key={item.label}>
                    <Text fw={700} style={{ fontSize: "24px", color: "#666" }}>
                      {item.count}
                    </Text>
                    <IconChevronRight
                      size={16}
                      style={{ margin: "4px auto", color: "#666" }}
                    />
                    <Text size="sm" style={{ fontSize: "12px", color: "#666" }}>
                      {item.label}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>

              <Box style={{ textAlign: "right", marginBottom: "16px" }}>
                {[
                  { label: "취소", count: 0 },
                  { label: "교환", count: 0 },
                  { label: "반품", count: 0 },
                ].map((item) => (
                  <Text
                    key={item.label}
                    span
                    style={{
                      marginLeft: "24px",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    {item.label}{" "}
                    <Text span fw={600}>
                      {item.count}
                    </Text>
                  </Text>
                ))}
              </Box>
              {orderList.length > 0 ? (
                orderList.map((order) => (
                  <Box
                    key={order.orderId}
                    mt="xl"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      overflow: "hidden",
                      fontSize: 14,
                    }}
                  >
                    {/* 주문 상단 정보 */}
                    <Box
                      bg="#f8f8f8"
                      p="md"
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <Group justify="space-between">
                        <Text fw={600}>주문번호: #{order.orderId}</Text>
                        <Text size="sm" c="dimmed">
                          {new Date(order.orderDate).toLocaleString()}
                        </Text>
                      </Group>
                      <Text size="sm" mt={4}>
                        배송지: {order.orderAddress}
                      </Text>
                      <Text size="sm" mt={2}>
                        총 결제금액: {order.totalPrice.toLocaleString()}원
                      </Text>
                    </Box>

                    {/* 주문 상품 목록 (헤더) */}
                    <Grid
                      align="center"
                      py="xs"
                      style={{
                        fontWeight: 600,
                        borderBottom: "1px solid #ddd",
                        color: "#666",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Grid.Col span={5}>
                        <Flex align="center" justify="center">
                          상품정보
                        </Flex>
                      </Grid.Col>
                      <Grid.Col span={2} ta="center">
                        <Flex align="center" justify="center">
                          수량
                        </Flex>
                      </Grid.Col>
                      <Grid.Col span={2.5} ta="center">
                        <Flex align="center" justify="center">
                          상품금액
                        </Flex>
                      </Grid.Col>
                      <Grid.Col span={2.5} ta="center">
                        <Flex align="center" justify="center">
                          배송
                        </Flex>
                      </Grid.Col>
                    </Grid>

                    {/* 주문 상품 아이템 리스트 */}
                    {order.orderItems.map((item) => (
                      <Grid
                        key={item.orderItemId}
                        align="center"
                        py="md"
                        style={{ borderBottom: "1px solid #eee", fontSize: 14 }}
                      >
                        <Grid.Col span={5}>
                          <Flex align="center" gap="sm">
                            <img
                              src={item.imageUrl}
                              alt={item.itemName}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 6,
                              }}
                            />
                            <Text fw={500}>{item.itemName}</Text>
                          </Flex>
                        </Grid.Col>
                        <Grid.Col span={2}>
                          <Text ta="center">{item.quantity}개</Text>
                        </Grid.Col>
                        <Grid.Col span={2.5}>
                          <Text fw={600} ta="center">
                            {item.price.toLocaleString()}원
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={2.5}>
                          <Text ta="center">무료배송</Text>
                        </Grid.Col>
                      </Grid>
                    ))}
                  </Box>
                ))
              ) : (
                <Text
                  size="sm"
                  ta="center"
                  style={{ color: "#999", fontSize: "13px", marginTop: "20px" }}
                >
                  최근 1개월 내 주문 내역이 없습니다.
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <FooterComponent />
    </>
  );
}
