import React, { useEffect, useMemo, useState } from "react";
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
  Modal,
  Paper,
  Badge,
  Burger,
  Drawer,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import BASE_URL from "../../config.js";

interface User {
  brandName: string | null;
  userEmail: string;
  userPassword: string | null;
  userName: string;
  userPhone: string;
  bdate: string | null;
  role: string | null;
  registrationNumber: string;
  userStatus: string | null;
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
  const [couponModalOpened, setCouponModalOpened] = useState(false);
  const [couponCount, setCouponCount] = useState(1);
  const [drawerOpened, { open, close, toggle }] = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchOrderList();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${BASE_URL}/myPage`, {
        headers: { access: token || "" },
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUserInfo(data);
      if (data.registrationNumber) navigate("/seller/mypage");
    } catch (err) {
      console.error("mypage error", err);
    }
  };

  const fetchOrderList = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${BASE_URL}/orders/list/paid`, {
        headers: { access: token || "" },
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrderList(data);
    } catch (err) {
      console.error("order list error", err);
    }
  };

  const statusCounts = useMemo(() => {
    const counts = {
      결제완료: 0,
      상품준비중: 0,
      배송중: 0,
      배송완료: 0,
      취소: 0,
      교환: 0,
      반품: 0,
    };
    orderList.forEach(() => counts["결제완료"]++);
    return counts;
  }, [orderList]);

  const sidebarItems = [
    { category: "나의 쇼핑정보", items: ["주문 내역", "교환/반품/취소 내역"] },
    { category: "나의 참여 내역", items: ["1:1 문의", "상품 Q&A", "상품리뷰", "이벤트 참여내역"] },
    { category: "나의 정보 관리", items: ["회원정보 수정", "맞춤 혜택 수신 동의"] },
  ];

  const renderSidebarItems = () => (
    <>
      {sidebarItems.map((group) => (
        <Box key={group.category} mb="xl">
          <Text fw={700} size="sm" mb="xs">{group.category}</Text>
          {group.items.map((item) => (
            <Text
              key={item}
              size="sm"
              style={{ padding: "6px 0", cursor: "pointer", color: "#555" }}
              onClick={() =>
                showNotification({ title: "알림", message: `${item}은 아직 미구현된 기능입니다.`, color: "gray" })
              }
            >
              {item}
            </Text>
          ))}
        </Box>
      ))}
    </>
  );

  return (
    <Box>
      <Box pos="relative">
        <HeaderComponent />
        <Burger
          opened={drawerOpened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
          style={{ position: "absolute", top: 16, left: 16, zIndex: 1001 }}
        />
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={close}
        hiddenFrom="sm"
        padding="md"
        size={220}
        title="메뉴"
      >
        {renderSidebarItems()}
      </Drawer>

      <Flex>
        <Box
          w={220}
          visibleFrom="sm"
          p="lg"
          style={{ borderRight: "1px solid #eee", minHeight: "100vh" }}
        >
          {renderSidebarItems()}
        </Box>

        <Box style={{ flex: 1, padding: 24, maxWidth: 1000 }} mx="auto">
          {/* 유저 카드 */}
          <Card mb="xl" withBorder>
            <Paper shadow="sm" radius="md" p="lg" style={{ background: "#1e293b" }} withBorder>
              <Group justify="space-between" align="flex-start">
                <Group>
                  <Avatar radius="xl" size="lg" color="gray" style={{ fontWeight: 700, fontSize: 20 }}>
                    {userInfo?.userName?.charAt(0) ?? "?"}
                  </Avatar>
                  <Box>
                    <Text size="md" fw={700} style={{ color: "#ffffff" }}>
                      {userInfo?.userName}
                    </Text>
                    <Text size="sm" style={{ color: "#cbd5e1" }}>
                      {userInfo?.userPhone}
                    </Text>
                    <Text size="sm" style={{ color: "#cbd5e1" }}>
                      {userInfo?.userEmail}
                    </Text>
                  </Box>
                </Group>
                <Box ta="right">
                  <Badge size="md" color="blue" variant="filled" radius="md">
                    STARTER
                  </Badge>
                  <Text size="xs" style={{ color: "#94a3b8", marginTop: 4 }}>
                    상품 구매 시 회원 등급이 변경됩니다.
                  </Text>
                </Box>
              </Group>
            </Paper>

            <SimpleGrid cols={{ base: 1, sm: 3, md: 4 }} mt="md" style={{ textAlign: "center" }}>
              <Box>
                <Text fw={600} size="xs" c="dimmed">Point</Text>
                <Text fw={700}>0P</Text>
              </Box>
              <Box>
                <Modal
                  opened={couponModalOpened}
                  onClose={() => setCouponModalOpened(false)}
                  title="쿠폰 상세 정보"
                  centered
                >
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text fw={700} size="lg" mb="sm">50% 할인 쿠폰</Text>
                    <Text size="sm" color="dimmed">📅 유효기간: 발급일로부터 7일</Text>
                  </Card>
                </Modal>
                <Text fw={600} size="xs" c="dimmed">쿠폰</Text>
                {couponCount > 0 ? (
                  <Text fw={700} style={{ cursor: "pointer" }} onClick={() => setCouponModalOpened(true)}>
                    {couponCount}장
                  </Text>
                ) : (
                  <Text fw={400} size="sm" c="dimmed">없음</Text>
                )}
              </Box>
              <Box>
                <Text fw={600} size="xs" c="dimmed">리뷰</Text>
                <Text fw={700}>0개</Text>
              </Box>
            </SimpleGrid>
          </Card>

          {/* 주문내역 */}
          <Box>
            <Box style={{ borderTop: "2px solid black" }} mb={20} />
            <Group justify="space-between" mb="md">
              <Text fw={600} size="lg">주문 내역</Text>
              <Group style={{ fontSize: "12px", color: "#666", cursor: "pointer" }}>
                <Text>전체보기</Text>
                <IconChevronRight size={14} />
              </Group>
            </Group>

            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" mb="md">
              {["결제완료", "상품준비중", "배송중", "배송완료"].map((label) => (
                <Box ta="center" key={label}>
                  <Text fw={700} size="xl" c="gray">{statusCounts[label]}</Text>
                  <IconChevronRight size={16} style={{ margin: "4px auto", color: "#666" }} />
                  <Text size="sm" c="dimmed">{label}</Text>
                </Box>
              ))}
            </SimpleGrid>

            <Box style={{ textAlign: "right", marginBottom: "16px" }}>
              {["취소", "교환", "반품"].map((label) => (
                <Text key={label} span style={{ marginLeft: "24px", fontSize: "12px", color: "#666" }}>
                  {label} <Text span fw={600}>{statusCounts[label]}</Text>
                </Text>
              ))}
            </Box>

            {orderList.length > 0 ? (
              orderList.map((order) => (
                <Box key={order.orderId} mt="xl" style={{ border: "1px solid #ddd", borderRadius: 8 }}>
                  <Box bg="#f8f8f8" p="md" style={{ borderBottom: "1px solid #ddd" }}>
                    <Group justify="space-between">
                      <Text fw={600}>주문번호: #{order.orderId}</Text>
                      <Text size="sm" c="dimmed">{new Date(order.orderDate).toLocaleString()}</Text>
                    </Group>
                    <Text size="sm" mt={4}>배송지: {order.orderAddress}</Text>
                    <Text size="sm" mt={2}>총 결제금액: {order.totalPrice.toLocaleString()}원</Text>
                  </Box>
                  <Grid align="center" py="xs" style={{ fontWeight: 600, borderBottom: "1px solid #ddd", color: "#666", backgroundColor: "#fafafa" }}>
                    <Grid.Col span={5}><Flex justify="center">상품정보</Flex></Grid.Col>
                    <Grid.Col span={2}><Flex justify="center">수량</Flex></Grid.Col>
                    <Grid.Col span={2.5}><Flex justify="center">상품금액</Flex></Grid.Col>
                    <Grid.Col span={2.5}><Flex justify="center">배송</Flex></Grid.Col>
                  </Grid>
                  {order.orderItems.map((item) => (
                    <Grid
                      key={item.orderItemId}
                      align="center"
                      py="md"
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <Grid.Col span={5}>
                        <Flex gap="md" align="center">
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 8,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                              marginLeft: 40
                            }}
                          />
                          <Text fw={600} size="md" lineClamp={2}>
                            {item.itemName}
                          </Text>
                        </Flex>
                      </Grid.Col>

                      <Grid.Col span={2}>
                        <Text ta="center" size="sm" c="dimmed">
                          {item.quantity}개
                        </Text>
                      </Grid.Col>

                      <Grid.Col span={2.5}>
                        <Text ta="center" fw={700} size="sm">
                          {item.price.toLocaleString()}원
                        </Text>
                      </Grid.Col>

                      <Grid.Col span={2.5}>
                        <Text ta="center" size="sm" c="teal">
                          무료배송
                        </Text>
                      </Grid.Col>
                    </Grid>
                  ))}
                </Box>
              ))
            ) : (
              <Box ta="center" mt="xl">
                <Text size="sm" c="dimmed" mb="sm">최근 1개월 내 주문 내역이 없습니다.</Text>
                <Button variant="light" onClick={() => navigate("/")}>쇼핑하러 가기</Button>
              </Box>
            )}
          </Box>
        </Box>
      </Flex >
      <FooterComponent />
    </Box >
  );
}
