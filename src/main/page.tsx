import React from "react";
import {
  Container,
  Grid,
  Image,
  Text,
  Title,
  Accordion,
  Card,
  Badge,
  Box,
  Flex,
  Anchor,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import HeaderComponent from "../components/Header.tsx";
import FooterComponent from "../components/Footer.tsx";

export default function MainPage() {
  return (
    <>
      {/* Header */}
      <HeaderComponent />

      {/* Banner */}
      <Box
        w="100%"
        style={{
          background: "#3B61FF",
          color: "white",
          padding: "10px 0",
          textAlign: "center",
        }}
      >
        🎉 지금 가입하면 50% 할인 쿠폰 증정 🎉
      </Box>

      <Container size="lg" py="md">
        {/* LIVE 방송 */}
        <Title order={3} mt="xl" mb="sm">
          LIVE 방송
        </Title>
        <Grid gutter="md" mb={70}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid.Col span={3} key={i}>
              <Card shadow="sm" padding="sm" radius="md" withBorder>
                <Badge color="blue" variant="filled" size="sm">
                  LIVE
                </Badge>

                <Image
                  src={`https://placehold.co/240x320?text=Live+${i + 1}`}
                  alt="방송 이미지"
                  mt="xs"
                  radius="sm"
                />

                <Text mt="xs" fw={600} ta="center" size="sm">
                  라이브 방송 제목
                </Text>

                <Flex
                  mt="sm"
                  gap="xs"
                  justify="center"
                  align="center"
                  direction="row"
                  wrap="wrap"
                >
                  <Image
                    src={`https://placehold.co/60x60?text=${i + 1}`}
                    alt="상품 이미지"
                    radius="sm"
                    w={45}
                  />
                  <Text size="xs" fw={500}>
                    상품명
                  </Text>
                  <Text size="xs" c="red">
                    50%{" "}
                    <Text span fw={700} c="black">
                      19,800원
                    </Text>
                  </Text>
                </Flex>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* 실시간 Best 상품 */}
        <Flex justify="space-between" align="center" mt="xl" mb="md">
          <Title order={3}>실시간 Best 상품</Title>
          <Anchor href="#" size="xs" c="dimmed">
            &gt; 더보기
          </Anchor>
        </Flex>

        <Grid gutter="md" mb={70}>
          {[
            {
              title: "캠핑의자",
              priceOriginal: "85,000원",
              priceSale: "76,500원",
              sale: "10%",
              image: "https://placehold.co/300x300?text=campingchair",
            },
            {
              title: "라이브 쇼케이스 스마트폰 거치대",
              priceOriginal: "4,000원",
              priceSale: "3,500원",
              sale: "12%",
              image: "https://placehold.co/300x300?text=smartphone",
            },
            {
              title: "실시간 방송용 LED 조명",
              priceOriginal: "3,000원",
              priceSale: "2,900원",
              sale: "3%",
              image: "https://placehold.co/300x300?text=LED+lightening",
            },
          ].map((item, i) => (
            <Grid.Col span={4} key={i}>
              <Card padding="sm" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={item.image}
                    alt={item.title}
                    height={160}
                    fit="cover"
                  />
                </Card.Section>

                <Text mt="xs" fw={600} size="sm">
                  {item.title}
                </Text>

                <Flex mt="xs" align="baseline" gap="xs">
                  <Text size="xs" c="red" fw={600}>
                    {item.sale}
                  </Text>
                  <Text size="xs" td="line-through" c="dimmed">
                    {item.priceOriginal}
                  </Text>
                  <Text size="sm" fw={700}>
                    {item.priceSale}
                  </Text>
                </Flex>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* 자주 묻는 질문 */}
        <Title order={4} mt="xl" mb="md">
          자주 묻는 질문
        </Title>
        <Accordion
          chevronPosition="right"
          defaultValue={null}
          chevron={<IconChevronDown size={18} />}
          mb={70}
        >
          <Accordion.Item value="q1">
            <Accordion.Control>
              라이브 방송은 어떻게 참여하나요?
            </Accordion.Control>
            <Accordion.Panel>
              가입 후 방송 게시판에서 정보를 확인하세요.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="q2">
            <Accordion.Control>상품 구매는 어떻게 하나요?</Accordion.Control>
            <Accordion.Panel>
              개발자 방송을 시청하면 복잡할 수 있습니다.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="q3">
            <Accordion.Control>반통 정책은 어떻게 되나요?</Accordion.Control>
            <Accordion.Panel>
              상품의 상태에 따라 다른 조차로 처리됩니다.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="q4">
            <Accordion.Control>배송은 얼마나 걸린가요?</Accordion.Control>
            <Accordion.Panel>2~3일 정도 속에 배송됩니다.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>

      {/* Footer */}
      <FooterComponent />
    </>
  );
}