import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, Button, Divider, Header, Icon } from 'react-native-elements';

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
      </ThemeProvider>
      
    </NavigationContainer>
    
  );
}

class HomeScreen extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <View style={{ flex: 1}}>
        <Header
          centerComponent={{ text: 'MIS TURNOS', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <TurnosView/>
      </View>
    )
  };
};

class TurnosView extends React.Component {
  render() {
    return(
      <View style={{flex: 1}}>
        <View style={{flex:1}}>
          <Text>aca van los turnos </Text>
        </View>
        <Button 
          icon={<Icon name='plus' type='feather' color='white' />}
          type="solid" 
          titleStyle={{fontSize:24, justifyContent:"center"}}
          title="Agregar turno"/>
      </View>
    )
  }
}
