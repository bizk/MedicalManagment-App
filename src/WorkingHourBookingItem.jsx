import React from 'react';
import { Button, ListSection, IconButton, ListItem } from 'material-bread';

export default class WorkingHourBookingItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ListItem text={'Yanzon, Carlos Santiago'}
                secondaryText={'8:00 - 8:30'}
                actionItem={<IconButton name="edit" size={24} color="#6e6e6e" onPress={() => {}}/>}
            />
        );
    }
}