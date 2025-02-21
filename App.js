import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import WifiManager from "react-native-wifi-reborn";

export default function App() {
  const [ipAddress, setIpAddress] = useState(null);
  const [wifiStatus, setWifiStatus] = useState(null);
  const [wifiStrength, setWifiStrength] = useState(null);

  const fetchWifiInfo = () => {
    // Get the IP Address and WiFi status
    NetInfo.fetch().then((state) => {
      setWifiStatus(state.type === "wifi" ? "Connected to WiFi" : "Not Connected to WiFi");

      if (state.details.ipAddress) {
        setIpAddress(state.details.ipAddress);
      } else {
        setIpAddress("Unknown");
      }
    });

    // Get the WiFi signal strength
    WifiManager.getCurrentSignalStrength().then((strength) => {
      setWifiStrength(strength);
    }).catch((error) => {
      console.error("Error getting WiFi signal strength:", error);
      setWifiStrength("Unknown");
    });
  };

  return (
    <View style={[styles.container, { padding: 20 }]}>
      <Button title="Check WiFi Info" onPress={fetchWifiInfo} />
      {ipAddress && <Text style={styles.text}>IP Address: {ipAddress}</Text>}
      {wifiStatus && <Text style={styles.text}>WiFi Status: {wifiStatus}</Text>}
      {wifiStrength !== null && <Text style={styles.text}>WiFi Strength: {wifiStrength} dBm</Text>}
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
});