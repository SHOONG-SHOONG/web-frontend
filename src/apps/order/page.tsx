import {
  Container,
  Grid,
  Image,
  Text,
  Title,
  Box,
  Flex,
  Anchor,
  Stack,
  Radio,
  Checkbox,
  Button,
  TextInput,
} from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";
import BASE_URL from "../../config.js";

declare global {
  interface Window {
    IMP: any;
  }
}

// 백엔드에서 받아올 상품 데이터 타입 정의
type OrdersDetailDto = {
  orderId: number;
  totalPrice: number;
  orderDate: Date;
  orderAddress: string;
  orderItems: OrderItemDetailDto[];
};

type OrderItemDetailDto = {
  orderItemId: number;
  orderId: number;
  itemId: number;
  imageUrl: string;
  itemName: string;
  quantity: number;
  price: number;
};

export default function OrderPage() {
  const [orderDetails, setOrderDetails] = useState<OrdersDetailDto[]>([]);
  const [userAddress, setUserAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [agreements, setAgreements] = useState({
    privacy: false,
    thirdParty: false,
    paymentAgency: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const allChecked = Object.values(agreements).every(Boolean);
    setAgreed(allChecked);
  }, [agreements]);

  // 백엔드에서 상품 데이터 가져오기 (실제로는 API 호출)
  useEffect(() => {
    const fetchOrderItems = async () => {
      const token = localStorage.getItem("access");

      try {
        const response = await fetch(`${BASE_URL}/orders/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            access: token || "",
          },
          credentials: "include",
        });

        if (response.status === 401) {
          alert("로그인이 필요한 서비스입니다.");
          // localStorage.removeItem("access"); // 필요 시 제거
          // navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        console.error("결제할 상품 조회 실패:", error);
        setOrderDetails([]); // 오류 시 빈 배열로 초기화
      }
    };
    fetchOrderItems();
  }, []);

  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          let fullAddress = data.address;
          let extraAddress = "";

          if (data.addressType === "R") {
            if (data.bname !== "") extraAddress += data.bname;
            if (data.buildingName !== "")
              extraAddress += `${extraAddress ? ", " : ""}${data.buildingName}`;
            fullAddress += extraAddress ? ` (${extraAddress})` : "";
          }
          setUserAddress(fullAddress);
        },
      }).open();
    } else {
      alert("다음 주소 검색 API 스크립트가 로드되지 않았습니다.");
      console.error("Daum Postcode API script not loaded.");
    }
  };

  const handleSubmit = () => {
    if (!agreed) {
      alert("약관에 동의해주세요.");
      return;
    }

    if (!window.IMP) {
      alert("결제 모듈이 로드되지 않았습니다.");
      return;
    }

    const { IMP } = window;
    IMP.init("imp77656432"); // 네 가맹점 식별코드

    IMP.request_pay(
      {
        pg: "danal_tpay", // 사용할 PG사
        pay_method: "card",
        merchant_uid: `ORD-${Date.now()}`, // 주문 고유 번호
        name: "포트원 테스트 결제",
        amount: orderDetails.reduce((acc, o) => acc + o.totalPrice, 0),
        buyer_email: "shoong@shoong.com",
        buyer_name: "구매자 이름",
        buyer_tel: "010-1234-5678",
        buyer_addr: userAddress,
        buyer_postcode: "12345",
      },
      async function (rsp) {
        if (rsp.success) {
          try {
            const token = localStorage.getItem("access");
            const orderId = orderDetails[0]?.orderId;

            const res = await fetch(`${BASE_URL}/orders/success`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                access: token || "",
              },
              credentials: "include",
              body: JSON.stringify({
                orderId: orderId,
              }),
            });

            if (!res.ok) {
              throw new Error("백엔드 주문 확정 API 실패");
            }

            // 성공 시 이동
            navigate("/order/complete", {
              state: { orderId: orderId },
            });
          } catch (error) {
            console.error("결제 후 주문 확정 실패:", error);
            alert("결제는 완료되었지만 주문 처리 중 오류가 발생했습니다.");
          }
        } else {
          alert("결제에 실패했습니다: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <>
      {/* Header */}
      <HeaderComponent />

      <Container size="lg" py="md">
        <Title order={3} ta="center" my="xl">
          상품 주문하기
        </Title>

        {/* 상품 정보 */}
        <Box style={{ borderTop: "1px solid #eee" }}>
          <Grid columns={12} p="sm" style={{ borderBottom: "1px solid #eee" }}>
            <Grid.Col span={6}>
              <Text fw={600} c="dimmed" size="sm">
                상품정보
              </Text>
            </Grid.Col>
            <Grid.Col span={3} ta="center">
              <Text fw={600} c="dimmed" size="sm">
                수량
              </Text>
            </Grid.Col>
            <Grid.Col span={3} ta="right">
              <Text fw={600} c="dimmed" size="sm">
                상품금액
              </Text>
            </Grid.Col>
          </Grid>

          {orderDetails.length > 0 &&
            orderDetails[0].orderItems.map((orderItemDetail) => (
              <Grid
                columns={12}
                p="md"
                align="center"
                style={{ borderBottom: "1px solid #eee" }}
              >
                <Grid.Col span={6}>
                  <Flex gap="md" align="center">
                    <Image
                      src={orderItemDetail.imageUrl}
                      alt="상품 이미지"
                      w={80}
                      h={80}
                    />
                    <Text fw={500}>{orderItemDetail.itemName}</Text>
                  </Flex>
                </Grid.Col>
                <Grid.Col span={3} ta="center">
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      border: "1px solid #eee",
                      padding: "4px 8px",
                      width: "120px",
                      margin: "0 auto",
                    }}
                  >
                    <Text mx="xs" fw={500}>
                      {orderItemDetail.quantity}
                    </Text>
                  </Flex>
                </Grid.Col>
                <Grid.Col span={3} ta="right">
                  <Box>
                    <Text fw={600}>
                      {(
                        orderItemDetail.price * orderItemDetail.quantity
                      ).toLocaleString()}
                      원
                    </Text>
                  </Box>
                </Grid.Col>
              </Grid>
            ))}

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
                  {orderDetails
                    .reduce((acc, order) => acc + order.totalPrice, 0)
                    .toLocaleString()}
                  원
                </Text>
                <Text size="xs" c="gray">
                  총 {orderDetails.length}건
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
                  {orderDetails
                    .reduce((acc, order) => acc + order.totalPrice, 0)
                    .toLocaleString()}
                  원
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* 주문자 정보 */}
          <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
            <Text fw={700} size="sm" mb="md">
              주문자 정보
            </Text>
            <TextInput
              size="md"
              radius="sm"
              label="주소"
              placeholder="주소 검색"
              leftSection={<IconMapPin size={16} />}
              value={userAddress}
              onClick={handleAddressSearch}
              readOnly
              required
            />
          </Box>

          {/* 결제 수단 */}
          <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
            <Text fw={700} size="sm" mb="md">
              결제 수단
            </Text>
            <Radio.Group
              value={paymentMethod}
              onChange={setPaymentMethod}
              name="payment-method"
            >
              <Stack gap="sm" mt="sm">
                <Radio value="card" label="카드" />
                <Radio value="virtual" label="가상계좌" />
                <Radio value="mobile" label="휴대폰" />
              </Stack>
            </Radio.Group>
          </Box>

          {/* 약관 동의 */}
          <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
            <Text fw={700} size="sm" mb="md">
              약관 동의
            </Text>
            <Box bg="gray.1" p="md">
              <Stack gap="xs">
                {/* 모두 동의 */}
                <Flex align="center" gap="xs">
                  <Checkbox
                    color="#364fc6"
                    checked={Object.values(agreements).every(Boolean)}
                    onChange={(e) => {
                      const checked = e.currentTarget?.checked ?? false;
                      setAgreements({
                        privacy: checked,
                        thirdParty: checked,
                        paymentAgency: checked,
                      });
                    }}
                  />
                  <Text size="sm" fw={600}>
                    주문 내용을 확인하였으며, 아래 내용에 모두 동의합니다.
                  </Text>
                </Flex>

                {/* 개별 항목 */}
                <Flex align="center" gap="xs">
                  <Checkbox
                    color="#364fc6"
                    checked={agreements.privacy}
                    onChange={(e) =>
                      setAgreements((prev) => ({
                        ...prev,
                        privacy: e.currentTarget?.checked ?? false,
                      }))
                    }
                  />
                  <Text size="sm">개인정보 수집 및 이용 동의</Text>
                  <Anchor size="xs">약관보기</Anchor>
                </Flex>
                <Flex align="center" gap="xs">
                  <Checkbox
                    color="#364fc6"
                    checked={agreements.thirdParty}
                    onChange={(e) =>
                      setAgreements((prev) => ({
                        ...prev,
                        thirdParty: e.currentTarget?.checked ?? false,
                      }))
                    }
                  />
                  <Text size="sm">개인정보 제 3자 제공 동의</Text>
                </Flex>
                <Flex align="center" gap="xs">
                  <Checkbox
                    color="#364fc6"
                    checked={agreements.paymentAgency}
                    onChange={(e) =>
                      setAgreements((prev) => ({
                        ...prev,
                        paymentAgency: e.currentTarget?.checked ?? false,
                      }))
                    }
                  />
                  <Text size="sm">전자결제대행 이용 동의</Text>
                </Flex>
              </Stack>
            </Box>
          </Box>

          {/* 결제 버튼 */}
          <Button
            fullWidth
            size="lg"
            color="dark"
            onClick={handleSubmit}
            disabled={!agreed}
          >
            결제하기
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <FooterComponent />
    </>
  );
}
