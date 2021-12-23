import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../service/api';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsQuantity,
  AppointmentsTitle,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,

} from './styles';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

interface CarProps {
  car: CarDTO;
  user_id: string;
  id: string;
  startDate: string;
  endDate: string;
}

export function MyCars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();

  const theme = useTheme();

  function handleGoBack() {
    navigation.goBack();
  };

  useEffect(() => {
    async function fetchMyCars() {
      try {
        setLoading(true);
        const { data } = await api.get('/schedules_byuser?user_id=1');
        setCars(data);

      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    }

    fetchMyCars();
  }, [])

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <Header>
        <BackButton
          onPress={handleGoBack}
          color={theme.colors.shape}
        />

        <Title>
        Seus agendamentos,{'\n'}
        estão aqui.
        </Title>

        <SubTitle>
          Conforto, segurança e praticidade.
        </SubTitle>
      </Header>

      <Content>
        <Appointments>
          <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
          <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
        </Appointments>

        {loading ? <LoadAnimation /> : (
          <FlatList
            data={cars}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car}/>
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
          />
        )}
      </Content>
    </Container>
  );
}