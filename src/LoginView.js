import React from 'react';
import { View } from 'react-native';
import { Divider, Paper, Heading, Subtitle, Button, TextField } from 'material-bread';

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginMessageError: false,
        }
    }

    render() {

        return (
            <View style={{flex:1, backgroundColor: '#f0f0f0'}}>
                <Paper style={{ flex: 1, margin: 20, marginTop: 30, backgroundColor: '#F9FAFF'}}>
                    <View style={{flex: 1, margin: 15}}>
                        <View style={{width: '100%', borderBottomColor:'#E05858', borderBottomWidth: 1}}> 
                            <Heading style={{color: '#E05858'}} type={2} text="Bienvenido." />
                        </View>
                             
                        <View style={{marginTop: 20}}>
                            <Subtitle type={1} text="Nombre de usuario:" />
                            <TextField
                                containerStyle={{ marginTop: 20 }}
                                type={'outlined'}
                                value={"Usuario"}
                                onChangeText={value => console.log("usuario",value)}
                                />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Subtitle type={1} text="Contrasena:" />
                            <TextField
                                containerStyle={{ marginTop: 20 }}
                                type={'outlined'}
                                value={"Contrasena"}
                                onChangeText={value => console.log("Contrasena",value)}
                                />
                        </View>

                        <View style={{flex: 1}}/>
                        
                        <Button 
                            text={'Iniciar sesion'} 
                            color={'#E05858'} 
                            style={{height: 45}}
                            borderSize={2} 
                            onPress={console.log("hola!")}
                            type="contained"
                            fullWidth
                            />
                    </View>
                </Paper>    
            </View>
        )
    }
}