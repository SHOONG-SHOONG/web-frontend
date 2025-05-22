import React, { useState } from 'react';
import { Container, Grid, Image, Text, Title, Avatar, TextInput, Card, Flex, Badge, Paper, Box, Button, Stack, Group, Anchor, Divider, ActionIcon } from '@mantine/core';
import { IconSearch } from "@tabler/icons-react";
import { IconBrandFacebook, IconBrandTwitter, IconBrandBlogger, IconShare3 } from '@tabler/icons-react';
import LiveViewer from "./LiveViewer.tsx";
import HeaderComponent from "../../components/Header.tsx";
import FooterComponent from "../../components/Footer.tsx";

const menus = [
    { label: "홈", value: "home" },
    { label: "카테고리", value: "category" },
    { label: "라이브", value: "live" },
];


export default function LivePage() {
    const [active, setActive] = useState("home");

    return (
        <>
            {/* Header */}
            <HeaderComponent />

            {/* 본문 내용 */}
            <Container size="lg" pt={40}>
                {/* 제목 & 상태 표시 */}
                <Group align="center" mb="md">
                    <Avatar src="/your-logo-path.png" size="md" />
                    <Title order={3} style={{ flexGrow: 1 }}>갤럭시 S25 사전판매 마지막날!</Title>
                    <Badge color="blue" size="lg" radius="sm">LIVE</Badge>
                    <Text size="sm" c="dimmed">3,000 시청</Text>
                </Group>

                <Grid gutter="xl">
                    {/* 왼쪽: 영상 + 공유 */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                         <LiveViewer streamKey="shoong" />

                        {/* 공유 버튼 */}
                        <Group mt="md">
                            <ActionIcon size="lg" variant="default"><IconBrandFacebook /></ActionIcon>
                            <ActionIcon size="lg" variant="default"><IconBrandTwitter /></ActionIcon>
                            <ActionIcon size="lg" variant="default"><IconBrandBlogger /></ActionIcon>
                            <ActionIcon size="lg" variant="default"><IconShare3 /></ActionIcon>
                        </Group>
                    </Grid.Col>

                    {/* 오른쪽: 채팅 & 상품 */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Flex direction="column" gap="lg">

                            {/* 채팅창 */}
                            <Paper
                                shadow="sm"
                                radius="md"
                                p="md"
                                mb="lg"
                                style={{
                                    height: 400,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {/* 제목 (고정) */}
                                <Text size="sm">실시간 채팅</Text>
                                <Divider my="sm" />

                                {/* 채팅 메시지 (스크롤 영역) */}
                                <Box
                                    style={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        marginBottom: 12,
                                    }}
                                >
                                    <Flex direction="column" gap={8}>
                                        <Text size="xs">나는SOLO: 두구두구두구</Text>
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <Text size="xs" key={i}>zumba999: 다 던져~</Text>
                                        ))}
                                        <Text size="xs" fw={700} c="red">
                                            ⚠️ 인증이 없으면 주문 불가!
                                        </Text>
                                    </Flex>
                                </Box>

                                {/* 입력창 (고정 하단) */}
                                <Group>
                                    <TextInput placeholder="메세지를 입력하세요" style={{ flex: 1 }} />
                                    <Button>전송</Button>
                                </Group>
                            </Paper>

                            {/* 상품 정보 */}
                            <Flex gap="md" align="flex-start">

                                <Image src={`https://placehold.co/60x60?text=product`}
                                    style={{ width: 60, height: 60 }} radius="md" />

                                <Box>
                                    <Text mt="xs" fw={600} size="sm">상품명</Text>
                                    <Flex mt="xs" align="baseline" gap="xs">
                                        <Text size="xs" c="red" fw={600}>
                                            10%
                                        </Text>
                                        <Text size="xs" td="line-through" c="dimmed">
                                            85,000원
                                        </Text>
                                        <Text size="sm" fw={700}>
                                            76,500원
                                        </Text>
                                    </Flex>
                                </Box>
                            </Flex>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Container>

            {/* Footer */}
            <FooterComponent />
        </>
    );
}
