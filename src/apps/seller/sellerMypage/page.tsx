import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    Card,
    Badge,
    Group,
    Button,
    SimpleGrid,
    Flex,
    Grid,
    AppShell,
    Container,
    Title,
    Image,
    Loader,
    Divider,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import BASE_URL from "../../../config.js";

interface User {
    brandId?: number;
    brandName: string | null;
    userEmail: string;
    userPassword: string | null;
    userName: string;
    userPhone: string;
    bdate: string | null;
    role: string | null;
    registrationNumber: string;
    userStatus: string;
}

interface BrandItem {
    itemId: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface Brand {
    brandName: string;
    brandDescription: string;
    logoUrl: string;
    items: BrandItem[];
}

export default function SellerMypge() {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [brandInfo, setBrandInfo] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem("access");

            const response = await fetch(`${BASE_URL}/myPage`, {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    access: token || "",
                },
                credentials: "include",
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            setUserInfo(data);

            if (data.brandId) {
                await fetchBrandInfo(data.brandId);
            } else {
                setLoading(false); // brandId 없으면 로딩 종료
            }
        } catch (err) {
            console.error("mypage", err);
            setLoading(false);
        }
    };

    const fetchBrandInfo = async (brandId: number) => {
        try {
            const token = localStorage.getItem("access");
            const res = await fetch(`${BASE_URL}/brand/summary/${brandId}`, {
                method: "GET",
                headers: { accept: "*/*", access: token || "" },
                credentials: "include",
            });

            const data = await res.json();
            setBrandInfo(data);
        } catch (err) {
            console.error("브랜드 정보 조회 실패", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell layout="default">
            <SellerNavBarPage />
            <AppShell.Main style={{ backgroundColor: "#fff" }}>
                <Container py="xl" px="xl">
                    <Title order={3} fw={600}>마이페이지</Title>
                    <Box style={{ display: "flex", minHeight: "100vh" }}>
                        <Box style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px" }}>
                            <Box style={{ width: "1000px", maxWidth: "100%" }}>
                                {/* 프로필 카드 */}
                                <Card mb="xl" radius="lg" withBorder p="xl" shadow="sm">
                                    {/* 안내 오버레이 */}
                                    {!userInfo?.brandId && (
                                        <Box
                                            pos="absolute"
                                            top={0}
                                            left={0}
                                            right={0}
                                            bottom={0}
                                            bg="rgba(0, 0, 0, 0.6)"
                                            style={{
                                                zIndex: 10,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backdropFilter: "blur(2px)",
                                            }}
                                        >
                                            <Text size="lg" fw={700} c="white">
                                                브랜드를 먼저 등록해주세요
                                            </Text>
                                        </Box>
                                    )}
                                    <Flex justify="space-between" align="flex-start">
                                        <Group align="center" gap="lg">
                                            <Box
                                                w={60}
                                                h={60}
                                                style={{
                                                    backgroundColor: "#eee",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 20,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {userInfo?.userName?.charAt(0) ?? "?"}
                                            </Box>
                                            <Box>
                                                <Text fw={700} size="xl">{userInfo?.userName}</Text>
                                                <Text size="sm" c="dimmed">{userInfo?.userEmail}</Text>
                                                <Text size="sm" c="dimmed">{userInfo?.userPhone}</Text>
                                            </Box>
                                        </Group>
                                        <Box ta="right">
                                            <Text fw={800} size="lg" color="gray">SELLER</Text>
                                            <Text size="xs" c="dimmed">판매자 계정입니다</Text>
                                        </Box>
                                    </Flex>

                                    <Box h={1} bg="gray.2" my="sm" />

                                    <Box mt="lg">
                                        <SimpleGrid cols={3} spacing="lg" align="center">
                                            <Box>
                                                <Text size="xs" c="dimmed" mb={4}>브랜드</Text>
                                                <Text fw={600}>
                                                    {userInfo?.brandName || "미등록"}
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text size="xs" c="dimmed" mb={4}>사업자 등록번호</Text>
                                                <Text fw={600}>{userInfo?.registrationNumber}</Text>
                                            </Box>
                                            <Box>
                                                <Text size="xs" c="dimmed" mb={4}>계정 상태</Text>
                                                <Badge
                                                    color={
                                                        userInfo?.userStatus === "ACTIVE"
                                                            ? "blue"
                                                            : userInfo?.userStatus === "PENDING"
                                                                ? "yellow"
                                                                : "red"
                                                    }
                                                    variant="light"
                                                    radius="sm"
                                                >
                                                    {userInfo?.userStatus === "ACTIVE"
                                                        ? "활성화됨"
                                                        : userInfo?.userStatus === "PENDING"
                                                            ? "승인 대기중"
                                                            : "비활성화"}
                                                </Badge>
                                            </Box>
                                        </SimpleGrid>
                                    </Box>
                                </Card>


                                {/* 브랜드 정보 카드 */}
                                {loading ? (
                                    <Flex justify="center" align="center" h={200}>
                                        <Loader size="lg" />
                                    </Flex>
                                ) : brandInfo ? (
                                    <Card withBorder radius="lg" p="xl" shadow="md" mb="xl" bg="gray.0">
                                        <Title order={3} fw={700} mb="lg">
                                            내 브랜드 정보
                                        </Title>
                                        <Flex direction="column" gap="xl">
                                            <Flex gap="lg" align="center">
                                                <Image
                                                    src={brandInfo.logoUrl}
                                                    alt="브랜드 로고"
                                                    w={350}
                                                    h={350}
                                                    fit="cover"
                                                    radius="md"
                                                    fallbackSrc="/placeholder.png"
                                                    style={{ border: "1px solid #ddd" }}
                                                />
                                                <Box>
                                                    <Text fw={800} style={{ fontSize: "30px" }}>{brandInfo.brandName}</Text>
                                                    <Text size="md" c="dimmed" mt={4}>{brandInfo.brandDescription}</Text>
                                                </Box>
                                            </Flex>
                                            <Box h={1} bg="gray.2" my="sm" />
                                            <Box>
                                                <Text fw={700} size="lg" mb="md">등록된 상품</Text>
                                                {brandInfo.items.length > 0 ? (
                                                    <Grid gutter="md">
                                                        {brandInfo.items.map((item) => (
                                                            <Grid.Col span={3} key={item.itemId}>
                                                                <Card withBorder radius="md" shadow="xs" p="sm" h={250}>
                                                                    <Image
                                                                        src={item.imageUrl}
                                                                        height={120}
                                                                        fit="cover"
                                                                        radius="sm"
                                                                        fallbackSrc="/placeholder.png"
                                                                    />
                                                                    <Text fw={600} mt="sm" truncate="end">{item.name}</Text>
                                                                    <Text size="sm" c="dimmed">{item.price.toLocaleString()}원</Text>
                                                                </Card>
                                                            </Grid.Col>
                                                        ))}
                                                    </Grid>
                                                ) : (
                                                    <Text size="sm" c="gray">등록된 상품이 없습니다.</Text>
                                                )}
                                            </Box>
                                        </Flex>
                                    </Card>
                                ) : (
                                    <Card withBorder radius="md" p="xl" ta="center">
                                        <Text size="lg" fw={600} mb="sm">아직 브랜드를 등록하지 않으셨습니다.</Text>
                                        <Text size="sm" c="dimmed" mb="lg">브랜드를 등록하고 상품을 판매해보세요!</Text>
                                        <Button onClick={() => navigate("/seller/brand")}
                                            color="dark"
                                            size="md"
                                            radius="lg"
                                            w={300}
                                            mx="auto">
                                            브랜드 등록하러 가기
                                        </Button>
                                    </Card>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
