//write a rn component that takes in a picture and text and displays side by side it in a list item
import { CustomButton } from "components/atoms/CustomButton";
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text } from "react-native-paper";

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
        <CustomButton label={text} onPress={onPress} icon={icon} />
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
