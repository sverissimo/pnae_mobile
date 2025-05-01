import { useState, useEffect, useContext, useCallback } from "react";
import * as Location from "expo-location";
import { LocationContext } from "@contexts/index";
import { Linking } from "react-native";
import { locationObjToText } from "@shared/utils";

async function getCurrentPositionWithTimeout(
  options: Location.LocationOptions = {},
  timeoutMs = 10000
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

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!isMounted) return;

        setLocationPermission(status);
        if (status === Location.PermissionStatus.GRANTED && !location) {
          const loc = await getCurrentPositionWithTimeout({}, 5000);

          if (!isMounted) return;
          setLocation(loc);
        }
      } catch (err) {
        console.log("-> Initial location fetch failed!!!", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const getLocationPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status);
    if (status !== Location.PermissionStatus.GRANTED) {
      Linking.openSettings();
    }
  }, []);

  const getUpdatedLocation = useCallback(async (): Promise<string> => {
    let status = locationPermission;

    if (status !== Location.PermissionStatus.GRANTED) {
      const res = await Location.requestForegroundPermissionsAsync();
      status = res.status;
      setLocationPermission(status);

      if (status !== Location.PermissionStatus.GRANTED) {
        Linking.openSettings();
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
      console.log(
        "%%% getUpdatedLocation timeout/error, falling back to last known:",
        err
      );
      return locationObjToText(location);
    }
  }, [locationPermission, location]);

  return {
    location,
    locationPermission,
    getLocationPermission,
    getLocation: () => locationObjToText(location),
    getUpdatedLocation,
  };
}
