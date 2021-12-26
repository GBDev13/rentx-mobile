import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';

import {
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
import { database } from '../../database';
import { Car as ModelCar } from '../../database/model/Car';

interface NavigationProps{
  navigate:(
    screen: string,
    carObject?:{
      car: ModelCar
    }
  ) => void
}

export function Home() {
  const [cars, setCars] = useState<ModelCar[]>([]);
  const [loading, setLoading] = useState(true);

  const netInfo = useNetInfo();

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

  function handleCarDetails(car: ModelCar) {
    navigation.navigate('CarDetails', { car });
  };

  function handleOpenMyCars() {
    navigation.navigate('MyCars');
  };

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api.
        get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
        const { changes, latestVersion } = response.data;
        console.log(response.data);
        return { changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        if (user.updated.length > 0) {
          try {
            await api.post('/users/sync', user)
          } catch (err) {
            console.log('push', err);
          }
        }
      }
    });
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchCars() {
      try {
        setLoading(true);
        
        const carCollection = database.get<ModelCar>('cars');
        const cars = await carCollection.query().fetch();

        if (isMounted) {
          setCars(cars);
        }
    
      } catch (err) {
        console.log(err)
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCars();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if(netInfo.isConnected === true) {
      offlineSynchronize();
    }
  }, [netInfo.isConnected]);

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
      
      {/* <PanGestureHandler onGestureEvent={onGestureEvent}>
        <MyCarsButtonWrapper style={myCarsbuttonStyle}>
          <MyCarsButtonAnimated onPress={handleOpenMyCars}>
            <Ionicons
              color={theme.colors.shape}
              size={32}
              name="ios-car-sport"
            />
          </MyCarsButtonAnimated>
        </MyCarsButtonWrapper>
      </PanGestureHandler> */}
    </Container>
  );
}