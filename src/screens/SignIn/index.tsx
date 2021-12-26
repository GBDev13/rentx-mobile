import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'styled-components';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import * as Yup from 'yup';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Form,
  Footer
} from './styles';
import { useNavigation } from '@react-navigation/core';
import { useAuth } from '../../hooks/auth';

export function SignIn(){
  const { signIn } = useAuth();

  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
        .email('Digite um e-mail válido')
        .required('E-mail obrigatório'),
        password: Yup.string()
        .required('A senha é obrigatória')
      });
  
      await schema.validate({ email, password });

      await signIn({ email, password });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        Alert.alert('Opa', err.message);
      } else {
        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, verifique as credenciais'
        )
      }
    }
  };

  const navigation = useNavigation<any>();

  function handleNewAccount() {
    navigation.navigate("SignUpFirstStep");
  };

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Header>
            <Title>
              Estamos{'\n'}
              quase lá.
            </Title>
            
            <SubTitle>
              Faça seu login para começar{'\n'}
              uma experiência incrível.
            </SubTitle>
          </Header>

          <Form>
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              style={{ marginBottom: 8 }}
              onChangeText={setEmail}
              value={email}
            />

            <PasswordInput
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />
          </Form>

          <Footer>
            <Button
              title="Login"
              onPress={handleSignIn}
              enabled={true}
              loading={false}
              style={{ marginBottom: 8 }}
            />
            
            <Button
              title="Criar conta gratuíta"
              onPress={handleNewAccount}
              enabled={true}
              loading={false}
              color={theme.colors.background_secondary}
              light
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}