import { useQuery } from "@apollo/client";
import { ActivityIndicator, FlatList, Text } from "react-native";
import { GET_LOCATIONS } from "./graphql";
import { RenderLocations } from "./RenderLocations";
import { View } from "../Themed";
import { styles } from "@/app/(tabs)/styles";

export function LocationsList() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);
  const { separator } = styles;

  if (error) return <Text>{`Error to list: ${error.message}`}</Text>;

  return (
    <>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <FlatList
        data={data?.locations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <RenderLocations {...item} />}
        ItemSeparatorComponent={() => <View style={separator} />}
      />
    </>
  );
}
