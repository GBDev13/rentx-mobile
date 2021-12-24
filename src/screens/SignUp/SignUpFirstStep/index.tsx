import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';

import * as Yup from 'yup';

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

interface NavigationProps{
  navigate:(
    screen: string,
    user?: {
      user: {
        name: string;
        email: string;
        driverLicense: string;
      }
    }
  ) => void;
  goBack: () => void;
}

export function SignUpFirstStep(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  const navigation = useNavigation<NavigationProps>();

  function handleBack() {
    navigation.goBack();
  };

  async function handleNext() {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string()
        .required("CNH é obrigatória"),
        email: Yup.string()
        .email("E-mail inválido")
        .required('E-mail é obrigatório'),
        name: Yup.string()
        .required('Nome é obrigatório')
      });

      const data = { name, email, driverLicense };
      await schema.validate(data);

      navigation.navigate("SignUpSecondStep", { user: data })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return Alert.alert("Opa", err.message);
      }
    }
  };

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
            <FormTitle>1. Dados</FormTitle>

            <SignUpInput
              iconName="user"
              placeholder="Nome"
              onChangeText={setName}
              value={name}
            />
            <SignUpInput
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
            <SignUpInput
              iconName="credit-card"
              placeholder="CNH"
              keyboardType="numeric"
              onChangeText={setDriverLicense}
              value={driverLicense}
            />
          </Form>

          <Button
            title="Próximo"
            onPress={handleNext}
          />

        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}