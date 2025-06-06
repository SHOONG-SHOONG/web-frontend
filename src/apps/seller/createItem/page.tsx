import React, { useState, useEffect } from "react";
import {
  AppShell,
  Container,
  Title,
  Button,
  Stack,
  TextInput,
  NumberInput,
  FileInput,
  Textarea,
  Flex,
  Card,
  Box,
  Select,
  Text,
  Loader,
  AppShellNavbar,
} from "@mantine/core";
import { IconPhoto, IconPlus } from "@tabler/icons-react";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import BASE_URL from "../../../config.js";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import Filter from "badwords-ko";

const filter = new Filter();

export default function CreateItemPage() {
  const MAX_DESCRIPTION_LENGTH = 255;
  const navigate = useNavigate();

  const [brandId, setBrandId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // brandId 로딩 완료 여부

  const [itemName, setItemName] = useState<string>("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [discountRate, setDiscountRate] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string | null>(null);
  const [stock, setStock] = useState<number | undefined>(undefined);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [description, setDescription] = useState<string>("");
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [itemNameError, setItemNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`${BASE_URL}/myPage`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.brandId) {
        setBrandId(data.brandId);
      }
    } catch (err) {
      console.error("사용자 정보 조회 실패", err);
    } finally {
      setLoading(false);
    }
  };

  const toLocalDateTimeString = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const handleSubmit = async () => {
    if (!brandId) {
      showNotification({
        title: "브랜드 미등록",
        message: "상품 등록 전 브랜드를 먼저 등록해주세요.",
        color: "red",
      });
      return;
    }

    if (!itemName || !description || price == null || price <= 0 || stock == null || stock <= 0 ||
      imageFiles.length === 0 || !category || !endDate || isNaN(endDate.getTime())) {
      showNotification({
        title: "입력 오류",
        message: "필수 입력 필드를 모두 채워주세요.",
        color: "red",
        autoClose: 3000,
      });
      return;
    }

    const currentDiscountRate = discountRate ?? 0;
    if (currentDiscountRate < 0 || currentDiscountRate > 100) {
      showNotification({
        title: "할인율 오류",
        message: "할인율은 0에서 100 사이여야 합니다.",
        color: "red",
      });
      return;
    }

    if (itemNameError || descriptionError) {
      showNotification({
        title: "부적절한 단어 감지",
        message: "상품 이름 또는 설명에 부적절한 단어가 포함되어 있습니다.",
        color: "red",
      });
      return;
    }

    const itemData = {
      itemName: filter.clean(itemName),
      price,
      discountRate: currentDiscountRate / 100.0,
      description: filter.clean(description),
      itemQuantity: stock,
      category,
      createdAt: new Date().toISOString(),
      discountExpiredAt: toLocalDateTimeString(endDate),
    };

    const formData = new FormData();
    formData.append("item", JSON.stringify(itemData));
    imageFiles.forEach((file) => formData.append("imageFiles", file));

    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${BASE_URL}/item`, {
        method: "POST",
        headers: { access: token || "" },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`상품 등록 실패: ${response.status} - ${errorDetail}`);
      }

      showNotification({
        title: "등록 성공",
        message: "상품이 성공적으로 등록되었습니다!",
        color: "teal",
      });

      setItemName("");
      setPrice(undefined);
      setDiscountRate(undefined);
      setCategory(null);
      setStock(undefined);
      setImageFiles([]);
      setDescription("");
      setEndDate(null);
      setItemNameError("");
      setDescriptionError("");

      navigate("/seller");
    } catch (error) {
      console.error("상품 등록 에러:", error);
      showNotification({
        title: "상품 등록 실패",
        message: "서버 오류 또는 유효하지 않은 입력입니다.",
        color: "red",
      });
    }
  };

  return (
    <AppShell layout="default">
      <AppShellNavbar>
        <SellerNavBarPage />
      </AppShellNavbar>
      <AppShell.Main ml={250}>
        <Box py="xl" px="xl">
          <Container w={800}>
            <Flex justify="space-between" align="center" mb="xl">
              <Title order={2}>상품 등록</Title>
              <Button
                radius="lg"
                h={40}
                leftSection={<IconPlus size={16} />}
                color="black"
                variant="light"
                onClick={handleSubmit}
                disabled={!brandId}
              >
                등록하기
              </Button>
            </Flex>

            <Card p="lg" mt="lg" shadow="sm" withBorder style={{ position: "relative" }}>
              <Stack gap="lg">
                <TextInput
                  radius="sm"
                  size="md"
                  label="상품 이름"
                  placeholder="상품 이름을 입력하세요"
                  value={itemName}
                  onChange={(e) => {
                    const inputValue = e.currentTarget.value;
                    if (filter.isProfane(inputValue)) {
                      setItemNameError(
                        "상품 이름에 부적절한 단어가 포함되어 있습니다."
                      );
                    } else {
                      setItemNameError("");
                    }
                    setItemName(inputValue);
                  }}
                  required
                  error={itemNameError} // Mantine 컴포넌트에 에러 메시지 표시
                />

                <NumberInput
                  radius="sm"
                  size="md"
                  label="기존 가격"
                  placeholder="상품의 원 가격을 입력하세요"
                  value={price}
                  onChange={(val) =>
                    setPrice(typeof val === "number" ? val : undefined)
                  }
                  min={0}
                  required
                  prefix="₩"
                />

                <NumberInput
                  radius="sm"
                  size="md"
                  label="할인율 (%)"
                  placeholder="할인율을 입력하세요 (0~100)"
                  value={discountRate}
                  onChange={(val) =>
                    setDiscountRate(typeof val === "number" ? val : undefined)
                  }
                  min={0}
                  max={100}
                  required
                  suffix="%"
                />

                <Select
                  radius="sm"
                  size="md"
                  label="카테고리"
                  placeholder="카테고리를 선택하세요"
                  data={["여행", "숙박", "항공", "교통", "캠핑", "기타"]}
                  value={category}
                  onChange={setCategory}
                  searchable
                  clearable
                  required
                />

                <NumberInput
                  radius="sm"
                  size="md"
                  label="재고 수량"
                  placeholder="재고 수량을 입력하세요"
                  value={stock}
                  onChange={(val) =>
                    setStock(typeof val === "number" ? val : undefined)
                  }
                  min={0}
                  max={10000}
                  required
                />

                <FileInput
                  multiple
                  radius="sm"
                  size="md"
                  label="상품 이미지 등록"
                  placeholder="이미지를 업로드하세요 (최대 N개)"
                  leftSection={<IconPhoto size={16} />}
                  value={imageFiles}
                  onChange={setImageFiles}
                  accept="image/png,image/jpeg,image/gif"
                  required
                />

                <Textarea
                  radius="sm"
                  size="md"
                  label="상품 설명"
                  placeholder="상품에 대한 상세 설명을 입력하세요"
                  value={description}
                  onChange={(e) => {
                    const inputValue = e.currentTarget.value;

                    if (inputValue.length > MAX_DESCRIPTION_LENGTH) {
                      showNotification({
                        title: "⚠️ 설명이 너무 깁니다",
                        message: `최대 ${MAX_DESCRIPTION_LENGTH}자까지만 입력할 수 있습니다.`,
                        color: "red",
                      });
                      return;
                    }

                    if (filter.isProfane(inputValue)) {
                      setDescriptionError("상품 설명에 부적절한 단어가 포함되어 있습니다.");
                    } else {
                      setDescriptionError("");
                    }

                    setDescription(inputValue);
                  }}
                  minRows={4}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  required
                  error={descriptionError}
                />
                <Text size="sm" mt="xs" c={description.length > MAX_DESCRIPTION_LENGTH ? "red" : "gray"}>
                  {description.length}/{MAX_DESCRIPTION_LENGTH}자
                </Text>


                <TextInput
                  radius="sm"
                  size="md"
                  label="할인 종료 일시"
                  type="datetime-local"
                  required
                  onChange={(e) => {
                    const parsedDate = new Date(e.currentTarget.value);
                    if (!isNaN(parsedDate.getTime())) {
                      setEndDate(parsedDate);
                    } else {
                      setEndDate(null);
                    }
                  }}
                />
              </Stack>

              {!loading && !brandId && (
                <Box
                  pos="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="rgba(0, 0, 0, 0.6)"
                  style={{
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <Text size="lg" fw={700} c="white">
                    상품 등록 전 브랜드 등록이 필요합니다.
                  </Text>
                </Box>
              )}
              {loading && (
                <Box
                  pos="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="rgba(255, 255, 255, 0.6)"
                  style={{
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(1px)",
                  }}
                >
                  <Loader color="blue" />
                </Box>
              )}
            </Card>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
