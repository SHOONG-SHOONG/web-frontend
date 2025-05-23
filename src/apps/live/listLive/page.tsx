import React, { useEffect, useState } from 'react';
import { Container, Grid, Image, Text, Title, Flex, Badge, Card, Box, Tabs, Stack, Group, Anchor, Divider } from '@mantine/core';
import { IconSearch } from "@tabler/icons-react";

import HeaderComponent from "../../../components/Header.tsx";
import FooterComponent from "../../../components/Footer.tsx";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

interface Item {
    itemId: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface BrandData {
    brandName: string;
    brandDescription: string;
    logoUrl: string;
    items: Item[];
}

const menus = [
    { label: "홈", value: "home" },
    { label: "카테고리", value: "category" },
    { label: "라이브", value: "live" },
];


export default function ListLivePage() {
    const [active, setActive] = useState("home");
    const { brandId } = useParams();
    const [brandData, setBrandData] = useState<BrandData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!brandId) return;

        fetch(`http://192.168.0.6:8080/brand/${brandId}`)
            .then(res => res.json())
            .then(data => setBrandData(data))
            .catch(err => console.error("Error fetching brand data:", err));
    }, [brandId]);

    if (!brandId) {
        return <Text color="red">유효하지 않은 브랜드 경로입니다.</Text>;
    }
    if (!brandData) {
        return <Text>로딩 중...</Text>;
    }


    return (
        <>
            {/* Header */}
            <HeaderComponent />

            {/* 본문 내용 */}
            <Container size="lg" pt={30}>

                {/* 라이브 */}
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


            </Container>

            {/* Footer */}
            <FooterComponent />
        </>
    );
}
