import React, { useEffect, useState } from "react";
import {
    AppShell,
    Container,
    Title,
    Button,
    Box,
    TextInput,
    Textarea,
    FileButton,
    Stack,
    Text,
    Card,
    Flex,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import { IconPlus } from "@tabler/icons-react";
import BASE_URL from "../../../config";

interface Brand {
    brandName: string;
    brandDescription: string;
    logoUrl: string;
}

interface User {
    brandName?: string;
    userName: string;
    userEmail: string;
}

export default function RegisterBrandPage() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [brandName, setBrandName] = useState("");
    const [brandDescription, setBrandDescription] = useState("");
    const [userInfo, setUserInfo] = useState<User | null>(null);

    const isRegistered = !!userInfo?.brandName?.trim();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("access");
                const res = await fetch(`${BASE_URL}/myPage`, {
                    method: "GET",
                    headers: {
                        Accept: "*/*",
                        access: token || "",
                    },
                    credentials: "include",
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setUserInfo(data);
            } catch (err) {
                console.error("사용자 정보 불러오기 실패:", err);
            }
        };

        fetchUserInfo();
    }, []);

    const handleSubmit = async () => {
        if (!brandName.trim() || !brandDescription.trim() || !file) {
            alert("브랜드 이름, 설명, 이미지를 모두 입력해주세요.");
            return;
        }

        const token = localStorage.getItem("access");
        const formData = new FormData();
        formData.append("imageFile", file);

        try {
            const response = await fetch(
                `${BASE_URL}/brand/create?name=${encodeURIComponent(brandName)}&description=${encodeURIComponent(brandDescription)}`,
                {
                    method: "POST",
                    headers: {
                        access: token || "",
                    },
                    credentials: "include",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            alert("브랜드 등록이 완료되었습니다.");
            navigate("/seller/brand");
        } catch (error) {
            console.error("브랜드 등록 실패:", error);
            alert("브랜드 등록에 실패했습니다.");
        }
    };

    return (
        <AppShell layout="default">
            <SellerNavBarPage />
            <AppShell.Main style={{ backgroundColor: "#fff" }}>
                <Container py="xl" px="xl">
                    <Flex justify="space-between" align="center" mb="xl">
                        <Title order={3} fw={600}>브랜드 등록</Title>
                        <Button
                            radius="lg"
                            h={40}
                            leftSection={<IconPlus size={16} />}
                            color="black"
                            variant="light"
                            onClick={handleSubmit}
                            disabled={isRegistered}
                        >
                            {isRegistered ? "브랜드 등록 완료" : "등록하기"}
                        </Button>
                    </Flex>

                    <Text color="dimmed" mb="lg">
                        브랜드 정보는 <b>최초 1회</b>만 등록 가능하며, 이후에는 수정이 불가합니다.
                    </Text>
                    {isRegistered && (
                        <Text color="dimmed" mb="lg">
                            회원님은 <b>{userInfo?.brandName}</b> 브랜드를 이미 등록하셨습니다.
                        </Text>
                    )}

                    <Card withBorder p="lg" radius="lg">
                        <Stack gap="lg">
                            <Text mb={4} fw={500}>브랜드 이름</Text>
                            <TextInput
                                radius="sm"
                                size="md"
                                placeholder="브랜드명을 입력하세요"
                                value={brandName}
                                onChange={(e) => setBrandName(e.currentTarget.value)}
                                disabled={isRegistered}
                            />
                            <Text mb={4} fw={500}>대표 썸네일 이미지</Text>
                            <FileButton onChange={setFile} accept="image/png,image/jpeg" disabled={isRegistered}>
                                {(props) => (
                                    <Button
                                        radius="lg"
                                        h={40}
                                        w={300}
                                        color="black"
                                        variant="outline"
                                        {...props}
                                    >
                                        업로드
                                    </Button>
                                )}
                            </FileButton>
                            {file && (
                                <Text size="sm" mt="xs">
                                    {file.name}
                                </Text>
                            )}
                        </Stack>
                        <Textarea
                            mt="md"
                            label="소개 문구"
                            placeholder="브랜드를 간단히 소개해주세요."
                            autosize
                            minRows={3}
                            value={brandDescription}
                            onChange={(e) => setBrandDescription(e.currentTarget.value)}
                            disabled={isRegistered}
                        />
                    </Card>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
