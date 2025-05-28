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

export default function StatisticsPage() {
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
                            <Title order={2}>통계</Title>
                            {/* <Button
                                leftSection={<IconPlus size={16} />}
                                color="black"
                                variant="light"
                                onClick={() => navigate("/admin/item/create")}
                            >
                                확인
                            </Button> */}
                        </Flex>

                        <Grid mt="md">
                            <Grid.Col span={3}>
                                <Card radius="md" shadow="sm" p="lg" withBorder bg="white">
                                    <Text size="sm" c="dimmed">
                                        총 상품 수
                                    </Text>
                                    <Title order={2}>{items ? items.length : 0}</Title>
                                </Card>
                            </Grid.Col>
                            <Grid.Col span={3}>
                                <Card radius="md" shadow="sm" p="lg" withBorder bg="white">
                                    <Text size="sm" c="dimmed">
                                        총 재고 수량
                                    </Text>
                                    <Title order={2}>{totalQuantity}</Title>
                                </Card>
                            </Grid.Col>
                            <Grid.Col span={3}>
                                <Card radius="md" shadow="sm" p="lg" withBorder bg="white">
                                    <Text size="sm" c="dimmed">
                                        카테고리 수
                                    </Text>
                                    <Title order={2}>{categoryCount}</Title>
                                </Card>
                            </Grid.Col>
                            <Grid.Col span={3}>
                                <Card radius="md" shadow="sm" p="lg" withBorder bg="white">
                                    <Text size="sm" c="dimmed">
                                        평균 할인율
                                    </Text>
                                    <Title order={2}>{avgDiscount}%</Title>
                                </Card>
                            </Grid.Col>
                        </Grid>

                    </Container>
                </Box>

                <Container py="xl">
                    <Card withBorder p="lg" radius="md">
                        dkdk
                    </Card>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
