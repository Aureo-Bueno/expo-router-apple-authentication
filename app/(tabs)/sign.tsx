import { View } from "@/components/Themed";
import { styles } from "./styles";
import * as AppleAuthentication from "expo-apple-authentication";

export default function TabSignScreen() {
  const { container } = styles;

  const handleSignIn = async () => {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log(credentials);
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <View style={container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 44 }}
        onPress={handleSignIn}
      />
    </View>
  );
}
