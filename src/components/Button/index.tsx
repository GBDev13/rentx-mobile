import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

import {
  Container,
  Title
} from './styles';

interface Props {
  title: string;
  color?: string;
  onPress: () => void;
  enabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  color,
  onPress,
  enabled = true,
  loading,
  ...rest
}: Props) { 
  const theme = useTheme();

  return (
    <Container
      color={color ?? theme.colors.main}
      onPress={onPress}
      enabled={enabled && !loading}
      {...rest}
    >
      {loading ? <ActivityIndicator color={theme.colors.shape} size="small"/> : <Title>{title}</Title>}
    </Container>
  );
}