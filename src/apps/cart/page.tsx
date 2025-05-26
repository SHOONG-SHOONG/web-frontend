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
} from "@mantine/core";
import React, { useEffect, useState, useRef } from "react";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import BASE_URL from "../../config.js";
import { useNavigate, Link } from "react-router-dom";

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
    if(!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cart/get`, {
          method: "GET",
          headers: {
            access: token || "",
          },
          credentials: "include",
        });

        if (response.status === 401) {
          alert("로그인이 필요한 서비스입니다.");
          // localStorage.removeItem("access"); // 필요 시 제거
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setCartItems(data);
        setSelectedIds(data.map((item: CartItem) => item.cartId));
      } catch (error) {
        console.error("장바구니 조회 실패:", error);
        setCartItems([]); // 오류 시 빈 배열로 초기화
      }
    };

    fetchCartItems();
  }, [navigate]);  

  const isAllSelected = selectedIds.length === cartItems.length && cartItems.length > 0;

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

  // 선택된 항목 기준 계산
  const selectedItems = cartItems.filter((item) =>
    selectedIds.includes(item.cartId)
  );
  const totalPrice = selectedItems.reduce(
    (sum, item) =>
      sum + item.price * (1 - item.discountRate) * item.cartQuantity,
    0
  );

  const handleOrder = () => {
    if (selectedIds.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }
    
    navigate("/order", {
      state: {
        cartItemsIds: selectedIds,
      },
    });
  };

  return (
    <>
      {/* Header */}
      <HeaderComponent />

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
              <Flex  justify="center" mr={10}>
                <Checkbox 
                  checked={isAllSelected}
                  onChange={toggleAll} 
                  ml={12}
                  color="#364fc6"
                />
              </Flex>
            </Grid.Col>
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
            <Grid.Col span={1} ta="center">
              <Flex align="center" justify="center">
                배송
              </Flex>  
            </Grid.Col>
          </Grid>

          {/* Cart Items */}
          {cartItems.map((item) => (
          <Grid
            key={item.cartId}
            align="center"
            py="sm"
            style={{ borderBottom: "1px solid #ddd", fontSize: 14 }}
          >
            <Grid.Col span={1}>
              <Flex align="center" justify="center">
                <Checkbox
                  color="#364fc6"
                  checked={selectedIds.includes(item.cartId)}
                  onChange={() => toggleItem(item.cartId)}
                />
              </Flex>
            </Grid.Col>

            <Grid.Col span={5}>
              <Flex align="center" gap="sm">
                <Link to={`/item/${item.itemId}`} style={{ textDecoration: "none" }}>

                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    style={{ 
                      width: 200,
                      height: 200,
                      objectFit: "cover",
                      display: "block",
                      borderRadius: 6,
                    }}
                  />
                </Link>
                <Link to={`/item/${item.itemId}`} style={{ textDecoration: "none" }}>
                  <Text fw={500} c="black" style={{ cursor: "pointer" }}>
                    {item.itemName}
                  </Text>
                </Link>
              </Flex>
            </Grid.Col>

            <Grid.Col span={2}>
              <Flex direction="column" align="center" gap="xs">
                <Flex align="center" gap="sm">
                  <Button
                    size="xs"
                    variant="default"
                    onClick={() => updateQuantity(item.cartId, -1)}
                  >
                    -
                  </Button>
                  <Input
                    value={item.cartQuantity}
                    type="number"
                    size="xs"
                    w={35}
                    styles={{
                      input:{
                        textAlign: "center",
                      }
                    }}
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
                    onClick={() => updateQuantity(item.cartId, 1)}
                  >
                    +
                  </Button>
                </Flex>

                <Button
                  size="xs"
                  color="#364fc6"
                  w={80}
                  px={15}
                  mt="xs"
                  onClick={async () => {
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
                        alert("수량이 업데이트되었습니다.");
                      } else {
                        alert("수정 실패");
                      }
                    } catch (error) {
                      console.error("수정 요청 실패:", error);
                      alert("서버와의 통신 중 오류가 발생했습니다.");
                    }
                  }}
                >
                  수량 변경
                </Button>
              </Flex>
            </Grid.Col>


            <Grid.Col span={2} ta="center">
              <Stack gap={0}>
                <Text fw={700}>
                  {(
                    item.price *
                    (1 - item.discountRate) *
                    item.cartQuantity
                  ).toLocaleString()}
                  원
                </Text>
                <Text size="xs" td="line-through" c="gray">
                  {(item.price * item.cartQuantity).toLocaleString()}원
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

          <Button
            color="dark"
            size="lg"
            w="50%"
            onClick={() => navigate("/order")}
          >
            {totalPrice.toLocaleString()}원 주문하기
          </Button>
        </Flex>
      </Container>

      <FooterComponent />
    </>
  );
}
