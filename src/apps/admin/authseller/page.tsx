import React, { useEffect, useState } from "react";
import {
  AppShell,
  Container,
  Card,
  Title,
  Box,
  Text,
  Flex,
  Group,
  ActionIcon,
  Tooltip,
  Loader,
  AppShellNavbar,
  Table,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import AdminNavBarPage from "../../../components/AdminNavBar.tsx";
import BASE_URL from "../../../config";
import { RingLoader } from "../../../components/RingLoader.tsx";

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

  useEffect(() => {
    const fetchSellers = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await fetch(`${BASE_URL}/admin/pending/users`, {
          headers: { access: token || "" },
        });
        const data = await res.json();
        setSellers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("판매자 목록 불러오기 실패:", err);
        setSellers([]);
      }
    };
    fetchSellers();
  }, []);

  const handleApprove = async (userId: number) => {
    const token = localStorage.getItem("access");
    try {
      await fetch(`${BASE_URL}/admin/${userId}/user/approve`, {
        method: "POST",
        headers: { access: token || "" },
      });
      setSellers((prev) => prev?.filter((s) => s.id !== userId) || null);
    } catch (err) {
      console.error("승인 실패:", err);
    }
  };

  const handleReject = async (userId: number) => {
    const token = localStorage.getItem("access");
    try {
      await fetch(`${BASE_URL}/admin/${userId}/user/reject`, {
        method: "POST",
        headers: { access: token || "" },
      });
      setSellers((prev) => prev?.filter((s) => s.id !== userId) || null);
    } catch (err) {
      console.error("거절 실패:", err);
    }
  };

  return (
    <AppShell layout="default">
      <AppShellNavbar>
        <AdminNavBarPage />
      </AppShellNavbar>
      <AppShell.Main ml={250}>
        <Box py="xl" px="xl">
          <Container>
            <Title order={2}>판매자 관리</Title>
          </Container>
        </Box>
        <Container py="xl">
          <Title order={4} mb="md">대기 목록</Title>
          <Card withBorder p="lg" radius="md">
            {!sellers ? (
              <Flex justify="center" align="center" py="xl">
                <RingLoader />
              </Flex>
            ) : sellers.length === 0 ? (
              <Text ta="center">대기중인 정보가 없습니다.</Text>
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
                    <th>이름</th>
                    <th>이메일</th>
                    <th>전화번호</th>
                    <th>사업자번호</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {sellers.map((s) => (
                    <tr key={s.id} style={{ height: "60px" }}>
                      <td>{s.userName}</td>
                      <td>{s.userEmail}</td>
                      <td>{s.userPhone}</td>
                      <td>{s.registrationNumber}</td>
                      <td>
                        <Group gap="xs" justify="center">
                          <Tooltip label="승인">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              radius="xl"
                              onClick={() => handleApprove(s.id)}
                            >
                              <IconCheck size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="거절">
                            <ActionIcon
                              variant="light"
                              color="red"
                              radius="xl"
                              onClick={() => handleReject(s.id)}
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}