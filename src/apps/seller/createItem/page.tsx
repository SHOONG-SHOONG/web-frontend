import React, { useState } from "react";
import {
  AppShell,
  Container,
  Title,
  Button,
  Stack,
  TextInput,
  NumberInput,
  MultiSelect,
  FileInput,
  Textarea,
  Flex,
  Card,
  Box,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconPhoto, IconPlus } from "@tabler/icons-react";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import BASE_URL from "../../../config.js";
import { useNavigate } from "react-router-dom";
import { DateValue } from "@mantine/dates";

export default function CreateItemPage() {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [category, setCategory] = useState<string[]>([]);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  // const [endDate, setEndDate] = useState<string | null>(null);
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
      itemName: itemName,
      price: price,
      discountRate: Math.round(((price - discountRate) / price) * 100),
      description,
      itemQuantity: stock,
      category: category[0] || "",
      createdAt: new Date().toISOString(),
      discountExpiredAt: endDate instanceof Date ? endDate.toISOString() : "",
    };

    const formData = new FormData();
    formData.append("item", JSON.stringify(itemData));
    formData.append("imageFiles", image);

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

      const data = await response.json();
      console.log("등록 성공:", data);
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
          <Container>
            <Flex justify="space-between" align="center">
              <Title order={2}>상품 등록</Title>
              <Button
                leftSection={<IconPlus size={16} />}
                color="black"
                variant="light"
                onClick={handleSubmit}
              >
                등록하기
              </Button>
            </Flex>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <TextInput
                  label="상품 이름"
                  placeholder="상품 이름을 입력하세요"
                  value={itemName}
                  onChange={(e) => setItemName(e.currentTarget.value)}
                  required
                />

                <NumberInput
                  label="기존 가격"
                  value={price}
                  onChange={(val) =>
                    setPrice(typeof val === "number" ? val : 0)
                  }
                  min={0}
                  required
                />

                <NumberInput
                  label="할인율"
                  value={discountRate}
                  onChange={(val) =>
                    setDiscountRate(typeof val === "number" ? val : 0)
                  }
                  min={0}
                  required
                />

                <MultiSelect
                  label="카테고리"
                  placeholder="카테고리를 선택하세요"
                  data={["여행", "숙박", "항공", "교통", "캠핑"]}
                  value={category}
                  onChange={setCategory}
                  searchable
                  clearable
                />

                <NumberInput
                  label="수량"
                  value={stock}
                  onChange={(val) =>
                    setStock(typeof val === "number" ? val : 0)
                  }
                  min={0}
                  required
                />

                <FileInput
                  label="상품 이미지 등록"
                  placeholder="이미지를 업로드하세요"
                  leftSection={<IconPhoto size={16} />}
                  value={image}
                  onChange={setImage}
                  accept="image/png,image/jpeg"
                />

                <Textarea
                  label="상품 설명"
                  placeholder="상품에 대한 상세 설명을 입력하세요"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  minRows={4}
                />

                <DatePickerInput
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
