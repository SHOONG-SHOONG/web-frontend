import React from "react";
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

export default function RegisterBrandPage() {
    const navigate = useNavigate();
    const [file, setFile] = React.useState<File | null>(null);

    return (
        <AppShell layout="default">
            <SellerNavBarPage />
            <AppShell.Main style={{ backgroundColor: "#fff" }}>
                <Container size="xl" px={0}>
                    <Box py="xl" px="xl">
                        <Flex justify="space-between" align="center">
                            <Title order={2}>브랜드 등록</Title>
                            <Button
                                radius="lg"
                                h={40}
                                leftSection={<IconPlus size={16} />}
                                color="black"
                                variant="light"
                            // onClick={() => navigate("/seller/item/create")}
                            >
                                등록하기
                            </Button>
                        </Flex>
                    </Box>

                    <Box>
                        <Text mb={4} fw={500}>
                            대표 썸네일 이미지
                        </Text>
                        <FileButton onChange={setFile} accept="image/png,image/jpeg">
                            {(props) => (
                                <Button variant="outline" {...props}>
                                    업로드
                                </Button>
                            )}
                        </FileButton>
                        {file && (
                            <Text size="sm" mt="xs">
                                {file.name}
                            </Text>
                        )}
                    </Box>

                    <Textarea
                        label="소개 문구"
                        placeholder="Field text goes here"
                        autosize
                        minRows={3}
                    />
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
