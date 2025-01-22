import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {profile, myCompetitions, userVideos} from '../../actions/ApiActions';
import {BASE_URL} from '../../actions/APIs';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../../others/MyContext';
import Video from 'react-native-video';
import Clipboard from '@react-native-clipboard/clipboard';
import EllipseSvg from './../../assets/images/Ellipse 8.svg';
import Points from './../../assets/images/Points.svg';
import {Dimensions} from 'react-native';

const Profile = ({route, navigation}) => {
  const {username} = route.params;
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [refreshing, setRefreshing] = useState(false);
  const {profileReload, setProfileReload} = useContext(MainContext);
  const [currentTab, setCurrentTab] = useState(0);
  const [myContests, setMyContests] = useState([]);
  const [myVideos, setMyVideos] = useState([]);
  const [contestsLoading, setContestsLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(false);

  const fetchMyContests = async () => {
    setContestsLoading(true);
    let result;
    if (username) {
      result = await myCompetitions(navigation, username);
    } else {
      result = await myCompetitions(navigation);
    }
    if (result[0] === 200) {
      setMyContests(result[1]);
    }
    setContestsLoading(false);
  };

  const fetchMyVideos = async () => {
    setVideosLoading(true);
    let result;
    if (username) {
      result = await userVideos(navigation, username);
    } else {
      result = await userVideos(navigation);
    }
    if (result[0] === 200) {
      setMyVideos(result[1]);
    }
    setVideosLoading(false);
  };

  const openSettings = () => {
    setSettingsVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Move to visible position
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (profileReload) {
      fetchprofile();
      setProfileReload(false);
    }
  }, [profileReload]);

  const closeSettings = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // Move off-screen
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start(() => setSettingsVisible(false));
  };

  const fetchprofile = async () => {
    setLoading(true);
    setRefreshing(true);
    const result = username
      ? await profile(navigation, username)
      : await profile(navigation);
    if (result[0] === 200) {
      console.log('result[1]>>>', result[1])
      setProfileData(result[1]);
    } else {
      ToastAndroid.show(result[1], ToastAndroid.SHORT);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const handleSettingsOption = option => {
    setSettingsVisible(false);
    if (option === 'EditProfile') {
      navigation.navigate(option, {profileData: profileData});
    } else {
      navigation.navigate(option);
    }
  };

  useEffect(() => {
    fetchprofile();
    fetchMyContests();
  }, []);

  const logout = async () => {
    setLoading(true);
    setSettingsVisible(false);
    await AsyncStorage.removeItem('AuthToken');
    await AsyncStorage.removeItem('AuthUser');
    await AsyncStorage.removeItem('AuthId');
    await AsyncStorage.removeItem('RegAuthId');
    await AsyncStorage.removeItem('AuthEmail');
    await AsyncStorage.removeItem('AuthName');
    await AsyncStorage.removeItem('AuthPhone');
    await AsyncStorage.removeItem('AuthImage');
    ToastAndroid.show('Logout successfully.', ToastAndroid.SHORT);
    setLoading(false);
    navigation.navigate('Login');
  };

  const tabSwitch = () => {
    if (currentTab === 0) {
      setCurrentTab(1);
      fetchMyVideos();
    } else {
      setCurrentTab(0);
      fetchMyContests();
    }
  };

  const viewCompetition = comp => {
    navigation.navigate('ViewComp', {
      compId: comp.id,
      compType: comp.competition_type,
    });
  };

  const renderCompetitions = ({item: comp}) => (
    <TouchableOpacity
      onPress={() => (!comp.is_close ? viewCompetition(comp) : null)}
      style={[
        styles.competitions,
        !comp.is_active && styles.inactiveCompetition,
      ]}
      activeOpacity={comp.is_active ? 0.7 : 1}>
      <View>
        <Image
          source={{
            uri:
              comp?.banner_image && comp?.banner_image?.includes('media')
                ? BASE_URL + comp?.banner_image
                : comp?.file_uri,
          }}
          style={[
            styles.competitionImage,
            !comp.is_active && styles.inactiveCompetitionImage,
          ]}
        />
        <View style={styles.overlayDetails}>
          <Text style={styles.competitionsNameText}>{comp.name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.overlayDetailText}>
              Registration Start: {comp.registration_start_date}
            </Text>
            <Text style={styles.overlayDetailText}>
              Registration End: {comp.registration_close_date}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.overlayDetailText}>
              Total Slots: {comp.max_participants}
            </Text>
            <Text style={styles.overlayDetailText}>
              Remaining Slots: {comp.remaining_slots}
            </Text>
          </View>
          {comp.is_close && (
            <View style={styles.inactiveOverlay}>
              <Text style={styles.inactiveText}>Closed</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const openVideos = (id)=>{
    if (username){
      navigation.navigate('Reels', {vId: id});
    }
    else {
      navigation.navigate('MyVideos', {vId: id});
    }
  };

  const renderVideos = ({item}) => {
    const screenWidth = Dimensions.get('window').width;
    const videoWidth = (screenWidth - 40) / 3; // Account for padding/margin

    return (
      <TouchableOpacity
        style={[
          styles.videoItem,
          {width: videoWidth, height: videoWidth * 1.5},
        ]}
        onPress={()=> openVideos(item.id)}>
        <Video
          muted
          source={{uri: BASE_URL + item.video}}
          resizeMode="cover"
          style={styles.videoThumbnail}
        />
      </TouchableOpacity>
    );
  };

  const copyUsername = id => {
    Clipboard.setString(id);
    ToastAndroid.show('Copied!', ToastAndroid.SHORT);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchprofile}
          colors={['#9Bd35A', '#689F38']}
        />
      }>
      {!username && (
        <View style={styles.header}>
          <TouchableOpacity onPress={openSettings}>
            <Icon name="settings" size={40} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <Image
        source={
          profileData.cover_image
            ? {uri: BASE_URL + profileData.cover_image}
            : require('./../../assets/images/new-logo.jpg')
        }
        style={styles.bannerImage}
      />

      <Image
        source={
          profileData.profile_image
            ? {uri: BASE_URL + profileData.profile_image}
            : require('./../../assets/images/dp.png')
        }
        style={styles.profileImage}
      />

      <Text style={styles.name}>
        {profileData.first_name} {profileData.last_name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
        }}>
        <Text style={styles.name1}>{profileData.username}</Text>
        <TouchableOpacity onPress={() => copyUsername(profileData.username)}>
          <Icon name="copy" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <EllipseSvg width={50} height={50} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardNumber1}>{profileData.total_likes}</Text>
            <Text style={styles.cardTitle}>Votes</Text>
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
          <Points width={50} height={50} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardNumber1}>{profileData.points}</Text>
            <Text style={styles.cardTitle}>Points</Text>
          </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#B94EA0" />
        </View>
      </Modal>

      <View style={styles.cardRow2}>
        <View style={styles.cardColumn}>
          <Text style={styles.cardNumber}>
            {profileData.participations ? profileData.participations.length : 0}
          </Text>
          <Text style={styles.cardSubtitle}>Contest Entered</Text>
        </View>
        <View style={styles.cardColumn}>
          <Text style={styles.cardNumber}>0</Text>
          <Text style={styles.cardSubtitle}>Top 50</Text>
        </View>
        {/* <View style={styles.cardColumn}>
          <Text style={styles.cardNumber}>0</Text>
          <Text style={styles.cardSubtitle}>Votes Cast</Text>
        </View> */}
      </View>
      {profileData.eligible_awards &&
        profileData.eligible_awards.length > 0 && (
          <>
            <Text style={styles.subHeading}>Awards</Text>

            <View style={styles.imageRow}>
              {profileData.eligible_awards.map((award, index) => (
                <Image
                  key={index}
                  source={{uri: BASE_URL + award.image}}
                  style={styles.image}
                />
              ))}
            </View>
          </>
        )}

      <View style={styles.myAwards}>
        <TouchableOpacity
          onPress={() => (currentTab === 0 ? null : tabSwitch())}
          style={styles.myAwardsTab}>
          <Icon
            name="trophy-outline"
            size={30}
            color={currentTab === 0 ? '#B94EA0' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => (currentTab === 1 ? null : tabSwitch())}
          style={styles.myVideosTab}>
          <Icon
            name={'film'}
            size={30}
            color={currentTab === 1 ? '#B94EA0' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {currentTab === 0 && (
        <>
          <TouchableOpacity
            onPress={() => viewCompetition(comp)}
            // key={index}
            style={styles.tournaments}>
            <View style={styles.myContestsContainer}>
              {!contestsLoading ? (
                <FlatList
                  data={myContests}
                  renderItem={renderCompetitions}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={
                    myContests.length
                      ? styles.listContainer
                      : styles.emptyListContainer
                  }
                  ListEmptyComponent={
                    <View style={styles.noVideosContainer}>
                      <View style={styles.iconWrapper}>
                        <Icon name="trophy-outline" size={60} color="#bbb" />
                      </View>
                      <Text style={styles.noCompetitionsText}>
                        You haven't joined any contests yet. Start participating
                        and showcase your skills!
                      </Text>
                    </View>
                  }
                />
              ) : (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#B94EA0" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </>
      )}

      {currentTab === 1 && (
        <>
          <View style={styles.myVideosContainer}>
            {!videosLoading ? (
              <FlatList
                data={myVideos}
                renderItem={renderVideos}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                contentContainerStyle={
                  myVideos.length
                    ? styles.gridContainer
                    : styles.emptyListContainer
                }
                ListEmptyComponent={
                  <View style={styles.noVideosContainer}>
                    <View style={styles.iconWrapper}>
                      <Icon name="videocam-outline" size={60} color="#bbb" />
                    </View>
                    <Text style={styles.noCompetitionsText}>
                      No videos uploaded yet. Share your experiences by
                      uploading videos!
                    </Text>
                  </View>
                }
              />
            ) : (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#B94EA0" />
              </View>
            )}
          </View>
        </>
      )}

      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#B94EA0" />
        </View>
      </Modal>

      {settingsVisible && (
        <Modal
          transparent={true}
          animationType="none"
          visible={settingsVisible}>
          <Animated.View
            style={[
              styles.settingsModal,
              {transform: [{translateX: slideAnim}]},
            ]}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSettingsOption('EditProfile')}>
                <Text style={styles.modalOptionText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSettingsOption('ChangePassword')}>
                <Text style={styles.modalOptionText}>
                  {profileData.is_password ? 'Change' : 'Create'} Password
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={logout}>
                <Text style={styles.modalOptionText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={closeSettings}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures the content scrolls properly
    paddingBottom: 20,
  },
  header: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  bannerImage: {
    width: '100%',
    height: 200, // Adjust the height of the banner
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    position: 'absolute',
    top: 140, // Adjust based on the height of the banner
    left: '50%',
    transform: [{translateX: -60}], // Center the profile image horizontally
    zIndex: 1, // Ensure the profile image is above the banner
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 60, // Adds space after the profile image
  },
  name1: {
    fontSize: 14,

    color: '#333',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'left',
    paddingLeft: 10,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#211E74',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardImage: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
  cardContent: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#211E74',
  },
  cardRow2: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  cardColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardTitle: {
    color: '#fff',
  },
  cardNumber1: {
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  sliderContainer: {
    marginTop: 20,
  },
  imageSlider: {
    marginTop: 10,
  },
  sliderImage: {
    width: 250,
    height: 150,
    marginRight: 20,
    borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  settingsModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 200,
    height: 'auto',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalClose: {
    marginTop: 10,
  },
  modalCloseText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  myAwards: {
    width: '100%',
    flexDirection: 'row',
    height: 50,
    marginTop: 30,
  },
  myAwardsTab: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myVideosTab: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myContestsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  myVideosContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  competitions: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  competitionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
  },
  competitionsNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  overlayDetailText: {
    fontSize: 13,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  listContainer: {
    padding: 10,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCompetitionsText: {
    fontSize: 18,
    padding: 10,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  gridContainer: {
    flexGrow: 1,
  },
  videoItem: {
    flex: 1,
    aspectRatio: 1, // Ensures square shape for grid items
    borderWidth: 2,
    borderColor: '#fff', // White border between videos
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  noVideosContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 50,
  },
  noVideosText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});

export default Profile;
