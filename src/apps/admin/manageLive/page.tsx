import React from "react";
import {
    AppShell,
    Container,
    Flex,
    Title,
    Button,
    Table,
    Badge,
    Image,
    Box,
    Text,
    Card,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import AdminNavBarPage from "../../../components/AdminNavBar.tsx";

const liveList = [
    { id: 1, title: "Live 1", date: "2025.04.23", time: "14:00", status: "대기" },
    { id: 2, title: "Live 2", date: "2025.04.23", time: "14:00", status: "종료" },
    { id: 3, title: "Live 3", date: "2025.04.23", time: "14:00", status: "종료" },
];

export default function ManageLivePage() {
    const navigate = useNavigate();

    return (
        <AppShell layout="default">
            <AdminNavBarPage />
            <AppShell.Main style={{ backgroundColor: "#f8f9fa" }}>
                <Container size="xl" px={0}>
                    <Flex justify="space-between" align="center" mb="lg">
                        <Title order={3} fw={600}>
                            라이브목록 (0/10)
                        </Title>
                        <Button
                            variant="filled"
                            size="sm"
                            radius="md"
                            onClick={() => navigate("/admin/regist-live")}
                            styles={{
                                root: {
                                    backgroundColor: "#4c6ef5",
                                    "&:hover": {
                                        backgroundColor: "#364fc7",
                                    },
                                },
                            }}
                        >
                            라이브 등록
                        </Button>
                    </Flex>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Table
                            horizontalSpacing="md"
                            verticalSpacing="sm"
                            highlightOnHover
                            style={{ fontSize: "14px" }}
                        >
                            <Table.Thead>
                                <Table.Tr style={{ borderBottom: "2px solid #e9ecef" }}>
                                    <Table.Th style={{ textAlign: "center" }}>상태</Table.Th>
                                    <Table.Th>라이브</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {liveList.map((live) => (
                                    <Table.Tr key={live.id}>
                                        <Table.Td style={{ textAlign: "center" }}>
                                            <Badge color={live.status === "대기" ? "yellow" : "gray"}>
                                                {live.status}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Flex gap="md" align="flex-start">
                                                <Image
                                                    src={`https://placehold.co/60x60?text=live`}
                                                    style={{ width: 80, height: 110 }}
                                                    radius="md"
                                                />
                                                <Box>
                                                    <Text mt="xs" fw={600} size="sm">
                                                        {live.title}
                                                    </Text>
                                                    <Flex mt="xs" align="baseline" gap="xs">
                                                        <Text size="xs" c="dimmed">
                                                            {live.date} {live.time}
                                                        </Text>
                                                        <Text size="sm" c="dimmed">
                                                            ♡ 0
                                                        </Text>
                                                    </Flex>
                                                </Box>
                                            </Flex>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Card>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
// import React, { useEffect, useState } from "react";
// import {
//     AppShell,
//     Container,
//     Flex,
//     Title,
//     Button,
//     Table,
//     Badge,
//     Image,
//     Box,
//     Text,
//     Card,
// } from "@mantine/core";
// import { useNavigate } from "react-router-dom";
// import AdminNavBarPage from "../../../components/AdminNavBar";


// interface LiveItem {
//     id: number;
//     title: string;
//     imageUrl: string;
//     itemName: string;
//     price: number;
//     discountRate: number;
//     itemImageUrl: string;
//     status: string;
// }

// export default function ManageLivePage() {
//     const navigate = useNavigate();
//     const [liveList, setLiveList] = useState<LiveItem[]>([]);

//     useEffect(() => {
//         fetch("/live/my-lives", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Accept: "*/*",
//                 // Authorization: `Bearer ${token}`, // 필요시 추가
//             },
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 setLiveList(data);
//             })
//             .catch((err) => {
//                 console.error("Failed to fetch live list", err);
//             });
//     }, []);

//     return (
//         <AppShell layout="default">
//             <AdminNavBarPage />
//             <AppShell.Main style={{ backgroundColor: "#f8f9fa" }}>
//                 <Container size="xl" px={0}>
//                     <Flex justify="space-between" align="center" mb="lg">
//                         <Title order={3} fw={600}>
//                             라이브목록 ({liveList.length}/10)
//                         </Title>
//                         <Button
//                             variant="filled"
//                             size="sm"
//                             radius="md"
//                             onClick={() => navigate("/admin/regist-live")}
//                             styles={{
//                                 root: {
//                                     backgroundColor: "#4c6ef5",
//                                     "&:hover": {
//                                         backgroundColor: "#364fc7",
//                                     },
//                                 },
//                             }}
//                         >
//                             라이브 등록
//                         </Button>
//                     </Flex>

//                     <Card shadow="sm" padding="lg" radius="md" withBorder>
//                         <Table
//                             horizontalSpacing="md"
//                             verticalSpacing="sm"
//                             highlightOnHover
//                             style={{ fontSize: "14px" }}
//                         >
//                             <Table.Thead>
//                                 <Table.Tr style={{ borderBottom: "2px solid #e9ecef" }}>
//                                     <Table.Th style={{ textAlign: "center" }}>상태</Table.Th>
//                                     <Table.Th>라이브</Table.Th>
//                                 </Table.Tr>
//                             </Table.Thead>
//                             <Table.Tbody>
//                                 {liveList.map((live) => (
//                                     <Table.Tr key={live.id}>
//                                         <Table.Td style={{ textAlign: "center" }}>
//                                             <Badge color={live.status === "SCHEDULED" ? "yellow" : "gray"}>
//                                                 {live.status}
//                                             </Badge>
//                                         </Table.Td>
//                                         <Table.Td>
//                                             <Flex gap="md" align="flex-start">
//                                                 <Image
//                                                     src={live.imageUrl || "https://placehold.co/60x60?text=live"}
//                                                     style={{ width: 80, height: 110 }}
//                                                     radius="md"
//                                                 />
//                                                 <Box>
//                                                     <Text mt="xs" fw={600} size="sm">
//                                                         {live.title}
//                                                     </Text>
//                                                     <Flex mt="xs" align="baseline" gap="xs">
//                                                         <Text size="xs" c="dimmed">
//                                                             {live.itemName} / ₩{live.price.toLocaleString()}
//                                                         </Text>
//                                                         <Text size="sm" c="dimmed">
//                                                             할인 {live.discountRate}%
//                                                         </Text>
//                                                     </Flex>
//                                                 </Box>
//                                             </Flex>
//                                         </Table.Td>
//                                     </Table.Tr>
//                                 ))}
//                             </Table.Tbody>
//                         </Table>
//                     </Card>
//                 </Container>
//             </AppShell.Main>
//         </AppShell>
//     );
// }
