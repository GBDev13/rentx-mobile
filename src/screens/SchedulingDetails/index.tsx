import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import { Feather } from '@expo/vector-icons';

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
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal
} from './styles';
import { Button } from '../../components/Button';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { format, parseISO } from 'date-fns';
import { api } from '../../service/api';
import { Alert } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

interface Params {
  car: CarDTO;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string;
}

interface NavigationProps{
  navigate:(
    screen: string,
    props?: {
      nextScreenRoute: string;
      title: string;
      message: string;
    }
  ) => void;
  goBack: () => void;
}

export function SchedulingDetails(){
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);

  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const netInfo = useNetInfo();

  const { car, dates } = route.params as Params;

  const rentTotal = Number(dates.length * car.price);

  async function handleConfirmScheduling() {
    try {
      setLoading(true);

      await api.post("rentals", {
        user_id: 1,
        car_id: car.id,
        start_date: parseISO(dates[0]),
        end_date: parseISO(dates[dates.length - 1]),
        total: rentTotal
      });
      
      navigation.navigate("Confirmation", {
        nextScreenRoute: 'Home',
        title: 'Carro alugado!',
        message: 'Agora você só precisa ir\naté a concessionária da RENTX'
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível confimar o agendamento")
    } finally {
      setLoading(false);
    }
  };

  function handleGoBack() {
    navigation.goBack();
  };

  useEffect(() => {
    setRentalPeriod({
      start: format(parseISO(dates[0]), 'dd/MM/yyy'),
      end: format(parseISO(dates[dates.length - 1]), 'dd/MM/yyy')
    })
  }, [dates])

  useEffect(() => {
    async function fetchCarsUpdated() {
      const response = await api.get(`/cars/${car.id}`);
      setCarUpdated(response.data);
    }

    if(netInfo.isConnected === true) fetchCarsUpdated();
  }, [netInfo.isConnected]);

  return (
    <Container>
      <Header>
        <BackButton onPress={handleGoBack}/>
      </Header>

      <CarImages>
        <ImageSlider imagesUrl={
          !!carUpdated.photos ?
          carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
        }/>
      </CarImages>
    
      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
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

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(15)}
            color={theme.colors.text}
          />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>
      
        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>R$ {car.price} x{dates.length} diárias</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button
          title="Alugar agora"
          color={theme.colors.success}
          onPress={handleConfirmScheduling}
          loading={loading}
        />
      </Footer>
    </Container>
  );
}