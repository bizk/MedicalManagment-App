import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ThemeProvider, Divider, Header, Icon, Overlay } from 'react-native-elements';
import {  Appbar, Select, Card, CardContent, Ripple, shadow, Button, Paper } from 'material-bread';
import Modal from 'react-native-modal';
import TurnoItem from './TurnoItem';

export default class TurnosView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isModalVisible: true,
        selectedItemThree: 1,
        bookings: [],
      }
      this.toggleModal = this.toggleModal.bind(this);
    }
    
    toggleModal() {
      this.setState({isModalVisible: !this.state.isModalVisible})
    };
  
    async getAllBookings() {
      console.log("new call")
      try{
        fetch("http://192.168.0.224:8080/booking/getAll" ,{
          method: 'GET',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
        }).then(res => {return res.json()})
        .then(resJson => {
          var i, arr = [];
          for (i = 0; i < resJson.length; i++) {
            arr.push(resJson[i]);
          };
          console.log(arr.length);
          this.setState({bookings: arr});
        })
        .catch(e => console.log(e));
      } catch (e) {
        console.log(e) 
      }
    }
  
    componentDidMount() {
      this.getAllBookings()
    }
  
    _returnItems() {
      return ;
    };
  
    render() {
      const data = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' },
      ]
  
      return(
        <View style={{flex: 1, backgroundColor:'#F9FAFF'}}>
            <Overlay style={{flex: 1}} isVisible={this.state.isModalVisible}>
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
                  textColor={'#E05858'} 
                  borderSize={2} 
                  icon={<Icon name="favorite" />} 
                  onPress={this.toggleModal}/>
                <Button
                  text={'Agregar turno'}
                  color={'#E05858'} 
                  type="flat"
                />
              </View>
          </Overlay>
            
            <View style={{flex: 1, alignItems: 'center'}}>
                <ScrollView style={{marginTop: 12}}>
                {this.state.bookings.map((booking) => {
                    if ( booking === undefined) {
                    return ""
                    }
                    else {
                    return <TurnoItem key={booking.bookingId} booking={booking}/> 
                    }
                })}
                </ScrollView>
                <View style={{
                    position:'absolute',
                    bottom:0,
                    marginBottom: 12,
                }}>
                    <Button
                    icon={<Icon name="add" />}
                    text={'Agregar turno'}
                    type="contained"
                    color={'#E05858'}
                    radius={20}
                    onPress={this.toggleModal}
                    />
                </View>
            </View>
        </View>
      )
    }
  }
  