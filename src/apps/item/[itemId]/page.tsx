import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Image,
  Text,
  Title,
  Button,
  NumberInput,
  Tabs,
  Table,
  Flex,
  Group,
  Divider,
  Loader,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import HeaderComponent from "../../../components/Header.tsx";
import FooterComponent from "../../../components/Footer.tsx";

// 타입 정의
interface ItemImage {
  id: number;
  url: string;
  createdAt: string;
}

interface Item {
  itemId: number;
  brandId: number;
  itemName: string;
  price: number;
  discountRate: number;
  finalPrice: number;
  wishlistCount: number;
  description: string;
  itemQuantity: number;
  category: string;
  discountExpiredAt: string;
  status: string;
  itemImages: ItemImage[];
}

export default function ItemDetailPage() {
  const { itemId } = useParams(); // <- 주소에서 itemId 추출
  const [item, setItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetail = async (
      itemId: number,
      setItem: (item: Item) => void,
      setError: (error: string | null) => void
    ) => {
      try {
        // const token = localStorage.getItem("access");

        const response = await fetch(`http://192.168.0.6:8080/item/${itemId}`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            // access: token || "",
          },
          // credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const data: Item = await response.json();
        setItem(data);
        setError(null);
      } catch (err: any) {
        console.error("에러 발생:", err);
        setError(err.message || "상품 조회 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetail(Number(itemId), setItem, setError);
    }
  }, [itemId]);

  const handleAddToCart = () => {
    alert("장바구니에 담았습니다!");
  };

  const handleBuy = () => {
    alert("구매 페이지로 이동합니다.");
  };

  if (loading) {
    return (
      <Container py="xl">
        <Loader color="blue" size="lg" />
      </Container>
    );
  }

  if (!item) {
    return (
      <Container py="xl">
        <Title order={3}>상품 정보를 찾을 수 없습니다.</Title>
      </Container>
    );
  }

  return (
    <>
      <HeaderComponent />

      <Container size="lg" py="xl">
        {/* 상품 이미지 + 정보 */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Image
              src={item.itemImages?.[0]?.url || "https://placehold.co/600x600"}
              alt={item.itemName}
              radius="md"
              w={400}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={3}>{item.itemName}</Title>

            {item.discountRate > 0 && (
              <Text size="sm" c="dimmed" td="line-through">
                {item.price.toLocaleString()}원
              </Text>
            )}

            <Text
              fw={700}
              size="lg"
              c={item.discountRate > 0 ? "red" : "black"}
            >
              {item.discountRate > 0 && `${item.discountRate}% `}
              <Text span fw={700} c="black">
                {item.finalPrice.toLocaleString()}원
              </Text>
            </Text>

            <Text mt="xs">{item.description}</Text>

            <Divider my="sm" />

            <Text size="sm">배송: 택배배송 (CJ대한통운)</Text>

            <Flex align="center" gap="md" mt="md">
              <NumberInput
                value={quantity}
                onChange={(val) =>
                  setQuantity(typeof val === "number" ? val : 1)
                }
                min={1}
                max={item.itemQuantity}
                size="sm"
                w={100}
              />

              <Text fw={700}>
                총 금액: {(item.finalPrice * quantity).toLocaleString()}원
              </Text>
            </Flex>

            <Group mt="md" grow>
              <Button variant="outline" onClick={handleAddToCart}>
                장바구니
              </Button>
              <Button color="dark" onClick={handleBuy}>
                구매하기
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        {/* 상세 정보 탭 */}
        <Tabs
          color="#4d6ef4"
          variant="pills"
          radius="md"
          defaultValue="detail"
          mt="xl"
        >
          <Tabs.List>
            <Tabs.Tab value="detail">상품상세</Tabs.Tab>
            <Tabs.Tab value="review">리뷰(0)</Tabs.Tab>
            <Tabs.Tab value="inquiry">문의(0)</Tabs.Tab>
            <Tabs.Tab value="notice">안내사항</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="detail" pt="md">
            <Image
              src="https://placehold.co/800x100?text=item+detail"
              alt="상세이미지"
            />
            <Text mt="sm">{item.description}</Text>
          </Tabs.Panel>

          <Tabs.Panel value="review" pt="md">
            <Text size="sm" c="dimmed">
              가장 먼저 리뷰를 작성해주세요.
            </Text>
          </Tabs.Panel>

          <Tabs.Panel value="inquiry" pt="md">
            <Text size="sm" c="dimmed">
              상품에 대해 궁금한 점을 작성해주세요.
            </Text>
            <Button variant="outline" mt="sm" size="xs">
              상품 문의 작성하기
            </Button>
          </Tabs.Panel>

          <Tabs.Panel value="notice" pt="md">
            <Table striped withColumnBorders mt="sm">
              <tbody>
                <tr>
                  <td>
                    <b>기본 택배사</b>
                  </td>
                  <td>CJ대한통운</td>
                </tr>
                <tr>
                  <td>
                    <b>출고지</b>
                  </td>
                  <td>04549 | 서울 중구 을지로 154-2 | 오락국</td>
                </tr>
                <tr>
                  <td>
                    <b>반품지</b>
                  </td>
                  <td>04549 | 서울 중구 을지로 154-2 | 오락국</td>
                </tr>
                <tr>
                  <td>
                    <b>반품 배송비</b>
                  </td>
                  <td>3,000원</td>
                </tr>
                <tr>
                  <td>
                    <b>반품 요청 가능 기간</b>
                  </td>
                  <td>배송 완료 후 7일 이내</td>
                </tr>
                <tr>
                  <td>
                    <b>배송 및 반품 안내</b>
                  </td>
                  <td>* 배송은 주문일로부터 영업일 기준 7~10일 소요됩니다.</td>
                </tr>
              </tbody>
            </Table>
          </Tabs.Panel>
        </Tabs>
      </Container>

      <FooterComponent />
    </>
  );
}
