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
  global.backendUrl = "https://medical-managment-backend.herokuapp.com/";

  return (
    <NavigationContainer>    
      <ThemeProvider theme={theme}>
        <MainScreen/>
      </ThemeProvider>
    </NavigationContainer>
  );
}

class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: "",
      person: []
    }
  }

  loginStatus(data) {
    this.setState({
      loginStatus: "200",
      person: data
    })
  }

  leaveSession() {
    this.setState({
      loginStatus: "",
      person: undefined
    })
  }

  render(){
    var loginStatus = this.loginStatus;
    var leaveSession = this.leaveSession;
    return(
      <View style={{flex: 1}}>
        {
          (this.state.loginStatus === "200") ? <HomeScreen personData={this.state.person} leaveSession={leaveSession.bind(this)}/> : <LoginView loginStatus={loginStatus.bind(this)}/>
        }
      </View>
    )
  }
}
class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      role: "",
      titleColor: "#FF5656"
    }
  }

  render() {
    return(
      <View style={{ flex: 1}}>
          {
            (this.props.personData.role.role === "medic") && <TurnosMedicosView personData={this.props.personData} leaveSession={this.props.leaveSession}/> 
          }
          {
            (this.props.personData.role.role === "patient") && <TurnosView personData={this.props.personData} leaveSession={this.props.leaveSession}/>
          }
      </View>
    )
  };
};