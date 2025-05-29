import React, { useState } from "react";
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
} from "@mantine/core";
import { IconPhoto, IconPlus } from "@tabler/icons-react";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import BASE_URL from "../../../config.js";

import Filter from "badwords-ko";
const filter = new Filter();

export default function CreateItemPage() {
  const [itemName, setItemName] = useState<string>("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [discountRate, setDiscountRate] = useState<number | undefined>(
    undefined
  );
  const [category, setCategory] = useState<string | null>(null);
  const [stock, setStock] = useState<number | undefined>(undefined);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [description, setDescription] = useState<string>("");
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 욕설 필터링 에러 상태 추가
  const [itemNameError, setItemNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const toLocalDateTimeString = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`
    );
  };

  const handleSubmit = async () => {
    // 1. 필수 정보 유효성 검사
    if (
      !itemName ||
      !description ||
      price === undefined ||
      price === null ||
      price <= 0 ||
      stock === undefined ||
      stock === null ||
      stock <= 0 ||
      imageFiles.length === 0 ||
      !category ||
      !endDate ||
      isNaN(endDate.getTime())
    ) {
      alert(
        "모든 필수 입력 필드를 채워주세요. (상품 이름, 설명, 가격, 수량, 이미지, 카테고리, 할인 종료일)"
      );
      return;
    }

    // 2. 할인율 유효성 검사 (0% ~ 100% 범위)
    const currentDiscountRate =
      discountRate === undefined || discountRate === null ? 0 : discountRate;
    if (currentDiscountRate < 0 || currentDiscountRate > 100) {
      alert("할인율은 0에서 100 사이의 값이어야 합니다.");
      return;
    }
    const adjustedDiscountRate = currentDiscountRate / 100.0;

    // 3. 욕설 필터링 에러 최종 검사
    // 실시간 경고가 활성화되어 있어 여기에 걸리면 제출을 막습니다.
    if (itemNameError || descriptionError) {
      alert(
        "상품 이름 또는 설명에 부적절한 단어가 포함되어 있습니다. 수정해주세요."
      );
      return;
    }

    //  중요: 제출 시 필터링된 내용을 사용합니다.
    // 실시간 경고 후에도 혹시 모를 상황에 대비해 최종 필터링을 다시 적용합니다.
    const filteredItemName = filter.clean(itemName);
    const filteredDescription = filter.clean(description);

    // 4. 백엔드로 전송할 아이템 데이터 객체 생성
    const itemData = {
      itemName: filteredItemName, // 필터링된 상품 이름 사용
      price: price as number,
      discountRate: adjustedDiscountRate,
      description: filteredDescription, // 필터링된 상품 설명 사용
      itemQuantity: stock as number,
      category: category,
      createdAt: new Date().toISOString(),
      discountExpiredAt: toLocalDateTimeString(endDate),
    };

    const formData = new FormData();
    formData.append("item", JSON.stringify(itemData));

    imageFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });

    // 개발자 디버깅을 위한 FormData 내용 로깅
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`${BASE_URL}/item`, {
        method: "POST",
        headers: {
          access: token || "",
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`상품 등록 실패: ${response.status} - ${errorDetail}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("상품 등록 성공:", data);
      } else {
        console.log("상품 등록 성공 (응답 본문 없음)");
      }

      alert("상품이 성공적으로 등록되었습니다!");

      // 폼 초기화
      setItemName("");
      setPrice(undefined);
      setDiscountRate(undefined);
      setCategory(null);
      setStock(undefined);
      setImageFiles([]);
      setDescription("");
      setEndDate(null);
      setItemNameError(""); // 에러 메시지도 초기화
      setDescriptionError(""); // 에러 메시지도 초기화
    } catch (error) {
      console.error("상품 등록 에러:", error);
      alert(
        `상품 등록에 실패했습니다. 에러: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <AppShell layout="default">
      <SellerNavBarPage />
      <AppShell.Main style={{ backgroundColor: "#ffffff" }}>
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
              >
                등록하기
              </Button>
            </Flex>

            <Card p="lg" mt="lg" shadow="sm" withBorder>
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
                    if (filter.isProfane(inputValue)) {
                      setDescriptionError(
                        "상품 설명에 부적절한 단어가 포함되어 있습니다."
                      );
                    } else {
                      setDescriptionError("");
                    }
                    setDescription(inputValue);
                  }}
                  minRows={4}
                  required
                  error={descriptionError} // Mantine 컴포넌트에 에러 메시지 표시
                />

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
            </Card>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
