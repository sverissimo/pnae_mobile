// src/screens/HomeScreen/components/Card.tsx
import React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import { Icon } from "./Icon";

type CardProps = {
  title: string;
  iconName: string;
  onPress: () => void;
};

export const Card: React.FC<CardProps> = ({ title, iconName, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Icon iconName={iconName} color="#fff" />
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {},
  card: {
    height: 200,
    width: 150,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "#fff",
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: "#fff",
  },
});
