import { Text, View } from '@/components/Themed';
import { styles } from './styles';
import { LocationsList } from '@/components/LocationsList';

export default function TabLocationsScreen() {
  const { container, separator, title } = styles;

  return (
    <View style={container}>
      <Text style={title}>List Locations</Text>
      <View style={separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <LocationsList />
    </View>
  );
}

