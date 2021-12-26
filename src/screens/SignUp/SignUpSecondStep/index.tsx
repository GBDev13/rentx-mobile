import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { api } from '../../../service/api';

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle,
  SignUpInput
} from './styles';

interface Params {
  user: {
    name: string;
    email: string;
    driverLicense: string;
  }
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

export function SignUpSecondStep(){
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const theme = useTheme();

  const { user } = route.params as Params;

  function handleBack() {
    navigation.goBack();
  };

  async function handleRegister() {
    if (!password.trim() || !passwordConfirm.trim()) {
      return Alert.alert("Informe a senha e a confirmação");
    }

    if (password !== passwordConfirm) {
      return Alert.alert("As senhas não são iguais");
    }
    
    try {
      await api.post("/users", {
        ...user,
        driver_license: user.driverLicense,
        password
      });
  
      navigation.navigate("Confirmation", {
        nextScreenRoute: 'SignIn',
        title: 'Conta criada!',
        message: 'Agora é só fazer login\ne aproveitar'
      });
    } catch (err) {
      Alert.alert("Opa", "Não foi possível cadastrar");
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack}/>

            <Steps>
              <Bullet active />
              <Bullet />
            </Steps>
          </Header>

          <Title>
            Crie sua{'\n'}
            conta
          </Title>
          
          <SubTitle>
            Faça seu cadastro de{'\n'}
            forma rápida e fácil.
          </SubTitle>

          <Form>
            <FormTitle>2. Senha</FormTitle>

            <SignUpInput
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />

            <SignUpInput
              iconName="lock"
              placeholder="Repetir Senha"
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
            />
          </Form>

          <Button
            title="Cadastrar"
            color={theme.colors.success}
            onPress={handleRegister}
          />

        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}