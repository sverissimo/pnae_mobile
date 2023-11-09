import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { LogoutComponent } from "../molecules";
import { Icon } from "../atoms";
import { globalColors } from "@constants/themes";
import { useManageConnection } from "@shared/hooks";

type HeaderButtonsProps = {
  isConnected?: boolean;
  onLogout: () => void;
};

export function HeaderButtons({ onLogout: logoutHandler }: HeaderButtonsProps) {
  const { isConnected } = useManageConnection();

  return (
    <View style={styles.container}>
      <View style={styles.wifiIcon}>
        <Icon
          iconName={isConnected ? "wifi" : "wifi-off"}
          size={24}
          color={globalColors.text}
        />
      </View>
      <LogoutComponent onLogout={logoutHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  wifiIcon: {
    marginRight: "6%",
  },
});
