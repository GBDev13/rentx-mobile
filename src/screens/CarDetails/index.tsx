import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import SpeedSvg from '../../assets/speed.svg'; 
import AccelerationSvg from '../../assets/acceleration.svg'; 
import ForceSvg from '../../assets/force.svg'; 
import GasolineSvg from '../../assets/gasoline.svg'; 
import ExchangeSvg from '../../assets/exchange.svg'; 
import PeopleSvg from '../../assets/people.svg'; 

import {
  Container,
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

export function CarDetails() {
  const navigation = useNavigation<any>();

  function handleConfirmRental() {
    navigation.navigate('Scheduling');
  };

  function handleGoBack() {
    navigation.navigate('Home');
  };
  
  return (
    <Container>
      <Header>
        <BackButton onPress={handleGoBack}/>
      </Header>

      <CarImages>
        <ImageSlider imagesUrl={["https://production.autoforce.com/uploads/version/profile_image/5505/comprar-prestige-plus-40-tfsi-s-tronic_7243435b0b.png"]}/>
      </CarImages>
    
      <Content>
        <Details>
          <Description>
            <Brand>Lanborghini</Brand>
            <Name>Huracan</Name>
          </Description>

          <Rent>
            <Period>Ao dia</Period>
            <Price>R$ 580</Price>
          </Rent>
        </Details>

        <Accessories>
          <Accessory name="380Km/h" icon={SpeedSvg}/>
          <Accessory name="3.2s" icon={AccelerationSvg}/>
          <Accessory name="800 HP" icon={ForceSvg}/>
          <Accessory name="Gasolina" icon={GasolineSvg}/>
          <Accessory name="Auto" icon={ExchangeSvg}/>
          <Accessory name="2 pessoas" icon={PeopleSvg}/>
        </Accessories>

        <About>
          Este é automóvel desportivo. Surgiu do lendário touro de lide indultado na praça Real Maestranza de Sevilla. É um belíssimo carro para quem gosta de acelerar.
        </About>
      </Content>

      <Footer>
        <Button title="Escolher período do aluguel" onPress={handleConfirmRental} />
      </Footer>
    </Container>
  );
}