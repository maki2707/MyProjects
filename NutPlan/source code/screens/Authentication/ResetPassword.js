import React, { useState } from 'react'
import Background from '../../components/Background'
import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import BackButton from '../../components/BackButton'
import { CustomButton } from '../../components';
import {images, COLORS, SIZES, FONTS} from "../../constants"
import { theme } from '../../core/theme'
import { emailValidator } from '../../utils/validators/emailValidator'
import { sendEmailWithPassword } from 'firebase/auth'

const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' })

  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    const response = await sendEmailWithPassword(email.value)
    
    navigation.navigate('LoginScreen')
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Oporavak lozinke</Header>
      <TextInput
        label="E-mail addresa"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="Dobit ćete mail s uputama za oporavak lozinke"
      />
      <CustomButton      
        buttonText="Pošalji upute"
        buttonContainerStyle={{
            paddingVertical : 18,
            borderRadius : 20,
            paddingHorizontal: 50
        }}
        colors={[COLORS.darkGreen, COLORS.lime]}
        onPress={sendResetPasswordEmail}
        />      
    </Background>
  )
}

export default ResetPassword;