import React from 'react';
import { View, ScrollView } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Divider, Heading, Subtitle, Button, ListSection,ProgressCircle, IconButton, Tabs, Dialog, Appbar } from 'material-bread';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import MedicItem from './MedicItem';
export default class TurnosMedicosView extends React.Component {
    
    constructor(props) {
      super(props);
      
      this.state = {
        isModalVisible: false,
        confirmWorkHour: false,
        showDatePicker: false,
        bookingDateMedic: [],
       
        isInProgress: true,

        specialities: [],
        specialityValue: '',
        specialityType: "",
        date: moment().add(1,'day').toDate(),

        startWorkHour: 0,
        hour_startWorkHour: "7:30",
        finishWorkHour: 1,
        hour_finishWorkHour: "8:00",

        workingHoursAndBookings: [],
        exitDialog: false,

        errorCreatingBookings: false,
      }

      this.createWorkHour = this.createWorkHour.bind(this);
      this.toggleModal = this.toggleModal.bind(this);
      this.toggleDatePicker = this.toggleDatePicker.bind(this);
    }

    toggleModal() {
      this.setState({isModalVisible: !this.state.isModalVisible})
    };

    async getTodayBookings() {
      try {
        this.setState({isInProgress: true});
        fetch(`${backendUrl}booking/medic/getTodayBookingHours` ,{
          method: 'POST',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.props.personData.id
          })
        }).then(res => {
          return res.json()})
        .then(resJson => {
          let bookings = [];
          resJson.forEach(booking => bookings.push(booking));
          this.setState({workingHoursAndBookings: bookings, isInProgress: false});
        })
        .catch(e => console.log(e));
      } catch (e) { console.log(e) }
    }
  
    async getAllSpecialities() {
      try {
        fetch(`${backendUrl}speciality/medics` ,{
          method: 'POST',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
          body: JSON.stringify({
            medicId: this.props.personData.id
          })
        })
        .then(res => {return res.json()})
        .then(resJson => {
          var i, arr = [];
          for (i = 0; i < resJson.length; i++) {
            arr.push(resJson[i]);
          };
          this.setState({specialities: arr, specialityValue: arr[0].specialityId});
        })
        .catch(e => {
          console.log("getAllSpecialities FETCH ERROR");
          console.log(e);          
        })
      } catch (e) {
        console.log("getAllSpecialities ERROR");
        console.log(e);
      }
    }

    componentDidMount() {
      this.getTodayBookings();
      this.getAllSpecialities();
    }

    toggleDatePicker() {
      this.setState({showDatePicker: !this.state.showDatePicker});
    }

    async dateHttpRequest() {
      try {
        fetch(`${backendUrl}medWorkHs/getWorkHours_specDate` , {
          method: 'POST',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
          body: JSON.stringify({
            date: moment(this.state.date).format('YYYY-MM-DD'),
            speciality: this.state.specialityValue
          })
        })
        .then(res => {  
          return res.json()
        })
        .then(resJson => {
          var i, arr = [];
          for (i = 0; i < resJson.length; i++) {
            arr.push(resJson[i]);
          };
          this.setState({bookingDateMedic: arr});
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

    async createWorkHour() {
      try {
        fetch(`${backendUrl}medWorkHs` , {
          method: 'POST',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
          body: JSON.stringify({
            medicId: this.props.personData.id,
            day: moment(this.state.date).format('MM-DD-YYYY'),
            time_start: this.state.hour_startWorkHour,
            time_end: this.state.hour_finishWorkHour,
            specialityId: this.state.specialityValue
          })
        })
        .then(res => {
          if (res.status === 200) this.setState({sucessCreatingBookings: true})
          else if (res.status === 300 || res.status === 400) this.setState({errorCreatingBookings: true});
          this.getTodayBookings();
          this.toggleModal();
        })
        .catch(e => console.log(e));
      } catch (e) {
        console.log(e) 
      }
    }

    async getBookings_Week() {
      try {
        this.setState({isInProgress: true});
        fetch(`${backendUrl}booking/medic/getWeekBookingHours` , {
          method: 'POST',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.props.personData.id
          })
        })
        .then(res => {  
          return res.json()
        })
        .then(resJson => {
          let bookings = [];
          resJson.forEach(booking => bookings.push(booking));
          this.setState({workingHoursAndBookings: bookings, isInProgress: false});
        }).catch(e=> console.log(e))
      } catch (e) {
        console.log(e);
      }
    }

    async getBookings_All() {

      try {
        this.setState({isInProgress: true});
        fetch(`${backendUrl}booking/medic/getAllBookingHours` , {
          method: 'POST',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.props.personData.id
          })
        })
        .then(res => {  
          return res.json()
        })
        .then(resJson => {
          let bookings = [];
          resJson.forEach(booking => bookings.push(booking));
          this.setState({workingHoursAndBookings: bookings, isInProgress: false});
        }).catch(e=> console.log(e))
      } catch (e) {
        console.log(e);
      }
    }

    changeTab(index) {
      this.setState({isInProgress: true});
      if (index === 0) this.getTodayBookings();
      else if (index === 1 ) this.getBookings_Week();
      else this.getBookings_All();
      this.setState({ selectedTab: index })
    }

    render() {
        var hours = ["7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "24:00"];
        return(
            <View style={{flex: 1, backgroundColor:'#F9FAFF'}}>
              <Appbar 
                title={"Mis horarios"}
                titleStyles={{color:'#F9FAFF', fontWeight: 'bold', textAlignVertical:'center', paddingTop:'3%'}}
                barType={'normal'} 
                color={"#00BCD4"}
                elevation={8}
                style={{paddingTop: 30, height: 70}}
                actionItems={[
                  <IconButton key={0} name="directions-walk" size={24} color={'#F9FAFF'} onPress={() => this.setState({exitDialog: true})} />
                ]}
                />
              <Tabs
                selectedIndex={this.state.selectedTab}
                handleChange={index => this.changeTab(index)}
                backgroundColor={'#00BCD4'}
                actionItems={[
                  { label: 'Dia' },
                  { label: 'Semana' },
                  { label: 'Todos' },
                ]}
              />

              <Dialog
                visible={this.state.sucessCreatingBookings}
                onTouchOutside={() => this.setState({ sucessCreatingBookings: false })}
                title={'Los turnos se crearon con exito!'}
                actionItems={[{ text: 'OK', onPress: () => {this.setState({ sucessCreatingBookings: false})}}]}
              />

              <Dialog
                visible={this.state.errorCreatingBookings}
                onTouchOutside={() => this.setState({ errorCreatingBookings: false })}
                title={'Error al crear los turnos!'}
                supportingText={"Existen turnos entre las horas seleccionadas para esa fecha, por favor, revise la informacion ingresada"}
                actionItems={[{ text: 'OK', onPress: () => {this.setState({ errorCreatingBookings: false})}}]}
              />

              <Dialog
                visible={this.state.exitDialog}
                onTouchOutside={() => this.setState({ exitDialog: false })}
                title={'Desea cerrar sesion?'}
                actionItems={[
                  {
                    text: 'Cancelar',
                    onPress: () =>  this.setState({ exitDialog: false }),
                  },
                  {
                    text: 'SI',
                    onPress: () => {this.setState({ exitDialog: false}, this.props.leaveSession)},
                  },
                ]}/>

              <Dialog
                visible={this.state.confirmWorkHour}
                onTouchOutside={() => this.setState({ confirmWorkHour: false })}
                title={'Desea crear su horario?'}
                supportingText={
                  'El dia ' + moment(this.state.date).format('MM-DD-YYYY') + ' de ' + this.state.hour_startWorkHour + ' a '+this.state.hour_finishWorkHour+' hs para la especialidad '
                }
                actionItems={[
                  {
                    text: 'Cancel',
                    onPress: () =>  this.setState({ confirmWorkHour: false }),
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      this.createWorkHour();
                      this.setState({ confirmWorkHour: false })
                    }
                  },
                ]}
                />

                <Overlay isVisible={this.state.isModalVisible}>
                  <View style= {{flex: 1, marginTop: 8}}>  
                      <View style={{width: '100%', alignItems: 'center', borderBottomColor:'#00BCD4', paddingBottom: 8, borderBottomWidth: 0.5}}>
                        <Heading style={{color: '#00BCD4'}} type={4} text="Agregar turnos" />     
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
                                onChange={(event, selectedDate) => {   this.selectDateHttpRequest(selectedDate) }} 
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
                                      this.setState({startWorkHour: itemIndex, finishWorkHour: 0})
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
                                      this.setState({finishWorkHour: itemIndex})
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
                      text={'Agregar turnos'}
                      color={'#00BCD4'} 
                      icon={<Icon name={'date-range'}/>}
                      type="flat"
                      onPress={() => {
                          this.setState({
                            confirmWorkHour: true,
                            hour_startWorkHour: hours[this.state.startWorkHour], 
                            hour_finishWorkHour: hours[this.state.startWorkHour + this.state.finishWorkHour + 1]
                          });
                        }}
                      />
                  </View>
                </Overlay>
                
                <View style={{flex: 1, margin: 10}}>
                  {(
                    this.state.isInProgress &&
                    <View style={{width:"100%", height:"100%", zIndex: 1, position: "absolute", backgroundColor:"rgba(255,255,255,0.6)", justifyContent:'center', alignItems:'center'}}>
                      <ProgressCircle color={"#00BCD4"}/>
                    </View>
                  )}
                  <ScrollView style={{ width: `100%` }}>
                    <ListSection>
                    {
                      this.state.workingHoursAndBookings.map(booking =>{
                        if (booking === undefined ) return ;
                        else {
                          return <MedicItem key={booking.bookingId} booking={booking}/>
                        }
                      })
                    }
                    </ListSection>
                                      
                  </ScrollView>           
                </View>

                <View style={{ alignItems: 'center', paddingTop: 40}}>
                    <View style={{
                        position:'absolute',
                        bottom:0,
                        marginBottom: 12,
                    }}>
                        <Button
                        icon={<Icon name="add" />}
                        text={'Agregar turnos'}
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

