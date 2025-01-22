import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    ToastAndroid,
    ActivityIndicator,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BASE_URL } from '../../actions/APIs';
import { updateProfile } from '../../actions/ApiActions';
import {launchImageLibrary} from 'react-native-image-picker';
import { MainContext } from '../../others/MyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EditProfile = ({ navigation, route }) => {
    const {profileData} = route.params;
    const [myProfile, setMyProfile] = useState(profileData);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setProfileReload } = useContext(MainContext);
    
    useEffect(()=>{
        if (!profileData){
            ToastAndroid.show('Somthing went wrong.', ToastAndroid.SHORT);
            navigation.goBack();
        };
    }, []);

    const handleProfileChange = (field, value) => {
        setMyProfile((prevProfile) => ({ ...prevProfile, [field]: value }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            handleProfileChange('dob', selectedDate.toISOString().split('T')[0]);
        }
    };

    const handleImageEdit = async (type) => {
        const options = {
            mediaType: 'photo',
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.8,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('Image Picker Error: ', response.errorMessage);
            } else {
                const uri = response.assets[0].uri;
                if (type === 'profile') {
                    setMyProfile({...myProfile, profile_image: uri});
                } else if (type === 'cover') {
                    setMyProfile({...myProfile, cover_image: uri});
                }
            }
        });
    };

    const handleGenderChange = (gender) => {
        handleProfileChange('gender', gender.toLowerCase());
    };

    const saveProfile = async () => {
        setLoading(true);
    
        try {
            const formData = new FormData();

            formData.append('phonenumber', myProfile.phonenumber);
            formData.append('first_name', myProfile.first_name);
            formData.append('last_name', myProfile.last_name);
            formData.append('zipcode', myProfile.zipcode);
            formData.append('gender', myProfile.gender);
            formData.append('dob', myProfile.dob);

            if (myProfile.profile_image && myProfile.profile_image.includes('file:///')) {
                formData.append('profile_image', {
                    uri: myProfile.profile_image,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                });
            }
            if (myProfile.cover_image && myProfile.cover_image.includes('file:///')) {
                formData.append('cover_image', {
                    uri: myProfile.cover_image,
                    name: 'cover.jpg',
                    type: 'image/jpeg',
                });
            }

            const result = await updateProfile(navigation, formData);
    
            if (result[0] === 200) {
                await AsyncStorage.setItem('AuthPhone', result[1].phonenumber);
                ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
                setProfileReload(true);
                navigation.navigate('Profile');
            } else {
                console.log('Error updating profile:', result);
                ToastAndroid.show('Failed to update profile. Please try again.', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('Error in saveProfile:', error);
            ToastAndroid.show('An error occurred. Please try again.', ToastAndroid.SHORT);
        } finally {
            console.log('Loading stopped');
            setLoading(false);
        }
    };

    const renderRadioButton = (label) => (
        <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleGenderChange(label)}
        >
            <View style={[styles.radioCircle, myProfile.gender === label.toLowerCase() && styles.selectedCircle]} />
            <Text style={styles.radioText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Edit Profile</Text>

            <View style={styles.coverImageContainer}>
                <Image
                    source={
                        myProfile.cover_image
                            ? myProfile.cover_image.includes('file:///') 
                                ? { uri: myProfile.cover_image } 
                                : { uri: BASE_URL + myProfile.cover_image }
                            : require('./../../assets/images/dp.png')
                    }
                    style={styles.coverImage}
                />
                <TouchableOpacity
                    style={[styles.editIcon, styles.coverEditIcon]}
                    onPress={() => handleImageEdit('cover')}
                >
                    <Icon name="edit" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
                <Image
                    source={
                        myProfile.profile_image
                            ? myProfile.profile_image.includes('file:///') 
                                ? { uri: myProfile.profile_image } 
                                : { uri: BASE_URL + myProfile.profile_image }
                            : require('./../../assets/images/dp.png')
                    }
                    style={styles.profileImage}
                />
                <TouchableOpacity
                    style={[styles.editIcon, styles.profileEditIcon]}
                    onPress={() => handleImageEdit('profile')}
                >
                    <Icon name="edit" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    style={styles.input}
                    value={myProfile.first_name}
                    onChangeText={(value) => handleProfileChange('first_name', value)}
                    placeholder="Enter first name"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    style={styles.input}
                    value={myProfile.last_name}
                    onChangeText={(value) => handleProfileChange('last_name', value)}
                    placeholder="Enter last name"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                    <Text style={styles.inputText}>{myProfile.dob || 'Select Date'}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={myProfile.dob ? new Date(myProfile.dob) : new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.pickerContainer}>
                    <View style={styles.radioContainer}>
                        {renderRadioButton('Male')}
                        {renderRadioButton('Female')}
                        {renderRadioButton('Other')}
                    </View>
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Zipcode</Text>
                <TextInput
                    style={styles.input}
                    value={myProfile.zipcode}
                    onChangeText={(value) => handleProfileChange('zipcode', value)}
                    placeholder="Enter zipcode"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={myProfile.phonenumber}
                    onChangeText={(value) => handleProfileChange('phonenumber', value)}
                    placeholder="Enter phone number"
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <Text style={styles.saveButtonText}>Save Profile</Text>
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
    coverImageContainer: {
        position: 'relative',
        backgroundColor: 'black',
        marginBottom: 20,
        borderRadius: 10,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    coverImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: -50,
        borderWidth: 3,
        borderColor: '#fff',
        alignSelf: 'center',
    },
    editIcon: {
        position: 'absolute',
        backgroundColor: '#B94EA0',
        padding: 10,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    coverEditIcon: {
        right: 100,
        bottom: 10,
    },
    profileEditIcon: {
        right: 150,
        bottom: 0,
    },
    radioContainer: {
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        marginRight: 10,
    },
    selectedCircle: {
        backgroundColor: '#B94EA0',
    },
    radioText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'DMSans_500Medium',
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifyButton: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
    },
    verifyText: {
        color: '#fff',
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: '#B94EA0',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
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

export default EditProfile;
