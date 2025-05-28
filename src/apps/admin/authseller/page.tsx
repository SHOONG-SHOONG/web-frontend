import React, { useEffect, useState } from "react";
import {
    AppShell,
    Container,
    Card,
    Title,
    Box,
    Text,
    Flex,
    Avatar,
    Group,
    Badge,
    ActionIcon,
    Tooltip,
    Loader,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import AdminNavBarPage from "../../../components/AdminNavBar.tsx";

interface Seller {
    id: number;
    userAlias: string;
    userEmail: string;
    userName: string;
    name: string;
    userPhone: string;
    birthDay: string;
    role: string;
    registrationNumber: string;
    userStatus: string;
    userAddress: string;
    brandId: number;
    brandName: string;
}

export default function AuthSellerPage() {
    const [sellers, setSellers] = useState<Seller[] | null>(null);

    const fetchPendingSellers = async () => {
        const token = localStorage.getItem("access");
        try {
            const res = await fetch('${BASE_URL}/admin/pending/users', {
                method: "GET",
                headers: {
                    access: token || "",
                },
                credentials: "include",
            });
            const data = await res.json();
            setSellers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setSellers([]);
        }
    };

    const handleApprove = async (userId: number) => {
        const token = localStorage.getItem("access");
        try {
            await fetch('${BASE_URL}/admin/${userId}/user/approve', {
                method: "POST",
                headers: { access: token || "" },
            });
            fetchPendingSellers();
        } catch (err) {
            console.error("승인 실패:", err);
        }
    };

    const handleReject = async (userId: number) => {
        const token = localStorage.getItem("access");
        try {
            await fetch('${BASE_URL}/admin/${userId}/user/reject', {
                method: "POST",
                headers: { access: token || "" },
            });
            fetchPendingSellers();
        } catch (err) {
            console.error("거절 실패:", err);
        }
    };

    useEffect(() => {
        fetchPendingSellers();
    }, []);

    return (
        <AppShell layout="default">
            <AdminNavBarPage />
            <AppShell.Main>
                <Container py="xl">
                    <Title order={2} mb="lg">
                        판매자 관리
                    </Title>

                    <Title order={4} mb="md">
                        대기 목록
                    </Title>
                    <Card withBorder p="lg" radius="md">
                        {!sellers ? (
                            <Flex justify="center" align="center" py="xl">
                                <Loader size="lg" />
                            </Flex>
                        ) : (
                            <Box>
                                <Flex
                                    justify="space-between"
                                    pb="sm"
                                    mb="sm"
                                    style={{ borderBottom: "1px solid #eee" }}
                                >
                                    <Text fw={500} w={200}>
                                        이름
                                    </Text>
                                    <Text fw={500} w={200}>
                                        이메일
                                    </Text>
                                    <Text fw={500} w={160}>
                                        전화번호
                                    </Text>
                                    <Text fw={500} w={200}>
                                        브랜드명
                                    </Text>
                                    <Text fw={500} w={200}>
                                        작업
                                    </Text>
                                </Flex>
                                {sellers.map((seller) => (
                                    <Flex
                                        key={seller.id}
                                        align="center"
                                        justify="space-between"
                                        py="sm"
                                        style={{ borderBottom: "1px solid #f1f3f5" }}
                                    >
                                        <Text w={200}>{seller.userName}</Text>
                                        <Text w={200}>{seller.userEmail}</Text>
                                        <Text w={160}>{seller.userPhone}</Text>
                                        <Text w={200}>{seller.brandName}</Text>
                                        <Group w={200}>
                                            <Tooltip label="승인">
                                                <ActionIcon
                                                    variant="light"
                                                    color="green"
                                                    radius="xl"
                                                    onClick={() => handleApprove(seller.id)}
                                                >
                                                    <IconCheck size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                            <Tooltip label="거절">
                                                <ActionIcon
                                                    variant="light"
                                                    color="red"
                                                    radius="xl"
                                                    onClick={() => handleReject(seller.id)}
                                                >
                                                    <IconX size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Flex>
                                ))}
                            </Box>
                        )}
                    </Card>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
