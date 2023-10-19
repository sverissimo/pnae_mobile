import { useContext } from "react";
import { SnackBarContext, SnackBarStateProps } from "@contexts/SnackbarContext";
import { globalColors } from "@constants/themes";

export const useSnackBar = () => {
  const { snackBarOptions, setSnackBarOptions } = useContext(SnackBarContext);
  const editSnackBarOptions = (options: Partial<SnackBarStateProps>) => {
    const color =
      options.status === "success"
        ? globalColors.primary[300]
        : options.status === "error"
        ? "red"
        : options.status === "warning"
        ? "darkorange"
        : options.status === "info"
        ? "blue"
        : globalColors.primary[400];

    options.color = options.color ?? color;
    setSnackBarOptions({
      ...snackBarOptions,
      ...options,
      visible: true,
    });
  };

  return { setSnackBarOptions: editSnackBarOptions };
};
