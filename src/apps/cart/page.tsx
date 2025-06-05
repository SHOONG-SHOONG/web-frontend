import {
  Box,
  Container,
  Flex,
  Grid,
  Stack,
  Text,
  Title,
  Button,
  Checkbox,
  Input,
  Image,
  ActionIcon,
} from "@mantine/core";
import React, { useEffect, useState, useRef } from "react";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import BASE_URL from "../../config.js";
import { useNavigate, Link } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

export type CartItem = {
  cartId: number;
  itemId: number;
  cartQuantity: number;
  itemName: string;
  price: number;
  discountRate: number;
  category: string;
  description: string;
  imageUrl: string;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const token = localStorage.getItem("access");
    if (!token) {
      showNotification({
        title: "이용 안내",
        message: "앗! 로그인 없이는 장바구니를 이용할 수 없어요.",
        color: "yellow",
        autoClose: 3500,
      });
      navigate("/login");
      return;
    }

    const checkIfSellerAndFetchCart = async () => {
      try {
        const res = await fetch(`${BASE_URL}/myPage`, {
          method: "GET",
          headers: { access: token },
          credentials: "include",
        });

        if (!res.ok) throw new Error("유저 정보 불러오기 실패");

        const data = await res.json();
        if (data.registrationNumber) {
          showNotification({
            title: "이용 안내",
            message: "판매자 계정은 장바구니 기능을 이용할 수 없어요 🛒",
            color: "yellow",
          });
          navigate("/");
          return;
        }

        const cartRes = await fetch(`${BASE_URL}/cart/get`, {
          method: "GET",
          headers: { access: token },
          credentials: "include",
        });

        if (!cartRes.ok) throw new Error("장바구니 조회 실패");

        const cartData = await cartRes.json();
        setCartItems(cartData);
        setSelectedIds(cartData.map((item: CartItem) => item.cartId));
      } catch (err) {
        console.error("에러:", err);
        showNotification({
          title: "오류 발생",
          message: "장바구니를 불러오는 중 문제가 생겼습니다.",
          color: "red",
        });
      }
    };

    checkIfSellerAndFetchCart();
  }, [navigate]);

  //   const fetchCartItems = async () => {
  //     try {
  //       const response = await fetch(`${BASE_URL}/cart/get`, {
  //         method: "GET",
  //         headers: {
  //           access: token || "",
  //         },
  //         credentials: "include",
  //       });

  //       if (response.status === 401) {
  //         alert("로그인이 필요한 서비스입니다.");
  //         // localStorage.removeItem("access"); // 필요 시 제거
  //         navigate("/login");
  //         return;
  //       }

  //       if (!response.ok) {
  //         throw new Error(`서버 오류: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       console.log(data);
  //       setCartItems(data);
  //       setSelectedIds(data.map((item: CartItem) => item.cartId));
  //     } catch (error) {
  //       console.error("장바구니 조회 실패:", error);
  //       setCartItems([]); // 오류 시 빈 배열로 초기화
  //     }
  //   };

  //   fetchCartItems();
  // }, [navigate]);

  const isAllSelected =
    selectedIds.length === cartItems.length && cartItems.length > 0;

  // 전체 선택 핸들러
  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => item.cartId));
    }
  };

  // 개별 선택 핸들러
  const toggleItem = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const updateQuantity = (cartId: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + delta) }
          : item
      )
    );
  };

  const patchQuantity = async (item: CartItem) => {
    const token = localStorage.getItem("access");

    try {
      const res = await fetch(
        `${BASE_URL}/cart/change/${item.cartId}?quantity=${item.cartQuantity}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            access: token || "",
          },
          credentials: "include",
        }
      );

      if (res.ok) {
        showNotification({
          title: "수량 변경 완료",
          message: `"${item.itemName}"의 수량이 업데이트되었어요!`,
          color: "teal",
        });
      } else {
        showNotification({
          title: "수량 변경 실패",
          message: "변경에 실패했습니다. 다시 시도해 주세요.",
          color: "red",
        });
      }
    } catch (error) {
      console.error("수정 요청 실패:", error);
      showNotification({
        title: "네트워크 오류",
        message: "서버와의 연결 중 문제가 발생했습니다.",
        color: "red",
      });
    }
  };

  // 선택된 항목 기준 계산
  const selectedItems = cartItems.filter((item) =>
    selectedIds.includes(item.cartId)
  );
  const totalPrice = selectedItems.reduce(
    (sum, item) =>
      sum + item.price * (1 - item.discountRate) * item.cartQuantity,
    0
  );

  const deleteCartItem = async (cartId: number) => {
    const token = localStorage.getItem("access");

    try {
      const res = await fetch(`${BASE_URL}/cart/delete/${cartId}`, {
        method: "DELETE",
        headers: {
          access: token || "",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("삭제 실패");
      }

      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
      setSelectedIds((prev) => prev.filter((id) => id !== cartId));
    } catch (err) {
      console.error("장바구니 삭제 실패:", err);
      showNotification({
        title: "삭제 실패",
        message: "상품 삭제 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
        color: "red",
      });
    }
  };

  const handleOrder = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await fetch(`${BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access: token || "",
        },
        credentials: "include",
        body: JSON.stringify({
          selectedCartIds: selectedIds,
        }),
      });

      if (res.ok) {
        navigate("/order");
      } else {
        const text = await res.text();

        try {
          const error = JSON.parse(text);
          showNotification({
            title: "주문 알림",
            message: error.message || "알 수 없는 오류가 발생했어요.",
            color: "red",
          });
        } catch {
          showNotification({
            title: "주문 알림",
            message: "관리자에게 문의해주세요.",
            color: "red",
          });
        }
      }
    } catch (error) {
      console.error("주문 알림:", error);
      showNotification({
        title: "통신 오류",
        message: "서버와 연결 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
        color: "red",
      });
    }
  };

  return (
    <>
      {/* Header */}
      <HeaderComponent />

      {/* Content */}
      <Container size="xl" py="xl">
        <Title order={3} mb="xl" ta="center">
          장바구니
        </Title>

        <Box style={{ borderTop: "2px solid black", fontSize: 14 }}>
          {/* 헤더 */}
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
              <Flex align="center" justify="center">
                <Checkbox
                  color="#409fff"
                  checked={isAllSelected}
                  onChange={toggleAll}
                />
              </Flex>
            </Grid.Col>

            <Grid.Col span={2}>
              <Flex align="center" justify="center">
                상품 이미지
              </Flex>
            </Grid.Col>

            <Grid.Col span={3}>
              <Flex align="center" justify="center">
                상품명
              </Flex>
            </Grid.Col>

            <Grid.Col span={2}>
              <Flex align="center" justify="center">
                수량
              </Flex>
            </Grid.Col>

            <Grid.Col span={2}>
              <Flex align="center" justify="center">
                상품금액
              </Flex>
            </Grid.Col>

            <Grid.Col span={1}>
              <Flex align="center" justify="center">
                배송
              </Flex>
            </Grid.Col>

            <Grid.Col span={1}>
              <Flex align="center" justify="center">
                삭제
              </Flex>
            </Grid.Col>
          </Grid>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <Grid
              key={item.cartId}
              columns={12}
              align="center"
              py="md"
              style={{ borderBottom: "1px solid #eee" }}
            >
              {/* 체크박스 */}
              <Grid.Col span={1}>
                <Flex align="center" justify="center">
                  <Checkbox
                    color="#409fff"
                    checked={selectedIds.includes(item.cartId)}
                    onChange={() => toggleItem(item.cartId)}
                  />
                </Flex>
              </Grid.Col>

              {/* 상품 이미지 */}
              <Grid.Col span={2}>
                <Flex justify="center">
                  <Image
                    src={item.imageUrl}
                    alt={item.itemName}
                    w={170}
                    h={170}
                    radius="md"
                    fit="cover"
                  />
                </Flex>
              </Grid.Col>

              {/* 상품명 */}
              <Grid.Col span={3}>
                <Flex justify="center">
                  <Text fw={500}>{item.itemName}</Text>
                </Flex>
              </Grid.Col>

              {/* 수량 */}
              <Grid.Col span={2}>
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  gap="xs"
                >
                  <Flex align="center" gap="xs">
                    <Button
                      size="xs"
                      variant="default"
                      radius="xs"
                      onClick={() => updateQuantity(item.cartId, -1)}
                    >
                      -
                    </Button>
                    <Input
                      value={item.cartQuantity}
                      radius="xs"
                      type="number"
                      size="xs"
                      w={35}
                      onChange={(e) => {
                        const value = Math.max(1, parseInt(e.target.value));
                        setCartItems((prev) =>
                          prev.map((el) =>
                            el.cartId === item.cartId
                              ? { ...el, cartQuantity: value }
                              : el
                          )
                        );
                      }}
                    />
                    <Button
                      size="xs"
                      variant="default"
                      radius="xs"
                      onClick={() => updateQuantity(item.cartId, 1)}
                    >
                      +
                    </Button>
                  </Flex>
                  <Button
                    size="xs"
                    color="#409fff"
                    w={128}
                    onClick={() => patchQuantity(item)}
                  >
                    수량 변경
                  </Button>
                </Flex>
              </Grid.Col>

              {/* 가격 */}
              <Grid.Col span={2}>
                <Flex direction="column" align="center" justify="center">
                  <Text fw={700}>
                    {(
                      item.price *
                      (1 - item.discountRate) *
                      item.cartQuantity
                    ).toLocaleString()}
                    원
                  </Text>
                  <Text td="line-through" size="xs" c="dimmed">
                    {(item.price * item.cartQuantity).toLocaleString()}원
                  </Text>
                </Flex>
              </Grid.Col>

              {/* 배송 */}
              <Grid.Col span={1}>
                <Flex justify="center" align="center">
                  <Text fw={600}>무료배송</Text>
                </Flex>
              </Grid.Col>

              {/* 삭제 */}
              <Grid.Col span={1}>
                <Flex justify="center" align="center">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="lg"
                    onClick={() => deleteCartItem(item.cartId)}
                  >
                    <Text fw={700} fz="lg" c="red">
                      ✕
                    </Text>
                  </ActionIcon>
                </Flex>
              </Grid.Col>
            </Grid>
          ))}
        </Box>

        {/* 가격 요약 */}
        <Box mt="xl" px="sm" py="lg" style={{ borderTop: "1px solid #ccc" }}>
          <Flex
            justify="center"
            align="center"
            gap="lg"
            style={{ fontWeight: 600 }}
          >
            {/* 총 주문 금액 */}
            <Box ta="center">
              <Text size="sm" c="gray">
                총 주문 금액
              </Text>
              <Text fw={700} size="xl">
                {totalPrice.toLocaleString()}원
              </Text>
              <Text size="xs" c="gray">
                총 {selectedIds.length}건
              </Text>
            </Box>

            {/* + 기호 */}
            <Text fw={500} size="lg" px="sm" ml={60} mr={60}>
              +
            </Text>

            {/* 총 배송비 */}
            <Box ta="center">
              <Text size="sm" c="gray">
                총 배송비
              </Text>
              <Text fw={700} size="xl">
                무료
              </Text>
            </Box>

            {/* = 기호 */}
            <Text fw={500} size="lg" px="sm" ml={60} mr={60}>
              =
            </Text>

            {/* 총 결제 금액 */}
            <Box ta="center">
              <Text size="sm" c="gray">
                총 결제 금액
              </Text>
              <Text fw={700} size="xl">
                {totalPrice.toLocaleString()}원
              </Text>
            </Box>
          </Flex>
        </Box>

        <Stack mt="md" bg="#f9f9f9" p="md" m="xs">
          <Text size="xs" c="gray">
            • 장바구니 상품은 최대 30일까지 저장됩니다.
          </Text>
          <Text size="xs" c="gray">
            • 가격, 할인 등 정보가 변경될 시점 주문이 불가할 수 있습니다.
          </Text>
          <Text size="xs" c="gray">
            • 옵션 선택 상품은 선택 이후에 옵션이 변경될 수 있으니
            재확인해주세요.
          </Text>
          <Text size="xs" c="gray">
            • 결제 시점에 따라 상품 품절 시 주문이 불가합니다.
          </Text>
          <Text size="xs" c="gray">
            • 동일한 유형 상품이 포함될 수 있으며, 주문 완료 후 다른 유형의
            상품은 추가되지 않습니다.
          </Text>
        </Stack>

        <Flex justify="space-between" mt="xl">
          <Button
            variant="default"
            size="lg"
            w="50%"
            onClick={() => navigate("/item")}
          >
            쇼핑 계속하기
          </Button>

          <Button color="dark" size="lg" w="50%" onClick={handleOrder}>
            {totalPrice.toLocaleString()}원 주문하기
          </Button>
        </Flex>
      </Container>

      <FooterComponent />
    </>
  );
}
