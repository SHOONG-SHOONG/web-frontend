import React from "react";
import { Text, Flex, Box, Anchor } from "@mantine/core";

function TitleComponent({
  label,
  subLabel,
  onClick,
}: {
  label: string;
  subLabel: string;
  onClick?: () => void;
}) {
  return (
    <Box mt={30} mb={20}>
      {subLabel && (
        <Text size="sm" color="gray" mb={6}>
          {subLabel}
        </Text>
      )}
      <Flex
        align="center"
        gap={6}
        style={{ fontSize: "32px", fontWeight: 700 }}
      >
        {label}
        {onClick && (
          <Text
            onClick={onClick}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              fontWeight: 400,
              marginLeft: "6px",
            }}
          >
            &gt;
          </Text>
        )}
      </Flex>
    </Box>
  );
}
export default TitleComponent;
