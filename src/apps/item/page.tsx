import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FooterComponent from "../../components/Footer.tsx";
import HeaderComponent from "../../components/Header.tsx";
import { Box, Container, Grid, Image, Text, Flex, Button } from "@mantine/core";
import { IconArrowNarrowUp, IconArrowUp } from "@tabler/icons-react";
import BASE_URL from "../../config.js";

//  필터 라이브러리 임포트
import Filter from "badwords-ko";
const filter = new Filter(); // 필터 인스턴스 생성 (기본 욕설 리스트 사용)

// 필요한 경우 커스텀 단어 추가:
// filter.addWords("새로운욕설", "나쁜말");

// filter
const categories = [
  {
    label: "전체",
    value: "",
    icon: "⭐️",
    url: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/star_2b50.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/star_2b50.png",
  },
  {
    label: "여행",
    value: "여행",
    icon: "🏖️",
    url: "https://em-content.zobj.net/source/microsoft-teams/363/palm-tree_1f334.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/palm-tree_1f334.png",
  },
  {
    label: "숙박",
    value: "숙박",
    icon: "🛏️",
    url: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/bed_1f6cf-fe0f.png",
    murl: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/bed_1f6cf-fe0f.png",
  },
  {
    label: "항공",
    value: "항공",
    icon: "✈️",
    url: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/airplane-departure_1f6eb.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/airplane-departure_1f6eb.png",
  },
  {
    label: "캠핑",
    value: "캠핑",
    icon: "🏕",
    url: "https://em-content.zobj.net/source/microsoft-teams/363/camping_1f3d5-fe0f.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/camping_1f3d5-fe0f.png",
  },
  {
    label: "교통",
    value: "교통",
    icon: "🚗",
    url: "https://em-content.zobj.net/source/microsoft-3D-fluent/406/automobile_1f697.png",
    murl: "https://em-content.zobj.net/source/microsoft-teams/363/automobile_1f697.png",
  },
];

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

interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

const categoryMap: Record<string, string> = {
  여행: "TRAVEL",
  항공: "FLIGHT",
  숙박: "ACCOMMODATION",
  캠핑: "CAMPING",
  교통: "TRANSPORT",
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [selected, setSelected] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  // 상품 목록을 키워드로 가져오는 함수
  const fetchItemListByKeyword = async (keyword: string) => {
    try {
      const token = localStorage.getItem("access");

      const page = 0;
      const size = 30;
      const sort = "itemId,desc";

      const url = `${BASE_URL}/item/search?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}&size=${size}&sort=${sort}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      //  받아온 상품 데이터의 itemName과 description을 필터링
      const filteredItems = data.content.map((item: Item) => ({
        ...item,
        itemName: filter.clean(item.itemName),
        description: filter.clean(item.description),
      }));
      setItems(filteredItems);
      setPageInfo(data.page);
      setError(null);
    } catch (err: any) {
      console.error("상품 목록 불러오기 실패:", err);
      setError(err.message || "상품 조회 중 오류 발생");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 상품 목록을 카테고리로 가져오는 함수
  const fetchItemListByCategory = async (category: string) => {
    try {
      const token = localStorage.getItem("access");

      const page = 0;
      const size = 10;
      const sort = "itemId,desc";

      const url = `${BASE_URL}/item/search?category=${encodeURIComponent(
        category
      )}&page=${page}&size=${size}&sort=${sort}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          access: token || "",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      //  받아온 상품 데이터의 itemName과 description을 필터링
      const filteredItems = data.content.map((item: Item) => ({
        ...item,
        itemName: filter.clean(item.itemName),
        description: filter.clean(item.description),
      }));
      setItems(filteredItems);
      setPageInfo(data.page);
      setError(null);
    } catch (err: any) {
      console.error("카테고리별 상품 불러오기 실패:", err);
      setError(err.message || "상품 조회 중 오류 발생");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 전체 상품 목록을 가져옴
  useEffect(() => {
    fetchItemListByKeyword(""); // 초기 로드 시 전체 상품 (빈 키워드)
  }, []);

  // 페이지 최상단으로 스크롤하는 함수
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <HeaderComponent />

      <Container size="lg" py="xl">
        {/* Filter categories */}
        <Flex
          mb={32}
          gap={24}
          wrap="nowrap"
          style={{ overflowX: "auto", paddingBottom: 8 }}
          justify="center"
        >
          {categories.map((cat) => (
            <Box
              key={cat.value}
              onClick={() => {
                setSelected(cat.value);
                fetchItemListByCategory(cat.value);
              }}
              style={{ textAlign: "center", cursor: "pointer", minWidth: 72 }}
            >
              <Box
                w={50}
                h={50}
                style={{
                  borderRadius: "50%",
                  fontSize: 33,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <span className="tossface">{cat.icon}</span>
              </Box>
              <Text
                mt={6}
                size="sm"
                fw={selected === cat.value ? 700 : 400}
                truncate
              >
                {cat.label}
              </Text>
            </Box>
          ))}
        </Flex>

        {/* 상품 목록 Grid */}
        <Grid gutter="xl" mt={40}>
          {items.map((item) => (
            <Grid.Col span={{ base: 6, md: 3 }} key={item.itemId}>
              <Box
                onClick={() =>
                  navigate(`/item/${item.itemId}`, { state: item })
                }
                style={{ cursor: "pointer" }}
              >
                {/* 상품 이미지 */}
                <Image
                  src={
                    item.itemImages?.[0]?.url || "https://placehold.co/400x400"
                  }
                  alt={item.itemName}
                  radius="sm"
                  height={320}
                  fit="cover"
                  style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                />

                {/* 카테고리 표시 */}
                <Text mt="md" size="xs" fw={600} c={"gray"}>
                  {categoryMap[item.category] || ""}
                </Text>

                {/* 상품명 */}
                <Text size="sm" mb="xs">
                  {item.itemName} {/*  필터링된 상품명 표시 */}
                </Text>

                {/* 할인율 + 가격 */}
                <Flex align="center" gap={6}>
                  {item.discountRate > 0 && (
                    <Text size="sm" fw={700} color="red">
                      {item.discountRate * 100}%
                    </Text>
                  )}
                  <Text size="xs" td="line-through" c="dimmed">
                    {item.price.toLocaleString()}원
                  </Text>
                  <Text size="sm" fw={700}>
                    {item.finalPrice.toLocaleString()}원
                  </Text>
                </Flex>
              </Box>
            </Grid.Col>
          ))}
        </Grid>
      </Container>

      <Button
        onClick={scrollToTop}
        variant="filled"
        color="#409fff"
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 999,
          width: 50,
          height: 50,
          borderRadius: "50%",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconArrowNarrowUp size={30} />
      </Button>

      <FooterComponent />
    </>
  );
}
