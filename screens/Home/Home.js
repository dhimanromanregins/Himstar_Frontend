import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  BackHandler,
  ToastAndroid,
  Dimensions,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  RefreshControl,
  FlatList,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-snap-carousel';               
import QueryIcon from "../../assets/images/query-svgrepo-com.svg"
import HistoryIcon from "../../assets/images/events-svgrepo-com.svg"

import {
  getCategories,
  getBanners,
  getCompetitions,
  getTournaments,
} from '../../actions/ApiActions';
import {MainContext} from '../../others/MyContext';
import {BASE_URL} from '../../actions/APIs';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Easing } from 'react-native-reanimated'

const {width} = Dimensions.get('window'); // Get screen width
const padding = 10;
const sliderWidth = width - padding * 2; // Adjusting for padding
const itemWidth = sliderWidth - padding;

const Home = ({navigation}) => {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const slideAnimation = useState(new Animated.Value(-300))[0];
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const carouselRef = useRef(null);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);
  const [activeCompetitions, setActiveCompetitions] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {homeReload, setHomeReload} = useContext(MainContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [currentCate, setCurrentCate] = useState(null);
  const [numColumns, setNumColumns] = useState(2);

  const fetchProfileImage = async () => {
    const image = await AsyncStorage.getItem('AuthImage');
    setProfileImage(image);
  };

  useEffect(() => {
    if (homeReload) {
      fetchAllData();
      setHomeReload(false);
    }
  }, [homeReload]);

  const waveAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Opacity animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.5, // Fade out to 50% opacity
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, // Fade back to full opacity
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wavy animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotateInterpolate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  useFocusEffect(
    useCallback(() => {
      fetchProfileImage();
      return () => {
        if (slideAnimation) {
          Animated.timing(slideAnimation, {
            toValue: -300,
            duration: 300,
            useNativeDriver: true,
          }).start();
          setMenuVisible(false);
        }
      };
    }, []),
  );

  const toggleColumns = () => {
    setNumColumns(numColumns === 2 ? 3 : 2); // Toggle between 2 and 3 columns
  };

  const fetchCategories = async () => {
    setCategories([]);
    const result = await getCategories(navigation);
    if (result[0] === 200) {
      setCategories(result[1]);
    }
  };

  const fetchBanners = async (bannerId = null) => {
    setBanners([]);
    const result = await getBanners(navigation);
    console.log('Banners Data:', result);
    if (result[0] === 200) {
      setBanners(result[1].banners);
    }
  };

  const fetchCompetitions = async (bannerId = '') => {
    setActiveCompetitions([]);
    setTournaments([]);
    const result = await getCompetitions(navigation, bannerId);
    console.log('Comps Data:', result);
    if (result[0] === 200) {
      const activeComps = result[1]['active'];
      setActiveCompetitions(activeComps);
      const upComingComps = result[1]['upcoming'];
      setUpcomingCompetitions(upComingComps);
    }
  };

  const fetchTournaments = async (bannerId = '') => {
    setTournaments([]);
    const result = await getTournaments(navigation, bannerId);
    if (result[0] === 200) {
      setTournaments(result[1]);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await fetchCategories();
    await fetchBanners();
    await fetchCompetitions();
    await fetchTournaments();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const renderCategory = ({item}) => (
    <TouchableOpacity
      style={[
        styles.filterTag,
        {backgroundColor: item.isActive ? '#B94EA0' : 'white'},
      ]}
      onPress={() => filterApply(item.id)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const filterApply = async id => {
    setLoading(true);
    const selectedCategory = categories.find(category => category.id === id);
    await fetchCompetitions(selectedCategory.isActive ? '' : id);
    await fetchTournaments(selectedCategory.isActive ? '' : id);
    const categoryUpdate = categories.map(category =>
      category.id === id
        ? {...category, isActive: !category.isActive}
        : {...category, isActive: false},
    );
    setCategories(categoryUpdate);
    const activeCategory = categoryUpdate.find(category => category.isActive);
    setCurrentCate(activeCategory ? activeCategory.id : null);
    setLoading(false);
    setModalVisible(false);
  };
  const toggleModal = () => setModalVisible(!isModalVisible);

  const onClose = () => {
    setModalVisible(false); // Close the modal by setting its visibility to false
  };

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        }
        setBackPressedOnce(true);
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        setTimeout(() => setBackPressedOnce(false), 2000);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [backPressedOnce]),
  );

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnimation, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // const renderBanner = ({ item }) => (
  //   <View style={styles.banner}>
  //     <Image source={{ uri: item?.banner_image && item?.banner_image?.includes('media') ? BASE_URL + item?.banner_image : item?.file_uri }} style={{ width: '100%', height: 170, borderRadius: 10 }} />
  //   </View>
  // );
  const BannerItem = ({item, play}) => {
    const [isMuted, setIsMuted] = useState(true); // State to handle mute/unmute for videos
    const [isPlaying, setIsPlaying] = useState(false);

    return (
      <View style={styles.banner}>
        {item?.media_type === 'banner' ? (
          // Render the image for banner media type
          <Image
            source={{
              uri:
                item?.banner_image && item?.banner_image.includes('media')
                  ? BASE_URL + item?.banner_image
                  : item?.file_uri,
            }}
            style={{width: '100%', height: 200, borderRadius: 10}}
          />
        ) : (
          // Render the video for video media type
          <View
            style={{
              position: 'relative',
              width: '100%',
              height: 200,
              borderRadius: 10,
            }}>
            <Video
              source={{
                uri:
                  item?.video_file && item?.video_file.includes('media')
                    ? BASE_URL + item?.video_file
                    : item?.file_uri,
              }}
              style={{width: '100%', height: '100%', borderRadius: 10}}
              resizeMode="cover"
              muted={isMuted}
              repeat
              paused={!isPlaying}
              bufferConfig={{
                minBufferMs: 5000,
                maxBufferMs: 60000,
              }}
            />
            {/* Unmute button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 10,
                right: 50,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: 8,
                borderRadius: 20,
              }}
              onPress={() => setIsMuted(!isMuted)}>
              <Icon
                name={isMuted ? 'volume-mute' : 'volume-high'}
                size={20}
                color="white"
              />
            </TouchableOpacity>
            {/* Play/Pause button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: 8,
                borderRadius: 20,
              }}
              onPress={() => setIsPlaying(!isPlaying)}>
              <Icon
                name={isPlaying ? 'pause' : 'play'} // Toggle play/pause icon
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const viewCompetition = comp => {
    console.log('>>>>>>>>>>>>>>', comp);
    navigation.navigate('ViewComp', {
      compId: comp.id,
      compType: comp.competition_type,
    });
  };

  const renderCompetition = competition => (
    <TouchableOpacity
      onPress={() => viewCompetition(competition)}
      key={competition.id}
      style={styles.upcomingCompetitionItem}>
      <Image
        source={{
          uri:
            competition?.banner_image &&
            competition?.banner_image?.includes('media')
              ? BASE_URL + competition?.banner_image
              : competition?.file_uri,
        }}
        style={styles.upcomingCompetitionImage}
      />
      <Text style={styles.upcomingCompetitionSlots}>
          {competition.remaining_slots}/{competition.max_participants}
        </Text>

      {/* Video Icon */}
      <View style={styles.videoIconContainer}>
        <Icon name="videocam" size={15} color="#000" style={styles.videoIcon} />
      </View>

      <View style={styles.upcomingCompetitionDetails}>
        
        <Text style={styles.upcomingCompetitionDate}>
          {competition.registration_open_date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const navigateMenuOption = option => {
    toggleMenu();
    navigation.navigate(option);
  };
  const sliderWidth = Dimensions.get('window').width;
  const itemWidth = sliderWidth * 0.95;

  return (
    <View style={styles.container}>
      {menuVisible && <View style={styles.overlay} />}
      <View style={styles.menuProfile}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Icon name={'menu'} size={40} color="#fff" />
        </TouchableOpacity>
        <View style={styles.IconButton}>
          <Image source={require('./../../assets/images/logo-without-shadow.png')} style={styles.logohimstar} />
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}>
          <Image
            source={
              profileImage
                ? {uri: BASE_URL + profileImage}
                : require('./../../assets/images/dp.png')
            }
            style={styles.profilePicture}
          />
        </TouchableOpacity>
      </View>
     <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnimation }] }]}>
      {/* Logo at the top */}

      {/* Menu Button for opening/closing sidebar */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Icon name={menuVisible ? 'close' : 'menu'} size={40} color="#fff" />
      </TouchableOpacity>



      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/logo-without-shadow.png')} style={styles.logo} />
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItemContainer} onPress={() => navigateMenuOption('Wallet')}>
          <Icon name="wallet-outline" size={24} color="#fff" style={styles.iconstyle} />
          <Text style={styles.menuItem}>My Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItemContainer} onPress={() => navigateMenuOption('ReferralHistory')}>
          <Icon name="people-outline" size={24} color="#fff" style={styles.iconstyle} />
          <Text style={styles.menuItem}>My Referrals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItemContainer} onPress={() => navigateMenuOption('PaymentHistory')}>
          <Icon name="pricetag-outline" size={24} color="#fff" />
          <Text style={styles.menuItem}>Payment History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItemContainer} onPress={() => navigateMenuOption('MyVideos')}>
          <Icon name="videocam-outline" size={24} color="#fff" />
          <Text style={styles.menuItem}>My Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItemContainer} onPress={() => navigateMenuOption('ContactUs')}>
          <Icon name="phone-portrait-outline" size={24} color="#fff" />
          <Text style={styles.menuItem}>Contact Us</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
      style={styles.menuItemContainer}
      onPress={() => navigateMenuOption('ContachDetails')}
    >
      <QueryIcon width={24} height={24} fill="#fff" />
      <Text style={styles.menuItem}>Query Status</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.menuItemContainer}
      onPress={() => navigateMenuOption('PastEvents')}>
      <HistoryIcon name="history" width={24} height={24} fill="#fff"/>
      <Text style={styles.menuItem}>Past Events</Text>
    </TouchableOpacity>
      </View>
    </Animated.View>
      <ScrollView
        scrollEnabled={menuVisible ? false : true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#B94EA0']}
          />
        }>
        {categories && categories.length > 0 && (
          <View style={styles.filtersWrapper}>
            <View style={styles.upcomingCompHead}>
              <Text style={styles.dataHeading}>Filters</Text>
              {categories.length > 4 && (
                <Text
                  onPress={toggleModal}
                  style={styles.upcomingMoreCompetition}>
                  See more...
                </Text>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroller}>
              {categories.map((tag, index) => (
                <TouchableOpacity
                  onPress={() => filterApply(tag.id)}
                  key={tag.id}
                  style={[
                    styles.filterTag,
                    {backgroundColor: tag.isActive ? '#B94EA0' : 'white'},
                  ]}>
                  <Text
                    style={[
                      styles.filterTagText,
                      {color: tag.isActive ? 'white' : '#B94EA0'},
                    ]}>
                    {tag.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

<Modal
      visible={isModalVisible}
      onRequestClose={onClose}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={categories}
            numColumns={numColumns}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCategory}
            contentContainerStyle={styles.grid}
            key={numColumns} // Add key prop here to force re-render when columns change
          />
        <View style={styles.buttons}>
        <TouchableOpacity onPress={toggleColumns} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Grid Change</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          
          
          </View>
        </View>
      </View>
    </Modal>

        {!loading &&
          banners.length === 0 &&
          activeCompetitions.length === 0 &&
          upcomingCompetitions.length === 0 &&
          tournaments.length === 0 && (
            <View
              style={[
                styles.noData,
                {marginTop: categories.length === 0 && 400},
              ]}>
              <Text style={styles.noDataText}>No data!</Text>
            </View>
          )}

        <View style={styles.crouselWrapper}>
          <Carousel
            layout="default"
            ref={carouselRef}
            data={banners}
            renderItem={({item, index}) => (
              <BannerItem item={item} play={index === activeSlide} />
            )}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            layoutCardOffset={5}
            onSnapToItem={index => setActiveSlide(index)}
          />
        </View>
        {activeCompetitions.length > 0 && (
          <View style={styles.upcomingCompetitionsWrapper}>
            <View style={styles.upcomingCompHead}>
              <Text style={styles.dataHeading}>Ongoing Competitions</Text>
              {activeCompetitions.length > 5 && (
                <Text
                  onPress={() => navigation.navigate('LiveComps')}
                  style={styles.upcomingMoreCompetition}>
                  See more...
                </Text>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.upcomingCompetitionScroller}>
              {activeCompetitions.slice(0, 10).map(renderCompetition)}
            </ScrollView>
          </View>
        )}

        {upcomingCompetitions.length > 0 && (
          <View style={[styles.upcomingCompetitionsWrapper, {marginTop: 10}]}>
            <View style={styles.upcomingCompHead}>
              <Text style={styles.dataHeading}>Upcoming Competitions</Text>
              {activeCompetitions.length > 5 && (
                <Text
                  onPress={() => navigation.navigate('UpcomingComps')}
                  style={styles.upcomingMoreCompetition}>
                  See more...
                </Text>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.upcomingCompetitionScroller}>
              {upcomingCompetitions.slice(0, 10).map(renderCompetition)}
            </ScrollView>
          </View>
        )}

        {tournaments.length > 0 && (
          <View style={styles.tournamentsWrapper}>
            <Text style={styles.dataHeading}>Mega Contests</Text>

            {tournaments.slice(0, 10).map((comp, index) => (
              <TouchableOpacity
                onPress={() => viewCompetition(comp)}
                key={index}
                style={styles.tournaments}>
                {/* {comp.file_uri && ( */}
                <View>
                  <Image
                    source={{
                      uri:
                        comp?.banner_image &&
                        comp?.banner_image?.includes('media')
                          ? BASE_URL + comp?.banner_image
                          : comp?.file_uri,
                    }}
                    style={styles.tournamentImage}
                  />
                  <View style={styles.overlayDetails}>
                    <Text style={styles.tournamentNameText}>{comp.name}</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.overlayDetailText}>
                        Registration Start: {comp.registration_open_date}
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
                  </View>
                </View>
                {/* )} */}
              </TouchableOpacity>
            ))}

            {tournaments.length > 5 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AllTournaments', {
                    categoryId: currentCate,
                  })
                }
                style={styles.activeCompsSeeMoreButton}>
                <Text style={styles.activeCompsSeeMoreButtonText}>
                  See more...
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </ScrollView>

      <View>
<TouchableOpacity onPress={() => navigation.navigate('StartedContests')} 
          style={{ zIndex: 1 }}
          activeOpacity={0.7} 
        >
      <View style={styles.startbuttonview}>
      <Animated.View
        style={[
          styles.startedbutton,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('StartedContests')} 
          style={{ zIndex: 1 }}
          activeOpacity={0.7} 
        >
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Icon name="trophy-outline" size={30} color="#bbb" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
    </TouchableOpacity>
    </View>


      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#B94EA0" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 70,
    left: '50%',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    pointerEvents: 'auto',
  },
  noData: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noDataText: {
    color: 'black',
  },
  menuProfile: {
    backgroundColor: '#B94EA0',
    zIndex: 1,
    width: '100%',
    height: 70,
    position: 'absolute',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  IconButton: {
    position: 'absolute',
    top: 20,
    right: "45%",
    zIndex: 1,
  },
  logohimstar:{
    height:50,
    width:50,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 75,
  },

  logo:{
    width:100,
    height:100,
    top: 20,
    left: "2%",
    right:50,
    marginBottom:10,
    
  },

  menuItemContainer:{
    display:'flex',
    alignContent:'center',
    flexDirection:'row',
    alignItems:'center'
  },

  iconstyle:{
alignItems:'center',

  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#B94EA0',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  menuContainer: {
    marginTop: 50,
  },

  logoContainer:{
    width:"100%",
    paddingBottom:20,
    borderBottomWidth:2,
    borderBottomColor:'#fff',
    textAlign:"center",
    alignContent:"center",
    alignItems:'center',
  },
  menuItem: {
    color: '#fff',
    padding: 15,
    fontSize: 18,
    fontFamily: 'DMSans_400Regular',
  },
  filtersWrapper: {
    marginTop: 70,
    marginBottom: 30,
    paddingLeft: 15,
    paddingRight: 15,
  },
  filterScroller: {
    flexDirection: 'row',
  },
  filterTag: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B94EA0',
    marginBottom:10,
  },
  filterTagText: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
  },
  carouselWrapper: {
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10, // Reduce or set to 0 to remove right gap
  },
  banner: {
    borderRadius: 10,
    height: 200,
    width: 100,

    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingCompetitionsWrapper: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  upcomingCompHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
  upcomingMoreCompetition: {
    fontSize: 12,
    color: '#B94EA0',
    fontFamily: 'DMSans_400Regular',
  },
  upcomingCompetitionScroller: {
    flexDirection: 'row',
  },
  upcomingCompetitionItem: {
    width: 100,
    marginHorizontal: 5,
    alignItems: 'center',
    fontSize: 10,
  },
  upcomingCompetitionImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    position:'relative'
  },
  upcomingCompetitionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
    paddingLeft: 3,
    paddingRight: 5,
  },
  upcomingCompetitionSlots: {
    fontSize: 10,
    position:'absolute',
    top:5,
    left:5,
    backgroundColor:'#fff',
    borderRadius:5,
    padding:3,
    color: '#B94EA0',
    fontWeight: 'bold',
  },
  upcomingCompetitionDate: {
    fontSize: 10,
    color: '#B94EA0',
    fontWeight: 'bold',
  },
  tournamentsWrapper: {
    paddingHorizontal: 20,
    marginTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 20,
  },
  dataHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingBottom: 8,
    paddingTop: 5,
    fontFamily: 'DMSans_400Regular',
  },
  tournaments: {
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
  tournamentImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    // padding: 10,
  },
  tournamentNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'DMSans_400Regular',
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
  activeCompsSeeMoreButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#B94EA0',
    borderRadius: 5,
  },
  activeCompsSeeMoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'DMSans_400Regular',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  banner: {
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden', // Ensure video and images fit within rounded borders
  },
  carouselWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },

  videoIconContainer: {
    position: 'absolute',
    top: 10,
    right: 0,
    zIndex: 10, // Ensures the icon is above the image
  },
  videoIcon: {
    width: 24, // Adjust size as needed
    height: 24,
    tintColor: 'white', // Optional, to color the icon
  },





  buttons:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',  // Dark overlay
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 5,  // Shadow for Android
    shadowColor: '#000',  // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categoryItem: {
    width: '48%',  // Set each item width to 48% for two per row with spacing
    marginBottom: 15,
    paddingVertical: 15,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: '1%', // Small margin between items
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',  // Center the text
    overflow: 'hidden',  // Prevent overflow
    textOverflow: 'ellipsis',  // Truncate text if it's too long
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#B94EA0',  // Main color
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#B94EA0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },


  startbuttonview: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    width: '100%',
    height: '100%',
  },

  startedbutton: {
    backgroundColor: '#B94EA0',
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: 75,
    height: 75,
    borderRadius: 75,
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  startedbuttontext: {
    color: "#fff",
    fontSize: 12,
  }
});

export default Home;
