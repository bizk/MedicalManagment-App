import React, {useState} from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Divider, Heading, Select, Subtitle, shadow, Button } from 'material-bread';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import Modal from 'react-native-modal';
import TurnoItem from './TurnoItem';

export default class TurnosView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isModalVisible: true,
        selectedItemThree: 1,
        language: 'java',
        showDatePicker: false,
        bookings: [],
        specialities: [],
        date: new Date(),
      }

      this.toggleModal = this.toggleModal.bind(this);
      this.toggleDatePicker = this.toggleDatePicker.bind(this);
    }
    
    toggleModal() {
      this.setState({isModalVisible: !this.state.isModalVisible})
    };
  
    async getAllBookings() {
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
          this.setState({bookings: arr});
        })
        .catch(e => console.log(e));
      } catch (e) {
        console.log(e) 
      }
    }
  
    async getAllSpecialities() {
      try {
        fetch("http://192.168.0.224:8080/speciality/getAll" , {
          method: 'GET',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
        }).then(res => {return res.json()})
        .then(resJson => {
          var i, arr = [];
          for (i = 0; i < resJson.length; i++) {
            arr.push(resJson[i]);
          };
          this.setState({specialities: arr});
        }).catch(e => {
          console.log("getAllSpecialities ERROR");
          console.log(e);          
        })
      } catch (e) {
        console.log("getAllSpecialities ERROR");
        console.log(e);
      }
    }

    componentDidMount() {
      this.getAllBookings();
      this.getAllSpecialities();
    }

    setStartDate(date) {
      this.setState({date: date})
    }

    toggleDatePicker() {
      this.setState({showDatePicker: !this.state.showDatePicker});
    }

    render() {
      const data = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' },
      ]
  
      return(
        <View style={{flex: 1, backgroundColor:'#F9FAFF'}}>
            <Overlay isVisible={this.state.isModalVisible}>
              <View style= {{flex: 1}}>  
                <Heading style={{alignSelf: 'center', color: '#E05858'}} type={4} text="Crear turno" />     
                <Divider/>
  
                <Subtitle style={{marginBottom: '2%'}} type={1} text="Especialidad" />
                <View style={{borderWidth: 1}}>
                  <Picker   
                  selectedValue={this.state.language}
                  style={{height: 50, width: '100%'}}
                  mode={'dropdown'}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({language: itemValue})
                  }>
                    {
                      this.state.specialities.map(speciality => {
                        if ( speciality === undefined) {
                          return ;
                        } else {
                          return <Picker.Item key={speciality.specialityId} label={speciality.type} value={speciality.type}/> 
                        }
                      })
                    }
                  </Picker> 
                </View>     
                <Divider/>

                <Subtitle style={{marginBottom: 5}} type={1} text="Fecha:" />
                <Button 
                  text={moment(this.state.date).format('DD/MM/YYYY').toString()} 
                  borderSize={1} 
                  textColor={'#E05858'} 
                  type="outlined" 
                  icon={<Icon name="date-range" />} 
                  onPress={this.toggleDatePicker}
                  />
                {this.state.showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={this.state.date}
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    maximumDate={moment().add(2, 'month').toDate()}
                    minimumDate={moment().add(1,'day').toDate()}
                    style={{backgroundColor:'red'}}
                    onChange={(event, selectedDate) => { this.setState({date: selectedDate, showDatePicker: false})}}
                  />
                )}
                <Divider/>

                <Subtitle type={1} text="Medico" />     
                <Picker   
                selectedValue={this.state.language}
                style={{height: 50, width: '100%'}}
                mode={'dropdown'}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({language: itemValue})
                }
                >
                  <Picker.Item label="Java" value="java" />
                  <Picker.Item label="JavaScript" value="js" />
                </Picker>
                <Divider/>

                <Subtitle type={1} text="Turno" />     
                <Picker   
                selectedValue={this.state.language}
                style={{height: 50, width: '100%'}}
                mode={'dropdown'}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({language: itemValue})
                }
                >
                  <Picker.Item label="Java" value="java" />
                  <Picker.Item label="JavaScript" value="js" />
                </Picker>
                <Divider/>

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
                  icon={<Icon name={'date-range'}/>}
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