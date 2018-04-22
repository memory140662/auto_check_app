import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Switch
} from 'react-native';

const Field = ({ type, label, isSecure, onValueChange, value, keyboardType }) => {

    let field = null;

    switch (type) {
        case 'switch':
            field = (
                <Switch onValueChange={onValueChange} value={value} />
            );
            break;
        default:
            field = (
                <TextInput
                    style={styles.input}
                    placeholder={label}
                    secureTextEntry={isSecure} 
                    onChangeText={onValueChange}
                    value={value}
                    keyboardType={keyboardType}
                />
            );
    }

    return (
        <View style={styles.field}>
            <View style={styles.label}>
                <Text style={styles.labelText}>{label}</Text>
            </View>
            {field}
        </View>
    );
};

const styles = StyleSheet.create({
    field: {
        flex: 1, 
        flexDirection: 'row',
        margin: 10
    },
    label: {
        flex: 1,
        justifyContent: 'center'
    },
    labelText: {
        fontSize: 16,
    },
    input: {
        fontSize: 24,
        flex: 3
    }
});


export default Field;