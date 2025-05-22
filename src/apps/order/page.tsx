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
import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";

// 백엔드에서 받아올 상품 데이터 타입 정의
type OrderDetail = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  discountRate: number;
}

export default function OrderPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [agreements, setAgreements] = useState({
    privacy: false,
    thirdParty: false,
    paymentAgency: false,
  });

  // 백엔드에서 상품 데이터 가져오기 (실제로는 API 호출)
  useEffect(() => {
    const allChecked = Object.values(agreements).every(Boolean);
    setAgreed(allChecked);

    // ✨ 실제 API 주소로 교체
    fetch("/api/order")
      .then((res) => res.json())
      .then((data) => setOrderDetails(data));
  }, [agreements]);

  const handleSubmit = () => {
    if (!agreed) return alert("약관에 동의해주세요.");
    alert("주문이 완료되었습니다!");
  };

  return (
    <>
      {/* Header */}
      <HeaderComponent/>

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

            {orderDetails.map((orderDetail) => (  
              <Grid columns={12} p="md" align="center" style={{ borderBottom: "1px solid #eee" }}>
                <Grid.Col span={6}>
                  <Flex gap="md" align="center">
                    <Image src={orderDetail.image} alt="상품 이미지" w={80} h={80} />
                    <Text fw={500}>{orderDetail.name}</Text>
                  </Flex>
                </Grid.Col>
                <Grid.Col span={3} ta="center">
                  <Flex align="center" justify="center" style={{ border: "1px solid #eee", padding: "4px 8px", width: "120px", margin: "0 auto" }}>
                    <Text mx="xs" fw={500}>{orderDetail.quantity}</Text>
                  </Flex>
                </Grid.Col>
                <Grid.Col span={3} ta="right">
                  <Box>
                    <Text fw={600}>{(orderDetail.price * orderDetail.quantity).toLocaleString()}원</Text>
                    <Text c="dimmed" td="line-through" size="xs">{(orderDetail.price * orderDetail.quantity).toLocaleString()}원</Text>
                    <Text c="red" size="xs">{orderDetail.discountRate}% 할인</Text>
                  </Box>
                </Grid.Col>
              </Grid>
            ))}
            
            {/* 총 금액 정보 */}
            {orderDetails.map((orderDetail) => (  
              <Grid columns={3} style={{ borderBottom: "1px solid #eee", padding: "24px 0" }}>
                <Grid.Col span={1}>
                  <Box ta="center">
                    <Text c="dimmed" size="sm" mb="xs">총 주문 금액</Text>
                    <Text fw={600}>{orderDetail.price.toLocaleString()}원</Text>
                    <Text c="dimmed" size="xs" mt="xs">총 {orderDetails.length}건</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Box ta="center">
                    <Text c="dimmed" size="sm" mb="xs">배송비</Text>
                    <Text fw={600}>무료</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Box ta="center">
                    <Text c="dimmed" size="sm" mb="xs">총 결제 금액</Text>
                    <Text fw={600}>{orderDetail.price.toLocaleString()}원</Text>
                  </Box>
                </Grid.Col>
              </Grid>
            ))}

            {/* 주문자 정보 */}
            <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
              <Text fw={700} size="sm" mb="md">주문자 정보</Text>
              <Stack gap="md">
                <Box>
                  <Text size="sm" mb="xs">이메일 *</Text>
                  <Input placeholder="shoong@shoong.com" />
                </Box>
                <Box>
                  <Text size="sm" mb="xs">
                    휴대전화 번호 <Text size="sm" c="red">*</Text>
                  </Text>
                  <Input placeholder="주문자 휴대전화 번호를 입력해 주세요." />
                </Box>
              </Stack>
            </Box>

            {/* 결제 수단 */}
            {orderDetails.map((orderDetail) => (  
              <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
                <Text fw={700} size="sm" mb="md">결제 수단</Text>
                <Radio checked label="무통장입금" />
              </Box>
            ))}
          
            {/* 약관 동의 */}
            <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
              <Text fw={700} size="sm" mb="md">약관 동의</Text>
              <Box bg="gray.1" p="md">
                <Text mb="sm">✔ 주문 내용을 확인하였으며, 아래 내용에 모두 동의합니다.</Text>
                <Stack gap="xs">
                  <Flex align="center" gap="xs">
                    <Checkbox
                      checked={agreements.privacy}
                      onChange={(e) =>
                        setAgreements((prev) => ({ ...prev, privacy: e.currentTarget.checked }))
                      }
                    />
                    <Text size="sm">개인정보 수집 및 이용 동의</Text>
                    <Anchor size="xs">약관보기</Anchor>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Checkbox
                      checked={agreements.thirdParty}
                      onChange={(e) =>
                        setAgreements((prev) => ({ ...prev, thirdParty: e.currentTarget.checked }))
                      }
                    />
                    <Text size="sm">개인정보 제 3자 제공 동의</Text>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Checkbox
                      checked={agreements.paymentAgency}
                      onChange={(e) =>
                        setAgreements((prev) => ({ ...prev, paymentAgency: e.currentTarget.checked }))
                      }
                    />
                    <Text size="sm">전자결제대행 이용 동의</Text>
                  </Flex>
                </Stack>
              </Box>
            </Box>

            {/* 결제 버튼 */}
            <Button fullWidth size="lg" color="dark" onClick={handleSubmit} disabled={!agreed}>
              결제하기
            </Button>

          </Box>  

      </Container>

      {/* Footer */}
      <FooterComponent/>
    </>
  );
}