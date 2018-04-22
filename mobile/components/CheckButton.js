import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';
import propTypes from 'prop-types';
import _ from 'lodash';

import Aux from '../hoc/Aux';

const CheckButton = ({ children, onPress }) => (
    <Aux>
        <TouchableOpacity 
            style={styles.button}
            onPress={onPress}
        >
            <Text style={styles.text}>{_.toUpper(children)}</Text>
        </TouchableOpacity>
    </Aux>
)

const styles = StyleSheet.create({
    button: {
        flex: 1,
        backgroundColor: '#2b75af',
        marginStart: 2,
        marginEnd: 2,
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center'
    },
    text: {
        fontSize: 32,
        color: 'white'
    },
});

export default CheckButton;