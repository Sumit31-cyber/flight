import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="searchAirport" />
      <Stack.Screen name="datePicker" />
      <Stack.Screen name="searchFlightScreen" />
      <Stack.Screen name="flightSeatSelection" />
    </Stack>
  );
}
