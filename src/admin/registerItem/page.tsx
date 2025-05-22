import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FileInput,
  Group,
  MultiSelect,
  NumberInput,
  Stack,
  Textarea,
  TextInput,
  Title,
  Flex,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconPhoto } from "@tabler/icons-react";

export default function ItemRegisterPage() {
  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [category, setCategory] = useState<string[]>([]);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSubmit = () => {
    const product = {
      productName,
      originalPrice,
      salePrice,
      category,
      stock,
      image,
      description,
      endDate,
    };
    console.log("상품 등록됨:", product);
    alert("상품이 등록되었습니다!");
  };

  return (
    <>
      <Flex>
        {/* 사이드바 */}
        <Box
          w={220}
          h="100vh"
          bg="#f8f9fa"
          p="md"
          style={{ borderRight: "1px solid #e9ecef" }}
        >
          <Text fw={700} size="xl" c="#3b5bdb" mb="lg">
            Shoong
          </Text>
          <Stack gap="xs">
            <Button variant="subtle" color="#3b5bdb" fullWidth>
              상품 관리
            </Button>
            <Button variant="subtle" color="gray" fullWidth>
              라이브쇼 관리
            </Button>
            <Button variant="subtle" color="gray" fullWidth>
              계정 관리
            </Button>
          </Stack>
        </Box>

        {/* 메인 콘텐츠 */}
        <Box style={{ flex: 1 }} bg="#fefefe">
          <Container size="sm" py="xl">
            <Title order={3} mb="lg">
              상품 등록
            </Title>

            <Stack gap="md">
              <TextInput
                label="상품 이름"
                placeholder="상품 이름을 입력하세요"
                value={productName}
                onChange={(e) => setProductName(e.currentTarget.value)}
                required
              />

              <NumberInput
                label="기존 가격"
                value={originalPrice}
                onChange={(val) =>
                  setOriginalPrice(typeof val === "number" ? val : 0)
                }
                min={0}
                required
              />

              <NumberInput
                label="할인가"
                value={salePrice}
                onChange={(val) =>
                  setSalePrice(typeof val === "number" ? val : 0)
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
                onChange={(val) => setStock(typeof val === "number" ? val : 0)}
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
                // onChange={(date) => setEndDate(date)}
                valueFormat="YYYY-MM-DD"
                type="default"
              />

              <Group justify="flex-end" mt="md">
                <Button color="blue" onClick={handleSubmit}>
                  상품 등록하기
                </Button>
              </Group>
            </Stack>
          </Container>
        </Box>
      </Flex>
    </>
  );
}
