import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, TouchableOpacity, ToastAndroid } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { referralHistory } from '../../actions/ApiActions';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';


const ReferralHistory = ({ navigation }) => {
    const [referralHistoryData, setReferralHistoryData] = useState([]);
    const [referralCode, setReferrelCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReferralHistory = async () => {
        try {
            const result = await referralHistory(navigation);
            console.log('Result:', result);
            if (result[0] === 200) {
                setReferralHistoryData(result[1].referral_history);
                setReferrelCode(result[1].referrel_code);
            }
        } catch (err) {
            console.log('Error:', err);
            setError('Failed to fetch referral history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferralHistory();
    }, []);

    const handleCopyReferralCode = () => {
        Clipboard.setString(referralCode);
        ToastAndroid.show('Referral code copied!', ToastAndroid.SHORT);
    };

    const renderReferralItem = ({ item }) => {
        const borderColor = item.status.toLowerCase() === 'pending' ? '#FFC107' : '#4CAF50';

        return (
            <Card style={[styles.card, { borderLeftWidth: 5, borderLeftColor: borderColor }]}>
                <Card.Content>
                    <Title>{item.invitee}</Title>
                    <Paragraph>Referral Code: {item.referral_code}</Paragraph>
                    <Paragraph>Status: {item.status.toUpperCase()}</Paragraph>
                </Card.Content>
            </Card>
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.referralCodeText}>Referral Code: {referralCode}</Text>
                <TouchableOpacity onPress={handleCopyReferralCode}>
                    <Icon name="copy-outline" size={24} color="#B94EA0" style={styles.copyIcon} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={referralHistoryData}
                keyExtractor={(item) => item.referral_code}
                renderItem={renderReferralItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No referrals found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFF',
        elevation: 2,
        marginBottom: 10,
    },
    referralCodeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#B94EA0',
        marginRight: 8,
    },
    copyIcon: {
        marginLeft: 8,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        margin: 10,
        borderRadius: 8,
        elevation: 3,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    list: {
        paddingHorizontal: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
});

export default ReferralHistory;
