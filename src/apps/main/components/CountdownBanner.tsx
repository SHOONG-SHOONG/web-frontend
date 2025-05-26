import { useEffect, useState } from "react";
import { Box, Flex, Text, Title, Group } from "@mantine/core";
import React from "react";

function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const endTime = new Date("2025-05-27T10:59:00+09:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(
        2,
        "0"
      );
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(
        2,
        "0"
      );
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <Box ta="center" py={40} mt={50}>
      <Title order={2}>48H 릴레이 특가</Title>
      <Text size="lg" mt={4} c="dimmed">
        시간 한정 특가 캠핑 의자
      </Text>
      <Text size="sm" mt={4}>
        06.17 (수) 11:00 ~ 06.18 (금) 10:59
      </Text>

      <Group mt={32} justify="center">
        <TimeBlock value={timeLeft.hours} label="HRS" />
        <TimeSeparator />
        <TimeBlock value={timeLeft.minutes} label="MIN" />
        <TimeSeparator />
        <TimeBlock value={timeLeft.seconds} label="SEC" />
      </Group>
    </Box>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <Flex direction="column" align="center">
      <Text fz={48} fw={700}>
        {value}
      </Text>
      <Text size="xs" c="dimmed" mt={-4}>
        {label}
      </Text>
    </Flex>
  );
}

function TimeSeparator() {
  return (
    <Text fz={40} fw={500} mt={-8}>
      :
    </Text>
  );
}

export default CountdownBanner;
