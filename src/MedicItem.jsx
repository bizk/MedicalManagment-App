import React from 'react';
import {
    Dialog,
    Card,
    IconButton
} from 'material-bread';
import {
    View,
    Text
} from 'react-native';
import moment from "moment";

export default class MedicItem extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isInThisWeek: true,

                selectedBooking: -1,

                cancelBooking: false,
                modalBookingTest: "",

            };
            if (moment(this.props.booking.day).isAfter(moment().add(7, 'days').startOf('day'))) this.state.isInThisWeek = false;
        }


        cancelBookingModal() {
            this.setState({
                cancelBooking: true,
                selectedBooking: this.props.booking.bookingId
            });
            if (this.props.booking.status === "") this.setState({
                modalBookingTest: "LIBRE - Dia: " + this.props.booking.day + " - " + this.props.booking.time_start +
                    " a " + this.props.booking.time_end
            })
            else this.setState({
                modalBookingTest: "Dia: " + this.props.booking.day + " - " + this.props.booking.time_start +
                    " a " + this.props.booking.time_end + " Paciente " + this.props.booking.patient.sureName + ', ' + this.props.booking.patient.name
            })
        }

        async cancelBooking() {
            try {
                fetch(`${backendUrl}booking`, {
                        method: 'DELETE',
                        mode: "cors",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            bookingId: this.props.booking.bookingId
                        })
                    })
                    .then(this.props.booking.status = "canceledMedicCentre")
                    .catch(e => console.log(e));
            } catch (e) {
                console.log(e)
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
                        <Card style={{ marginBottom: 12, width: '100%', minWidth: '100%', alignItems: 'center',justifyContent: 'center'}} outlined >
                            <View style={{width:"100%",  alignItems: 'center', flexDirection: 'row'}}>
                                <View style={{flex:1, marginLeft:15, flexDirection: 'column', marginTop:4}}>
                                    {(this.props.booking.status === "") && 
                                        <View style={{flexDirection: 'row', marginBottom: 6}}>
                                            <Text style={{ color: 'rgba(0,0,0,.9)', fontSize: 16, fontWeight: '600', marginRight: 6}}>
                                                {this.props.booking.speciality.type}
                                            </Text>
                                            <Text style={{ color: 'rgba(0,0,0,.9)', fontSize: 16, fontWeight: '600', marginRight: 6}}>
                                                LIBRE
                                            </Text>
                                        </View>
                                    }
                                    {(this.props.booking.status === "canceledMedicCentre" || this.props.booking.status === "canceled" ) && 
                                        <View style={{flexDirection: 'row', marginBottom: 6}}>
                                            <Text style={{ color: '#AAA', fontSize: 16, fontWeight: '600', marginRight: 6}}>
                                                {this.props.booking.speciality.type}
                                            </Text>
                                            <Text style={{ color: '#AAA', fontSize: 16, fontWeight: '600', marginRight: 6}}>
                                                CANCELADO
                                            </Text>
                                        </View>
                                    }
                                    {(this.props.booking.status === "reservado") && 
                                        <View style={{flexDirection: 'row', marginBottom: 6}}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 6}}>
                                                {this.props.booking.speciality.type}
                                            </Text>
                                            <Text style={{ fontSize: 16 , fontWeight: 'bold'}}>   
                                                {this.props.booking.patient.sureName + " " + this.props.booking.patient.name}
                                            </Text>
                                        </View>
                                    }
                                    {(this.props.booking.status === "confirmed") && 
                                        <View style={{flexDirection: 'row', marginBottom: 6}}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 6, color: "#009688"}}>
                                                {this.props.booking.speciality.type}
                                            </Text>
                                            <Text style={{ fontSize: 16 , fontWeight: 'bold'}}>   
                                                {this.props.booking.patient.sureName + " " + this.props.booking.patient.name}
                                            </Text>
                                        </View>
                                    }
                                    <View style={{flexDirection: 'row', marginBottom: 6}}>
                                        <Text style={{ color: 'rgba(0,0,0,.6)', fontSize: 14, marginRight: 6 }}>   
                                            {this.props.booking.day + " - " + this.props.booking.time_start + " " + this.props.booking.time_end}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'column', marginRight: 15}}> 
                                    {(!this.state.isInThisWeek && this.props.booking.status === '' && <IconButton name="cancel" size={24} disabled={false} color="#6e6e6e" onPress={() => this.cancelBookingModal()}/>)}
                                </View>
                            </View>
                        </Card>
                    </View>
        );
    }
}