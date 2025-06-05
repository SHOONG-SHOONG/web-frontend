import React, { useEffect, useState } from "react";
import {
  AppShell,
  Container,
  Flex,
  Title,
  Box,
  Loader,
} from "@mantine/core";

import { useNavigate, useSearchParams } from "react-router-dom";
import SellerNavBarPage from "../../../../components/SellerNavBar.tsx";
import { RingLoader } from "../../../../components/RingLoader.tsx";
import BASE_URL from "../../../../config.js";

export default function LiveStatisticsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  // 쿼리 파라미터 가져오기
  const itemId = searchParams.get("itemId");
  const liveId = searchParams.get("liveId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Grafana iframe URL 구성
  const grafanaDashboardUid = "beniokcoo3thcc"; // 실제 대시보드 UID로 대체
  const grafanaHost = "http://192.168.0.6:3000";
  const dashboardTitle = "efg";

  const grafanaUrl = `${grafanaHost}/d/${grafanaDashboardUid}/${encodeURIComponent(
    dashboardTitle
  )}?from=${from}&to=${to}&var-itemId=${itemId}&var-liveId=${liveId}`;
  console.log("params: ", from, to, liveId, itemId);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // 로딩 UX 개선
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppShell layout="default">
      <SellerNavBarPage />
      <AppShell.Main style={{ backgroundColor: "#fff" }}>
        <Container py="xl" px="xl">
          <Flex justify="space-between" align="center" mb="xl">
            <Title order={3} fw={600}>
              라이브 통계
            </Title>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" py="xl">
              <Loader size="lg" />
            </Flex>
          ) : (
            <Box
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <iframe
                // src={grafanaUrl}
                src={`http://192.168.0.6:3000/d-solo/beniokcoo3thcc/efg?orgId=1&from=${from}&to=${to}&var-liveId=${liveId}&theme=light&panelId=1`}
                width="500" 
                height="200" 
                frameborder="0"
              ></iframe>
              <iframe 
                src={`http://192.168.0.6:3000/d-solo/beniokcoo3thcc/efg?orgId=1&from=${from}&to=${to}&var-itemId=${itemId}&theme=light&panelId=6`} 
                width="1000" 
                height="300" 
                frameborder="0"
              ></iframe>
              
            </Box>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
