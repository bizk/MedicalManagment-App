import React from 'react';
import { View, ScrollView } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Divider, Heading, Subtitle, Button, Dialog, Appbar } from 'material-bread';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import TurnoItem from './TurnoItem';

export default class TurnosView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isModalVisible: false,
        visible:false,
        confirmBooking: false,
        selectedItemThree: 1,
        specialityValue: '',
        specialityIndex: -1,
        language: 'java',
        showDatePicker: false,
        bookings: [],
        bookingDateMedic: [],
        bookingDateMedicValue: 0,
        specialities: [],
        date: new Date(),
      }

      this.toggleModal = this.toggleModal.bind(this);
      this.toggleDatePicker = this.toggleDatePicker.bind(this);
    }
    
    toggleModal() {
      this.setState({isModalVisible: !this.state.isModalVisible, visible: true})
    };
  
    async getAllBookings() {
      try{
        fetch("http://192.168.0.224:8080/booking/patient" ,{
          method: 'POST',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.props.personData.id
          })
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
        fetch("http://192.168.0.224:8080/speciality" , {
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
        fetch("http://192.168.0.224:8080/medWorkHs/getWorkHours_specDate" , {
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
      return(
        <View style={{flex: 1, backgroundColor:'#F9FAFF'}}>
          <Appbar 
            title={"Mis horarios"}
            titleStyles={{color:'#FF5656', fontWeight: 'bold', textAlignVertical:'center', paddingTop:'3%'}}
            barType={'normal'} 
            color={"#fff"}
            elevation={8}
            style={{marginTop: '2%'}}
            />
          <Dialog
            visible={this.state.confirmBooking}
            onTouchOutside={() => this.setState({ confirmBooking: false })}
            title={'Desea crear su turno?'}
            supportingText={
              'El dia 3/7/2020 7:30 a 8:00 hs para la especialidad GENERAL con el medico Celada, Maria?'
            }
            actionItems={[
              {
                text: 'Cancel',
                onPress: () =>  this.setState({ confirmBooking: false }),
              },
              {
                text: 'OK',
                onPress: () =>  this.setState({ confirmBooking: false }),
              },
            ]}
          />
          {/* <Dialog
          visible={this.state.visible}
          onTouchOutside={() => this.setState({ visible: false })}
          title={'Desea confirmar turno?'}
          actionItems={[
            {
              text: 'Cancelar',
              onPress: () =>  this.setState({ visible: false }),
            },
            {
              text: 'OK',
              onPress: () =>  this.setState({ visible: false }),
            },
          ]}
          /> */}
          {/* <Dialog
          visible={this.state.visible}
          onTouchOutside={() => this.setState({ visible: false })}
          title={'Desea Cancelar turno?'}
          supportingText={
              'Si cancela el turno antes de las 12 hs de este sufrira recargos'
            }
          actionItems={[
            {
              text: 'Cancelar',
              onPress: () =>  this.setState({ visible: false }),
            },
            {
              text: 'Confirmar',
              onPress: () =>  this.setState({ visible: false }),
            },
          ]}
          /> */}
          <Overlay isVisible={this.state.isModalVisible}>
              <View style= {{flex: 1, marginTop: 8}}>  
                <View style={{width: '100%', alignItems: 'center', borderBottomColor:'#E05858', paddingBottom: 8, borderBottomWidth: 0.5}}>
                  <Heading style={{color: '#E05858'}} type={4} text="Crear turno" />     
                </View>
                
                <View style={{marginTop: 15}}>
                  <Subtitle type={1} text="Especialidad" />
                  <View style={{borderBottomWidth: 0.5}}>
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
                    textColor={'#E05858'} 
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
                <View>
                  <Subtitle type={1} text="Medico" />     
                  <View style={{borderBottomWidth: 0.5, }}>
                    <Picker   
                    selectedValue={this.state.bookingDateMedicValue}
                    mode={'dropdown'}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({bookingDateMedicValue: itemValue})
                    }>
                      { (this.state.bookingDateMedic.length > 0) && (
                        this.state.bookingDateMedic.map(medics => {
                          if ( medics !== undefined) {
                            return <Picker.Item key={medics.id} label={medics.person.sureName + " " + medics.person.name} value={medics.person}/> 
                          } 
                        })
                      ) 
                      }
                    </Picker>
                  </View>
                  <Divider/>
                </View>
                
                <View>
                  <Subtitle type={1} text="Turno" />         
                  <View style={{borderBottomWidth: 0.5,}}>
                    <Picker   
                    selectedValue={this.state.language}
                    style={{height: 50, width: '100%'}}
                    mode={'dropdown'}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({language: itemValue})
                    }
                    >
                      <Picker.Item label="7:00 - 7:30" value="java" />
                      <Picker.Item label="7:30 - 8:00" value="js" />
                    </Picker>
                  </View>
                  <Divider/>
                </View>

                <View style={{flex: 1}}/>
                <Button 
                  text={'Cancelar'} 
                  textColor={'#E05858'} 
                  borderSize={2} 
                  onPress={this.toggleModal}/>
                <Button
                  text={'Agregar turno'}
                  color={'#E05858'} 
                  icon={<Icon name={'date-range'}/>}
                  type="flat"
                  onPress={() => {this.setState({confirmBooking: true})}}
                />
              </View>
          </Overlay>

          <View style={{flex: 1, alignItems: 'center'}}>
            <ScrollView style={{marginTop: 12}}>
              {this.state.bookings.map((booking) => {
                if ( booking === undefined) {
                  return ""
                } else {
                  return <TurnoItem key={booking.bookingId} booking={booking} bookingStatus={booking.status}/> 
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