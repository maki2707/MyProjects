import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../../components/Background'
import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import BackButton from '../../components/BackButton'
import { CustomButton } from '../../components';
import {images, COLORS, SIZES, FONTS} from "../../constants"
import { emailValidator } from '../../utils/validators/emailValidator'
import { passwordValidator } from '../../utils/validators/passwordValidator'
import { nameValidator } from '../../utils/validators/nameValidator'
import { loginUser } from '../../Controllers/AuthController';

import { theme } from '../../core/theme'

const Login = ({ navigation }) =>
{   

  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [error, setError] = useState()

  const onLoginPressed = async () => {
    console.log("poceo login")
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    const response = await loginUser({
      email: email.value,
      password: password.value,
    })
    if (response.error) {
      setError(response.error)
    }
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Dobrodošli natrag</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Lozinka"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={styles.forgot}>Zaboravljena lozinka?</Text>
        </TouchableOpacity>
      </View>    
     
      <CustomButton      
            buttonText="Login"
            buttonContainerStyle={{
                paddingVertical : 18,
                borderRadius : 20,
                paddingHorizontal: 100
            }}
            colors={[COLORS.darkGreen, COLORS.lime]}
            onPress={onLoginPressed}
      />
                    
                     
     
      <View style={styles.row}>
        <Text
        style={{
            color:COLORS.darkLime
        }}
        >Nemaš račun? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Register')}>
          <Text style={{
            color:COLORS.darkLime,
            fontWeight: 'bold'            
        }}>
            Registracija
            </Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

export default Login;