import React, { useEffect, useState, useContext } from 'react'
import { NativeEventEmitter, StyleSheet, Text, View, TouchableOpacity, ToastAndroid, Modal, ActivityIndicator, LogBox } from 'react-native'
import PayUBizSdk from 'payu-non-seam-less-react';
import { sha512 } from 'js-sha512';
import { makePayment } from '../../actions/ApiActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainContext } from '../../others/MyContext';
import { BASE_URL } from '../../actions/APIs';


const Payment = ({ route, navigation }) => {
    const { setHomeReload } = useContext(MainContext);
    const { competition, amount, firstName, email, phone, reg_id } = route.params;
    // const [userId, setUserId] = useState(null);
    const currentDate = new Date().toLocaleDateString();
    const [loading, setLoading] = useState(false);

    const [key, setKey] = useState("wUKnWv");
    const [merchantSalt, setMerchantSalt] = useState("dfnpSUMPtmdP9T0UT02vyKseFpuUDxSu");

    const [ios_surl, setIosSurl] = useState(
        `${BASE_URL}/api/success/`,
    );
    const [ios_furl, setIosFurl] = useState(
        `${BASE_URL}/api/failure/`,
    );
    const [environment, setEnvironment] = useState(1 + '');
    const [android_surl, setAndroidSurl] = useState(
        `${BASE_URL}/api/success/`,
    );
    const [android_furl, setAndroidFurl] = useState(
        `${BASE_URL}/api/failure/`,
    );

    const [showCbToolbar, setShowCbToolbar] = useState(true);
    const [userCredential, setUserCredential] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#B94EA0');

    const [secondaryColor, setSecondaryColor] = useState('#022daf');
    const [merchantName, setMerchantName] = useState('DEMO PAY U');
    const [merchantLogo, setMerchantLogo] = useState("");

    const [surePayCount, setSurePayCount] = useState(1);
    const [merchantResponseTimeout, setMerchantResponseTimeout] = useState(10000);
    const [autoApprove, setAutoApprove] = useState(false);
    const [merchantSMSPermission, setMerchantSMSPermission] = useState(false);
    const [
        showExitConfirmationOnCheckoutScreen,
        setShowExitConfirmationOnCheckoutScreen,
    ] = useState(true);
    const [
        showExitConfirmationOnPaymentScreen,
        setShowExitConfirmationOnPaymentScreen,
    ] = useState(true);

    const [autoSelectOtp, setAutoSelectOtp] = useState(true);

    const fetchUser = async () => {
        const id = await AsyncStorage.getItem('RegAuthId');
        if (!id) {
            ToastAndroid.show('Something went wrong, please try again!', ToastAndroid.SHORT);
            setLoading(false);
            navigation.goBack();
        }
        // setUserId(id);
    };

    useEffect(() => {
        LogBox.ignoreLogs(['new NativeEventEmitter']);
        fetchUser();
    }, []);

    requestSMSPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
                {
                    title: 'PayU SMS Permission',
                    message:
                        'Pay U needs access to your sms to autofill OTP on Bank Pages ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('SMS Permission Granted!');
            } else {
                console.log('SMS Permission Denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    displayAlert = async (status, value, successResponse = null) => {
        if (status === 'Success') {
            if (competition.competition_type === 'competition') {
                successResponse['competition'] = competition?.id;
            }
            else if (competition.competition_type === 'tournament') {
                successResponse['tournament'] = competition?.id;
                successResponse['tci'] = competition?.competition?.id;
            }
            else {
                ToastAndroid.show('You did a wrong payment, please contact to our supports team.', ToastAndroid.LONG);
                navigation.goBack();
                setLoading(false);
                return;
            }
            successResponse['user'] = reg_id;
            const result = await makePayment(navigation, successResponse);
            if (result[0] === 201) {
                setHomeReload(true);
                setLoading(false);
                navigation.navigate('ViewComp', { compId: competition.id, compType: competition.competition_type });
            }
            else {
                ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
                navigation.goBack();
            }
        };
        if (value.includes('canceled')) {
            setLoading(false);
        }
        ToastAndroid.show(value, ToastAndroid.SHORT);
    };
    onPaymentSuccess = e => {
        console.log('Payment Success Data1:', e.merchantResponse);
        console.log('Payment Success Data2:', e.payuResponse);
        displayAlert('Success', "Registeration completed successfully.", JSON.parse(e.payuResponse));
    };

    onPaymentFailure = e => {
        console.log('Payment faluire Data1:', e.merchantResponse);
        console.log('Payment faluire Data1:', e.payuResponse);
        displayAlert('Fail', 'Payment failed, please try again!');
    };


    onPaymentCancel = e => {
        console.log('onPaymentCancel isTxnInitiated -' + e);
        displayAlert('Cancel', 'Payment canceled.');
    };

    onError = e => {
        console.log('Payment Error:', e)
        displayAlert('onError', JSON.stringify(e));
    };


    calculateHash = data => {
        console.log('Calculate HASH1', data);
        var result = sha512(data);
        console.log('Calculate HASH2', result);
        return result;
    };

    sendBackHash = (hashName, hashData) => {
        var hashValue = calculateHash(hashData);
        var result = { [hashName]: hashValue };
        console.log('SEND bACK', result);
        PayUBizSdk.hashGenerated(result);
    };
    generateHash = e => {
        console.log('Generate hash1', e.hashName);
        console.log('Generate hash2', e.hashString);
        sendBackHash(e.hashName, e.hashString + merchantSalt);
    };

    useEffect(() => {
        const eventEmitter = new NativeEventEmitter(PayUBizSdk);
        payUOnPaymentSuccess = eventEmitter.addListener(
            'onPaymentSuccess',
            onPaymentSuccess,
        );
        payUOnPaymentFailure = eventEmitter.addListener(
            'onPaymentFailure',
            onPaymentFailure,
        );
        payUOnPaymentCancel = eventEmitter.addListener(
            'onPaymentCancel',
            onPaymentCancel,
        );
        payUOnError = eventEmitter.addListener('onError', onError);
        payUGenerateHash = eventEmitter.addListener('generateHash', generateHash);

        return () => {
            payUOnPaymentSuccess.remove();
            payUOnPaymentFailure.remove();
            payUOnPaymentCancel.remove();
            payUOnError.remove();
            payUGenerateHash.remove();
        };
    }, [merchantSalt]);

    const createPaymentParams = () => {
        var txnid = new Date().getTime().toString();
        var payUPaymentParams = {
            key: key,
            transactionId: txnid,
            amount: amount,
            productInfo: competition.name,
            firstName: firstName,
            email: email,
            phone: phone,
            ios_surl: ios_surl,
            ios_furl: ios_furl,
            android_surl: android_surl,
            android_furl: android_furl,
            environment: environment,
            userCredential: userCredential,
        };
        var payUCheckoutProConfig = {
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
            merchantName: merchantName,
            merchantLogo: merchantLogo,
            showExitConfirmationOnCheckoutScreen:
                showExitConfirmationOnCheckoutScreen,
            showExitConfirmationOnPaymentScreen: showExitConfirmationOnPaymentScreen,
            surePayCount: surePayCount,
            merchantResponseTimeout: merchantResponseTimeout,
            autoSelectOtp: autoSelectOtp,
            autoApprove: autoApprove,
            merchantSMSPermission: merchantSMSPermission,
            showCbToolbar: showCbToolbar,
            enforcePaymentList: [{ 'payment_type': "UPI" }, { 'payment_type': "CARD" }]
        };
        return {
            payUPaymentParams: payUPaymentParams,
            payUCheckoutProConfig: payUCheckoutProConfig,
        };
    };

    const launchPayment = () => {
        setLoading(true);
        PayUBizSdk.openCheckoutScreen(createPaymentParams());
    };

    const getCurrentDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        return `${day}-${month}-${year}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerText}>Checkout Details</Text>
            </View>

            <View style={styles.card}>
                {/* Total Amount */}
                <View style={styles.detailGroup}>
                    <Text style={styles.label}>Total Amount</Text>
                    <Text style={styles.detail}>Rs.{amount}</Text>
                </View>

                {/* Date */}
                <View style={styles.detailGroup}>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.detail}>{getCurrentDate()}</Text>
                </View>

                {/* Competition Name */}
                <View style={styles.detailGroup}>
                    <Text style={styles.label}>Competition Name</Text>
                    <Text style={styles.detail}>{competition.name}</Text>
                </View>

                {/* Name */}
                <View style={styles.detailGroup}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.detail}>{firstName}</Text>
                </View>

                {/* Email */}
                <View style={styles.detailGroup}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.detail}>{email}</Text>
                </View>

                {/* Phone */}
                <View style={styles.detailGroup}>
                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.detail}>{phone}</Text>
                </View>
            </View>

            {/* Note */}
            <Text style={styles.note}>
                Note: After the payment is done, you will receive a confirmation email.
            </Text>

            <TouchableOpacity style={styles.checkoutButton} onPress={launchPayment}>
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color='#B94EA0' />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f9',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    backButtonContainer: {
        position: 'absolute',
        top: -5,
        left: -5,
        zIndex: 10,
    },
    backButton: {
        padding: 10,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#B94EA0',
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    detailItem: {
        fontSize: 16,
        color: '#555',
        marginVertical: 8,
    },
    label: {
        fontWeight: '600',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#B94EA0',
        textAlign: 'center',
        marginBottom: 30,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    detailGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#BD4DA3',
        marginBottom: 5,
    },
    detail: {
        fontSize: 16,
        color: '#333',
        padding: 0,
    },
    note: {
        fontSize: 14,
        color: '#BD4DA3',
        marginVertical: 20,
        textAlign: 'center',
    },
    checkoutButton: {
        backgroundColor: '#B94EA0',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});

export default Payment;
