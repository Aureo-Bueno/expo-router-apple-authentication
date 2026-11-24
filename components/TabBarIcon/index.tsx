import { FontAwesome } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';
import { useAppTheme } from '@/theme';

export default function TabBarIcon({
  color,
  ...props
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: ColorValue;
}) {
  const theme = useAppTheme();
  const iconColor = typeof color === 'number' ? undefined : (color ?? undefined);

  return <FontAwesome size={theme.layout.tabIconSize} color={iconColor} {...props} />;
}
