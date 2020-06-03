import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'react-native-elements';
import {  Appbar } from 'material-bread';

import TurnosView from './src/TurnosView';
import TurnosMedicosView from './src/TurnosMedicosView';
import LoginView from './src/LoginView';

const theme = {
  colors: {
    primary: '#FF5656',
    grey0: "#DAD6D6"
  }
}

export default function App() {
  
  return (
    <NavigationContainer>    
      <ThemeProvider theme={theme}>
        <HomeScreen/>
        {/* <LoginView/> */}
      </ThemeProvider>
      
    </NavigationContainer>
    
  );
}

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      role: "medic"
    }
  }

  render() {
    return(
      <View style={{ flex: 1}}>
        <Appbar 
          title={"Mis turnos"}
          titleStyles={{color:'#E05858', fontWeight: 'bold', textAlignVertical:'center', paddingTop:'3%'}}
          barType={'normal'} 
          color={'#FFFFFF'}
          elevation={8}
          style={{marginTop: '2%'}}
          />
          {
            (this.state.role === "medic") && <TurnosMedicosView/> 
          }
          {
            (this.state.role === "patient") &&  <TurnosView/>
          }
      </View>
    )
  };
};