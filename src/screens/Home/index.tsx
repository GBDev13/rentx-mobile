import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BackHandler, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';

import { PanGestureHandler } from 'react-native-gesture-handler';

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';

import {
  CarList,
  Container,
  Header,
  HeaderContent,
  TotalCars,
  MyCarsButtonWrapper,
  MyCarsButtonAnimated
} from './styles';
import { api } from '../../service/api';
import { CarDTO } from '../../dtos/CarDTO';
import { useTheme } from 'styled-components';
import { LoadAnimation } from '../../components/LoadAnimation';

interface NavigationProps{
  navigate:(
    screen: string,
    carObject?:{
      car: CarDTO
    }
  ) => void
}

export function Home() {
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const myCarsbuttonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
    ]
  }));

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: any) {
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value;
    },
    onActive(event, ctx: any) {
      positionX.value = ctx.positionX + event.translationX;
      positionY.value = ctx.positionY + event.translationY;
    },
    onEnd() {
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    }
  });

  const navigation = useNavigation<NavigationProps>();

  const theme = useTheme();

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car });
  };

  function handleOpenMyCars() {
    navigation.navigate('MyCars');
  };

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const { data } = await api.get("/cars");
    
        setCars(data);
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true
    );
    return () => backHandler.remove();
  });

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)}
            height={RFValue(12)}
          />

          {!loading && (
            <TotalCars>
              Total de {cars?.length} carros
            </TotalCars>
          )}
        </HeaderContent>
      </Header>

      {loading ? <LoadAnimation /> : (
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Car data={item} onPress={() => handleCarDetails(item)}/>}
        />
      )}
      
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <MyCarsButtonWrapper style={myCarsbuttonStyle}>
          <MyCarsButtonAnimated onPress={handleOpenMyCars}>
            <Ionicons
              color={theme.colors.shape}
              size={32}
              name="ios-car-sport"
            />
          </MyCarsButtonAnimated>
        </MyCarsButtonWrapper>
      </PanGestureHandler>
    </Container>
  );
}