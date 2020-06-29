import React from 'react';
import { Button, ListSection, Dialog, IconButton, ListItem } from 'material-bread';
import { View } from 'react-native';
import moment from "moment";

export default class WorkingHourItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInThisWeek: true,
            
            selectedBooking: -1,

            cancelBooking: false,
            modalBookingTest: "",

        };
        if (moment(this.props.workHour.day).isAfter(moment().add(7, 'days').startOf('day'))) this.state.isInThisWeek = false;
    }


    cancelBookingModal(booking) {
        this.setState({cancelBooking: true, selectedBooking: booking.bookingId});
        if (booking.status === "") this.setState({modalBookingTest: "LIBRE - Dia: " + booking.day + " - " + booking.time_start +
            " a " + booking.time_end})
        else this.setState({modalBookingTest: "Dia: " + booking.day + " - " + booking.time_start +
            " a " + booking.time_end + " Paciente " + booking.patient.sureName + ', ' + booking.patient.name})
    }

    async cancelBooking() {
        if (this.state.selectedBooking !== -1){
            try {
                fetch("http://192.168.0.224:8080/booking" ,{
                  method: 'DELETE',
                  mode: "cors",
                  headers:{ 'Content-Type': 'application/json'},
                  body: JSON.stringify({
                      bookingId: this.state.selectedBooking
                  })
                })
                .then(res => {
                    if (res === 200) 
                    this.props.workHour.bookings.find(booking => booking.bookingId === this.state.selectedBooking).status = "canceledMedicCentre";
                    return res.json()})
                .then(r => console.log(r))
                    .catch(e => console.log(e));
              } catch (e) { console.log(e) }
        }
      }
    render() {
        return (
            <View>
                <Dialog visible={this.state.cancelBooking}
                    onTouchOutside={() => this.setState({ cancelBooking: false })}
                    title={'Desea eliminar el turno?'}
                    supportingText={this.state.modalBookingTest}
                    actionItems={[
                        {
                            text: 'Eliminar',
                            textColor: 'red',
                            onPress: () =>  {this.cancelBooking(); this.setState({ cancelBooking: false })},
                        },
                        {
                            text: 'Cancelar',
                            onPress: () =>  this.setState({ cancelBooking: false })
                        }]}
                />
                <ListSection 
                    label={moment(this.props.workHour.day).format("DD / MM") + ' - ' + this.props.workHour.startHour + " a " + this.props.workHour.finishHour}
                    color="#000" topDivider={true} >                           
                    {
                        this.props.workHour.bookings.map(booking => {
                            if (booking === undefined) ;
                            else {
                                if (booking.patientId === null && booking.status === "")
                                    return <ListItem key={booking.bookingId} 
                                        text={'Libre'}
                                        secondaryText={booking.time_start + ' - ' + booking.time_end}
                                        disabled={this.state.isInThisWeek}
                                        actionItem={(!this.state.isInThisWeek && <IconButton name="cancel" size={24} disabled={false} color="#6e6e6e" onPress={() => this.cancelBookingModal(booking)}/>)}
                                    />
                                else if (booking.status === "canceledMedicCentre") {
                                    return <ListItem key={booking.bookingId} 
                                        text={'CANCELADO'}
                                        secondaryText={booking.time_start + ' - ' + booking.time_end}
                                        disabled={true}
                                    />
                                }
                                else 
                                    return <ListItem key={booking.bookingId}
                                        text={booking.patient.sureName + ', ' + booking.patient.name}
                                        secondaryText={booking.time_start + ' - ' + booking.time_end}
                                        actionItem={(!this.state.isInThisWeek && <IconButton name="cancel" size={24} disabled={false} color="#6e6e6e" onPress={() => this.cancelBookingModal(booking)}/>)}
                                    />
                            }
                        })               
                    }
                </ListSection>
            </View>
        );
    }
}