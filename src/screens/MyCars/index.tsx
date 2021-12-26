import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { api } from '../../service/api';
import { useIsFocused, useNavigation } from '@react-navigation/native';
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
import { Car as ModelCar } from '../../database/model/Car';
import { format, parseISO } from 'date-fns';

interface DataProps {
  id: string;
  car: ModelCar;
  start_date: string;
  end_date: string;
}

export function MyCars() {
  const [cars, setCars] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const screenIsFocus = useIsFocused();

  const navigation = useNavigation<any>();

  const theme = useTheme();

  function handleGoBack() {
    navigation.goBack();
  };

  useEffect(() => {
    async function fetchMyCars() {
      try {
        setLoading(true);
        const { data } = await api.get('/rentals');
        const dataFormatted = data.map((item: DataProps) => ({
          ...item,
          start_date: format(parseISO(item.start_date), 'dd/MM/yyy'),
          end_date: format(parseISO(item.end_date), 'dd/MM/yyy')
        }));

        setCars(dataFormatted);

      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    }

    fetchMyCars();
  }, [screenIsFocus])

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
                    <CarFooterDate>{item.start_date}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.end_date}</CarFooterDate>
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