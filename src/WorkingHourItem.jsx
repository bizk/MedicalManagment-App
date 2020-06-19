import React from 'react';
import { Button, ListSection, IconButton, ListItem } from 'material-bread';
import { WorkingHourBookingItem } from './WorkingHourBookingItem';

export default class WorkingHourItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // status: this.props.booking.status
        }
    }

    componentDidMount() {
        // this.setState({
        //     status: this.props.booking.status
        // })
        // console.log(this.props);
    }

    render() {
        return (
            <ListSection label={'OFTALMOLOGIA - ' + this.props.workHour.startHour + " a " + this.props.workHour.finishHour}>                           
                {
                    this.props.workHour.bookings.map(booking => {
                        if (booking === undefined) ;
                        else {
                            if (booking.status === "")
                                return <ListItem key={booking.bookingId} text={'Libre'}
                                    secondaryText={booking.time_start + ' - ' + booking.time_end}
                                    actionItem={<IconButton name="edit" size={24} color="#6e6e6e" onPress={() => {}}/>}
                                />
                            else 
                                return <ListItem text={booking.patient.sureName + ', ' + booking.patient.name}
                                    secondaryText={booking.time_start + ' - ' + booking.time_end}
                                    actionItem={<IconButton name="edit" size={24} color="#6e6e6e" onPress={() => {}}/>}
                                />
                        }
                    })               
                }
                
                <Button text={'Editar horario'}
                    style={{width:`100%`}}
                    type="outlined"
                    radius={20}
                    onPress={this.toggleModal} 
                />
            </ListSection>
        );
    }
}