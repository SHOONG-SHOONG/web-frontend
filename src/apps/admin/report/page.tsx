import React, { useEffect, useState } from "react";
import {
    AppShell,
    Container,
    Card,
    Title,
    Grid,
    Box,
    Text,
    Flex,
    Avatar,
    Progress,
    Group,
    Badge,
    Button,
    ActionIcon,
    Tooltip,
    Loader,
} from "@mantine/core";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import AdminNavBarPage from "../../../components/AdminNavBar.tsx";

interface Item {
    itemId: number;
    itemName: string;
    category: string;
    price: number;
    discountRate: number;
    itemQuantity: number;
    finalPrice: number;
    itemImages: { url: string }[];
}

export default function ReportPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<Item[] | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem("access");
            try {
                const res = await fetch('${BASE_URL}/admin/item-list', {
                    headers: { access: token || "" },
                });
                const data = await res.json();
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setItems([]);
            }
        };
        fetchItems();
    }, []);

    const totalQuantity = Array.isArray(items)
        ? items.reduce((sum, i) => sum + i.itemQuantity, 0)
        : 0;
    const avgDiscount =
        Array.isArray(items) && items.length > 0
            ? (
                items.reduce((sum, i) => sum + i.discountRate, 0) / items.length
            ).toFixed(1)
            : "0.0";
    const categoryCount = Array.isArray(items)
        ? new Set(items.map((i) => i.category)).size
        : 0;

    return (
        <AppShell layout="default">
            <AdminNavBarPage />
            <AppShell.Main style={{ backgroundColor: "#ffffff" }}>
                <Box py="xl" px="xl">
                    <Container>
                        <Flex justify="space-between" align="center">
                            <Title order={2}>신고 관리</Title>
                            {/* <Button
                                leftSection={<IconPlus size={16} />}
                                color="black"
                                variant="light"
                                onClick={() => navigate("/admin/item/create")}
                            >
                                확인
                            </Button> */}
                        </Flex>
                    </Container>
                </Box>

                <Container py="xl">
                    <Title order={4} mb="md">
                        신고 목록
                    </Title>
                    <Card withBorder p="lg" radius="md">
                        {!items ? (
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
                                        라이브 썸네일
                                    </Text>
                                    <Text fw={500} w={200}>
                                        라이브 아이디
                                    </Text>
                                    <Text fw={500} w={120}>
                                        라이브 명
                                    </Text>
                                    <Text fw={500} w={100}>
                                        라이브 시간
                                    </Text>
                                    <Text fw={500} w={100}>
                                        라이브 상태
                                    </Text>
                                    <Text fw={500} w={200}>
                                        작업
                                    </Text>
                                </Flex>
                                {items.map((item) => (
                                    <Flex
                                        key={item.itemId}
                                        align="center"
                                        justify="space-between"
                                        py="sm"
                                        style={{ borderBottom: "1px solid #f1f3f5" }}
                                    >
                                        <Group w={200}>
                                            <Avatar
                                                src={item.itemImages?.[0]?.url}
                                                size="sm"
                                                radius="xl"
                                            />
                                            <Text>{item.itemName}</Text>
                                        </Group>
                                        <Text w={120}>{item.category}</Text>
                                        <Text w={120}>{item.price.toLocaleString()}원</Text>
                                        <Text w={80}>{item.discountRate}%</Text>
                                        <Text w={120}>{item.itemQuantity}개</Text>
                                        <Group w={200}>
                                            <Tooltip label="이동">
                                                <ActionIcon variant="light" color="blue" radius="xl">
                                                    <IconEdit size={16} />
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
