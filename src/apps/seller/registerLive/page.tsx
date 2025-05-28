import React, { useEffect, useState } from "react";
import {
  AppShell,
  Container,
  Title,
  Button,
  Box,
  TextInput,
  Textarea,
  Stack,
  Text,
  Card,
  Accordion,
  Checkbox,
  Image,
  Flex,
  FileInput,
} from "@mantine/core";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import BASE_URL from "../../../config.js";

interface ItemImage {
  id: number;
  url: string;
  createdAt: string;
}

interface Item {
  itemId: number;
  brandId: number;
  itemName: string;
  price: number;
  discountRate: number;
  finalPrice: number;
  wishlistCount: number;
  description: string;
  itemQuantity: number;
  category: string;
  discountExpiredAt: string;
  status: string;
  itemImages: ItemImage[];
}

export default function LiveRegisterPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [streamKey, setStreamKey] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await fetch(`${BASE_URL}/admin/item-list`, {
          method: "GET",
          headers: {
            access: token || "",
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("상품 불러오기 실패");
        const data: Item[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !file || !startTime || !streamKey) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("LiveDate", liveDate);
    formData.append("streamKey", streamKey);
    formData.append("imageUrl", file);
    selectedItemIds.forEach((id) => formData.append("itemIds", id.toString()));

    try {
      const response = await fetch("/live/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("등록 실패");
      }

      const data = await response.json();
      console.log("등록 성공:", data);
      alert("라이브가 등록되었습니다!");
    } catch (error) {
      console.error("등록 에러:", error);
      alert("라이브 등록에 실패했습니다.");
    }
  };

  return (
    <AppShell layout="default">
      <SellerNavBarPage />
      <AppShell.Main style={{ backgroundColor: "#fff" }}>
        <Container py="xl" px="xl">
          <Flex justify="space-between" align="center">
            <Title order={3} fw={600}>
              라이브 서비스 등록
            </Title>
            <Button
              radius="lg"
              h={40}
              color="black"
              variant="light"
              onClick={handleSubmit}
            >
              라이브 등록
            </Button>
          </Flex>

          <Container py="xl">
            <Card p="lg" mt="lg">
              <Stack gap="lg">
                <TextInput
                  radius="sm"
                  size="md"
                  label="제목을 입력하세요"
                  placeholder="Field text goes here"
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                  required
                />

                <Box>
                  <Text mb={4} fw={500}>
                    대표 썸네일 이미지
                  </Text>

                  <FileInput
                    radius="sm"
                    size="md"
                    placeholder="이미지를 업로드하세요"
                    value={file}
                    onChange={setFile}
                    accept="image/png,image/jpeg"
                    variant="outline"
                  />

                  {file && (
                    <Text size="sm" mt="xs">
                      {file.name}
                    </Text>
                  )}
                </Box>

                <TextInput
                  radius="sm"
                  size="md"
                  label="라이브 예정 일시"
                  placeholder="예: 2025-05-24T15:00"
                  type="datetime-local"
                  value={liveDate}
                  onChange={(e) => setLiveDate(e.currentTarget.value)}
                  required
                />

                <Textarea
                  radius="sm"
                  size="md"
                  label="소개 문구"
                  placeholder="Field text goes here"
                  autosize
                  minRows={3}
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                />

                <TextInput
                  radius="sm"
                  size="md"
                  label="라이브 시작 시간"
                  placeholder="예: 2025-05-24T15:00"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.currentTarget.value)}
                  required
                />

                <TextInput
                  radius="sm"
                  size="md"
                  label="스트림 키"
                  placeholder="예: your-stream-key"
                  value={streamKey}
                  onChange={(e) => setStreamKey(e.currentTarget.value)}
                  required
                />

                {/* 상품 아코디언 */}
                <Box>
                  <Text fw={500} mb="xs">
                    라이브 쇼핑 상품 선택
                  </Text>
                  {items.length === 0 ? (
                    <Text color="dimmed">상품이 없습니다.</Text>
                  ) : (
                    <Accordion multiple defaultValue={[]}>
                      {items.map((item) => (
                        <Accordion.Item
                          key={item.itemId}
                          value={item.itemId.toString()}
                        >
                          <Accordion.Control>
                            <Checkbox
                              label={item.itemName}
                              checked={selectedItemIds.includes(item.itemId)}
                              onChange={(e) => {
                                const newId = item.itemId;
                                setSelectedItemIds((prev) =>
                                  e.currentTarget.checked
                                    ? [...prev, newId]
                                    : prev.filter((id) => id !== newId)
                                );
                              }}
                            />
                          </Accordion.Control>
                          <Accordion.Panel>
                            <Image
                              src={item.itemImages?.[0]?.url}
                              width={100}
                              alt={item.itemName}
                            />
                          </Accordion.Panel>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  )}
                </Box>
              </Stack>
            </Card>
          </Container>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
