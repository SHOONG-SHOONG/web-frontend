import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Grid,
  Image,
  Text,
  Title,
  Avatar,
  TextInput,
  Flex,
  Badge,
  Paper,
  Box,
  Button,
  Group,
  Divider,
  ActionIcon,
  Skeleton,
  Stack,
  Alert,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandBlogger,
  IconShare3,
  IconDeviceTvOldFilled,
  IconAlertCircle,
} from "@tabler/icons-react";
import LiveViewer from "./LiveViewer.tsx";
import HeaderComponent from "../../../components/Header.tsx";
import FooterComponent from "../../../components/Footer.tsx";
import BASE_CHAT_URL from "../../../chat_config.js";
import LoginModal from "../../../components/LoginModal.tsx";
import BASE_URL from "../../../config.js";
import { useParams, useNavigate } from "react-router-dom";

const LiveVideoSkeleton = () => (
  <Stack align="center" justify="center" spacing="xs" w="100%">
    <Box style={{ width: "100%", height: 400, borderRadius: 12, overflow: "hidden" }}>
      <Skeleton height="100%" animate />
    </Box>
    <Alert icon={<IconAlertCircle size={16} />} title="불러오는 중" color="gray" radius="md" mt="xs" w="100%">
      다시보기를 불러오는 중이에요. 잠시만 기다려 주세요!
    </Alert>
  </Stack>
);

type LiveItem = {
  itemId: number;
  itemName: string;
  imageUrl: string;
  price: number;
  discountRate: number;
};

type LiveInfo = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  streamKey: string;
  liveStartTime: string | null;
  liveEndTime: string | null;
  liveDate: string | null;
  liveStatus: string;
  replayURL: string | null;
  liveItems: LiveItem[];
};

export default function LivePage() {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const { liveId } = useParams<{ liveId: string }>();
  const [liveInfo, setLiveInfo] = useState<LiveInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket(`ws://${BASE_CHAT_URL}/chat/ws/chat`);
    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        const formatted = `${json.name} : ${json.content}`;
        setChatMessages((prev) => [...prev, formatted]);
      } catch (e) {
        setChatMessages((prev) => [...prev, event.data]);
      }
    };
    setSocket(ws);
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const fetchViewerCount = () => {
      fetch(`http://${BASE_CHAT_URL}/chat/viewer-count`)
        .then((res) => res.json())
        .then((count) => setViewerCount(count))
        .catch(console.error);
    };
    fetchViewerCount();
    const interval = setInterval(fetchViewerCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    const name = localStorage.getItem("name");
    if (!messageInput.trim() || !name) return;
    const payload = { name, content: messageInput };
    fetch(`http://${BASE_CHAT_URL}/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => setMessageInput(""))
      .catch(() => setChatMessages((prev) => [...prev, "[시스템] 메시지 전송 실패"]));
  };

  const fetchLiveInfo = async () => {
    if (!liveId) return;
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${BASE_URL}/live/${liveId}`, {
        method: "GET",
        headers: { accept: "*/*", access: token || "" },
        credentials: "include",
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: LiveInfo = await response.json();
      setLiveInfo(data);
    } catch (err) {
      console.error("라이브 정보 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchLiveInfo();
  }, [liveId]);

  return (
    <>
      <HeaderComponent />
      <Container size="lg" pt={40}>
        <Group align="center" mb="md">
          <Avatar src={liveInfo?.imageUrl} size={35} radius="xl" />
          <Title order={3} style={{ flexGrow: 1 }}>{liveInfo?.title}</Title>
          {liveInfo?.liveStatus === "ONGOING" && (
            <Badge color="blue" size="lg" radius="sm">LIVE</Badge>
          )}
          <Text size="sm" c="dimmed">{viewerCount.toLocaleString()} 명 시청</Text>
        </Group>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            {liveInfo?.liveStatus === "ONGOING" ? (
              <LiveViewer streamKey={liveInfo.streamKey} />
            ) : liveInfo?.liveStatus === "COMPLETED" && liveInfo?.replayURL ? (
              <Box
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%", // 16:9 비율
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <iframe
                  src={liveInfo.replayURL}
                  title="Replay Video"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "0",
                  }}
                  allowFullScreen
                />
              </Box>
            ) : (
              <LiveVideoSkeleton />
            )}

            <Group mt="md">
              <ActionIcon size="lg" variant="default"><IconBrandFacebook /></ActionIcon>
              <ActionIcon size="lg" variant="default"><IconBrandTwitter /></ActionIcon>
              <ActionIcon size="lg" variant="default"><IconBrandBlogger /></ActionIcon>
              <ActionIcon size="lg" variant="default"><IconShare3 /></ActionIcon>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Flex direction="column" gap="lg">
              <Paper shadow="sm" radius="md" p="md" mb="lg" style={{ height: 400, display: "flex", flexDirection: "column" }}>
                <Text size="sm">{liveInfo?.liveStatus === "ONGOING" ? "실시간 채팅" : "채팅 다시보기"}</Text>
                <Divider my="sm" />
                <Box ref={chatContainerRef} style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
                  <Flex direction="column" gap={8}>
                    {chatMessages.map((msg, idx) => (<Text size="xs" key={idx}>{msg}</Text>))}
                  </Flex>
                </Box>
                {liveInfo?.liveStatus === "ONGOING" && (
                  <Group>
                    <TextInput
                      placeholder="메세지를 입력하세요"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.currentTarget.value)}
                      style={{ flex: 1 }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button onClick={() => {
                      const token = localStorage.getItem("access");
                      if (!token) setLoginModalOpened(true);
                      else sendMessage();
                    }}>전송</Button>
                  </Group>
                )}
              </Paper>

              <LoginModal opened={loginModalOpened} onClose={() => setLoginModalOpened(false)} />

              {liveInfo?.liveItems[0] && (
                <Flex gap="md" align="flex-start" style={{ cursor: "pointer" }} onClick={() => navigate(`/item/${liveInfo.liveItems[0].itemId}`)}>
                  <Image src={liveInfo.liveItems[0].imageUrl} style={{ width: 60, height: 60 }} radius="md" />
                  <Box>
                    <Text mt="xs" fw={600} size="sm">{liveInfo.liveItems[0].itemName}</Text>
                    <Flex mt="xs" align="baseline" gap="xs">
                      <Text size="xs" c="red" fw={600}>{(liveInfo.liveItems[0].discountRate * 100).toFixed(0)}%</Text>
                      <Text size="xs" td="line-through" c="dimmed">{liveInfo.liveItems[0].price.toLocaleString()}원</Text>
                      <Text size="sm" fw={700}>{(liveInfo.liveItems[0].price * (1 - liveInfo.liveItems[0].discountRate)).toLocaleString()}원</Text>
                    </Flex>
                  </Box>
                </Flex>
              )}
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
      <FooterComponent />
    </>
  );
}
