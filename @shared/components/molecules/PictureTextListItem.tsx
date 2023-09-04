import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { CustomButton } from "../atoms";

type PictureTextListItemProps = {
  pictureURI: string;
  text: string;
  icon: string;
  onPress: () => void;
};

export const PictureTextListItem = ({
  pictureURI,
  text,
  icon,
  onPress,
}: PictureTextListItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.pictureContainer}>
        <Image source={{ uri: pictureURI }} style={styles.picture} />
      </View>
      <View style={styles.textContainer}>
        <CustomButton label={text} onPress={onPress} icon={icon} mode="text" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "5%",
    backgroundColor: "white",
  },
  pictureContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: "2%",
  },
  picture: {
    width: 80,
    height: 80,
  },
  textContainer: {
    flex: 3,
    alignItems: "center",
  },
});
