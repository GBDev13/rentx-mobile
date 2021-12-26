import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../hooks/auth';

const options = ['Dados', 'Trocar senha'];

export function Profile(){
  const [option, setOption] = useState(options[0]);

  const { user } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();

  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);

  function handleBack() {
    navigation.goBack();
  };

  function handleSignOut() {

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
                  onPress={() => setOption(item)}
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
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}