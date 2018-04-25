import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    Button,
    Alert,
    ActivityIndicator,
    RefreshControl,
    Keyboard,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Field from '../components/Field';
import * as actions from '../actions'
import Aux from '../hoc/Aux';
import Days from './Days';

const SETTINGS = [
    'account',
    'password',
    'days',
    'latitude',
    'longitude',
    'companyName',
    'isCalendar'
];
class Settings extends React.Component {

    state = {
        prevSettings: null,
        isSaved: false,
        isErrorShow: false
    }

    componentDidMount() {
        this.props.navigation.setParams({ saveSettings: this.saveSettings });
        if (!this.props.settings.days) {
            this.props.fetchSettings(this.props.settings.account);
        }
        this.setState({ isSaved: false });
    }

    componentWillReceiveProps(nextProps) {
        const nextSettings = _.pick(nextProps.settings, SETTINGS);
        if (!this.state.prevSettings || (this.state.isSaved && !nextProps.loginError)) {
            this.setState({
                prevSettings: { ...nextSettings },
                isSaved: false
            });
        }
    }

    saveSettings = () => {
        Keyboard.dismiss();
        this.setState({ isSaved: true, isErrorShow: false });
        if (!this.props.settings.password || !this.props.settings.account) {
            return Alert.alert('Error!', 'Must provide Account or Password!');
        }
        if (!this.props.saving) {
            this.props.saveSettings(_.pick(this.props.settings, SETTINGS));
        }
    }

    componentWillUnmount() {
        if (!this.state.isSaved && this.state.prevSettings || this.props.loginError || this.props.settings.error) {
            this.props.retrieveSettings(this.state.prevSettings);
        } else if (this.state.isSaved
            && (!_.isEqual(this.props.settings.account, this.state.prevSettings.account)
                || !_.isEqual(this.props.settings.password, this.state.prevSettings.password))) {
            this.props.fetchStatus(this.props.settings.account, this.props.settings.password);
        }
    }

    refreshHandler = () => {
        this.props.retrieveSettings(this.state.prevSettings);
        if (this.state.prevSettings.account && this.state.prevSettings.password) {
            this.props.fetchStatus(this.state.prevSettings.account, this.state.prevSettings.password);
        }
    }

    renderMessage = () => {
        let message = null;
        if (!this.state.isSaved || this.props.settings.saving || this.props.logining) return message;
        if (this.props.settings.error || this.props.loginError) {
            message = <Text style={styles.fail}>SAVE FAILED</Text>;
        } else {
            message = <Text style={styles.success}>SAVE SUCCESSED</Text>;
        }

        if (this.props.loginError && !this.state.isErrorShow) {
            Alert.alert('Error!', 'Account, Password or Company error!');
            this.setState({ isErrorShow: true });
        }
        return (
            <View style={styles.message}>
                {message}
            </View>
        );
    }

    renderMoreDetails = () => {
        let content = null;
        const { settings } = this.props;
        if (!settings.loading) {
            content = (
                <Aux>
                    <Field
                        label="Company"
                        value={settings.companyName}
                        onValueChange={companyName => this.props.changeSettings({
                            companyName
                        })}
                    />
                    <Field
                        label="Latitude"
                        value={_.toString(settings.latitude)}
                        keyboardType="numeric"
                        onValueChange={latitude => this.props.changeSettings({
                            latitude
                        })}
                    />
                    <Field
                        label="Longitude"
                        value={_.toString(settings.longitude)}
                        keyboardType="numeric"
                        onValueChange={longitude => this.props.changeSettings({
                            longitude
                        })}
                    />
                     <Field
                        label="Check Government Calendar"
                        value={settings.isCalendar}
                        type="switch"
                        onValueChange={isCalendar => this.props.changeSettings({
                            isCalendar
                        })}
                    />
                    <Days
                        days={settings.days}
                        isCalendar={settings.isCalendar}
                        onValueChange={this.props.changeSettings}
                    />
                </Aux>
            );
        }
        return content;
    }


    render() {

        let { settings } = this.props;

        return (
            <Aux>
                {this.renderMessage()}
                <ScrollView
                    contentContainerStyle={styles.settings}
                    refreshControl={
                        <RefreshControl
                            refreshing={settings.saving || settings.loading || this.props.logining}
                            onRefresh={this.refreshHandler}
                        />
                    }>
                    <Field
                        label="Account"
                        value={settings.account}
                        onValueChange={account => this.props.changeSettings({
                            account
                        })}
                    />
                    <Field
                        label="Password"
                        isSecure
                        value={settings.password}
                        onValueChange={password => this.props.changeSettings({
                            password
                        })}
                    />
                    {this.renderMoreDetails()}
                </ScrollView>
            </Aux>
        );
    }
}

const styles = StyleSheet.create({
    settings: {
        margin: 10
    },
    message: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 5,
        marginTop: 10
    },
    success: {
        color: 'green'
    },
    fail: {
        color: 'red'
    },
    spinner: {
        flex: 1,
        justifyContent: 'center'
    }
});

const mapStateToProps = ({ settings, auth }) => ({
    settings,
    loginError: auth.error,
    logining: auth.logining
});

const mapDispatchToProps = dispatch => ({
    saveSettings: async settings => {
        await dispatch(actions.login(settings));
        await dispatch(actions.saveSettings(settings));
    },
    fetchSettings: bindActionCreators(actions.fetchSettings, dispatch),
    fetchStatus: bindActionCreators(actions.fetchStatus, dispatch),
    changeSettings: bindActionCreators(actions.changeSettings, dispatch),
    retrieveSettings: bindActionCreators(actions.retrieveSettings, dispatch),
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Settings);