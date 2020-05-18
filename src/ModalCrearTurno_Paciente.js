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
        const data = [
            { id: 1, name: 'Option 1' },
            { id: 2, name: 'Option 2' },
            { id: 3, name: 'Option 3' },
        ];
        
        return(
            <Modal isVisible={this.state.isModalVisible}>
                <Paper style={{ flex: 1 }}>
                    <View style= {{flex: 1}}>       
                    <Text>I am the modal content!</Text>
                    <Select
                        label={'Select'}
                        type={'outlined'}
                        menuItems={data}
                        onSelect={value => this.setState({ selectedItemThree: value.name })}
                        selectedItem={this.state.selectedItemThree}
                    />
                    
                    <Text>I am the modal content!</Text>
                    <Select
                        label={'Select'}
                        type={'outlined'}
                        menuItems={data}
                        onSelect={value => this.setState({ selectedItemThree: value.name })}
                        selectedItem={this.state.selectedItemThree}
                        />
                    <View style={{flex: 1}}/>
                    <Button 
                        text={'Cancelar'} 
                        textColor={'#E91E63'} 
                        borderSize={2} 
                        icon={<Icon name="favorite" />} 
                        onPress={this.toggleModal}/>
                    <Button
                        text={'Agregar turno'}
                        color={'#E91E63'} 
                        type="flat"
                    />
                    </View>
                </Paper>
            </Modal>
        )   
    }
}