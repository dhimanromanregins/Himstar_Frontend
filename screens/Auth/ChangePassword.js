import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    ScrollView,
    ToastAndroid,
} from 'react-native';
import { updateProfile } from '../../actions/ApiActions';
import Icon from 'react-native-vector-icons/MaterialIcons';


const ChangePassword = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async() => {
        if (!newPassword || !confirmPassword) {
            ToastAndroid.show('Password and confirm password are required.', ToastAndroid.SHORT);
            return;
        }

        if (newPassword.length < 6) {
            ToastAndroid.show('New password must be at least 6 characters long.', ToastAndroid.SHORT);
            return;
        }

        if (newPassword !== confirmPassword) {
            ToastAndroid.show('New password and confirm password do not match.', ToastAndroid.SHORT);
            return;
        }

        setLoading(true);
        const result = await updateProfile(navigation, {password: newPassword});
        console.log(newPassword, 'result>>>>', result);
        if (result[0] === 200){
            ToastAndroid.show('Password changed successfully.', ToastAndroid.SHORT);
            navigation.goBack();
        }
        else{
            ToastAndroid.show(result[1], ToastAndroid.SHORT);
        }
        setLoading(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Change Password</Text>
            <View style={styles.formGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
                <Text style={styles.submitButtonText}>Change Password</Text>
            </TouchableOpacity>
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color='#B94EA0' />
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    backButtonContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
    backButton: {
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#B94EA0',
        marginBottom: 20,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#B94EA0',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});

export default ChangePassword;
