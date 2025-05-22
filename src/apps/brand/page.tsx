import React, { useState } from 'react';
import { Container, Grid, Image, Text, Title, Flex, Badge, Card, Box, Tabs, Stack, Group, Anchor, Divider } from '@mantine/core';
import { IconSearch } from "@tabler/icons-react";

import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";

const menus = [
    { label: "홈", value: "home" },
    { label: "카테고리", value: "category" },
    { label: "라이브", value: "live" },
];


export default function BrandPage() {
    const [active, setActive] = useState("home");

    return (
        <>
            {/* Header */}
            <HeaderComponent />

            {/* 본문 내용 */}
            <Container size="lg" pt={30}>
                <Tabs defaultValue="intro">
                    <Tabs.List>
                        <Tabs.Tab value="intro">브랜드 소개</Tabs.Tab>
                        <Tabs.Tab value="products">상품</Tabs.Tab>
                        <Tabs.Tab value="live">라이브</Tabs.Tab>
                    </Tabs.List>

                    {/* 브랜드 소개 */}
                    <Tabs.Panel value="intro" pt="xl">
                        <Grid gutter="xl" align="center">
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Image
                                    src={`https://placehold.co/240x320?text=brand`}
                                    alt="브랜드 로고"
                                    radius="xl"
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 8 }}>
                                <Title order={3} mb="md">편리함과 아름다움의 조화</Title>
                                <Text size="sm" c="dimmed">
                                    우리는 제품을 만들 때 편리함과 아름다움의 조화를 중요하게 생각합니다.
                                    사용하기 편리한 제품은 오랜 사용자 후속에서 약속을 감지하고,
                                    아름다운 제품은 감각적이고 세련된 공간을 연출해줍니다.
                                    우리는 당신이 소중히 여기는 것들을 공감하면서,
                                    당신의 일상과 함께 할 제품을 만들기 위해 노력합니다.
                                </Text>
                            </Grid.Col>
                        </Grid>
                    </Tabs.Panel>

                    {/* 상품 탭 */}
                    <Tabs.Panel value="products" pt="xl">
                        <Title order={3}>상품</Title>
                        <Text size="sm" c="dimmed">
                            <Grid gutter="md" pt={10} mb={70}>
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
                        </Text>
                    </Tabs.Panel>

                    {/* 라이브 탭 */}
                    <Tabs.Panel value="live" pt="xl">
                        <Title order={3}>라이브 진행중인 방송</Title>
                        <Text size="sm" c="dimmed">
                            <Grid gutter="md" pt={10} mb={70}>
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
                                                    src={`https://placehold.co/60x60?text=pr+${i + 1}`}
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
                        </Text>
                        <Divider my="sm" />
                        <Title order={3}>다시보기</Title>
                        <Text size="sm" c="dimmed">
                            <Grid gutter="md" pt={10} mb={70}>
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
                                                    src={`https://placehold.co/60x60?text=pr+${i + 1}`}
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
                        </Text>
                    </Tabs.Panel>
                </Tabs>
            </Container>

            {/* Footer */}
            <FooterComponent />
        </>
    );
}
