import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons/";

type IconProps = {
  iconName: string;
  color?: string;
  size?: number;
  iconStyle?: any;
  backgroundColor?: string;
  borderRadius?: number;
  onPress?: any;
  disabled?: boolean | undefined;
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
    iconName === "trash" ||
    iconName === "search" ||
    iconName === "arrow-back" ||
    iconName === "chevron-down" ? (
    <Ionicons
      name={iconName}
      size={defaultSize}
      color={defaultColor}
      {...props}
    />
  ) : iconName === "building" ||
    iconName === "pencil" ||
    iconName === "file-pdf-o" ||
    iconName === "edit" ||
    iconName === "microphone" ||
    iconName === "pencil-square-o" ? (
    <FontAwesome
      name={iconName}
      size={defaultSize}
      color={defaultColor}
      {...props}
    />
  ) : iconName === "wifi" || iconName === "wifi-off" ? (
    <MaterialIcons
      name={iconName}
      size={defaultSize}
      color={defaultColor}
      {...props}
    />
  ) : (
    <></>
  );
};
