import { Ionicons, FontAwesome } from "@expo/vector-icons/";

type IconProps = {
  iconName: string;
  color?: string;
  size?: number;
  iconStyle?: any;
  backgroundColor?: string;
  borderRadius?: number;
  onPress?: any;
};

export const Icon = (props: IconProps) => {
  const { iconName } = props;
  const defaultSize = 36;
  const defaultColor = "#000";
  return iconName === "person" ||
    iconName === "document-text" ||
    iconName === "home" ||
    iconName === "send" ||
    iconName === "chevron-up" ||
    iconName === "chevron-down" ? (
    <Ionicons
      name={iconName}
      size={defaultSize}
      color={defaultColor}
      {...props}
    />
  ) : iconName === "building" ||
    iconName === "pencil" ||
    iconName === "pencil-square-o" ? (
    <FontAwesome
      name={iconName}
      size={defaultSize}
      color={defaultColor}
      {...props}
    />
  ) : (
    <></>
  );
};
