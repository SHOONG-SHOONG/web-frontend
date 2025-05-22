import React, { useState } from "react";
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
} from "@mantine/core";
import { useLocation } from "react-router-dom";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";

export default function ItemDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const { state: item } = useLocation();

  if (!item) {
    return (
      <Container>
        <Title order={3}>상품 정보를 찾을 수 없습니다.</Title>
      </Container>
    );
  }

  const handleAddToCart = () => {
    alert("장바구니에 담았습니다!");
  };

  const handleBuy = () => {
    alert("구매 페이지로 이동합니다.");
  };

  return (
    <>
      <HeaderComponent />

      <Container size="lg" py="xl">
        {/* 상품 이미지 + 정보 */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Image src={item.image} alt={item.title} radius="md" w={400} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={3}>{item.title}</Title>

            {item.original && (
              <Text size="sm" c="dimmed" td="line-through">
                {item.original}
              </Text>
            )}

            {item.discount ? (
              <Text fw={700} size="lg" c="red">
                {item.discount}{" "}
                <Text span fw={700} c="black">
                  {item.sale.toLocaleString()}
                </Text>
              </Text>
            ) : (
              <Text fw={700} size="lg">
                {item.sale.toLocaleString()}
              </Text>
            )}

            <Text mt="xs">정말 편안한 {item.title}입니다!</Text>

            <Divider my="sm" />

            <Text size="sm">배송: 택배배송 (CJ대한통운)</Text>

            <Flex align="center" gap="md" mt="md">
              <NumberInput
                value={quantity}
                onChange={(val) =>
                  setQuantity(typeof val === "number" ? val : 1)
                }
                min={1}
                max={99}
                size="sm"
                w={100}
              />

              <Text fw={700}>
                총 금액: {(item.sale * quantity).toLocaleString()}원
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

        {/* Tabs */}
        {/* <Tabs defaultValue="detail" mt="xl"> */}
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

          {/* 상품상세 */}
          <Tabs.Panel value="detail" pt="md">
            <Image
              src="https://placehold.co/800x100?text=item+detail"
              alt="상세이미지"
            />
            <Text mt="sm">
              하이여잉
              <br />
              완벽하게 눕혀줍쇼서
              <br />
              너네들 다 나가 나만 와주세요.
            </Text>
          </Tabs.Panel>

          {/* 리뷰 */}
          <Tabs.Panel value="review" pt="md">
            <Text size="sm" c="dimmed">
              가장 먼저 리뷰를 작성해주세요.
            </Text>
          </Tabs.Panel>

          {/* 문의 */}
          <Tabs.Panel value="inquiry" pt="md">
            <Text size="sm" c="dimmed">
              상품에 대해 궁금한점을 작성해주세요.
            </Text>
            <Button variant="outline" mt="sm" size="xs">
              상품 문의 작성하기
            </Button>
          </Tabs.Panel>

          {/* 안내사항 */}
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
