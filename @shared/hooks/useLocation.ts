import { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import { LocationContext } from "@contexts/index";
import { Linking } from "react-native";

export function useLocation() {
  const { location, setLocation } = useContext(LocationContext);
  const [locationPermission, setLocationPermission] = useState<string>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status);

    if (status !== "granted") {
      Linking.openSettings();
      return;
    }
  };

  const updateLocation = async () => {
    try {
      if (locationPermission === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        return location;
      }
    } catch (error) {
      console.error("🚀 useLocation.ts:39:", error);
      return null;
    }
  };

  return {
    location,
    locationPermission,
    getLocationPermission,
    updateLocation,
  };
}
