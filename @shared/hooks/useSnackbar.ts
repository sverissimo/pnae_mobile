import { globalColors } from "@shared/constants/themes";
import { useState } from "react";

export type SnackBarStateProps = {
  visible: boolean;
  message: string;
  status?: "success" | "error" | "warning" | "info";
  duration?: number;
  color?: string;
};
const intialState = {
  visible: false,
  message: "",
  duration: 3000,
  color: globalColors.secondary[500],
};

export const useSnackBar = () => {
  const [snackBarOptions, setSnackBarOptions] =
    useState<SnackBarStateProps>(intialState);

  const editSnackBarOptions = (options: Partial<SnackBarStateProps>) => {
    const color =
      options.status === "success"
        ? globalColors.primary[300]
        : options.status === "error"
        ? "red"
        : options.status === "warning"
        ? "orange"
        : options.status === "info"
        ? "blue"
        : globalColors.secondary[500];

    options.color = options.color ?? color;
    setSnackBarOptions({ ...snackBarOptions, ...options, visible: true });
  };

  const hideSnackBar = () => {
    setSnackBarOptions((options) => ({ ...intialState, color: options.color }));
  };

  return {
    snackBarOptions,
    hideSnackBar,
    setSnackBarOptions: editSnackBarOptions,
  };
};
