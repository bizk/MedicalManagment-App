import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import {  Select, Button, Paper } from 'material-bread';

class ModalCrearTurno_Paciente extends React.Component {
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
        return(
            <Overlay isVisible={this.state.isModalVisible}>
              <View style= {{flex: 1}}>  
                <Heading style={{alignSelf: 'center', color: '#E05858'}} type={4} text="Crear turno" />     
                <Divider/>
  
                <Subtitle style={{marginBottom: '2%'}} type={1} text="Especialidad" />
                <View style={{borderWidth: 1}}>
                  <Picker   
                  selectedValue={this.state.specialityValue}
                  style={{height: 50, width: '100%'}}
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
                <Divider/>

                <Subtitle style={{marginBottom: 5}} type={1} text="Fecha:" />
                <Button 
                  text={moment(this.state.date).format('YYYY-MM-DD').toString()} 
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
                    onChange={(event, selectedDate) => { this.selectDateHttpRequest(selectedDate) }}
                  />
                )}
                <Divider/>

                <Subtitle type={1} text="Medico" />     
                <Picker   
                selectedValue={this.state.bookingDateMedic}
                style={{height: 50, width: '100%'}}
                mode={'dropdown'}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({language: itemValue})
                }>
                  {
                    () => {
                      console.log("abc",this.state.bookingDateMedic.length);
                      if (this.state.bookingDateMedic.length <= 0) {
                        console.log("x")
                        return <Picker.Item label={"-"} value={"  "}/> 
                      } else {
                        this.state.bookingDateMedic.map(medics => {
                          if ( medics !== undefined) {
                            return <Picker.Item key={medics.id} label={medics.person.surename + " " + medics.person.name} value={medics.person}/> 
                          } else {
                            console.log("pato")
                          }
                        })
                      }
                    }  
                  }
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
                  onPress={this.toggleModal}/>
                <Button
                  text={'Agregar turno'}
                  color={'#E05858'} 
                  icon={<Icon name={'date-range'}/>}
                  type="flat"
                />
              </View>
          </Overlay>
        )   
    }
}