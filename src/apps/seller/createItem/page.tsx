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
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconPhoto, IconPlus } from "@tabler/icons-react";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import BASE_URL from "../../../config.js";
import { DateValue } from "@mantine/dates";

export default function CreateItemPage() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState<DateValue>(null);

  const handleSubmit = async () => {
    if (
      !itemName ||
      !price ||
      !discountRate ||
      !stock ||
      !image ||
      !description ||
      !endDate
    ) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    const itemData = {
      itemName,
      price,
      discountRate: Math.round(((price - discountRate) / price) * 100),
      description,
      itemQuantity: stock,
      category: category || "",
      createdAt: new Date().toISOString(),
      discountExpiredAt:
        endDate instanceof Date && !isNaN(endDate.getTime())
          ? endDate.toISOString()
          : new Date().toISOString(), // fallback 처리
    };

    const formData = new FormData();
    formData.append("item", JSON.stringify(itemData));
    formData.append("imageFiles", image);

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
        throw new Error(`등록 실패: ${response.status}`);
      }

      // body가 있을 때만 json 파싱
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("등록 성공:", data);
      } else {
        console.log("등록 성공 (응답 본문 없음)");
      }

      alert("상품이 등록되었습니다!");
    } catch (error) {
      console.error("등록 에러:", error);
      alert("상품 등록에 실패했습니다.");
    }
  };

  return (
    <AppShell layout="default">
      <SellerNavBarPage />
      <AppShell.Main style={{ backgroundColor: "#ffffff" }}>
        <Box py="xl" px="xl">
          <Container w={800}>
            <Flex justify="space-between" align="center">
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

            <Card p="lg" mt="lg">
              <Stack gap="lg">
                <TextInput
                  radius="sm"
                  size="md"
                  label="상품 이름"
                  placeholder="상품 이름을 입력하세요"
                  value={itemName}
                  onChange={(e) => setItemName(e.currentTarget.value)}
                  required
                />

                <NumberInput
                  radius="sm"
                  size="md"
                  label="기존 가격"
                  value={price}
                  onChange={(val) =>
                    setPrice(typeof val === "number" ? val : 0)
                  }
                  min={0}
                  required
                />

                <NumberInput
                  radius="sm"
                  size="md"
                  label="할인율"
                  value={discountRate}
                  onChange={(val) =>
                    setDiscountRate(typeof val === "number" ? val : 0)
                  }
                  min={0}
                  required
                />

                <Select
                  radius="sm"
                  size="md"
                  label="카테고리"
                  placeholder="카테고리를 선택하세요"
                  data={["여행", "숙박", "항공", "교통", "캠핑"]}
                  value={category}
                  onChange={setCategory}
                  searchable
                  clearable
                />

                <NumberInput
                  radius="sm"
                  size="md"
                  label="수량"
                  value={stock}
                  onChange={(val) =>
                    setStock(typeof val === "number" ? val : 0)
                  }
                  min={0}
                  max={10000}
                  required
                />

                <FileInput
                  radius="sm"
                  size="md"
                  label="상품 이미지 등록"
                  placeholder="이미지를 업로드하세요"
                  leftSection={<IconPhoto size={16} />}
                  value={image}
                  onChange={setImage}
                  accept="image/png,image/jpeg"
                />

                <Textarea
                  radius="sm"
                  size="md"
                  label="상품 설명"
                  placeholder="상품에 대한 상세 설명을 입력하세요"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  minRows={4}
                />

                <DatePickerInput
                  radius="sm"
                  size="md"
                  label="할인 종료일자"
                  placeholder="날짜를 선택하세요"
                  leftSection={<IconCalendar size={16} />}
                  value={endDate}
                  onChange={(value) => setEndDate(value)}
                  valueFormat="YYYY-MM-DD"
                />
              </Stack>
            </Card>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
