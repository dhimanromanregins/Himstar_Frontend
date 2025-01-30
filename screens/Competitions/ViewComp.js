import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Modal,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../actions/APIs';
import {
  fetchSpecificCompetition,
  prizeBreakdown,
} from '../../actions/ApiActions';
import {useFocusEffect} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';

const ViewComp = ({route, navigation}) => {
  const {compId, compType} = route.params;
  const [competition, setCompetition] = useState(null);
  const [prize_b, setPrize_b] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dynamicHeight, setDynamicHeight] = useState(500);
  const [countdown, setCountdown] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCompetition = async () => {
    const result = await fetchSpecificCompetition(navigation, compId, compType);
    if (result[0] === 200) {
      setCompetition(result[1]);
    } else {
      ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      navigation.goBack();
    }
    setLoading(false);
  };

  const prizeBreakDown = async () => {
    const result = await prizeBreakdown(navigation, {
      type: compType,
      id: compId,
    });
    if (result[0] === 200) {
      console.log(result[1]);
      setPrize_b(result[1]);
    } else {
      ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      navigation.goBack();
    }
    setLoading(false);
  };

  //   console.log(prize_b, '=========================')

  useFocusEffect(
    useCallback(() => {
      if (!compId) {
        ToastAndroid.show(
          'Unable to view this competition, please try after some time.',
          ToastAndroid.SHORT,
        );
        navigation.goBack();
      } else {
        fetchCompetition();
        prizeBreakDown();
      }
      return () => {};
    }, []),
  );

  useEffect(() => {
    if (competition?.reg_open && competition?.registration_close_date) {
      const interval = setInterval(() => {
        const now = new Date().getTime();

        const closeDateString = competition?.registration_close_date.replace(
          ' at ',
          'T',
        );
        const closeDate = new Date(closeDateString);
        const targetDate = closeDate.getTime();
        // Check for invalid date
        if (isNaN(closeDate.getTime())) {
          console.error(
            'Invalid date format:',
            competition.registration_close_date,
          );
          clearInterval(interval);
          return;
        }

        // Calculate the remaining time
        const distance = targetDate - now;

        if (distance < 0) {
          clearInterval(interval);
          setCountdown(null);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [competition]);

  const viewCompReels = () => {
    if (competition.competition_type === 'tournament') {
      navigation.navigate('Reels', {value: 'TOUR-' + competition.id});
    } else {
      navigation.navigate('Reels', {value: 'COMP-' + competition.id});
    }
  };

  // useEffect(() => {
  //     if (!compId) {
  //         ToastAndroid.show('Unable to view this competition, please try after some time.', ToastAndroid.SHORT);
  //         navigation.goBack();
  //         return;
  //     }
  //     fetchCompetition();
  // }, []);

  // const compRegister = async () => {
  //     const email = await AsyncStorage.getItem('AuthEmail');
  //     const name = await AsyncStorage.getItem('AuthName');
  //     const phone = await AsyncStorage.getItem('AuthPhone');
  //     const reg_id = await AsyncStorage.getItem('RegAuthId');
  //     console.log(email, name, phone, reg_id);
  //     if (!email || !name || !phone || !reg_id) {
  //         ToastAndroid.show('Please update your profile before competetion register.', ToastAndroid.SHORT);
  //         return;
  //     }
  //     navigation.navigate('Payment', { compId: competition?.id, compType: competition?.competition_type, amount: String(competition?.price), productInfo: competition?.name, firstName: name, email: email, phone: phone, reg_id: String(reg_id) });
  // };

  const prizeList = competition?.prizes || [
    {id: 1, position: '1st', amount: 10000},
    {id: 2, position: '2nd', amount: 5000},
    {id: 3, position: '3rd', amount: 2000},
  ];

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const isVideoButtonDisabled = () => {
    const currentDate = new Date();
    const startDate = new Date(competition?.start_date);
    const endDate = new Date(competition?.end_date);

    // Disable button if current date is before the start date or after the end date
    return currentDate < startDate || currentDate > endDate;
  };

  const videoUpload = () => {
    navigation.navigate('VideoCreate', {competition: competition});
  };

  const navigateVideoPreview = async () => {
    navigation.navigate('VideoPreview', {
      uri: BASE_URL + competition?.temp_video,
      videoDimensions: null,
      musicUri: null,
      competition: competition,
    });
  };

  const copyID = id => {
    Clipboard.setString(id);
    ToastAndroid.show('Copied!', ToastAndroid.SHORT);
  };

  const enrollComp = () => {
    competition?.is_done
      ? navigation.navigate('Leaderboard', {
          compId:
            competition?.competition_type === 'competition'
              ? competition?.id
              : competition?.competition?.id,
        })
      : competition?.is_participated
      ? navigateVideoPreview()
      : videoUpload();

    // console.log('competition?.can_participate>>>', competition?.can_participate)
    // if (competition?.can_participate == true){
    //   competition?.is_done
    //   ? navigation.navigate('Leaderboard', {
    //       compId:
    //         competition?.competition_type === 'competition'
    //           ? competition?.id
    //           : competition?.competition?.id,
    //     })
    //   : competition?.is_participated
    //   ? navigateVideoPreview()
    //   : videoUpload()
    // }
    // else if (competition?.can_participate == false){
    //   ToastAndroid.show('You are not eligible to enroll in this competition.', ToastAndroid.SHORT);
    // }
    // else{
    //   competition?.is_done
    //   ? navigation.navigate('Leaderboard', {
    //       compId:
    //         competition?.competition_type === 'competition'
    //           ? competition?.id
    //           : competition?.competition?.id,
    //     })
    //   : competition?.is_participated
    //   ? navigateVideoPreview()
    //   : videoUpload()
    // }
  };

  const toLeaderBoard = () => {
    console.log(competition, '0000000000000');
    const startDateStr = competition.start_date;

    const startDate = new Date(startDateStr.replace(' ', 'T')); 

    const currentTime = new Date(); 
    const compId =
      competition?.competition_type === 'competition'
        ? competition?.id
        : competition?.competition?.id;

    if (
      compId &&
      competition.max_participants != competition.remaining_slots &&
      currentTime >= startDate
    ) {
      navigation.navigate('Leaderboard', {compId});
    } else {
      console.error('compId is undefined. Ensure competition data is correct.');
      Alert.alert('Message', 'There is no participant in the contest yet');
    }
  };

  const handleMediaDownload = async (url, fileName) => {
    try {
      const downloadDest =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const ret = RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadDest,
      });

      const result = await ret.promise;

      if (result.statusCode === 200) {
        ToastAndroid.show(
          'Download Successful, ' + `File saved to: ${downloadDest}`,
          ToastAndroid.SHORT,
        );
      } else {
        ToastAndroid.show('Download Failed!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Download error:', error);
      ToastAndroid.show('Download Failed!', ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={toLeaderBoard}>
        <Image
          source={{
            uri:
              competition?.competition_type === 'tournament'
                ? competition?.competition?.banner_image &&
                  competition?.competition?.banner_image?.includes('media')
                  ? BASE_URL + competition?.competition?.banner_image
                  : competition?.competition?.file_uri
                : competition?.banner_image &&
                  competition?.banner_image?.includes('media')
                ? BASE_URL + competition?.banner_image
                : competition?.file_uri,
          }}
          style={styles.bannerImage}
        />
      </TouchableOpacity>

      <View style={styles.videoButtonContainer}>
        <TouchableOpacity
          onPress={viewCompReels}
          disabled={isVideoButtonDisabled()}
          style={[
            styles.videoButton,
            {backgroundColor: isVideoButtonDisabled() ? '#C4C4C4' : '#B94EA0'},
          ]}>
          <Icon name="play" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.closeButtoncontainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => closeModal()}>
                <Icon name="close" style={styles.closeButtonText} size={60} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>Prize Breakdown</Text>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Position</Text>
              <Text style={styles.headerText2}>Prize</Text>
            </View>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false} // Hides the scrollbar
            >
              {/* List of Prizes */}
              <FlatList
                data={prize_b}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <View style={styles.prizeItem}>
                    <Text style={styles.position}>{item.position}</Text>
                    <Text style={styles.amount}>₹{item.prize}</Text>
                  </View>
                )}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.compTagsContainer}>
        {competition?.competition_type === 'competition' && (
          <TouchableOpacity
            style={[styles.tag, {backgroundColor: 'rgba(84, 197, 96, 0.49)'}]}>
            <Text style={styles.tagText}>{competition?.stage}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.tag, {backgroundColor: 'rgba(226, 170, 25, 0.49)'}]}
          onPress={openModal}>
          <Text style={styles.tagText}>
            Prize : ₹{competition?.winning_price}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tag, {backgroundColor: 'rgba(135, 73, 54, 0.49)'}]}>
          <Text style={styles.tagText}>
            {competition?.remaining_slots}/{competition?.max_participants}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.competitionName}>{competition?.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
          }}>
          <Text style={{textAlign: 'center', fontSize: 12, fontWeight: 'bold'}}>
            {competition?.unique_id}
          </Text>
          <TouchableOpacity onPress={() => copyID(competition?.unique_id)}>
            <Icon name="copy" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{competition?.description}</Text>

        {countdown && (
          <View style={styles.registration1}>
            <Text style={styles.registration1text}>Registration closes in</Text>
            <View style={styles.boxcontainer}>
              <Text style={styles.box}>{countdown}</Text>
            </View>
          </View>
        )}

        <View style={styles.bordercircle}>
          <View style={styles.circle}>
            <Icon
              name="trophy-outline"
              size={35}
              color="#fff"
              style={styles.iconclass}
            />
          </View>

          <View style={styles.detailsborder}>
            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>Registration Fees: </Text>
              <Text style={styles.textValue}>₹{competition?.price}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>Start Date: </Text>
              <Text style={styles.textValue}>
                {competition?.start_date_formatted}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>End Date: </Text>
              <Text style={styles.textValue}>
                {competition?.end_date_formatted}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>Registration Opens: </Text>
              <Text style={styles.textValue}>
                {competition?.competition_type === 'competition'
                  ? competition?.reg_open_date
                  : competition?.competition?.reg_open_date}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>Registration Closes: </Text>
              <Text style={styles.textValue}>
                {competition?.competition_type === 'competition'
                  ? competition?.reg_close_date
                  : competition?.competition?.reg_close_date}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>Location: </Text>
              <Text style={styles.textValue}>
                {competition?.competition_type === 'competition'
                  ? competition?.location
                  : competition?.competition?.location}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>Category: </Text>
              <Text style={styles.textValue}>{competition?.category}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>Total Slots: </Text>
              <Text style={styles.textValue}>
                {competition?.max_participants}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>Remaining Slots: </Text>
              <Text style={styles.textValue}>
                {competition?.remaining_slots}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesHeading}>Rules:</Text>
          <View>
            {Array.isArray(competition?.rules) &&
            competition.rules.length > 0 ? (
              competition.rules.map((rule, index) => (
                <Text style={styles.rulesText} key={index}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: '#B94EA0',
                    }}>
                    •{' '}
                  </Text>
                  {rule}
                </Text>
              ))
            ) : (
              <Text style={styles.rulesText}>No rules available</Text>
            )}
          </View>
        </View>

        {Array.isArray(competition?.media_files) &&
          competition.media_files.length > 0 && (
            <View>
              <Text style={styles.rulesHeading}>Media Files:</Text>
              {competition.media_files.map((file, index) => (
                <View style={{marginVertical: 5}} key={index}>
                  <Text
                    style={{fontWeight: 'bold', fontSize: 15, color: '#000'}}>
                    {index + 1}. {file.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleMediaDownload(BASE_URL + file.url, file.title)
                    }
                    style={{
                      backgroundColor: '#B94EA0',
                      width: 60,
                      borderRadius: 5,
                      padding: 3,
                      marginHorizontal: 10,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white'}}>Download</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        {competition?.reg_open && (
          <TouchableOpacity
            style={[styles.registerButton]}
            onPress={() =>
              competition?.is_done
                ? navigation.navigate('Leaderboard', {
                    compId:
                      competition?.competition_type === 'competition'
                        ? competition?.id
                        : competition?.competition?.id,
                  })
                : competition?.is_participated
                ? navigateVideoPreview()
                : videoUpload()
            }>
            <Text style={styles.registerButtonText}>
              {competition?.is_done
                ? 'Leaderboard'
                : competition?.is_participated
                ? 'Complete'
                : 'Enroll Now'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#B94EA0" />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  webview: {
    width: '100%',
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
  bannerImage: {
    width: '85%',
    height: 200,
    borderRadius: 30,
    margin: 30,
    marginBottom: 5,
  },
  compTagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  tag: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginHorizontal: 3,
    borderRadius: 30,
    width: '50%',
  },
  tagText: {
    color: '#000',
    fontSize: 12,
  },
  detailsContainer: {
    padding: 20,
  },
  competitionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'justify',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  textLabel: {
    fontSize: 14,
    color: '#000',
    // fontWeight: 'bold',
    fontFamily: 'DMSans_400Regular',
  },
  textValue: {
    fontSize: 14,
    color: '#B94EA0',
    fontWeight: '800',
  },
  rulesContainer: {
    marginBottom: 20,
  },
  rulesHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B94EA0',
    marginBottom: 5,
  },
  rulesText: {
    fontSize: 14,
    color: '#666',
    width: '100%',
    paddingVertical: 3,
  },
  registerButton: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderColor: '#fff',
    borderWidth: 1,
  },
  registerButtonText: {
    color: '#B94EA0',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  registration1text: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
  registration1: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    fontSize: 16,
    color: '#000',
  },

  boxcontainer: {
    flex: 1,
    alignItems: 'flex-end', // Aligns content to the right
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(84, 197, 96, 0.49)',
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  box: {
    fontSize: 14,
    fontWeight: '800', // 'semibold' should be replaced with '600' (valid font weight)
  },

  detailsborder: {
    borderBlockColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  bordercircle: {
    position: 'relative', // Make sure the parent has relative positioning
  },
  circle: {
    backgroundColor: '#B94EA0',
    borderRadius: 100, // Circular shape
    width: 50,
    height: 50,
    position: 'absolute',
    left: '45%',
    top: -25,
    zIndex: 1,
    justifyContent: 'center', // Vertically center the content inside the circle
    alignItems: 'center', // Horizontally center the content inside the circle
  },
  iconclass: {
    fontSize: 30, // Control the icon size
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  countdownContainer: {
    padding: 12,
    backgroundColor: '#FAF3E0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E0C097',
  },
  countdownText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C3D2E',
    textAlign: 'center',
  },
  videoButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 10,
  },
  videoButton: {
    backgroundColor: '#B94EA0',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '90%', // Modal width
    height: 400, // Fixed height
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'DMSans_400Regular',
    color: '#B94EA0',
    marginTop: 15,
  },
  prizeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderBottomWidth: 1, // Sets the thickness of the border
    borderBottomColor: '#ddd', // Sets the color of the border (light gray, can adjust as needed)
    paddingBottom: 10, // Optional: adds some space below the text and the border
  },
  position: {
    fontSize: 16,
    fontFamily: 'DMSans_700Regular',
    fontWeight: 'bold',
    color: '#000',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B94EA0',
  },
  closeButtoncontainer: {
    position: 'absolute', // Ensure the container is positioned within the modal
    top: 10, // Adjust for top margin from the top of the modal
    right: 10, // Adjust for right margin from the right side of the modal
    zIndex: 1, // Ensures the button is on top of other elements in the modal
  },

  closeButton: {
    width: 50,
    height: 50, // Ensure the button is square
    // backgroundColor: '#2196F3', // You can add color if needed
    alignItems: 'center',
    justifyContent: 'center', // Centers the Icon within the button
    borderRadius: 25,
    padding: 10,
  },

  closeButtonText: {
    color: '#000', // Change text color to white for better visibility
    fontSize: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 0,
  },

  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Adjust color as needed
    flex: 1,
    textAlign: 'left', // Ensures the text takes up available space
    // textAlign: 'center', // Centers the heading text
  },
  headerText2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right', // Adjust color as needed
    flex: 1, // Ensures the text takes up available space
    // textAlign: 'center', // Centers the heading text
  },
});

export default ViewComp;
