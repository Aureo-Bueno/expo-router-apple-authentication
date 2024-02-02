import { useQuery } from "@apollo/client";
import { ActivityIndicator, FlatList, Text } from "react-native";
import { View } from "../../Themed";
import { styles } from "@/app/(tabs)/styles";
import { GET_DOG_QUERY } from "./graphql";
import { usePathname } from "expo-router";

export interface DogDescriptionProps {
  dogId: string;
}

export function DogDescription({ dogId }: DogDescriptionProps) {
  const { loading, error, data } = useQuery(GET_DOG_QUERY, {
    variables:
      { id: dogId }
  });
  const pathname = usePathname();
  console.log(pathname);

  const { separator } = styles;

  if (error) return <Text>{`Error to list: ${error.message}`}</Text>;

  return (
    <View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {data && data.dog && (
        <View style={separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)">
          <Text>{data.dog.id}</Text>
          <Text>{data.dog.name}</Text>
          <Text>{data.dog.breed}</Text>
        </View>
      )}
    </View>
  );
}
