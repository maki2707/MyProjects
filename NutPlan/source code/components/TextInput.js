import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { theme } from '../core/theme'
import {images, COLORS, SIZES, FONTS} from "../constants"

const TextInput = ({ errorText, description, ...props }) => {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={COLORS.darkGreen}
        underlineColor={COLORS.darkGreen}
        mode="outlined"
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,       
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontSize: 13,
    color: COLORS.darkGreen,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: COLORS.darkGreen,
    paddingTop: 8,
  },
})

export default TextInput;