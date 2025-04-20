import { useState, useEffect, useContext, useLayoutEffect } from "react";
import * as Location from "expo-location";
import { LocationContext } from "@contexts/index";
import { Linking } from "react-native";
import { locationObjToText } from "@shared/utils";

async function getCurrentPositionWithTimeout(
  options: Location.LocationOptions = {},
  timeoutMs = 5000
): Promise<Location.LocationObject> {
  return Promise.race([
    Location.getCurrentPositionAsync(options),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Location request timed out")),
        timeoutMs
      )
    ),
  ]);
}

export function useLocation() {
  const { location, setLocation } = useContext(LocationContext);
  const [locationPermission, setLocationPermission] = useState<string>();

  // 1) Just request permission once (doesn't wait on GPS)
  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => setLocationPermission(status))
      .catch(console.error);
  }, []);

  // useLayoutEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     setLocationPermission(status);
  //     if (status === "granted") {
  //       console.log(
  //         "🚀 - useLocation.ts:12: status === granted, getting location..."
  //       );
  //       const location = await Location.getCurrentPositionAsync({});
  //       setLocation(location);
  //       console.log("🚀 - location:", location);
  //     }
  //   })();
  // }, []);

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status);

    if (status !== "granted") {
      Linking.openSettings();
      return;
    }
  };

  // 3) On‑demand GPS fetch that won’t hang forever
  async function getUpdatedLocation(): Promise<string> {
    if (locationPermission !== Location.PermissionStatus.GRANTED) {
      await getLocationPermission();
      if (locationPermission !== Location.PermissionStatus.GRANTED) {
        throw new Error("Location permission denied");
      }
    }

    try {
      const loc = await getCurrentPositionWithTimeout(
        { accuracy: Location.Accuracy.Highest },
        5000
      );
      setLocation(loc);
      return locationObjToText(loc);
    } catch (err) {
      console.warn(
        "useLocation#getUpdatedLocation failed, using last known:",
        err
      );
      return locationObjToText(location);
    }
  }

  // async function getUpdatedLocation(): Promise<string> {
  //   const updatedLocation = await updateLocation();
  //   const locationObj = updatedLocation ?? location;
  //   return locationObjToText(locationObj);
  // }

  // const updateLocation = async () => {
  //   try {
  //     if (locationPermission === "granted") {
  //       const location = await Location.getCurrentPositionAsync({});
  //       setLocation(location);
  //       return location;
  //     }
  //   } catch (error) {
  //     console.error("🚀 useLocation.ts:39:", error);
  //     return null;
  //   }
  // };

  return {
    location,
    locationPermission,
    getLocationPermission,
    getLocation: () => locationObjToText(location),
    getUpdatedLocation,
  };
}
