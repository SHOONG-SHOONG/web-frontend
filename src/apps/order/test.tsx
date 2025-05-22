import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    Flex,
    Grid,
    Group,
    Image,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
    Anchor,
  } from "@mantine/core";
  import React, { useState, useEffect } from "react";
  import HeaderComponent from "../../components/Header";
  import FooterComponent from "../../components/Footer";
  
  export default function OrderPage() {
    const [agreed, setAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
      privacy: false,
      thirdParty: false,
      paymentAgency: false,
    });
  
    useEffect(() => {
      const allChecked = Object.values(agreements).every(Boolean);
      setAgreed(allChecked);
    }, [agreements]);
  
    const [formData, setFormData] = useState({
      email: "",
      phone: "",
      receiverName: "",
      receiverPhone: "",
      receiverTel: "",
      addressZip: "",
      addressDetail: "",
      deliveryMemo: "",
      coupon: "",
      paymentMethod: "무통장입금",
    });
  
    const handleChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleSubmit = () => {
      if (!agreed) return alert("약관에 동의해주세요.");
      console.log("🧾 주문 정보:", formData);
      alert("주문이 완료되었습니다!");
    };
  
    return (
      <>
        <HeaderComponent />
  
        <Container size="lg" py="xl">
          <Title order={2} align="center" mb="xl">
            상품 주문하기
          </Title>
  
          {/* ... 생략된 섹션 동일 ... */}
  
          {/* 약관 동의 */}
          <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
            <Text fw={700} size="sm" mb="md">약관 동의</Text>
            <Box bg="gray.1" p="md">
              <Text mb="sm">✔ 주문 내용을 확인하였으며, 아래 내용에 모두 동의합니다.</Text>
              <Stack gap="xs">
                <Flex align="center" gap="xs">
                  <Checkbox
                    checked={agreements.privacy}
                    onChange={(e) =>
                      setAgreements((prev) => ({ ...prev, privacy: e.currentTarget.checked }))
                    }
                  />
                  <Text size="sm">개인정보 수집 및 이용 동의</Text>
                  <Anchor size="xs">약관보기</Anchor>
                </Flex>
                <Flex align="center" gap="xs">
                  <Checkbox
                    checked={agreements.thirdParty}
                    onChange={(e) =>
                      setAgreements((prev) => ({ ...prev, thirdParty: e.currentTarget.checked }))
                    }
                  />
                  <Text size="sm">개인정보 제 3자 제공 동의</Text>
                </Flex>
                <Flex align="center" gap="xs">
                  <Checkbox
                    checked={agreements.paymentAgency}
                    onChange={(e) =>
                      setAgreements((prev) => ({ ...prev, paymentAgency: e.currentTarget.checked }))
                    }
                  />
                  <Text size="sm">전자결제대행 이용 동의</Text>
                </Flex>
              </Stack>
            </Box>
          </Box>
  
          {/* 결제 버튼 */}
          <Button fullWidth size="lg" color="dark" onClick={handleSubmit} disabled={!agreed}>
            결제하기
          </Button>
        </Container>
  
        <FooterComponent />
      </>
    );
  }
  