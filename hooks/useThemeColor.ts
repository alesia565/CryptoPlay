import { useColorScheme } from 'react-native';

type ColorProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  props: ColorProps,
  colorName: string
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    const fallbackColors = {
      text: {
        light: '#000',
        dark: '#fff',
      },
      background: {
        light: '#fff',
        dark: '#000',
      },
    };
    return fallbackColors[colorName as keyof typeof fallbackColors]?.[theme] ?? '#000';
  }
}