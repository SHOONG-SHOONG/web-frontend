import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Table,
  Text,
  Title,
  Stack,
  UnstyledButton,
  Group,
} from "@mantine/core";
import { IconBox, IconBroadcast, IconUser } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function AdminItemPage() {
  const items = [
    {
      id: 1,
      name: "상품명",
      price: 20000,
      discount: 10,
      stock: 100,
      image: null,
      seller: "판매중",
    },
  ];

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
        <Flex
          h={60}
          px="xl"
          align="center"
          justify="space-between"
          style={{ borderBottom: "1px solid #e9ecef" }}
        >
          <Group gap="lg">
            <Link
              to="/admin"
              style={{ color: "#868e96", fontSize: 14, textDecoration: "none" }}
            >
              홈
            </Link>
            <Link
              to="#"
              style={{ color: "#868e96", fontSize: 14, textDecoration: "none" }}
            >
              관리
            </Link>
            <Link
              to="#"
              style={{ color: "#868e96", fontSize: 14, textDecoration: "none" }}
            >
              라이브쇼 송출
            </Link>
          </Group>
        </Flex>

        <Container py="xl">
          <Flex justify="space-between" align="center" mb="md">
            <Title order={4}>상품목록 (0/10)</Title>
            <Link to="">
              <Button color="#3b5bdb" radius="md" size="sm">
                상품 등록
              </Button>
            </Link>
          </Flex>

          <Table withColumnBorders highlightOnHover striped>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>상품 이미지</th>
                <th style={{ textAlign: "center" }}>상품명</th>
                <th style={{ textAlign: "center" }}>판매상태</th>
                <th style={{ textAlign: "center" }}>정가</th>
                <th style={{ textAlign: "center" }}>할인(%)</th>
                <th style={{ textAlign: "center" }}>재고</th>
                <th style={{ textAlign: "center" }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: "center" }}>
                    <Box
                      w={60}
                      h={60}
                      bg="#f1f3f5"
                      style={{
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src={
                          item.image ||
                          "https://placehold.co/60x60?text=\uD83C\uDF04"
                        }
                        alt=""
                        width={40}
                      />
                    </Box>
                  </td>
                  <td style={{ textAlign: "center" }}>{item.name}</td>
                  <td style={{ textAlign: "center" }}>{item.seller}</td>
                  <td style={{ textAlign: "center" }}>
                    {item.price.toLocaleString()}
                  </td>
                  <td style={{ textAlign: "center" }}>{item.discount}</td>
                  <td style={{ textAlign: "center" }}>{item.stock}</td>
                  <td style={{ textAlign: "center" }}>
                    <Group justify="center">
                      <Button size="xs" variant="light" color="#3b5bdb">
                        수정
                      </Button>
                      <Button size="xs" variant="light" color="red">
                        삭제
                      </Button>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Box>
    </Flex>
  );
}
