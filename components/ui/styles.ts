import { StyleSheet } from 'react-native';

export const uiStyles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    borderWidth: 1,
    padding: 28,
  },
  section: {
    gap: 12,
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rule: {
    width: 24,
    height: 2,
    borderRadius: 1,
  },
  divider: {
    height: 1,
  },
  status: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 2,
  },
});
