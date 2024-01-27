import { Text, View } from '@/components/Themed';
import { ILocations } from '../types';
import { Image } from 'react-native';

export function RenderLocations({ id, description, name, photo }: ILocations) {
  return (
    <View>
      <Text key={id}>{`${name} - ${description}`}</Text>
      <Image source={{ uri: photo }} style={{ width: 300, height: 100, alignSelf: 'center' }} />
    </View>
  )
}
