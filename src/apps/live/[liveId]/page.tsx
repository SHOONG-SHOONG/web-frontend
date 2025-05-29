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
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandBlogger,
  IconShare3,
} from "@tabler/icons-react";
import LiveViewer from "./LiveViewer.tsx";
import HeaderComponent from "../../../components/Header.tsx";
import FooterComponent from "../../../components/Footer.tsx";
import BASE_CHAT_URL from "../../../chat_config.js";
import LoginModal from "../../../components/LoginModal.tsx";
import BASE_URL from "../../../config.js";
import { useParams } from "react-router-dom";

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

  const handleChatInputClick = () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoginModalOpened(true);
    } else {
      sendMessage(); // 채팅 입력 가능
    }
  };

  // console.log(BASE_CHAT_URL);

  // WebSocket 연결
  useEffect(() => {
    const ws = new WebSocket(`ws://${BASE_CHAT_URL}/chat/ws/chat`);

    ws.onopen = () => {
      console.log("WebSocket 연결됨");
      // setChatMessages((prev) => [...prev, "[시스템] 채팅방에 연결되었습니다."]);
    };

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data); // JSON 문자열 → 객체
        const formatted = `${json.name} : ${json.content}`;
        setChatMessages((prev) => [...prev, formatted]);
      } catch (e) {
        // JSON 파싱 실패 시 그냥 출력 (예: 시스템 메시지)
        setChatMessages((prev) => [...prev, event.data]);
      }
    };

    ws.onclose = () => {
      // setChatMessages((prev) => [...prev, "[시스템] 채팅방 연결이 종료되었습니다."]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket 오류:", error);
      // setChatMessages((prev) => [...prev, "[시스템] 오류가 발생했습니다."]);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // 채팅 추가될 때마다 채팅창 스크롤 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const fetchViewerCount = () => {
      fetch(`http://${BASE_CHAT_URL}/chat/viewer-count`)
        .then((res) => res.json())
        .then((count) => setViewerCount(count))
        .catch((err) => {
          console.error("시청자 수 가져오기 실패:", err);
        });
    };

    fetchViewerCount(); // 최초 한 번 호출

    const interval = setInterval(fetchViewerCount, 5000); // 3초마다 갱신

    return () => clearInterval(interval); // 컴포넌트 unmount 시 정리
  }, []);

  // 메시지 전송
  const sendMessage = () => {
    const name = localStorage.getItem("name");
    if (!messageInput.trim() || !name) return;

    const payload = {
      name: name,
      content: messageInput,
    };

    fetch(`http://${BASE_CHAT_URL}/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.text())
      .then(() => setMessageInput(""))
      .catch((err) => {
        console.error("메시지 전송 오류:", err);
        setChatMessages((prev) => [...prev, "[시스템] 메시지 전송 실패"]);
      });
  };

  // 현재 진행 중인 라이브 정보 가져오기
  const fetchLiveInfo = async () => {
    if (!liveId) return;

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`${BASE_URL}/live/${liveId}`, {
        method: "GET",
        headers: {
          accept: "*/*",
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data: LiveInfo = await response.json();
      console.log(data);
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
          <Title order={3} style={{ flexGrow: 1 }}>
            {liveInfo?.title}
          </Title>
          <Badge color="blue" size="lg" radius="sm">
            LIVE
          </Badge>
          <Text size="sm" c="dimmed">
            {viewerCount.toLocaleString()} 명 시청
          </Text>
        </Group>

        <Grid gutter="xl">
          {/* 왼쪽: 영상 + 공유 */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <LiveViewer streamKey="shoong" />
            <Group mt="md">
              <ActionIcon size="lg" variant="default">
                <IconBrandFacebook />
              </ActionIcon>
              <ActionIcon size="lg" variant="default">
                <IconBrandTwitter />
              </ActionIcon>
              <ActionIcon size="lg" variant="default">
                <IconBrandBlogger />
              </ActionIcon>
              <ActionIcon size="lg" variant="default">
                <IconShare3 />
              </ActionIcon>
            </Group>
          </Grid.Col>

          {/* 오른쪽: 채팅창 + 상품 */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Flex direction="column" gap="lg">
              <Paper
                shadow="sm"
                radius="md"
                p="md"
                mb="lg"
                style={{
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text size="sm">실시간 채팅</Text>
                <Divider my="sm" />

                <Box
                  ref={chatContainerRef}
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    marginBottom: 12,
                  }}
                >
                  <Flex direction="column" gap={8}>
                    {chatMessages.map((msg, idx) => (
                      <Text size="xs" key={idx}>
                        {msg}
                      </Text>
                    ))}
                  </Flex>
                </Box>

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

                  <Button onClick={handleChatInputClick}>전송</Button>
                </Group>
              </Paper>

              <LoginModal
                opened={loginModalOpened}
                onClose={() => setLoginModalOpened(false)}
              />

              {/* 상품 정보 */}
              {liveInfo?.liveItems?.length > 0 && (
                <Flex gap="md" align="flex-start">
                  <Image
                    src={liveInfo.liveItems[0].imageUrl}
                    style={{ width: 60, height: 60 }}
                    radius="md"
                  />
                  <Box>
                    <Text mt="xs" fw={600} size="sm">
                      {liveInfo.liveItems[0].itemName}
                    </Text>
                    <Flex mt="xs" align="baseline" gap="xs">
                      <Text size="xs" c="red" fw={600}>
                        {liveInfo.liveItems[0].discountRate * 100}%
                      </Text>
                      <Text size="xs" td="line-through" c="dimmed">
                        {liveInfo.liveItems[0].price.toLocaleString()}원
                      </Text>
                      <Text size="sm" fw={700}>
                        {Math.floor(
                          liveInfo.liveItems[0].price *
                            (1 - liveInfo.liveItems[0].discountRate)
                        ).toLocaleString()}
                        원
                      </Text>
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
