// src/screens/HomeScreen/components/Card.tsx
import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Icon } from "../atoms";
import { globalColors } from "../../constants/themes";

const { primary, grayscale } = globalColors;

type CardProps = {
  title: string;
  iconName: string;
  onPress: () => void;
};

export const Card: React.FC<CardProps> = ({ title, iconName, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Icon iconName={iconName} color={grayscale[700]} />
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 5,
  },
  card: {
    paddingHorizontal: 3,
    height: 150,
    width: 150,
    borderWidth: 0.9,
    borderColor: grayscale[200],
    borderRadius: 8,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: globalColors.background2,
    elevation: 2,
  },
  title: {
    marginTop: 10,
    fontSize: 15,
    color: globalColors.text,
    textAlign: "center",
  },
});
