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
    AppShellNavbar,
    Table,
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
            <AppShellNavbar>
                <AdminNavBarPage />
            </AppShellNavbar>
            <AppShell.Main ml={250}>
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
                            <Table highlightOnHover withColumnBorders striped stickyHeader stickyHeaderOffset={60}
                                styles={{
                                    td: {
                                        paddingTop: 16,
                                        paddingBottom: 16,
                                    },
                                }}>
                                <thead style={{
                                    textAlign: "center", borderBottom: "2px solid #dee2e6"
                                }}>
                                    <tr>
                                        <th>라이브 썸네일</th>
                                        <th>라이브 아이디</th>
                                        <th>라이브 명</th>
                                        <th>라이브 시간</th>
                                        <th>라이브 상태</th>
                                        <th>라이브 상태</th>
                                        <th>작업</th>
                                    </tr>
                                </thead>
                            </Table>
                        )}
                    </Card>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
