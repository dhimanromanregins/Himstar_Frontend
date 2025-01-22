import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ToastAndroid, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { mergeVideo, removeTempVideo, postCreate, saveTempParticipant } from '../../actions/ApiActions';
import { BASE_URL } from '../../actions/APIs';
import { MainContext } from '../../others/MyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const VideoPreview = ({ route, navigation }) => {
    const { uri, videoDimensions, musicUri, competition } = route.params;
    const [tempVideoDimensions, setTempVideoDimensions] = useState({ width: '100%', height: 300 });
    const [loading, setLoading] = useState(true);
    const [videoUri, setVideoUri] = useState(uri);
    const [isPlaying, setIsPlaying] = useState(true);
    const { setHomeReload } = useContext(MainContext);
    const screenWidth = Dimensions.get('window').width;

    const adjustVideoDimensions = (data) => {
        console.log('+++++++++++++++');
        const { width, height } = data.naturalSize;
        const screenFinalWidth = height > width ? 300 : screenWidth;
        const aspectRatio = width / height;
        setTempVideoDimensions({
            width: screenFinalWidth,
            height: screenFinalWidth / aspectRatio
        });
        setLoading(false);
    };

    const mergeProcess = async()=>{
        try{
            console.log(videoDimensions, '**********Merging Video**********', videoUri, '|||', musicUri, '|||', competition.id);
            const formData = new FormData();
            formData.append('video', {
                uri: videoUri,
                type: 'video/mp4',
                name: 'video.mp4',
            });
            formData.append('music', musicUri);
            formData.append('competition_id', competition?.competition_type === 'competition' ? competition.id : competition?.competition?.id);
            const result = await mergeVideo(navigation, formData);
            console.log('Results: ', result);
            if (result[0] === 200){
                const videoURL = BASE_URL + '/' + result[1].merged_video;
                setVideoUri(videoURL);
            }
            else{
                ToastAndroid.show('Video processing failed, please try again!', ToastAndroid.SHORT);
                navigation.goBack();
            }
        }
        catch(error){
            ToastAndroid.show('Video processing failed, please try again!', ToastAndroid.SHORT);
            navigation.goBack();
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('VideoPrev Screen', videoUri);
        if (competition?.temp_video){
            return;
        }
        if (musicUri) {
            mergeProcess();
        }
        else {
            console.log('******************')
            setLoading(false);
        }
    }, []);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const compRegister = async () => {
        const email = await AsyncStorage.getItem('AuthEmail');
        const name = await AsyncStorage.getItem('AuthName');
        const phone = await AsyncStorage.getItem('AuthPhone');
        const reg_id = await AsyncStorage.getItem('RegAuthId');
        console.log(email, name, phone, reg_id);
        try{
            if (!email || !name || !phone || !reg_id) {
                ToastAndroid.show('Please update your profile before competetion register.', ToastAndroid.SHORT);
                navigation.navigate('Profile');
                return;
            };
            navigation.navigate('Payment', { competition: competition, amount: String(competition.price), firstName: name, email: email, phone: phone, reg_id: String(reg_id) });
        }
        catch(err){
            console.log('Error: ', err);
            ToastAndroid.show('Something went wrong, please try again.', ToastAndroid.SHORT);
        }
    };

    const participantUpdate = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('competition', competition?.competition_type === 'competition' ? competition.id : competition?.competition?.id);
        const result = await postCreate(navigation, formData);
        if (result[0] === 200){
            ToastAndroid.show('Competition registration completed successfully.', ToastAndroid.SHORT);
            setHomeReload(true);
            navigation.navigate('ViewComp', { compId: competition.id, compType: competition?.competition?.competition_type });
        }
        else{
            let errorMsg;
            if (typeof (result[1]) === 'object') {
                const firstKey = Object.keys(result[1])[0];
                errorMsg = result[1][firstKey];
            }
            else {
                errorMsg = result[1];
            }
            ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
        }
        setLoading(false);
    }

    const uploadVideo = async () => {
        setIsPlaying(false);

        if (!musicUri){
            setLoading(true);
            const formData = new FormData();
            formData.append('video', {
                uri: videoUri,
                type: 'video/mp4',
                name: 'video.mp4',
            });
            formData.append('competition', competition?.competition_type === 'competition' ? competition.id : competition?.competition?.id);
            const result = await saveTempParticipant(navigation, formData);
            console.log('Results: ', result);
            if (result[0] === 200){
                if (competition?.is_paid){
                    await participantUpdate();
                    return;
                }
                await compRegister();
            }
            else{
                ToastAndroid.show('Something went wrong!, please try again!', ToastAndroid.SHORT);
                navigation.goBack();
            }
            setLoading(false);
            return;
        };

        if (competition?.competition_type === 'competition' && !competition.is_done){
            await compRegister();
            return;
        };

        if (competition?.competition?.competition_type === 'tournament' && !competition.is_paid){
            await compRegister();
            return;
        };
    };

    const backToVideoEdit = async()=>{
        setIsPlaying(false);
        if (competition?.temp_video){
            setLoading(true);
            const result = await removeTempVideo(navigation, {competition_id: competition?.competition_type === 'competition' ? competition.id : competition?.competition?.id});
            if (result[0] === 200){
                navigation.navigate('ViewComp', {compId: competition.id});
            }
            else{
                ToastAndroid.show('Something went wrong!, please try again!', ToastAndroid.SHORT);
            };
            setLoading(false);
        }
        else{
            navigation.goBack();
        };
    };

    return (
        <>
            <View style={styles.container}>
                <View style={[styles.videoContainer, videoDimensions]}>

                    {videoUri ? (
                        <Video
                            source={{ uri: videoUri }}
                            style={videoDimensions ? videoDimensions : tempVideoDimensions}
                            resizeMode="cover"
                            paused={!isPlaying}
                            muted={loading ? true : false}
                            repeat={true}
                            onLoad={(data) => {
                                if (!competition?.temp_video) {
                                    if (videoUri.includes(BASE_URL)) {
                                        setLoading(false);
                                    }
                                } else {
                                    adjustVideoDimensions(data);
                                }
                            }}
                        />
                    )
                        :
                        <Text>Video Player Placeholder</Text>
                    }
                </View>

                {!loading && <View style={styles.controls}>
                    <TouchableOpacity onPress={togglePlayPause}>
                        <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={40} color="white" />
                    </TouchableOpacity>
                </View>}

                <View style={styles.navigationButtons}>
                    <TouchableOpacity style={[styles.backToVideoEdit, {width: !competition?.temp_video ? 80 : 150}]} onPress={backToVideoEdit}>
                        <Text style={styles.backToVideoEditText}>{!competition?.temp_video ? 'Back' : 'Change Video'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.uploadVideo} onPress={uploadVideo}>
                        <Text style={styles.uploadVideoText}>Done</Text>
                    </TouchableOpacity>
                </View>

                <Modal transparent={true} animationType="fade" visible={loading}>
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color='#B94EA0' />
                    </View>
                </Modal>
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    videoContainer: { width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        position: 'absolute',
        bottom: 120,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 50,
        width: '80%',
        position: 'absolute',
        bottom: 50,
    },
    backToVideoEdit: {
        backgroundColor: 'gray',
        borderRadius: 10,
        paddingVertical: 10,
        // width: 80,
        alignItems: 'center'
    },
    backToVideoEditText: {
        fontSize: 20,
        color: 'white',
    },
    uploadVideo: {
        backgroundColor: '#B94EA0',
        borderRadius: 10,
        paddingVertical: 10,
        width: 80,
        alignItems: 'center',
    },
    uploadVideoText: {
        fontSize: 20,
        color: 'white',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});

export default VideoPreview;
