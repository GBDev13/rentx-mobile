import { FlatList } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { Car as ModelCar } from "../../database/model/Car";

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

export const Container = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.colors.background_primary};
`;

export const Header = styled.View`
  width: 100%;
  height: 113px;

  background-color: ${({ theme }) => theme.colors.header};
  justify-content: flex-end;
  padding: 32px 24px;
`;

export const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TotalCars = styled.Text`
  font-size: ${RFValue(15)}px;
  font-family: ${({ theme }) => theme.fonts.primary_400};
  color: ${({ theme }) => theme.colors.text};
`;

export const CarList = styled(FlatList as new () => FlatList<ModelCar>).attrs({
  contentContainerStyle: {
    padding: 24,
  },
  showsVerticalScrollIndicator: false,
})``;

export const MyCarsButtonWrapper = styled(Animated.View)`
  position: absolute;
  right: 20px;
  bottom: 20px;
`;

export const MyCarsButtonAnimated = styled(ButtonAnimated)`
  width: 60px;
  height: 60px;
  border-radius: 30px;

  background-color: ${({ theme }) => theme.colors.main};

  align-items: center;
  justify-content: center;
`;
