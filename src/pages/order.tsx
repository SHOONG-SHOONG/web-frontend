import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Image,
  Text,
  Title,
  Box,
  Flex,
  Group,
  Anchor,
  Stack,
  Input,
  Radio,
  Checkbox,
  Button,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from 'react-router-dom';

// 백엔드에서 받아올 상품 데이터 타입 정의
interface ProductType {
  id: number;
  name: string;
  image: string;
  price: number;
  discountRate: number;
}

export default function OrderPage() {
  const [active, setActive] = useState("home");
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<ProductType>({
    id: 1,
    name: "찡찡이곰자",
    image: "https://placehold.co/80x80?text=Image",
    price: 85000,
    discountRate: 10
  });
  const navigate = useNavigate();

  // 할인가 계산
  const discountAmount = Math.floor(product.price * (product.discountRate / 100));
  const finalPrice = product.price - discountAmount;
  
  // 총 금액 계산 (수량에 따라 변경)
  const totalPrice = finalPrice * quantity;

  // 백엔드에서 상품 데이터 가져오기 (실제로는 API 호출)
  useEffect(() => {
    // 실제 구현 시 여기서 API 호출
    // 예: fetch('/api/products/1').then(res => res.json()).then(data => setProduct(data));
  }, []);

  const menus = [
    { label: "홈", value: "home" },
    { label: "카테고리", value: "category" },
    { label: "라이브", value: "live" },
  ];

  const handleMenuClick = (value: string) => {
    setActive(value);
    if (value === "home") {
      navigate('/');
    }
  };

  return (
    <>
      <Box px="lg" py="xs" style={{ borderBottom: "1px solid #eee" }}>
        <Flex justify="space-between" align="center">
          {/* 왼쪽: 로고 */}
          <Box w={190}>
            <Text fw={900} size="lg" c="blue">
              Shoong
            </Text>
          </Box>

          {/* 중앙: Anchor 기반 메뉴 */}
          <Box style={{ flex: 1 }}>
            <Group justify="center" gap="lg">
              {menus.map((menu) => (
                <Anchor
                  key={menu.value}
                  component="button"
                  size="md"
                  fw={active === menu.value ? 700 : 500}
                  c={active === menu.value ? "blue" : "gray"}
                  style={{
                    borderBottom:
                      active === menu.value ? "2px solid #3B61FF" : "none",
                    paddingBottom: 4,
                  }}
                  onClick={() => handleMenuClick(menu.value)}
                >
                  {menu.label}
                </Anchor>
              ))}
            </Group>
          </Box>

          {/* 오른쪽: 검색 및 로그인 메뉴 */}
          <Group gap="sm" w={190} justify="flex-end">
            <IconSearch size={16} />
            <Anchor href="#" underline="never" c="gray" size="sm">
              로그인
            </Anchor>
            <Anchor href="#" underline="never" c="gray" size="sm">
              회원가입
            </Anchor>
            <Anchor href="/order" underline="never" c="gray" size="sm">
              장바구니
            </Anchor>
          </Group>
        </Flex>
      </Box>

      <Container size="lg" py="md">
        <Title order={3} ta="center" my="xl">상품 주문하기</Title>

        {/* 상품 정보 */}
        <Box style={{ borderTop: "1px solid #eee" }}>
          <Grid columns={12} p="sm" style={{ borderBottom: "1px solid #eee" }}>
            <Grid.Col span={6}>
              <Text fw={600} c="dimmed" size="sm">상품정보</Text>
            </Grid.Col>
            <Grid.Col span={3} ta="center">
              <Text fw={600} c="dimmed" size="sm">수량</Text>
            </Grid.Col>
            <Grid.Col span={3} ta="right">
              <Text fw={600} c="dimmed" size="sm">상품금액</Text>
            </Grid.Col>
          </Grid>
          
          <Grid columns={12} p="md" align="center" style={{ borderBottom: "1px solid #eee" }}>
            <Grid.Col span={6}>
              <Flex gap="md" align="center">
                <Image src={product.image} alt="상품 이미지" w={80} h={80} />
                <Text fw={500}>{product.name}</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={3} ta="center">
              <Flex align="center" justify="center" style={{ border: "1px solid #eee", padding: "4px 8px", width: "120px", margin: "0 auto" }}>
                <Button variant="subtle" size="xs" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                <Text mx="xs" fw={500}>{quantity}</Text>
                <Button variant="subtle" size="xs" onClick={() => setQuantity(quantity + 1)}>+</Button>
              </Flex>
            </Grid.Col>
            <Grid.Col span={3} ta="right">
              <Box>
                <Text fw={600}>{(finalPrice * quantity).toLocaleString()}원</Text>
                <Text c="dimmed" td="line-through" size="xs">{(product.price * quantity).toLocaleString()}원</Text>
                <Text c="red" size="xs">{product.discountRate}% 할인</Text>
              </Box>
            </Grid.Col>
          </Grid>

          {/* 총 금액 정보 */}
          <Grid columns={3} style={{ borderBottom: "1px solid #eee", padding: "24px 0" }}>
            <Grid.Col span={1}>
              <Box ta="center">
                <Text c="dimmed" size="sm" mb="xs">총 주문 금액</Text>
                <Text fw={600}>{totalPrice.toLocaleString()}원</Text>
                <Text c="dimmed" size="xs" mt="xs">총 1건</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={1}>
              <Box ta="center">
                <Text c="dimmed" size="sm" mb="xs">총 배송비</Text>
                <Text fw={600}>무료</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={1}>
              <Box ta="center">
                <Text c="dimmed" size="sm" mb="xs">총 결제 금액</Text>
                <Text fw={600}>{totalPrice.toLocaleString()}원</Text>
              </Box>
            </Grid.Col>
          </Grid>

          {/* 주문자 정보 */}
          <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
            <Text fw={700} size="sm" mb="md">주문자 정보</Text>
            <Stack gap="md">
              <Box>
                <Text size="sm" c="red" mb="xs">이메일 *</Text>
                <Input value="mjgf9530@gmail.com" />
              </Box>
              <Box>
                <Text size="sm" c="red" mb="xs">휴대전화 번호 *</Text>
                <Input placeholder="주문자 휴대전화 번호를 입력해 주세요." />
              </Box>
            </Stack>
          </Box>

          {/* 결제 수단 */}
          <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
            <Text fw={700} size="sm" mb="md">결제 수단</Text>
            <Radio checked label="무통장입금" />
          </Box>

          {/* 약관 동의 */}
          <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
            <Text fw={700} size="sm" mb="md">약관 동의</Text>
            <Box bg="gray.1" p="md">
              <Text mb="sm">✔ 주문 내용을 확인하였으며, 아래 내용에 모두 동의합니다.</Text>
              <Stack gap="xs">
                <Flex align="center" gap="xs">
                  <Checkbox />
                  <Text size="sm">개인정보 수집 및 이용 동의</Text>
                  <Anchor size="xs">약관보기</Anchor>
                </Flex>
                <Flex align="center" gap="xs">
                  <Checkbox />
                  <Text size="sm">개인정보 제 3자 제공 동의</Text>
                </Flex>
                <Flex align="center" gap="xs">
                  <Checkbox />
                  <Text size="sm">전자결제대행 이용 동의</Text>
                </Flex>
              </Stack>
            </Box>
          </Box>

          {/* 결제 버튼 */}
          <Box ta="center" py="xl">
            <Button size="md" px="xl" bg="black">결제하기</Button>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box bg="black" c="white" py="xl" mt="xl" w="100%" h={350}>
        <Box
          ta="center"
          style={{
            maxWidth: "100%",
            padding: "0 24px",
            margin: "0 auto",
          }}
        >
          <Stack gap="xs">
            <Text fw={700} size="lg">
              Shoong
            </Text>
            <Text size="sm">
              Shoong | 대표자 : 김슝 | 사업자번호 : 123-34-56789
            </Text>
            <Text size="sm">
              통신판매업 : 0000-서울중구-0000호 | 개인정보보호책임자 : 김슝 |
              이메일 : shoong@shoong.ai
            </Text>
            <Text size="sm">
              전화번호 : 00-0000-0000 | 주소 : 서울시 중구 을지로 000
            </Text>
            <Group gap="lg" mt="xs" ta="center">
              <Anchor href="#" c="white" size="xs">
                이용약관
              </Anchor>
              <Anchor href="#" c="white" size="xs">
                개인정보처리방침
              </Anchor>
            </Group>
            <Text size="xs" mt="sm" c="dimmed">
              © 2024 Shoong. All Rights Reserved.
            </Text>
          </Stack>
        </Box>
      </Box>
    </>
  );
}