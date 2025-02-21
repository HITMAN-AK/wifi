import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import WifiManager from "react-native-wifi-reborn";
import { Camera } from "expo-camera";

export default function App() {
  const [ipAddress, setIpAddress] = useState(null);
  const [wifiStatus, setWifiStatus] = useState(null);
  const [wifiStrength, setWifiStrength] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const cameraRef = useRef(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const fetchWifiInfo = () => {
    NetInfo.fetch().then((state) => {
      setWifiStatus(state.type === "wifi" ? "Connected to WiFi" : "Not Connected to WiFi");

      if (state.details.ipAddress) {
        setIpAddress(state.details.ipAddress);
      } else {
        setIpAddress("Unknown");
      }
    });

    WifiManager.getCurrentSignalStrength()
      .then((strength) => {
        setWifiStrength(strength);
      })
      .catch((error) => {
        console.error("Error getting WiFi signal strength:", error);
        setWifiStrength("Unknown");
      });
  };

  const toggleCamera = () => {
    setCameraVisible(!cameraVisible);
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={[styles.container, { padding: 20 }]}>
      <Button title="Check WiFi Info" onPress={fetchWifiInfo} />
      {ipAddress && <Text style={styles.text}>IP Address: {ipAddress}</Text>}
      {wifiStatus && <Text style={styles.text}>WiFi Status: {wifiStatus}</Text>}
      {wifiStrength !== null && <Text style={styles.text}>WiFi Strength: {wifiStrength} dBm</Text>}

      <Button title={cameraVisible ? "Close Camera" : "Open Front Camera"} onPress={toggleCamera} />

      {cameraVisible && (
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
        >
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                setCameraType(
                  cameraType === Camera.Constants.Type.front
                    ? Camera.Constants.Type.back
                    : Camera.Constants.Type.front
                );
              }}
            >
              <Text style={styles.cameraButtonText}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
    height: 300,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    margin: 20,
  },
  cameraButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  cameraButtonText: {
    fontSize: 14,
    color: "#000",
  },
});