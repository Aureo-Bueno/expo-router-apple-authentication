import { Button } from "react-native";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { styles } from "./styles";

export default function TabAboutScreen() {
  const { container, separator, title } = styles;

  return (
    <View style={container}>
      <Text style={title}>Tab About</Text>
      <View
        style={separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Link href="/modal" asChild>
        <Button title="Modal" />
      </Link>
    </View>
  );
}
