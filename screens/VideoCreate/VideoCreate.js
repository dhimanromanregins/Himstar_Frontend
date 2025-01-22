import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ToastAndroid, Text, ScrollView, Image } from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';


const VideoCreate = ({ route, navigation }) => {
    const { competition } = route.params;
    const [videoUri, setVideoUri] = useState(null);
    const [videoOptionsIsVisible, setVideoOptionsIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [videoDimensions, setVideoDimensions] = useState({ width: '100%', height: 300 });
    const screenWidth = Dimensions.get('window').width;
    const [rulesAccepted, setRulesAccepted] = useState(false);
    const rules = [
        'Your video should not exceed 5 minutes in length.',
        'Ensure your video is in MP4 format.',
        'Your video should not contain any offensive or copyrighted material.',
        'Maintain a resolution of at least 720p for better clarity.',
        'You can upload only one video per competition.',
        'Submit your video before the competition deadline.',
        'Ensure proper lighting and audio quality in your video.',
        'Your video must be your original work.',
        'Once submitted, you cannot modify your video.',
    ];

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'This app needs access to your camera to record videos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            const result = await request(PERMISSIONS.IOS.CAMERA);
            return result === RESULTS.GRANTED;
        }
    };

    useFocusEffect(
        useCallback(() => {
            return () => {
                setVideoUri(null);
                setVideoOptionsIsVisible(false);
                setIsPlaying(true);
            };
        }, [])
    );

    const recordVideo = async() => {
        const hasPermission = await requestCameraPermission();
        if (hasPermission){
            launchCamera(
                {
                    mediaType: 'video',
                    videoQuality: 'high',
                    durationLimit: 60,
                    saveToPhotos: true,
                },
                (response) => {
                    setVideoOptionsIsVisible(false);
                    if (response.assets && response.assets.length > 0) {
                        setVideoUri(response.assets[0].uri);
                        setIsPlaying(true);
                    }
                }
            );
        }
        else{
            ToastAndroid.show('Camera permission denied.', ToastAndroid.SHORT);
        }
    };

    const adjustVideoDimensions = (width, height) => {
        const screenFinalWidth = height > width ? 300 : screenWidth;
        const aspectRatio = width / height;

        setVideoDimensions({
            width: screenFinalWidth,
            height: screenFinalWidth / aspectRatio
        });
    };

    const selectVideo = () => {
        launchImageLibrary({ mediaType: 'video' }, response => {
            setVideoOptionsIsVisible(false);
            if (response.assets && response.assets.length > 0) {
                const duration = response.assets[0].duration;
                if (duration > 60) {
                    ToastAndroid.show('Video must be less than 60 seconds.', ToastAndroid.SHORT);
                    return;
                }
                const { uri, height, width } = response.assets[0];
                setVideoUri(uri);
                adjustVideoDimensions(width, height);
                setIsPlaying(true);
            }
        });
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const VideoPlayerComponent = ({ uri }) => (
        <Video
            source={{ uri }}
            style={videoDimensions}
            resizeMode="cover"
            paused={!isPlaying}
            repeat
        />
    );

    const navigateToVideoEdit = () => {
        if (videoUri) {
            navigation.navigate('VideoEdit', { uri: videoUri, videoDimensions: videoDimensions, competition: competition });
        }
    };

    return (
        rulesAccepted ? (
            <View
                style={[
                    styles.container,
                    videoUri && { backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }
                ]}
            >
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color={videoUri ? "white" : "black"} />
                    </TouchableOpacity>
                </View>
    
                {videoUri ? (
                    <>
                        <VideoPlayerComponent uri={videoUri} />
                        <View style={[styles.videoOption, { bottom: 50, gap: 50 }]}>
                            <TouchableOpacity
                                style={styles.videoNextStep}
                                onPress={() => setVideoUri(null)}
                            >
                                <Icon name='close' size={30} color="white" />
                            </TouchableOpacity>
    
                            <TouchableOpacity
                                style={styles.videoNextStep}
                                onPress={togglePlayPause}
                            >
                                <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={30} color="white" />
                            </TouchableOpacity>
    
                            <TouchableOpacity
                                style={styles.videoNextStep}
                                onPress={navigateToVideoEdit}
                            >
                                <Icon name='arrow-right' size={30} color="white" />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.cameraButton1}>
                            <TouchableOpacity
                                style={[styles.button, styles.uploadButton]}
                                onPress={selectVideo}
                            >
                                <Image
                                    source={require('../../assets/images/video_upload_btn.png')} // Path to the image
                                    style={styles.buttonImage}
                                />
                                <Text style={styles.buttonText}>Upload</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                style={[styles.button, styles.recordButton]}
                                onPress={recordVideo}
                            >
                                <Image
                                    source={require('../../assets/images/video_record_btn.png')} // Path to the image
                                    style={styles.buttonImage}
                                />
                                <Text style={styles.buttonText}>Record</Text>
                            </TouchableOpacity> */}
                        </View>
                    </>
                )}
            </View>
        ) : (
            <View style={styles.rulesMainContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        {/* <Text >←</Text> */}
                        <Icon style={styles.backArrow} name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Upload Rules</Text>
                </View>
    
                <ScrollView contentContainerStyle={styles.rulesContainer}>
                    {rules.map((rule, index) => (
                        <View key={index} style={styles.ruleItem}>
                            <Text style={styles.ruleNumber}>{index + 1}.</Text>
                            <Text style={styles.ruleText}>{rule}</Text>
                        </View>
                    ))}
                </ScrollView>
    
                <TouchableOpacity
                    style={styles.proceedButton}
                    onPress={() => setRulesAccepted(true)}
                >
                    <Text style={styles.proceedButtonText}>I Agree & Continue</Text>
                </TouchableOpacity>
            </View>
        )
    );
    
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    fullWidthImage: {
        width: '100%',
        height: 500,
        resizeMode: 'cover',
    },
    cameraButton: {
        marginTop: 150,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton1: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 50,
    },
    videoOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 100,
        position: 'absolute',
        bottom: 120,
    },
    videoNextStep: {
        alignSelf: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#B94EA0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pauseIconContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 30,
        width: 50,
        height: 50,
    },
    rulesMainContainer: {
        flex: 1,
        backgroundColor: '#f4f4f9',
        padding: 20,
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    rulesContainer: {
        paddingBottom: 20,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    ruleNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#B94EA0',
        marginRight: 10,
    },
    ruleText: {
        fontSize: 16,
        color: '#555',
        flex: 1,
    },
    proceedButton: {
        backgroundColor: '#B94EA0',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 20,
    },
    proceedButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 20,
        width: 120,
        height: 120,
        backgroundColor: '#211E74',
        marginHorizontal: 10,
    },
    uploadButton: {
        backgroundColor: '#211E74', // Blue background for Upload
    },
    recordButton: {
        backgroundColor: '#211E74', // Darker blue background for Record
    },
    buttonText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    buttonImage: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
});

export default VideoCreate;
