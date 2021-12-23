import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import {
  Container,
  HeaderWrapper,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer
} from './styles';
import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { StatusBar } from 'react-native';

interface Params {
  car: CarDTO;
}

interface NavigationProps{
  navigate:(
    screen: string,
    carObject?:{
      car: CarDTO
    }
  ) => void;
  goBack: () => void;
}

export function CarDetails() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();

  const { car } = route.params as Params;

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyleAnimation = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, 200],
      [200, 70],
      Extrapolate.CLAMP
    )
  }));

  const sliderCarsStyleAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, 150],
      [1, 0],
      Extrapolate.CLAMP
    )
  }));

  function handleConfirmRental() {
    navigation.navigate('Scheduling', { car });
  };

  function handleGoBack() {
    navigation.goBack();
  };
  
  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      
      <HeaderWrapper style={headerStyleAnimation}>
        <Header>
          <BackButton onPress={handleGoBack} />
        </Header>

        <CarImages style={sliderCarsStyleAnimation}>
          <ImageSlider imagesUrl={car.photos}/>
        </CarImages>
      </HeaderWrapper>
    
      <Content
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.rent.period}</Period>
            <Price>R$ {car.rent.price}</Price>
          </Rent>
        </Details>

        <Accessories>
          {
            car.accessories.map(accessory => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))
          }
        </Accessories>

        <About>
          {car.about}
          {car.about}
          {car.about}
          {car.about}
          {car.about}
        </About>
      </Content>

      <Footer>
        <Button title="Escolher período do aluguel" onPress={handleConfirmRental} />
      </Footer>
    </Container>
  );
}