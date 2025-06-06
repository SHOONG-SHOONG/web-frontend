import React, { useEffect, useState } from "react";
import {
  AppShell,
  Container,
  Flex,
  Title,
  Box,
  Loader,
  Text,
  Card,
  Divider,
  Stack,
  AppShellNavbar,
} from "@mantine/core";
import { useNavigate, useSearchParams } from "react-router-dom";
import SellerNavBarPage from "../../../../components/SellerNavBar.tsx";
import BASE_URL from "../../../../config.js";

export default function LiveStatisticsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const itemId = searchParams.get("itemId");
  const liveId = searchParams.get("liveId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const grafanaDashboardUid = "beniokcoo3thcc";
  const grafanaHost = "http://192.168.0.6:3000";
  const dashboardTitle = "efg";

  const baseGrafanaUrl = `${grafanaHost}/d-solo/${grafanaDashboardUid}/${dashboardTitle}?orgId=1&theme=light`;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppShell layout="default">
      <AppShellNavbar>
        <SellerNavBarPage />
      </AppShellNavbar>
      <AppShell.Main ml={250}>
        <Container size="lg" py="xl">
          <Flex justify="space-between" align="center" mb="lg">
            <Title order={2} fw={700}>
              라이브 커머스 통계 대시보드
            </Title>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" py="xl">
              <Loader size="lg" color="#409FFF" />
            </Flex>
          ) : (
            <Stack gap="xl">
              {/* 상품별 통계 요약 (카운트형) */}
              <Flex gap="md">
                <Box w="33.3%">
                  <Card padding="lg" radius="md" withBorder>
                    <Title order={4} mb="sm">
                      상품별 결제 횟수
                    </Title>
                    <iframe
                      src={`${baseGrafanaUrl}&var-liveId=${liveId}&var-itemId=${itemId}&from=${from}&to=${to}&panelId=2`}
                      width="100%"
                      height="150"
                      style={{ border: "none" }}
                    />
                  </Card>
                </Box>

                <Box w="33.3%">
                  <Card padding="lg" radius="md" withBorder>
                    <Title order={4} mb="sm">
                      상품 조회수
                    </Title>
                    <iframe
                      src={`${baseGrafanaUrl}&var-liveId=${liveId}&var-itemId=${itemId}&from=${from}&to=${to}&panelId=4`}
                      width="100%"
                      height="150"
                      style={{ border: "none" }}
                    />
                  </Card>
                </Box>

                <Box w="33.3%">
                  <Card padding="lg" radius="md" withBorder>
                    <Title order={4} mb="sm">
                      장바구니 담긴 횟수
                    </Title>
                    <iframe
                      src={`${baseGrafanaUrl}&var-liveId=${liveId}&var-itemId=${itemId}&from=${from}&to=${to}&panelId=5`}
                      width="100%"
                      height="150"
                      style={{ border: "none" }}
                    />
                  </Card>
                </Box>
              </Flex>

              {/* 방송 전환율 요약 */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="sm">
                  방송 전환율 요약
                </Title>
                <iframe
                  src={`${baseGrafanaUrl}&from=${from}&to=${to}&panelId=1`}
                  width="100%"
                  height="200"
                  style={{ border: "none" }}
                />
              </Card>

              {/* 상품별 상세 트렌드 추가 (panelId=6) */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="sm">
                  상품별 구매 트렌드
                </Title>
                <iframe
                  src={`${baseGrafanaUrl}&from=${from}&to=${to}&var-itemId=${itemId}&panelId=6`}
                  width="100%"
                  height="300"
                  style={{ border: "none" }}
                />
              </Card>
            </Stack>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
