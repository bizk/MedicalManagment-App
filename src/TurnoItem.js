import React from 'react';
import { Text, View } from 'react-native';
import { Card, CardContent, shadow, Button, Icon } from 'material-bread';

export default class TurnoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: ""
        }
    }

    componentDidMount() {
        this.setState({status: this.props.booking.status})
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
                <View style={{flexDirection:'column'}}>
                    <Button text={"Cancelar"} textColor={"#E05858"} dense/>
                    <Button text={'Confirmar'} type="outlined" textColor={'#009688'} borderSize={1} dense />
                </View>
            </View>
        </Card>
      );
    }
  }