import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar
} from 'react-native';

import {images, COLORS, SIZES, FONTS} from "../../constants"

import {LinearGradient}  from 'expo-linear-gradient';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import {
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { CustomButton } from '../../components';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

 
const Landing = ({ navigation }) => {

    let [fontsLoaded] = useFonts({
        Inter_900Black,
        Roboto_100Thin,
        Roboto_100Thin_Italic,
        Roboto_300Light,
        Roboto_300Light_Italic,
        Roboto_400Regular,
        Roboto_400Regular_Italic,
        Roboto_500Medium,
        Roboto_500Medium_Italic,
        Roboto_700Bold,
        Roboto_700Bold_Italic,
        Roboto_900Black,
        Roboto_900Black_Italic,
      });

      if (!fontsLoaded) {
        return <AppLoading />;
      }

    function renderHeader() {
        return(
            <View
                style={{
                    height: "70%"
                }}
            >
                <ImageBackground
                source={images.loginBack3}
                style={{
                    flex:1,
                    justifyContent: 'flex-end'
                }}
                resizeMode='cover'
                >
                   
                   <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        colors={[
                            COLORS.transparent,
                            COLORS.black
                        ]}
                        style={{
                            height: 200,
                            justifyContent: 'flex-end',
                            paddingHorizontal: SIZES.padding
                        }}
                    >
                        <Text
                            style={{
                                width:"80%",
                                color: COLORS.white,                                
                                lineHeight: 45,
                                fontFamily: 'Inter_900Black',
                                fontSize: 45

                            }}
                        >
                            NutPlan
                        </Text>
                    </LinearGradient>
                </ImageBackground>
            </View>
        )
    }
    function renderButtons() {
        return(
            <View
            style ={{
                flex:1,
                paddingHorizontal: SIZES.padding
            }}>
                <Text
                style={{
                    color:COLORS.gray,
                    fontFamily: 'Roboto_300Light'
                }}
                >
                Aplikacija za planiranje osobne prehrane                      by Filip Marčec
                </Text>

                <View
                    style={{
                        flex:1,
                        justifyContent: 'center'
                    }}
                >
                    <CustomButton
                        buttonText="Prijava"
                        buttonContainerStyle={{
                            paddingVertical : 18,
                            borderRadius : 20
                        }}
                        colors={[COLORS.darkGreen, COLORS.lime]}
                        onPress={()=> navigation.navigate("Login")}
                    />

                    <CustomButton
                        buttonText="Registracija"
                        buttonContainerStyle={{
                            marginTop : SIZES.radius,
                            paddingVertical : 18,
                            borderRadius : 20,
                            borderColor:COLORS.darkLime,
                            borderWidth:1,
                            backgroundColor: 'rgba(215, 215, 215, 0.1)',                       
                            

                        }}
                        colors={[]}
                        onPress={()=> navigation.navigate("Register")}
                    />
                </View>
            </View>
        )
    }

    

    return (
        <View
            style ={{
                flex:1,
                backgroundColor: COLORS.black
            }}
            
        >
            <StatusBar barStyle='light-content' />           
            
                {renderHeader()}
                {renderButtons()}           
        </View>
    )
}

export default Landing;