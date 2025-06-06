import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Image,
  Text,
  Title,
  Button,
  NumberInput,
  Tabs,
  Table,
  Flex,
  Group,
  Box,
  Loader,
  Divider,
  Select,
  Input,
} from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../../../components/Header.tsx";
import FooterComponent from "../../../components/Footer.tsx";
import BASE_URL from "../../../config.js";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { RingLoader } from "../../../components/RingLoader.tsx";
import LoginModal from "../../../components/LoginModal.tsx";
import { showNotification } from "@mantine/notifications";
import { useLogin } from "../../../contexts/AuthContext.tsx";

//  필터 라이브러리 임포트
import Filter from "badwords-ko";
const filter = new Filter(); // 필터 인스턴스 생성 (기본 욕설 리스트 사용)

// 필요한 경우 커스텀 단어 추가:
// filter.addWords("새로운욕설", "나쁜말");

// 타입 정의
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

const categoryMap: Record<string, string> = {
  여행: "TRAVEL",
  항공: "FLIGHT",
  숙박: "ACCOMMODATION",
  캠핑: "CAMPING",
  교통: "TRANSPORT",
};

export default function ItemDetailPage() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false); // 찜 상태
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const { role } = useLogin();

  const handleItemPurchaseClick = () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoginModalOpened(true);
    } else if (role?.toUpperCase() !== "CLIENT") {
      showNotification({
        title: "권한 제한",
        message: "구매는 일반 사용자만 사용할 수 있습니다.",
        color: "red",
      });
    } else {
      handleBuy();
    }
  };

  const handleCartItemClick = () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoginModalOpened(true);
    } else if (role?.toUpperCase() !== "CLIENT") {
      showNotification({
        title: "권한 제한",
        message: "장바구니는 일반 사용자만 사용할 수 있습니다.",
        color: "red",
      });
    } else {
      handleAddToCart();
    }
  };

  // 컴포넌트 마운트 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 상품 상세 정보 가져오기 및 필터링
  useEffect(() => {
    const fetchItemDetail = async (
      itemId: number,
      setItem: (item: Item) => void,
      setError: (error: string | null) => void
    ) => {
      try {
        const response = await fetch(`${BASE_URL}/item/summary/${itemId}`, {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const data: Item = await response.json();

        //  상품명과 설명을 필터링
        const filteredItem: Item = {
          ...data,
          itemName: filter.clean(data.itemName),
          description: filter.clean(data.description),
        };
        setItem(filteredItem);
        setError(null);
      } catch (err: any) {
        console.error("에러 발생:", err);
        setError(err.message || "상품 조회 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetail(Number(itemId), setItem, setError);
    }
  }, [itemId]); // itemId가 변경될 때마다 실행

  // 찜하기/찜 해제 토글 함수
  const toggleWishlist = async () => {
    // 실제 API 호출 로직은 주석 처리되어 있으므로, 여기서는 UI 상태만 토글합니다.
    // 실제 백엔드 연동 시에는 주석 처리된 코드를 활성화하고 로그인 여부 등 추가 로직을 처리해야 합니다.
    setIsWishlisted((prev) => !prev);

    // const token = localStorage.getItem("access");
    // if (!token) {
    //   setLoginModalOpened(true); // 로그인 모달 표시
    //   return;
    // }

    // try {
    //   const response = await fetch(
    //     `${BASE_URL}/wishlist/toggle/${item?.itemId}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         access: token || "",
    //       },
    //       credentials: "include",
    //     }
    //   );

    //   if (response.ok) {
    //     setIsWishlisted((prev) => !prev);
    //   } else if (response.status === 401) {
    //     alert("로그인이 만료되었거나 잘못되었습니다. 다시 로그인해주세요.");
    //     setLoginModalOpened(true); // 로그인 모달 표시
    //   } else {
    //     alert("찜 처리 중 오류가 발생했습니다.");
    //   }
    // } catch (error) {
    //   console.error("찜 요청 실패:", error);
    //   alert("찜 요청 중 문제가 발생했습니다.");
    // }
  };

  // 장바구니에 상품 추가
  const handleAddToCart = async () => {
    const token = localStorage.getItem("access");

    try {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access: token || "",
        },
        credentials: "include",
        body: JSON.stringify({
          itemId: Number(item?.itemId),
          cartQuantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("장바구니 추가 실패");
      }

      showNotification({
        title: "장바구니 담기 성공",
        message: "상품이 장바구니에 담겼습니다.",
        color: "teal",
      });

    } catch (error) {
      console.error("❌ 장바구니 요청 실패:", error);
      showNotification({
        title: "알림",
        message: "해당 상품을 장바구니에 담을 수 없습니다.",
        color: "red",
      });
    }
  };

  // 바로 구매 처리 (현재는 alert만)
  const handleBuy = async () => {
    const token = localStorage.getItem("access");

    try {
      // 1️⃣ 장바구니에 아이템 추가
      const cartRes = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access: token || "",
        },
        credentials: "include",
        body: JSON.stringify({
          itemId: Number(item?.itemId),
          cartQuantity: quantity,
        }),
      });

      if (!cartRes.ok) {
        throw new Error("장바구니 추가 실패");
      }

      const cartData = await cartRes.json();
      const cartId = cartData.cartId;

      // 2️⃣ 주문 생성
      const orderRes = await fetch(`${BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access: token || "",
        },
        credentials: "include",
        body: JSON.stringify({
          selectedCartIds: [cartId],
        }),
      });

      if (!orderRes.ok) {
        throw new Error("주문 생성 실패");
      }

      // 3️⃣ 주문 페이지로 이동
      navigate("/order");

    } catch (error) {
      console.error("바로 구매 실패:", error);
      showNotification({
        title: "알림",
        message: "해당 상품을 구매할 수 없습니다.",
        color: "red",
      });

    }
  };

  // 로딩 중일 때 로더 표시
  if (loading) {
    return (
      <Container py="xl">
        <RingLoader />
      </Container>
    );
  }

  // 상품 데이터가 없을 때 에러 메시지 표시
  if (!item) {
    return (
      <Container py="xl">
        <Title order={3}>상품 정보를 찾을 수 없습니다.</Title>
      </Container>
    );
  }

  return (
    <>
      <HeaderComponent />

      <Container size="lg" py="xl">
        {/* 상품 이미지 + 정보 섹션 */}
        <Grid gutter="md" mt={30} mb={60}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Image
              src={item.itemImages?.[0]?.url || "https://placehold.co/450x450"}
              alt={item.itemName}
              radius="md"
              w={450}
              h={450}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            {/* 브랜드명 */}
            <Text
              size="xs"
              color="dimmed"
              style={{ textTransform: "uppercase" }}
              mb={4}
            >
              {categoryMap[item.category] || ""}
            </Text>

            {/* 상품명 + 찜 버튼 */}
            <Flex justify="space-between" align="center" mb="xs">
              <Text size="xl" fw={500}>
                {item.itemName} {/*  필터링된 상품명 표시 */}
              </Text>
              <Box onClick={toggleWishlist} style={{ cursor: "pointer" }}>
                {isWishlisted ? (
                  <IconHeartFilled size={24} color="#ff4d6d" />
                ) : (
                  <IconHeart size={24} color="#aaa" />
                )}
              </Box>
            </Flex>

            {/* 정가 */}
            <Text size="md" fw={600} color="dimmed" td="line-through" mb="xs">
              {item.price.toLocaleString()}원
            </Text>

            {/* 할인율 + 할인가 */}
            <Flex align="center" gap={8} mb="md">
              {item.discountRate > 0 && (
                <Text size="xl" fw={700} color="red">
                  {Math.round(item.discountRate)}%
                </Text>
              )}
              <Text size="xl" fw={700}>
                {Math.round(item.finalPrice).toLocaleString()}원
              </Text>
            </Flex>

            {/* 배송 정보 */}
            <Flex
              justify="space-between"
              py={8}
              style={{ borderTop: "1px solid #eee" }}
              mt={30}
            >
              <Text fw={500}>배송 정보</Text>
            </Flex>

            {/* 배송 설명 */}
            <Text size="sm" color="dimmed" mb="sm">
              무료배송
              <br />
              제주도 포함한 도서/산간지역은 추가배송비 5,000원
            </Text>

            {/* 수량 선택 */}
            <Flex align="center" gap="md" mt="md" mb="md">
              <Text size="sm" fw={500}>
                수량
              </Text>
              <NumberInput
                value={quantity}
                onChange={(val) =>
                  setQuantity(typeof val === "number" ? val : 1)
                }
                min={1}
                max={item.itemQuantity}
                size="sm"
                w={100}
              />
            </Flex>

            {/* 총 금액 */}
            <Flex justify="space-between" align="center" mb="md">
              <Text size="sm" color="dimmed">
                총 상품 금액
              </Text>
              <Text size="lg" fw={700}>
                {(item.finalPrice * quantity).toLocaleString()}원
              </Text>
            </Flex>

            {/* 버튼 영역 */}
            <Flex gap="sm">
              <Button
                fullWidth
                variant="default"
                radius="sm"
                style={{ height: "50px", fontWeight: 600 }}
                onClick={handleCartItemClick}
              >
                장바구니에 담기
              </Button>
              <Button
                fullWidth
                color="dark"
                radius="sm"
                style={{ height: "50px", fontWeight: 600 }}
                onClick={handleItemPurchaseClick}
              >
                바로 구매하기
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>

        {/* 로그인 모달 */}
        <LoginModal
          opened={loginModalOpened}
          onClose={() => setLoginModalOpened(false)}
        />

        {/* 상세 정보 탭 섹션 */}
        <Tabs color="rgba(0, 0, 0, 1)" defaultValue="detail">
          <Tabs.List grow>
            <Tabs.Tab value="detail">상품상세</Tabs.Tab>
            <Tabs.Tab value="review">리뷰[0]</Tabs.Tab>
            <Tabs.Tab value="inquiry">문의[0]</Tabs.Tab>
            <Tabs.Tab value="notice">안내사항</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="detail" pt="xl">
            {/* 상품 상세 이미지 (예시) */}
            <Box style={{ textAlign: "center" }} mb="xl">
              <Image
                src="\assets\banner.png"
                alt="상세 이미지"
                radius="sm"
                width="100%"
                maw={800}
                mx="auto"
              />
            </Box>

            {/* 상품 설명 */}
            <Box
              px="md"
              style={{
                maxWidth: 800,
                margin: "0 auto",
                textAlign: "center",
                lineHeight: "1.8",
                whiteSpace: "pre-line", // 줄바꿈 반영
                fontSize: "16px",
                color: "#333",
              }}
            >
              {item.description}
            </Box>


            {/* 상품 상세 이미지 리스트 */}
            <Box style={{ textAlign: "center" }} mb="xl">
              {item.itemImages?.map((img, index) => (
                <Image
                  key={img.id || index}
                  src={img.url}
                  alt={`상품 이미지 ${index + 1}`}
                  radius="sm"
                  width="100%"
                  maw={600}
                  mx="auto"
                  mb="md"
                />
              ))}
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="review" pt="md">
            <Box mt="xl">
              {/* 리뷰 제목 */}
              <Text fw={700} size="lg" mb="xs">
                리뷰 (0)
              </Text>
              <Divider mb="md" />

              <Flex gap="xl" align="start" mb="xl">
                {/* 별점 박스 */}
                <Flex direction="column" align="center" w={120}>
                  <IconStar size={48} stroke={1.5} />
                  <Text size="xl" fw={600} mt="xs">
                    -
                  </Text>
                  <Button color="dark" size="xs" mt="xs" radius="xs">
                    상품 리뷰 작성하기
                  </Button>
                </Flex>
              </Flex>

              {/* 필터 + 검색바 */}
              <Flex
                justify="space-between"
                align="center"
                px="sm"
                py="sm"
                style={{
                  borderTop: "1px solid #eee",
                  borderBottom: "1px solid #eee",
                }}
                mb="lg"
              >
                <Group>
                  <Select
                    data={["최신순", "평점 높은순", "평점 낮은순"]}
                    defaultValue="최신순"
                    size="xs"
                    w={100}
                  />
                  <Select
                    data={["별점"]}
                    defaultValue="별점"
                    size="xs"
                    w={80}
                  />
                  <Select
                    data={["사이즈"]}
                    defaultValue="사이즈"
                    size="xs"
                    w={80}
                  />
                  <Select
                    data={["색상 (밝기)"]}
                    defaultValue="색상 (밝기)"
                    size="xs"
                    w={120}
                  />
                </Group>
                <Input placeholder="리뷰 키워드 검색" size="xs" w={200} />
              </Flex>

              {/* 빈 리뷰 안내 */}
              <Box py="xl" style={{ textAlign: "center" }}>
                <Text size="sm" color="dimmed">
                  리뷰가 없습니다.
                  <br />
                  리뷰를 작성해 보세요!
                </Text>
              </Box>
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="inquiry" pt="md">
            <Text size="sm" c="dimmed">
              상품에 대해 궁금한 점을 작성해주세요.
            </Text>
            <Button color="dark" size="xs" mt="xs" radius="xs">
              상품 문의 작성하기
            </Button>
          </Tabs.Panel>

          <Tabs.Panel value="notice" pt="md">
            <Table striped withColumnBorders mt="sm">
              <tbody>
                <tr>
                  <td>
                    <b>기본 택배사</b>
                  </td>
                  <td>CJ대한통운</td>
                </tr>
                <tr>
                  <td>
                    <b>출고지</b>
                  </td>
                  <td>04549 | 서울 중구 을지로 154-2 | 오락국</td>
                </tr>
                <tr>
                  <td>
                    <b>반품지</b>
                  </td>
                  <td>04549 | 서울 중구 을지로 154-2 | 오락국</td>
                </tr>
                <tr>
                  <td>
                    <b>반품 배송비</b>
                  </td>
                  <td>3,000원</td>
                </tr>
                <tr>
                  <td>
                    <b>반품 요청 가능 기간</b>
                  </td>
                  <td>배송 완료 후 7일 이내</td>
                </tr>
                <tr>
                  <td>
                    <b>배송 및 반품 안내</b>
                  </td>
                  <td>* 배송은 주문일로부터 영업일 기준 7~10일 소요됩니다.</td>
                </tr>
              </tbody>
            </Table>
          </Tabs.Panel>
        </Tabs>
      </Container>

      <FooterComponent />
    </>
  );
}
