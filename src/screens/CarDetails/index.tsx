import React, { useEffect, useState } from 'react';
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
  Footer,
  OfflineInfo
} from './styles';
import { Button } from '../../components/Button';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { StatusBar } from 'react-native';
import { Car as ModelCar } from '../../database/model/Car';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../service/api';
import { useNetInfo } from '@react-native-community/netinfo';

interface Params {
  car: ModelCar;
}

interface NavigationProps{
  navigate:(
    screen: string,
    carObject?:{
      car: ModelCar
    }
  ) => void;
  goBack: () => void;
}

export function CarDetails() {
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);

  const netInfo = useNetInfo();
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

  useEffect(() => {
    async function fetchCarsUpdated() {
      const response = await api.get(`/cars/${car.id}`);
      setCarUpdated(response.data);
    }

    if(netInfo.isConnected === true) fetchCarsUpdated();
  }, [netInfo.isConnected]);
  
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
          <ImageSlider imagesUrl={
            !!carUpdated.photos ?
            carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
          }/>
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
            <Period>{car.period}</Period>
            <Price>R$ {netInfo.isConnected === true ? car.price : '...'}</Price>
          </Rent>
        </Details>

        {
          carUpdated.accessories &&
          <Accessories>
            {
              carUpdated.accessories.map(accessory => (
                <Accessory
                  key={accessory.type}
                  name={accessory.name}
                  icon={getAccessoryIcon(accessory.type)}
                />
              ))
            }
          </Accessories>
        }

        <About>
          {car.about}
        </About>
      </Content>

      <Footer>
        <Button
          title="Escolher período do aluguel"
          onPress={handleConfirmRental}
          enabled={netInfo.isConnected === true}
        />

        {
          netInfo.isConnected === false &&
          <OfflineInfo>
            Conecte-se a Internet para ver mais detalhes e agendar seu carro
          </OfflineInfo>
        }
      </Footer>
    </Container>
  );
}