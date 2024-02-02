import { Text, View } from '@/components/Themed';
import { styles } from './styles';
import { DogDescription } from '@/components/DogsList/DogDescription';
import { DogsList } from '@/components/DogsList';

export default function TabLocationsScreen() {
  const { container, separator, title } = styles;

  return (
    <View style={container}>
      <Text style={title}>List Dogs Types</Text>
      <View style={separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <DogsList />
    </View>
  );
}
