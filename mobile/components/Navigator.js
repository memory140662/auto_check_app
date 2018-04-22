import React from 'react';
import {
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import Navigator from 'react-navigation';
import { connect } from 'react-redux';

import Home from './Home';
import Settings from './Settings';
import SettingsImg from '../assets/settings.png';
import SaveImg from '../assets/save.png';

const homeHeaderRight = ({ navigation }) => (
    <TouchableOpacity
        style={styles.headerRight}
        onPress={() => {
            navigation.push('Settings');
        }}
    >
        <Image source={SettingsImg} />
    </TouchableOpacity>
);

const settingsHeaderRight = (props) => {
    let params = props.navigation.state.params || {};
    return (
        <TouchableOpacity
            style={styles.headerRight}
            onPress={params.saveSettings}
        >
            <Image source={SaveImg} />
        </TouchableOpacity>
    )
};

const AppNavigator = Navigator.StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: props => ({
            title: 'Techlink Check',
            headerRight: homeHeaderRight(props)
        })
    },
    Settings: {
        screen: Settings,
        navigationOptions: props => ({
            title: 'Settings',
            headerRight: settingsHeaderRight(props)
        })
    }
});

export default AppNavigator;

const styles = StyleSheet.create({
    headerRight: {
        margin: 10
    }
});