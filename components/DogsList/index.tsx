import { useQuery } from "@apollo/client";
import { GET_DOGS_QUERY } from "./graphql";
import { styles } from "@/app/(tabs)/styles";
import { Text, View } from "../Themed";
import { ActivityIndicator, Button, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";

export function DogsList() {
  const { loading, error, data } = useQuery(GET_DOGS_QUERY);
  const { navigate }  = useNavigation();

  const { separator, container } = styles;

  // if (error) return <Text>{`Error to list: ${error.message}`}</Text>;
  console.log(data);

  return (
    <View style={container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <Button title="Reload" onPress={() => navigate('DogsDescription')} />
      <FlatList
        data={data?.dogs}
        renderItem={({ item }) => (
          <View style={separator}>
            <TouchableOpacity onPress={() => navigate}>
              <Text>{item.id}</Text>
              <Text>{item.name}</Text>
              <Text>{item.breed}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
