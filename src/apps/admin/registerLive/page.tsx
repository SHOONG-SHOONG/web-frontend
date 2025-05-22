import React from 'react';
import {
    UnstyledButton,
    Text,
    Container,
    TextInput,
    Textarea,
    Button,
    FileButton,
    Stack,
    Title,
    Box,
    Group,
    Flex,
    Divider,
} from '@mantine/core';

import { IconBox, IconBroadcast, IconUser } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function LiveRegisterPage() {
    const [file, setFile] = React.useState<File | null>(null);

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
                        <Title order={4}>라이브 서비스 관리</Title>
                        <Link to="">
                            <Button color="#3b5bdb" radius="md" size="sm">
                                라이브 등록
                            </Button>
                        </Link>
                    </Flex>

                    <Divider mb="sm" />

                    <Box bg="white" p="lg" radius="md" shadow="sm">
                        <Stack spacing="md">
                            <TextInput label="제목을 입력하세요" placeholder="Field text goes here" required />

                            <div>
                                <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>대표 썸네일 이미지</div>
                                <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                    {(props) => <Button variant="outline" {...props}>업로드</Button>}
                                </FileButton>
                                {file && <div style={{ marginTop: 8 }}>{file.name}</div>}
                            </div>

                            <TextInput label="라이브 예정 일시" placeholder="예: 5.22" />
                            <TextInput label="라이브 쇼핑 상품명" placeholder="스마트 AI 삼각 거치대" />
                            <Textarea label="소개 문구" placeholder="Field text goes here" autosize minRows={3} />

                        </Stack>
                    </Box>
                </Container>
            </Box>
        </Flex>
    );
}
