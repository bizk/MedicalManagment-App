import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, Divider, Header, Icon } from 'react-native-elements';
import {  Appbar, Select, Card, CardContent, Ripple, shadow, Button, Paper } from 'material-bread';
import Modal from 'react-native-modal';

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
        <Appbar title={"Mis turnos"} barType={'normal'}/>
        <TurnosView/>
      </View>
    )
  };
};

class TurnoItem extends React.Component {
  render() {
    return(
      <Card style={{ 
        marginTop: '3%', 
        ...shadow(6),
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center'
        }}
        outlined >
        <Ripple onPress={() => console.log('pressed action')}>
          <CardContent>
            <Text style={{ color: 'rgba(0,0,0,.6)', fontSize: 16, fontWeight: '600', marginBottom: 6 }}>
              Gorilla
            </Text>
            <Text style={{ color: 'rgba(0,0,0,.6)', fontSize: 14 }}>
              Gorillas are ground-dwelling, predominantly herbivorous apes that inhabit the forests of central Sub-Saharan Africa.
            </Text>
          </CardContent>
        </Ripple>
      </Card>
    );
  }
}
class TurnosView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      selectedItemThree: 1
    }
    this.toggleModal = this.toggleModal.bind(this);
  }
  
  toggleModal() {
    this.setState({isModalVisible: !this.state.isModalVisible})
  };

  render() {
    const data = [
      { id: 1, name: 'Option 1' },
      { id: 2, name: 'Option 2' },
      { id: 3, name: 'Option 3' },
    ]
    return(
      <View style={{flex: 1}}>
        <Modal isVisible={this.state.isModalVisible}>
          <Paper style={{ flex: 1 }}>
            <View style= {{flex: 1}}>       
              <Text>I am the modal content!</Text>
              <Select
                label={'Select'}
                type={'outlined'}
                menuItems={data}
                onSelect={value => this.setState({ selectedItemThree: value.name })}
                selectedItem={this.state.selectedItemThree}
              />
              
              <Text>I am the modal content!</Text>
              <Select
                  label={'Select'}
                  type={'outlined'}
                  menuItems={data}
                  onSelect={value => this.setState({ selectedItemThree: value.name })}
                  selectedItem={this.state.selectedItemThree}
                />
              <View style={{flex: 1}}/>
              <Button 
                text={'Cancelar'} 
                textColor={'#E91E63'} 
                borderSize={2} 
                icon={<Icon name="favorite" />} 
                onPress={this.toggleModal}/>
              <Button
                text={'Agregar turno'}
                color={'#E91E63'} 
                type="flat"
              />
            </View>
          </Paper>
        </Modal>

        <View style={{alignItems: 'center'}}>
          <TurnoItem />
          <TurnoItem />
          <TurnoItem />
          <TurnoItem />
        </View> 
        
        <Button 
          icon={<Icon name="add" />}
          text={'Radius'}
          type="contained"
          color={'#FF5722'}
          radius={20}
          onPress={this.toggleModal}
        />
      </View>
    )
  }
}
