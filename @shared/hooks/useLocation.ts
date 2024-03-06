import { useState, useEffect, useContext, useLayoutEffect } from "react";
import * as Location from "expo-location";
import { LocationContext } from "@contexts/index";
import { Linking } from "react-native";
import { locationObjToText } from "@shared/utils";

export function useLocation() {
  const { location, setLocation } = useContext(LocationContext);
  const [locationPermission, setLocationPermission] = useState<string>();

  useLayoutEffect(() => {
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

  function getLocation() {
    return locationObjToText(location);
  }

  async function getUpdatedLocation(): Promise<string> {
    const updatedLocation = await updateLocation();
    const locationObj = updatedLocation ?? location;
    return locationObjToText(locationObj);
  }

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
    getLocation,
    getUpdatedLocation,
  };
}
