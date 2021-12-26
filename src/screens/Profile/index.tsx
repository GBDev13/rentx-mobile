import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
  ProfileInput,
  ProfilePassInput
} from './styles';
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../hooks/auth';
import { Button } from '../../components/Button';
import { useNetInfo } from '@react-native-community/netinfo';

const options = ['Dados', 'Trocar senha'];

export function Profile(){
  const [option, setOption] = useState(options[0]);

  const { user, signOut, updateUser } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);

  function handleBack() {
    navigation.goBack();
  };

  async function handleAvatarSelect() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    });

    if (result.cancelled) return;

    if (result.uri) {
      setAvatar(result.uri);
    }
  };

  async function handleProfileUpdate() {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string()
        .required("CNH é obrigatória"),
        name: Yup.string()
        .required("Nome é obrigatório")
      });
      
      const data = { name, driverLicense };
      await schema.validate(data);

      await updateUser({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name,
        driver_license: driverLicense,
        avatar,
        token: user.token
      });

      Alert.alert("Perfil Atualizado");
    } catch (err) {
      console.log(err)
      if (err instanceof Yup.ValidationError) {
        Alert.alert("Opa", err.message);
      }
      Alert.alert("Não foi possível atualizar o perfil")
    }
  };

  async function handleSignOut() {
    Alert.alert(
      "Tem certeza?",
      "Se você sair, irá precisar de internet para conectar-se novamente.",
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: "Sair",
          onPress: () => signOut()
        }
      ]
      );
  }

  function handleOptionChange(op: string) {
    if(netInfo.isConnected === false && op === options[1]) {
      Alert.alert("Você está Offline", "Para mudar a senha, conecte-se a Internet");
    } else {
      setOption(op);
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={handleBack}/>
              <HeaderTitle>Editar Perfil</HeaderTitle>
            
              <LogoutButton onPress={handleSignOut}>
                <Feather name="power" size={24} color={theme.colors.shape}/>
              </LogoutButton>
            </HeaderTop>

            <PhotoContainer>
              {!!avatar && <Photo source={{ uri: avatar }}/>}
              <PhotoButton onPress={handleAvatarSelect}>
                <Feather
                  name="camera"
                  size={24}
                  color={theme.colors.shape}
                />
              </PhotoButton>
            </PhotoContainer>
          </Header>
        
          <Content style={{ marginBottom: useBottomTabBarHeight() }}>
            <Options>
              {options.map((item, index) => (
                <Option
                  key={index}
                  active={item === option}
                  onPress={() => handleOptionChange(item)}
                >
                  <OptionTitle active={item === option}>{item}</OptionTitle>
                </Option>
              ))}
            </Options>
          
            {option === options[0] && (
              <Section>
                <ProfileInput
                  iconName="user"
                  placeholder="Nome"
                  autoCorrect={false}
                  defaultValue={user.name}
                  onChangeText={setName}
                />
                <ProfileInput
                  iconName="mail"
                  editable={false}
                  defaultValue={user.email}
                />
                <ProfileInput
                  iconName="credit-card"
                  placeholder="CNH"
                  keyboardType="numeric"
                  defaultValue={user.driver_license}
                  onChangeText={setDriverLicense}
                />
              </Section>
            )}

            {option === options[1] && (
              <Section>
                <ProfilePassInput
                  iconName="lock"
                  placeholder="Senha atual"
                />
                <ProfilePassInput
                  iconName="lock"
                  placeholder="Nova atual"
                />
                <ProfilePassInput
                  iconName="lock"
                  placeholder="Repetir senha"
                />
              </Section>
            )}

            <Button
              title="Salvar alterações"
              onPress={handleProfileUpdate}
            />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}