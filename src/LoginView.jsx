import React from 'react';
import { View } from 'react-native';
import {  Paper, Heading, Subtitle, Button, TextField, ProgressCircle } from 'material-bread';

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginMessageError: false,
            userInput: "paciente_1",
            userSecret: "abc123",

            isInProgress: false,
        }
        
        this.login = this.login.bind(this);
    }

    async login() {
        var x = this.props.loginStatus;
        this.setState({isInProgress: true});
        try{
          fetch("http://192.168.0.224:8080/users" ,{
            method: 'POST',
            mode: "cors",
            headers:{ 'Content-Type': 'application/json'},
            body: JSON.stringify({
                mail: this.state.userInput,
                password: this.state.userSecret
            })
            }).then(res => {
                this.setState({isInProgress: false});
                if (res.status === 200) res.json().then(json => x(json));
                else if (res.status === 300) this.setState({loginMessageError: true})
            })
            .catch(e => console.log(e));
        } catch (e) {
            this.setState({isInProgress: false});
            console.log(e) 
        }
      }

    render() {

        return (
            <View style={{flex:1, backgroundColor: '#f0f0f0', flexDirection: "row",
                justifyContent: "center", alignItems: "center"}}>
                <Paper style={{ flex: 1, margin: 20, marginTop: 30, backgroundColor: '#F9FAFF'}}>
                {(
                    this.state.isInProgress &&
                    <View style={{width:"100%", height:"100%", zIndex: 1, position: "absolute", backgroundColor:"rgba(255,255,255,0.6)", justifyContent:'center', alignItems:'center'}}>
                    <ProgressCircle color={"#E05858"}/>
                    </View>
                )}
                    <View style={{flex: 1, margin: 15}}>
                        <View style={{width: '100%', borderBottomColor:'#E05858', borderBottomWidth: 1}}> 
                            <Heading style={{color: '#E05858'}} type={2} text="Bienvenido." />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Subtitle type={1} text="Nombre de usuario:" />
                            <TextField
                                containerStyle={{ marginTop: 20 }}
                                type={'outlined'}
                                value={this.state.userInput}
                                onChangeText={value => this.setState({userInput: value})}
                                />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Subtitle type={1} text="Contrasena:" />
                            <TextField
                                secureTextEntry={true}
                                containerStyle={{ marginTop: 20 }}
                                type={'outlined'}
                                value={this.state.userSecret}
                                onChangeText={value => this.setState({userSecret: value})}
                                />
                        </View>
                        {
                            this.state.loginMessageError && 
                            <View style={{marginTop: 15}}>
                                <Subtitle color={'#E05858'} type={1} text="Usuario o contraseña incorrecta. Vuelva a intentarlo o comuníquese con su centro de salud,"/>
                            </View>
                        }
                        <View style={{flex: 1}}/>
                        
                        <Button 
                            text={'Iniciar sesion'} 
                            color={'#E05858'} 
                            style={{height: 45}}
                            borderSize={2} 
                            onPress={this.login}
                            type="contained"
                            fullWidth
                            />
                    </View>
                </Paper>    
            </View>
        )
    }
}