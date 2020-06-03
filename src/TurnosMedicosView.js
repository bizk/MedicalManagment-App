import React from 'react';
import { View, ScrollView } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Divider, Heading, Subtitle, Button } from 'material-bread';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import TurnoItem from './TurnoItem';

export default class TurnosMedicosView extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        isModalVisible: true,
        selectedItemThree: 1,
        specialityValue: '',
        specialityIndex: -1,
        language: 'java',
        showDatePicker: false,
        bookings: [],
        bookingDateMedic: [],
        startWorkHour: 0,
        finishWorkHour: 1,
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
        fetch("localhost:8080/booking/getAll" ,{
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
        fetch("http://localhost:8080/speciality/getAll" , {
          method: 'GET',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
        })
        .then(res => {return res.json()})
        .then(resJson => {
          var i, arr = [];
          for (i = 0; i < resJson.length; i++) {
            arr.push(resJson[i]);
          };
          this.setState({specialities: arr});
        }).catch(e => {
          console.log("getAllSpecialities FETCH ERROR");
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

    async dateHttpRequest() {
      try {
        fetch("localhost:8080/medWorkHs/getWorkHours_specDate" , {
          method: 'POST',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
          body: JSON.stringify({
            date: moment(this.state.date).format('YYYY-MM-DD'),
            speciality: this.state.specialityValue
          })
        })
        .then(res => {  
          console.log("getWorkHours_specDate",res.status)
          return res.json()
        })
        .then(resJson => {
          var i, arr = [];
          for (i = 0; i < resJson.length; i++) {
            arr.push(resJson[i]);
          };
          this.setState({bookingDateMedic: arr});
          console.log(this.state.bookingDateMedic.length);
        })
        .catch(e => console.log(e));
      } catch (e) {
        console.log(e) 
      }
    }

    selectDateHttpRequest(selectedDate) {
      this.setState({date: selectedDate, showDatePicker: false})
      this.dateHttpRequest();
    }

    render() {
        var hours = ["7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "24:00"];
        return(
            <View style={{flex: 1, backgroundColor:'#F9FAFF'}}>
                <Overlay isVisible={this.state.isModalVisible}>
                <View style= {{flex: 1, marginTop: 8}}>  
                    <View style={{width: '100%', alignItems: 'center', borderBottomColor:'#00BCD4', paddingBottom: 8, borderBottomWidth: 0.5}}>
                    <Heading style={{color: '#00BCD4'}} type={4} text="Crear horario" />     
                    </View>
                    
                    <View style={{marginTop: 15}}>
                        <Subtitle type={1} text="Especialidad" />
                        <View style={{borderBottomWidth: 0.5, backgroundColor:'#f0f0f0'}}>
                            <Picker   
                            selectedValue={this.state.specialityValue}
                            mode={'dropdown'}
                            onValueChange={(itemValue, itemIndex) => this.setState({specialityValue: itemValue, specialitySelected: itemIndex}) }>
                            {
                                this.state.specialities.map(speciality => {
                                if ( speciality !== undefined) {
                                    return <Picker.Item key={speciality.specialityId} label={speciality.type} value={speciality.specialityId}/> 
                                }
                                })
                            }
                            </Picker> 
                        </View>     
                        <Divider />
                    </View>
                    
                    <View>
                        <Subtitle style={{marginBottom: 5}} type={1} text="Fecha:" />
                        <Button 
                            text={moment(this.state.date).format('YYYY-MM-DD').toString()} 
                            borderSize={1} 
                            textColor={'#00BCD4'} 
                            type="outlined" 
                            icon={<Icon name="date-range" />} 
                            onPress={this.toggleDatePicker} />
                            {this.state.showDatePicker && (
                            <DateTimePicker testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={this.state.date}
                                mode={"date"}
                                is24Hour={true}
                                display="default"
                                maximumDate={moment().add(2, 'month').toDate()}
                                minimumDate={moment().add(1,'day').toDate()}
                                style={{backgroundColor:'red'}}
                                onChange={(event, selectedDate) => { this.selectDateHttpRequest(selectedDate) }} 
                            />
                            )
                        }
                        <Divider/>
                    </View>    

                    <View style={{flexDirection: 'row', width: `100%`}}>
                        <View style={{flex: 1}}>
                            <Subtitle type={1} text="Hora de inicio" />     
                            <View style={{borderBottomWidth: 0.5}}>
                                <Picker   
                                selectedValue={this.state.startWorkHour}
                                mode={'dropdown'}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({startWorkHour: itemIndex})
                                }>
                                {
                                    hours.slice(0, hours.length - 1).map((hs, key) => {
                                        return <Picker.Item key={key} label={hs} value={key}/> 
                                    })
                                }
                                </Picker>
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <Subtitle type={1} text="Hora de fin" />     
                            <View style={{borderBottomWidth: 0.5}}>
                                <Picker   
                                // enabled={false}
                                selectedValue={this.state.finishWorkHour}
                                style={{height: 50, width: '100%'}}
                                mode={'dropdown'}
                                onValueChange={(itemValue, itemIndex) =>
                                {
                                    let fakeIndex = itemIndex + 1 + this.state.startWorkHour
                                    console.log(this.state.startWorkHour, itemIndex,fakeIndex, hours[fakeIndex], hours.length);
                                    this.setState({finishWorkHour: fakeIndex})
                                }
                                }>
                                {
                                    hours.slice(this.state.startWorkHour + 1).map((hs, key) => {
                                        return <Picker.Item key={hs} label={hs} value={key}/> 
                                    })
                                }
                                </Picker>
                            </View>
                        </View>
                    </View>

                    
                    <Divider/>

                    <View style={{flex: 1}}/>
                    <Button 
                    text={'Cancelar'} 
                    textColor={'#00BCD4'} 
                    borderSize={2} 
                    onPress={this.toggleModal}/>
                    <Button
                    text={'Agregar horario'}
                    color={'#00BCD4'} 
                    icon={<Icon name={'date-range'}/>}
                    type="flat"
                    onPress={() => {
                        console.log(hours[this.state.startWorkHour] + " " + hours[this.state.finishWorkHour])}}
                    />
                </View>
            </Overlay>
                
                <View style={{flex: 1, alignItems: 'center'}}>
                    <ScrollView style={{marginTop: 12}}>
                    {this.state.bookings.map((booking) => {
                        if ( booking === undefined) {
                        return ""
                        } else {
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
                        text={'Agregar horario'}
                        type="contained"
                        color={'#00BCD4'}
                        radius={20}
                        onPress={this.toggleModal}
                        />
                    </View>
                </View>
            </View>
        )
    }
  }

