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

//  필터 라이브러리 임포트
import Filter from "badwords-ko";
const filter = new Filter(); // 필터 인스턴스 생성 (기본 욕설 리스트 사용)

// 필요한 경우 커스텀 단어 추가:
// filter.addWords("새로운욕설", "나쁜말");

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

  //  욕설 필터링 에러 상태 추가
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

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
    // 1. 필수 정보 유효성 검사
    if (
      !title ||
      !description ||
      !file ||
      !startTime ||
      !streamKey ||
      selectedItemIds.length === 0
    ) {
      alert("필수 정보를 모두 입력하고 최소 하나의 상품을 선택해주세요.");
      return;
    }

    //  2. 욕설 필터링 에러 최종 검사
    // 실시간 경고가 활성화되어 있어 여기에 걸리면 제출을 막습니다.
    if (titleError || descriptionError) {
      alert(
        "제목 또는 소개 문구에 부적절한 단어가 포함되어 있습니다. 수정해주세요."
      );
      return;
    }

    //  중요: 제출 시 필터링된 내용을 사용합니다.
    // 실시간 경고 후에도 혹시 모를 상황에 대비해 최종 필터링을 다시 적용합니다.
    const filteredTitle = filter.clean(title);
    const filteredDescription = filter.clean(description);

    const formData = new FormData();
    formData.append("title", filteredTitle); // ✨ 필터링된 제목 사용
    formData.append("description", filteredDescription); // ✨ 필터링된 설명 사용
    formData.append("LiveDate", liveDate); // 이 필드가 백엔드에서 어떤 형태를 기대하는지 확인 필요 (현재는 YYYY-MM-DDTHH:mm 형식 그대로)
    formData.append("streamKey", streamKey);
    formData.append("imageFile", file);
    selectedItemIds.forEach((id) => formData.append("itemIds", id.toString()));

    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${BASE_URL}/live/create`, {
        method: "POST",
        headers: {
          access: token || "",
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `라이브 등록 실패: ${response.status} - ${errorDetail}`
        );
      }

      const data = await response.json();
      console.log("등록 성공:", data);
      alert("라이브가 성공적으로 등록되었습니다!");

      // 폼 초기화
      setTitle("");
      setDescription("");
      setFile(null);
      setLiveDate("");
      setStartTime("");
      setStreamKey("");
      setSelectedItemIds([]);
      setTitleError(""); // 에러 메시지도 초기화
      setDescriptionError(""); // 에러 메시지도 초기화
    } catch (error) {
      console.error("등록 에러:", error);
      alert(
        `라이브 등록에 실패했습니다. 에러: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
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
                  placeholder="라이브 방송의 제목을 입력하세요"
                  value={title}
                  onChange={(e) => {
                    const inputValue = e.currentTarget.value;
                    if (filter.isProfane(inputValue)) {
                      setTitleError(
                        "제목에 부적절한 단어가 포함되어 있습니다."
                      );
                    } else {
                      setTitleError("");
                    }
                    setTitle(inputValue);
                  }}
                  required
                  error={titleError} // Mantine 컴포넌트에 에러 메시지 표시
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
                  placeholder="라이브 방송에 대한 상세 설명을 입력하세요"
                  autosize
                  minRows={3}
                  value={description}
                  onChange={(e) => {
                    const inputValue = e.currentTarget.value;
                    if (filter.isProfane(inputValue)) {
                      setDescriptionError(
                        "소개 문구에 부적절한 단어가 포함되어 있습니다."
                      );
                    } else {
                      setDescriptionError("");
                    }
                    setDescription(inputValue);
                  }}
                  error={descriptionError} // Mantine 컴포넌트에 에러 메시지 표시
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
                    <Text color="dimmed">등록된 상품이 없습니다.</Text>
                  ) : (
                    <Accordion multiple defaultValue={[]}>
                      {items.map((item) => {
                        const isSelected = selectedItemIds.includes(
                          item.itemId
                        );
                        const discountPercent =
                          item.discountRate > 0 && item.discountRate < 1
                            ? item.discountRate * 100
                            : 0;
                        const imageFile =
                          item.itemImages?.[0]?.url ||
                          "https://placehold.co/100x100";

                        return (
                          <Accordion.Item
                            key={item.itemId}
                            value={item.itemId.toString()}
                          >
                            <Accordion.Control>
                              <Flex align="center" justify="space-between">
                                <Checkbox
                                  label={item.itemName}
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const newId = item.itemId;
                                    setSelectedItemIds((prev) =>
                                      e.currentTarget.checked
                                        ? [...prev, newId]
                                        : prev.filter((id) => id !== newId)
                                    );
                                  }}
                                />
                                <Text size="xs" c="dimmed">
                                  {item.status === "ON_SALE"
                                    ? "판매중"
                                    : "승인대기"}
                                </Text>
                              </Flex>
                            </Accordion.Control>
                            <Accordion.Panel>
                              <Flex gap="md" align="center">
                                <Image
                                  src={imageFile}
                                  width={100}
                                  radius="md"
                                  alt={item.itemName}
                                />
                                <Box>
                                  <Text size="sm">{item.description}</Text>
                                  <Flex align="center" gap="sm" mt="xs">
                                    {discountPercent > 0 && (
                                      <Text size="sm" fw={700} c="red">
                                        {discountPercent}%
                                      </Text>
                                    )}
                                    <Text size="sm" fw={700}>
                                      {item.finalPrice.toLocaleString()}원
                                    </Text>
                                  </Flex>
                                </Box>
                              </Flex>
                            </Accordion.Panel>
                          </Accordion.Item>
                        );
                      })}
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
