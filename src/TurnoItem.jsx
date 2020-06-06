import React from 'react';
import {
  Text,
  View
} from 'react-native';
import {
  Card,
  CardContent,
  shadow,
  Button,
  Icon,
  Subtitle
} from 'material-bread';

export default class TurnoItem extends React.Component {
    constructor(props) {
      super(props);
      console.log("aaa", this.props.booking.status);

      this.state = {
        status: this.props.booking.status
      }
      this.confirmBooking = this.confirmBooking.bind(this);
      this.cancelBooking = this.cancelBooking.bind(this);
    }

    componentDidMount() {
      console.log(this.props.booking.bookingId, this.props.bookingStatus, this.props.booking.status);
      this.setState({
        status: this.props.booking.status
      })
    }

    async confirmBooking() {
      console.log(this.props.booking.bookingId);
      try {
        fetch("http://192.168.0.224:8080/booking/confirmBooking", {
            method: 'PUT',
            mode: "cors",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              bookingId: this.props.booking.bookingId
            })
          })
          .then(res => {
            if (res.status === 200)
              this.setState({
                status: "confirmed"
              })
            else
              this.setState({
                status: "expirado"
              })
            return res.json()
          })
          .catch(e => console.log(e));
      } catch (e) {
        console.log(e)
      }
    }

    async cancelBooking() {
      try {
        fetch("http://192.168.0.224:8080/booking/cancelBooking", {
            method: 'PUT',
            mode: "cors",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              bookingId: this.props.booking.bookingId
            })
          })
          .then(res => {
            if (res.status === 200)
              this.setState({
                status: "canceled"
              })
            else
              this.setState({
                status: "expirado"
              })
            return res.json()
          })
          .catch(e => console.log(e));
      } catch (e) {
        console.log(e)
      }
    }

    render() {
      return(
        <Card style={{
          marginBottom: 12, 
          ...shadow(6),
          width: '95%',
          minWidth: '95%',
          alignItems: 'center',
          justifyContent: 'center'
          }}
          outlined >
            <View style={{width:"100%",  alignItems: 'center', flexDirection: 'row'}}>
                <View style={{flex:1, marginLeft:'4%', flexDirection: 'column', marginTop:6}}>
                    <View style={{flexDirection: 'row', marginBottom: 6}}>
                        <Text style={{ color: 'rgba(0,0,0,.9)', fontSize: 16, fontWeight: '600', marginRight: 6}}>
                            {this.props.booking.speciality.type}
                        </Text>
                        <Text style={{ color: 'rgba(0,0,0,.6)', fontSize: 16 }}>   
                            {this.props.booking.medic.sureName + " " + this.props.booking.medic.name}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: 6}}>
                        <Text style={{ color: 'rgba(0,0,0,.6)', fontSize: 14, marginRight: 6 }}>   
                            {this.props.booking.day}
                        </Text>
                        <Text style={{ color: 'rgba(0,0,0,.6)', fontSize: 14 }}>   
                            {this.props.booking.time_start}
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection:'column', backgroundColor:'#fff'}}>
                    <Button text={"Cancelar"} disabled={(this.state.status === "canceled" || this.state.status === "expirado") ? true : false} textColor={"#E05858"} dense onPress={this.cancelBooking} />
                    <Button text={'Confirmar'} disabled={(this.state.status === "") ? false : true} type="outlined" textColor={'#009688'} borderSize={1} dense onPress={this.confirmBooking} />
                </View>
            </View>
            {/* <View style={{paddingTop: 5, marginTop: 5, width: '100%', alignItems:"center", borderTopWidth: 0.5, borderColor: '#FF5722'}}>
              <Subtitle type={1} color={'#FF5722'} text="Cancelado por el centro medico" />
            </View> */}
            {((this.state.status === "canceled") && 
              <View style={{paddingTop: 5, marginTop: 5, width: '100%', alignItems:"center", borderTopWidth: 0.5, borderColor: '#E05858'}}>
                <Subtitle type={1} color={'#E05858'} text="Cancelado por el paciente" />
              </View>
            )}
            {((this.state.status === "confirmed") && 
              <View style={{paddingTop: 5, marginTop: 5, width: '100%', alignItems:"center", borderTopWidth: 0.5, borderColor: '#009688'}}>
                <Subtitle type={1} color={'#009688'} text="Confirmado" />
              </View>
            )}
            {((this.state.status === "expirado") && 
              <View style={{paddingTop: 5, marginTop: 5, width: '100%', alignItems:"center", borderTopWidth: 0.5, borderColor: '#607d8b'}}>
                <Subtitle type={1} color={'#607d8b'} text="Expirado" />
              </View>
            )}
        </Card>
      );
    }
  }