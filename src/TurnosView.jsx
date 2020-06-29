import React from 'react';
import { View, ScrollView } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Divider, Heading, Subtitle, Button, Dialog, Appbar, ProgressCircle , IconButton } from 'material-bread';
import {Picker} from '@react-native-community/picker';
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
        bookings: [],
  
        specialities: [],

        selectedDay_id: 0,
        selectedDay_value: '',
        dates: [],

        selectedMedic_value: 0,
        availableMedics: [],

        selectedBooking: '',
        availableHours: [],
        
        createBookingButton: true,

        exitDialog: false,
      
        isInProgress: false,
      }

      this.getDates_bySpec = this.getDates_bySpec.bind(this);
      this.getMedics_byDateAndSpec = this.getMedics_byDateAndSpec.bind(this);
      this.getHours_byData = this.getHours_byData.bind(this);
      this.toggleModal = this.toggleModal.bind(this);

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
        .catch(e => console.log("GetAllBookings",e));
      } catch (e) {
        console.log("GetAllBookings",e) 
      }
    }

    componentDidMount() {
      this.getAllBookings();
      this.getAllSpecialities();
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
          if (arr.length > 0) {
            this.setState({specialityValue: arr[0].specialityId, specialitySelected: 0, selectedBooking: ''})
            this.getDates_bySpec();
          };
        }).catch(e => {
          console.log("getAllSpecialities FETCH ERROR");
          console.log(e);          
        })
      } catch (e) {
        console.log("getAllSpecialities ERROR");
        console.log(e);
      }
    }

    async getDates_bySpec() {
      if (this.state.specialityValue != ``) {
        try {
          this.setState({isInProgress: true})
          fetch("http://192.168.0.224:8080/booking/getDays" , {
            method: 'POST',
            mode: "cors",
            headers:{ 'Content-Type': 'application/json'},
            body: JSON.stringify({
              specialityId: this.state.specialityValue
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
            this.setState({dates: arr});
            if (arr.length > 0) {
              this.setState({selectedDay_value: arr[0].day}, this.getMedics_byDateAndSpec)
            } else {
              this.setState({selectedDay_value: '', isInProgress: false})
            }
          })
          .catch(e => {
            console.log(e)
            this.setState({isInProgress: false})  
          });
        } catch (e) {
          this.setState({isInProgress: false})
          console.log(e) 
        }
      } 
    }

    async getMedics_byDateAndSpec() {
      if (this.state.specialityValue != '' && this.state.selectedDay_value != ``) {
        try {
        fetch("http://192.168.0.224:8080/booking/getMedics" , {
          method: 'POST',
          mode: "cors",
          headers:{ 'Content-Type': 'application/json'},
          body: JSON.stringify({
            specialityId: this.state.specialityValue,
            day: this.state.selectedDay_value
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
          this.setState({availableMedics: arr});
          if (arr.length > 0) {
            this.setState({selectedMedic_value: arr[0].medic.id, selectedBooking: ''}, this.getHours_byData)
          } else {
            this.setState({selectedMedic_value: '', isInProgress: false})
          }
        })
        .catch(e => {
          this.setState({isInProgress: false})
          console.log(e)
        });
      } catch (e) {
        console.log(e) 
        this.setState({isInProgress: false})
      }
      }
    }

    async getHours_byData() {
      if (this.state.specialityValue != '' && this.state.selectedDay_value != `` && this.state.selectedMedic_value != ``) {
        try {
          fetch("http://192.168.0.224:8080/booking/getHours" , {
            method: 'POST',
            mode: "cors",
            headers:{ 'Content-Type': 'application/json'},
            body: JSON.stringify({
              specialityId: this.state.specialityValue,
              day: this.state.selectedDay_value,
              medicId: this.state.selectedMedic_value
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
            this.setState({availableHours: arr});
            if (arr.length > 0) {
              this.setState({selectedBooking: arr[0].bookingId, createBookingButton: false, isInProgress: false})
            } else {
              this.setState({selectedBooking: '', createBookingButton: true, isInProgress: false})
            }
          })
          .catch(e => {
            this.setState({selectedBooking: '', createBookingButton: true, isInProgress: false})
            console.log(e)
          });
        } catch (e) {
          this.setState({selectedBooking: '', createBookingButton: true, isInProgress: false})
          console.log(e) 
        }
      } else {
        this.setState({selectedBooking: '', createBookingButton: true, isInProgress: false})
      }
    }

    async postBooking() {
      if (this.state.specialityValue != '' && this.state.selectedDay_value != `` && this.state.selectedMedic_value != `` && this.state.selectedBooking != ``) {
        try {
          fetch("http://192.168.0.224:8080/booking" , {
            method: 'POST',
            mode: "cors",
            headers:{ 'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.props.personData.id,
              bookingId: this.state.selectedBooking
            })
          })
          .then(res => {  
            if (res.status == 200) {
              this.getAllBookings();
              this.setState({specialityValue:'',selectedDay_value: ``,selectedMedic_value: ``, selectedBooking: ``, isModalVisible: false});      
            }
          }).then(() => this.getAllBookings())
          .catch(e => console.log(e));
        } catch (e) {
          console.log(e) 
        }
      } else {
        this.setState({selectedBooking: '', createBookingButton: true})
      }
    }

    render() {
      return(
        <View style={{flex: 1, backgroundColor:'#F9FAFF'}}>
          <Appbar 
            title={"Mis horarios"}
            style={{paddingTop: 30, height: 70}}
            titleStyles={{color:'#FF5656', fontWeight: 'bold', textAlignVertical:'center', marginTop: '4%'}}
            barType={'dense'} 
            color={"#fff"}
            elevation={8}
            actionItems={[
              <IconButton key={0} name="directions-walk" size={24} color={'#FF5656'} onPress={() => this.setState({exitDialog: true})} />
            ]}
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
            visible={this.state.confirmBooking}
            onTouchOutside={() => this.setState({ confirmBooking: false })}
            title={'Desea crear el turno?'}
            supportingText={
                  'El dia '+ this.props.selectedDay_value +' de 7:30 a 14:00 hs para la especialidad GENERAL/'
            }
            actionItems={[
              {
                text: 'Cancelar',
                onPress: () =>  this.setState({ confirmBooking: false }),
              },
              {
                text: 'SI',
                onPress: () => {this.setState({ confirmBooking: false}, this.postBooking)},
              },
            ]}/>

          <Overlay isVisible={this.state.isModalVisible}>
            <View style= {{flex: 1, marginTop: 8}}>  
              {(
                this.state.isInProgress &&
                <View style={{width:"100%", height:"100%", zIndex: 1, position: "absolute", backgroundColor:"rgba(255,255,255,0.6)", justifyContent:'center', alignItems:'center'}}>
                  <ProgressCircle color={"#E05858"}/>
                </View>
              )}
              
              <View style={{width: '100%', alignItems: 'center', borderBottomColor:'#E05858', paddingBottom: 8, borderBottomWidth: 0.5}}>
                <Heading style={{color: '#E05858'}} type={4} text="Crear turno" />     
              </View>
                
              <View style={{marginTop: 15}}>
                  <Subtitle type={1} text="Especialidad" />
                  <View style={{borderBottomWidth: 0.5}}>
                    <Picker   
                    selectedValue={this.state.specialityValue}
                    mode={'dropdown'}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({specialityValue: itemValue, specialitySelected: itemIndex, selectedDay_value: '', selectedMedic_value: ''}, this.getDates_bySpec)
                    }}>
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
                  <View style={{borderBottomWidth: 0.5}}>
                    <Picker   
                    selectedValue={this.state.selectedDay_value}
                    mode={'dropdown'}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({selectedDay_value: itemValue, selectedDay_id: itemIndex, selectedMedic_value: ''}, this.getMedics_byDateAndSpec)
                      }}>
                      {
                        this.state.dates.map(day => {
                          if ( day !== undefined) {
                            return <Picker.Item key={day.day} label={day.day} value={day.day}/> 
                          }
                        })
                      }
                    </Picker> 
                  </View>  
                  <Divider/>
                </View>    
                <View>
                  <Subtitle type={1} text="Medico" />     
                  <View style={{borderBottomWidth: 0.5, }}>
                    <Picker   
                    selectedValue={this.state.selectedMedic_value}
                    mode={'dropdown'}
                    onValueChange={(itemValue, itemIndex) =>{
                      this.setState({selectedMedic_value: itemValue});
                      this.getHours_byData();
                    }}>
                      { (this.state.availableMedics.length > 0) && (
                        this.state.availableMedics.map(medics => {
                          if ( medics !== undefined) {
                            return <Picker.Item key={medics.medic.id} label={medics.medic.sureName + " " + medics.medic.name} value={medics.medic.id}/> 
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
                    selectedValue={this.state.selectedBooking}
                    style={{height: 50, width: '100%'}}
                    mode={'dropdown'}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({selectedBooking: itemValue})
                    }
                    >
                      { (this.state.availableHours.length > 0) && (
                        this.state.availableHours.map(hs => {
                          if ( hs !== undefined) {
                            return <Picker.Item key={hs.bookingId} label={hs.time_start} value={hs.bookingId}/> 
                          } 
                        })
                      ) 
                      }
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
                  disabled={this.state.createBookingButton}
                  onPress={() => {this.setState({confirmBooking: true})}}
                />
              </View>
          </Overlay>

          <View style={{flex: 1, alignItems: 'center', paddingBottom: 50}}>
            <ScrollView style={{marginTop: 12}}>
              {this.state.bookings.map((booking) => {
                if ( booking === undefined) {
                  return ""
                } else {
                  return <TurnoItem key={booking.bookingId} booking={booking} bookingStatus={booking.status}/> 
                }
              })}
            </ScrollView>
            <View style={{martinTop: 50}}/>
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