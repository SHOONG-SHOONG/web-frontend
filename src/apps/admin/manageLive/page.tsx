import React from 'react';
import {
    UnstyledButton, Flex, Box, Button, Container,
    Group, Text, Title, Stack, Divider, Badge, Table, Image
} from '@mantine/core';
import { IconBox, IconBroadcast, IconUser } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const liveList = [
    { id: 1, title: 'Live 1', date: '2025.04.23', time: '14:00', status: '대기' },
    { id: 2, title: 'Live 2', date: '2025.04.23', time: '14:00', status: '종료' },
    { id: 3, title: 'Live 3', date: '2025.04.23', time: '14:00', status: '종료' },
];

export default function LiveListPage() {
    return (
        <Flex>
            {/* 사이드바 */}
            <Box
                w={220}
                h="100vh"
                bg="#f8f9fa"
                p="md"
                style={{ borderRight: "1px solid #e9ecef" }}
            >
                <Text fw={700} size="xl" c="#3b5bdb" mb="lg">
                    Shoong
                </Text>
                <Stack gap="xs">
                    <UnstyledButton
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "#edf2ff",
                            color: "#3b5bdb",
                            fontWeight: 600,
                        }}
                    >
                        <IconBox size={16} />
                        <Text size="sm">상품 관리</Text>
                    </UnstyledButton>
                    <UnstyledButton
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            borderRadius: 8,
                            color: "#495057",
                        }}
                    >
                        <IconBroadcast size={16} />
                        <Text size="sm">라이브쇼 관리</Text>
                    </UnstyledButton>
                    <UnstyledButton
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            borderRadius: 8,
                            color: "#495057",
                        }}
                    >
                        <IconUser size={16} />
                        <Text size="sm">계정 관리</Text>
                    </UnstyledButton>
                </Stack>
            </Box>

            {/* 메인 콘텐츠 */}
            <Box style={{ flex: 1 }} bg="#fefefe">
                <Container py="xl">
                    <Flex justify="space-between" align="center" mb="md">
                        <Title order={4}>라이브목록 (0/10)</Title>
                        <Link to="">
                            <Button color="#3b5bdb" radius="md" size="sm">
                                라이브 등록
                            </Button>
                        </Link>
                    </Flex>

                    <Divider mb="sm" />

                    <Table verticalSpacing="md" striped highlightOnHover>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>상태</th>
                                <th>라이브</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liveList.map((live) => (
                                <tr key={live.id}>
                                    <td style={{ textAlign: 'center' }}>
                                        <Badge color={live.status === '대기' ? 'yellow' : 'gray'}>{live.status}</Badge>
                                    </td>
                                    <td>
                                        <Flex gap="md" align="flex-start">

                                            <Image src={`https://placehold.co/60x60?text=live`}
                                                style={{ width: 80, height: 110 }} radius="md" />

                                            <Box>
                                                <Text mt="xs" fw={600} size="sm">{live.title}</Text>
                                                <Flex mt="xs" align="baseline" gap="xs">
                                                    <Text size="xs" c="dimmed">
                                                        {live.date} {live.time}
                                                    </Text>
                                                    <Text size="sm" c="dimmed">♡ 0</Text>
                                                </Flex>
                                            </Box>
                                        </Flex>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </Box>
        </Flex >
    );
}
