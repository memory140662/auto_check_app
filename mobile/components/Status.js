import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const Status = ({ status }) => (
    <View style={styles.row}>
        <View style={styles.col}>
            <Text style={styles.text}>
                {status.date}
            </Text>
        </View>
        <View style={styles.col}>
            <Text style={styles.text}>
                {status.checkinTime}
            </Text>
        </View>
        <View style={styles.col}>
            <Text style={styles.text}>
                {status.checkoutTime}
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 4, 
        alignItems: 'center',
        backgroundColor: 'white',
        height: 80
    },
    col: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20
    }
});

export default Status;