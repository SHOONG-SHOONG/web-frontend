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
import { IconPhoto, IconPlus } from "@tabler/icons-react";
import SellerNavBarPage from "../../../components/SellerNavBar.tsx";
import BASE_URL from "../../../config.js";

export default function CreateItemPage() {
  const [itemName, setItemName] = useState<string>("");
  const [price, setPrice] = useState<number | undefined>(undefined); // 초기값 undefined로 변경 (NumberInput 기본값)
  const [discountRate, setDiscountRate] = useState<number | undefined>(
    undefined
  ); // 초기값 undefined로 변경
  const [category, setCategory] = useState<string | null>(null);
  const [stock, setStock] = useState<number | undefined>(undefined); // 초기값 undefined로 변경
  const [imageFiles, setImageFiles] = useState<File[]>([]); // 단일 파일에서 파일 배열로 변경
  const [description, setDescription] = useState<string>("");
  const [endDate, setEndDate] = useState<Date | null>(null); // Date 타입 유지

  // ✅ LocalDateTime 문자열로 변환 (Z나 타임존 없는 순수 로컬 시간)
  const toLocalDateTimeString = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, "0");
    // 백엔드의 LocalDateTime은 일반적으로 ISO 8601 포맷을 기대합니다 (yyyy-MM-dd'T'HH:mm:ss)
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
    // price, discountRate, stock은 NumberInput의 onChange에서 number로 변환되므로 null/undefined 검사
    // 1. 필수 정보 유효성 검사
    // price, discountRate, stock은 NumberInput의 onChange에서 number로 변환되므로 null/undefined 검사
    if (
      !itemName ||
      !description ||
      price === undefined ||
      price === null ||
      price <= 0 || // price가 0보다 커야 함
      stock === undefined ||
      stock === null ||
      stock <= 0 || // stock이 0보다 커야 함
      imageFiles.length === 0 || // 이미지는 최소 하나 이상 필요
      !category || // 카테고리도 필수
      !endDate ||
      isNaN(endDate.getTime()) // 날짜는 필수 & 유효해야 함
    ) {
      alert(
        "모든 필수 입력 필드를 채워주세요. (상품 이름, 설명, 가격, 수량, 이미지, 카테고리, 할인 종료일)"
      );
      return;
    }

    // 2. 할인율 유효성 검사 (0% ~ 100% 범위)
    // discountRate가 undefined일 경우 0으로 처리 (NumberInput에서 min=0이므로 실제로는 잘 안 발생)
    const currentDiscountRate =
      discountRate === undefined || discountRate === null ? 0 : discountRate;
    if (currentDiscountRate < 0 || currentDiscountRate > 100) {
      alert("할인율은 0에서 100 사이의 값이어야 합니다.");
      return;
    }
    // 백엔드 DTO가 0.0 ~ 1.0 Double을 기대하므로 변환
    const adjustedDiscountRate = currentDiscountRate / 100.0;

    // 3. 백엔드로 전송할 아이템 데이터 객체 생성
    const itemData = {
      itemName,
      price: price as number, // 타입 가드 후 사용
      discountRate: adjustedDiscountRate, // ⭐ 변환된 할인율 사용 ⭐
      price: price as number, // 타입 가드 후 사용
      discountRate: adjustedDiscountRate, // ⭐ 변환된 할인율 사용 ⭐
      description,
      itemQuantity: stock as number, // 타입 가드 후 사용
      category: category, // ⭐ 카테고리는 이제 null 아님 (위에서 검증) ⭐
      createdAt: new Date().toISOString(), // ISO 8601 UTC
      discountExpiredAt: toLocalDateTimeString(endDate), // ⬅️ LocalDateTime string
      itemQuantity: stock as number, // 타입 가드 후 사용
      category: category, // ⭐ 카테고리는 이제 null 아님 (위에서 검증) ⭐
      createdAt: new Date().toISOString(), // ISO 8601 UTC
      discountExpiredAt: toLocalDateTimeString(endDate), // ⬅️ LocalDateTime string
    };

    const formData = new FormData();
    formData.append("item", JSON.stringify(itemData));

    // ⭐ 여러 파일 추가 (MultipartFile[]에 대응) ⭐
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
        // 서버에서 보낸 에러 메시지를 텍스트로 가져와서 표시
        const errorDetail = await response.text();
        throw new Error(`상품 등록 실패: ${response.status} - ${errorDetail}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("상품 등록 성공:", data);
        console.log("상품 등록 성공:", data);
      } else {
        console.log("상품 등록 성공 (응답 본문 없음)");
        console.log("상품 등록 성공 (응답 본문 없음)");
      }

      alert("상품이 성공적으로 등록되었습니다!");

      // 폼 초기화
      setItemName("");
      setPrice(undefined);
      setDiscountRate(undefined);
      setCategory(null);
      setStock(undefined);
      setImageFiles([]); // 이미지 파일 목록 초기화
      setDescription("");
      setEndDate(null);
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
              {" "}
              {/* mb 추가 */}
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
              {" "}
              {/* shadow, withBorder 추가 */}
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
                  placeholder="상품의 원 가격을 입력하세요"
                  placeholder="상품의 원 가격을 입력하세요"
                  value={price}
                  onChange={(val) =>
                    setPrice(typeof val === "number" ? val : undefined)
                  }
                  min={0} // ⭐ DTO의 @PositiveOrZero에 맞춰 0으로 변경 (기존 가격이 0일 수는 없으니 1로 하는게 더 현실적일 수 있음) ⭐
                  required
                  prefix="₩"
                  prefix="₩"
                />

                <NumberInput
                  radius="sm"
                  size="md"
                  label="할인율 (%)" // 레이블 명확화
                  placeholder="할인율을 입력하세요 (0~100)"
                  label="할인율 (%)" // 레이블 명확화
                  placeholder="할인율을 입력하세요 (0~100)"
                  value={discountRate}
                  onChange={(val) =>
                    setDiscountRate(typeof val === "number" ? val : undefined)
                  }
                  min={0}
                  max={100}
                  max={100}
                  required
                  suffix="%"
                  suffix="%"
                />

                <Select
                  radius="sm"
                  size="md"
                  label="카테고리"
                  placeholder="카테고리를 선택하세요"
                  data={["여행", "숙박", "항공", "교통", "캠핑", "기타"]} // '기타' 추가
                  data={["여행", "숙박", "항공", "교통", "캠핑", "기타"]} // '기타' 추가
                  value={category}
                  onChange={setCategory}
                  searchable
                  clearable // 필요에 따라 유지, 필수 항목이면 실제로는 선택해야 함
                  required // ⭐ 카테고리 필수 항목이므로 required 추가 ⭐
                  clearable // 필요에 따라 유지, 필수 항목이면 실제로는 선택해야 함
                  required // ⭐ 카테고리 필수 항목이므로 required 추가 ⭐
                />

                <NumberInput
                  radius="sm"
                  size="md"
                  label="재고 수량"
                  placeholder="재고 수량을 입력하세요"
                  label="재고 수량"
                  placeholder="재고 수량을 입력하세요"
                  value={stock}
                  onChange={(val) =>
                    setStock(typeof val === "number" ? val : undefined)
                  }
                  min={0} // ⭐ DTO의 @Min(0)에 맞춰 0으로 변경 ⭐
                  max={10000}
                  required
                />

                <FileInput
                  multiple // ⭐ 여러 파일 업로드 가능하도록 multiple 속성 추가 ⭐
                  multiple // ⭐ 여러 파일 업로드 가능하도록 multiple 속성 추가 ⭐
                  radius="sm"
                  size="md"
                  label="상품 이미지 등록"
                  placeholder="이미지를 업로드하세요 (최대 N개)" // 메시지 수정
                  placeholder="이미지를 업로드하세요 (최대 N개)" // 메시지 수정
                  leftSection={<IconPhoto size={16} />}
                  value={imageFiles} // ⭐ imageFiles 배열 사용 ⭐
                  onChange={setImageFiles} // ⭐ setImageFiles로 변경 ⭐
                  accept="image/png,image/jpeg,image/gif" // gif 형식 추가
                  required // 이미지 파일도 필수
                  value={imageFiles} // ⭐ imageFiles 배열 사용 ⭐
                  onChange={setImageFiles} // ⭐ setImageFiles로 변경 ⭐
                  accept="image/png,image/jpeg,image/gif" // gif 형식 추가
                  required // 이미지 파일도 필수
                />

                <Textarea
                  radius="sm"
                  size="md"
                  label="상품 설명"
                  placeholder="상품에 대한 상세 설명을 입력하세요"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  minRows={4}
                  required
                  required
                />

                {/* 날짜 선택은 기존 방식 유지 */}
                <TextInput
                {/* 날짜 선택은 기존 방식 유지 */}
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
                  // 최소 날짜를 오늘 이후로 제한 (선택 사항, HTML 기본 datepicker에서는 직접 구현 필요)
                  // Mantine DatePicker/DateTimePicker처럼 minDate prop이 바로 없으므로 주의
                  // value={endDate ? toLocalDateTimeString(endDate).substring(0, 16) : ''} // YYYY-MM-DDTHH:mm 형식으로 value 바인딩
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
                  // 최소 날짜를 오늘 이후로 제한 (선택 사항, HTML 기본 datepicker에서는 직접 구현 필요)
                  // Mantine DatePicker/DateTimePicker처럼 minDate prop이 바로 없으므로 주의
                  // value={endDate ? toLocalDateTimeString(endDate).substring(0, 16) : ''} // YYYY-MM-DDTHH:mm 형식으로 value 바인딩
                />
              </Stack>
            </Card>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}