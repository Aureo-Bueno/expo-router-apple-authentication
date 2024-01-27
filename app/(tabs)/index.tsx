import { Text, View } from '@/components/Themed';
import { styles } from './styles';

export default function TabHomeScreen() {
  const { container, separator, title } = styles;
  return (
    <View style={container}>
      <Text style={title}>Tab One</Text>
      <View style={separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

