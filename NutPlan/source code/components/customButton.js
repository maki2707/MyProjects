import React from 'react';
import { TouchableOpacity,
    Text
} from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import {images, COLORS, SIZES, FONTS} from "../constants"

import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import {    
    Roboto_300Light    
  } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';

const CustomButton = ({buttonText, buttonContainerStyle, colors, onPress}) => 
{
    let [fontsLoaded] = useFonts({       
        Roboto_300Light       
      });

    if (!fontsLoaded) {
        return <AppLoading />;
      }

    if(colors.length > 0)
    {
        return (
            <TouchableOpacity
                onPress={onPress}
            >
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    colors={colors}
                    style={{
                        ...buttonContainerStyle
                    }}
                
                >
                <Text
                    style={{
                        textAlign:'center',
                        color: COLORS.white,
                        fontSize: 20,
                        lineHeight: 30,
                        fontFamily: 'Roboto_300Light'
                    }}
                >
                    {buttonText}
                </Text>
                </LinearGradient>
                
            </TouchableOpacity>
        )
    }else
    {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    ...buttonContainerStyle
                }}
            >
                <Text
                    style={{
                        textAlign:'center',
                        color: COLORS.lightGreen,
                        lineHeight: 30,
                        fontSize: 20,                        
                        fontFamily: 'Roboto_300Light'
                    }}
                   
                >
                    {buttonText}
                </Text>
            </TouchableOpacity>
        )
    }

}

export default CustomButton;