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
} from "@mantine/core";
import { Link } from "react-router-dom";
import AdminNavBarPage from "../../../components/AdminNavBar.tsx";

export default function AdminUserPage() {
    const [file, setFile] = React.useState<File | null>(null);

    return (
        <AppShell layout="default">
            <AdminNavBarPage />
            <AppShell.Main style={{ backgroundColor: "#f8f9fa" }}>
                <Container size="xl" px={0}>
                    <Box mb="lg" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Title order={3} fw={600}>
                            판매자 관리
                        </Title>
                        <Link to="">
                            <Button
                                variant="filled"
                                size="sm"
                                radius="md"
                                onClick={() => {
                                    alert("수정되었습니다");
                                }}
                                styles={{
                                    root: {
                                        backgroundColor: "#4c6ef5",
                                        "&:hover": {
                                            backgroundColor: "#364fc7",
                                        },
                                    },
                                }}
                            >
                                수정
                            </Button>
                        </Link>
                    </Box>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack spacing="md">
                            <TextInput label="스토어 이름" placeholder="Field text goes here" required />

                            <Box>
                                <Text mb={4} fw={500}>
                                    대표 썸네일 이미지
                                </Text>
                                <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                    {(props) => <Button variant="outline" {...props}>업로드</Button>}
                                </FileButton>
                                {file && <Text size="sm" mt="xs">{file.name}</Text>}
                            </Box>

                            <TextInput label="전화번호" placeholder="예: 5.22" />
                            <TextInput label="주소" placeholder="스마트 AI 삼각 거치대" />
                            <Textarea label="소개 문구" placeholder="Field text goes here" autosize minRows={3} />
                        </Stack>
                    </Card>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
