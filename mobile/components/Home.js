import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';

import * as actions from '../actions';
import Status from './Status';
import Aux from '../hoc/Aux';
import CheckButton from './CheckButton';

class Home extends React.Component {

    async componentDidMount() {
        await this.props.login(this.props.settings);
        await this.fetchStatus();
    }

    fetchStatus = async () => {
        await  this.props.fetchStatus(this.props.settings);
    }

    checkIn = async (type) => {
        await this.props.checkIn(
            this.props.settings,
            _.pick(this.props.auth, [
                'accountId', 'userId', 'token'
            ]),
            type
        );
        await this.fetchStatus();
    }

    render() {
        let error = null;
        if (_.isEmpty(this.props.home.statusList)) {
            error = (
                <View style={styles.error}>
                    <Text>NO DATA</Text>
                </View>
            );
        }

        return (
            <View style={styles.contanier}>
                <View style={styles.check}>
                    <CheckButton
                        onPress={() => this.checkIn(0)}>
                        Check In
                    </CheckButton>
                    <CheckButton onPress={() => this.checkIn(1)}>
                        Check Out
                    </CheckButton>
                </View>
                {error}
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                _.isEmpty(this.props.home.statusList)
                                && !_.isEmpty(this.props.settings.account)
                                && !_.isEmpty(this.props.settings.password)
                                && !this.props.auth.error
                            }
                            onRefresh={this.fetchStatus}
                        />
                    }
                    data={this.props.home.statusList}
                    keyExtractor={(item, index) => _.toString(index)}
                    renderItem={({ item }) => <Status status={item} />} />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    contanier: {
        flex: 1,
        backgroundColor: '#ccc',
        justifyContent: 'center'
    },
    error: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    check: {
        backgroundColor: '#ccc',
        flexDirection: 'row',
        height: 80,
        margin: 5,
        marginStart: 2,
        marginEnd: 2,
    },
    status: {
        flex: 1
    }
});

const mapStateToProps = ({ home, settings, auth }) => ({
    home,
    settings,
    auth
});

const mapDispatchToProps = dispatch => ({
    fetchStatus: bindActionCreators(actions.fetchStatus, dispatch),
    checkIn: bindActionCreators(actions.checkIn, dispatch),
    login: bindActionCreators(actions.login, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);