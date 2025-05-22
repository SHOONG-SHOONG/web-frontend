import React, { useState } from "react";
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFileAnalytics,
  IconFingerprint,
  IconKey,
  IconLicense,
  IconLogout,
  IconMessage2,
  IconMessages,
  IconReceipt2,
  IconReceiptRefund,
  IconSettings,
  IconShoppingCart,
  IconSwitchHorizontal,
  IconUsers,
} from "@tabler/icons-react";
import { SegmentedControl, Box, Image } from "@mantine/core";
import { Link } from "react-router-dom";
import classes from "./AdminNavBar.module.css";
import shoongImage from "../assets/shoong2.png";

const tabs = {
  general: [
    { link: "", label: "Orders", icon: IconShoppingCart },
    { link: "", label: "Receipts", icon: IconLicense },
    { link: "", label: "Reviews", icon: IconMessage2 },
    { link: "", label: "Messages", icon: IconMessages },
    { link: "", label: "Customers", icon: IconUsers },
    { link: "", label: "Refunds", icon: IconReceiptRefund },
    { link: "", label: "Files", icon: IconFileAnalytics },
  ],
  account: [
    { link: "", label: "상품 관리", icon: IconBellRinging },
    { link: "", label: "라이브쇼 관리", icon: IconReceipt2 },
    { link: "", label: "계정 관리", icon: IconFingerprint },
    // { link: "", label: "SSH Keys", icon: IconKey },
    // { link: "", label: "Databases", icon: IconDatabaseImport },
    // { link: "", label: "Authentication", icon: Icon2fa },
    // { link: "", label: "Other Settings", icon: IconSettings },
  ],
};

export default function AdminNavBarPage() {
  const [section, setSection] = useState<"account" | "general">("account");
  const [active, setActive] = useState("Billing");

  const links = tabs[section].map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div>
        {/* 로고 */}
        <Box w={520} mt={5}>
          <Link to="/">
            <Image src={shoongImage} w={90} />{" "}
          </Link>
          {/* <Text fw={900} size="lg" c="blue">
                    Shoong
                  </Text> */}
        </Box>

        <SegmentedControl
          value={section}
          onChange={(value: any) => setSection(value)}
          transitionTimingFunction="ease"
          fullWidth
          data={[
            { label: "Account", value: "account" },
            { label: "System", value: "general" },
          ]}
        />
      </div>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
