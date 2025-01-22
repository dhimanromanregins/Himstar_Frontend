import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getLeaderBoard} from '../../actions/ApiActions';
import {BASE_URL} from '../../actions/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LeaderBoard = ({route, navigation}) => {
  const {compId} = route.params;
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userdata, setUserdata] = useState({});
  const top5Badges = [
    require('../../assets/images/Group20.png'),
    require('../../assets/images/Group16.png'),
    require('../../assets/images/Group18.png'),
    require('../../assets/images/Group17.png'),
    require('../../assets/images/Group19.png'),
  ];

  useEffect(() => {
    console.log('userdata>>>', userdata);
  }, [userdata]);

  const fetchLeaderBoard = async () => {
    const result = await getLeaderBoard(navigation, compId);
    if (result[0] === 200) {
      setLeaderBoardData(result[1]);
    } else {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      navigation.goBack();
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('leaderBoardData***', leaderBoardData);
    if (leaderBoardData.length > 0) {
      fetchSelf();
    }
  }, [leaderBoardData]);

  const fetchSelf = async () => {
    try {
      const username = await AsyncStorage.getItem('AuthUser');
      const result = leaderBoardData.filter(data => data.username === username);
      const userIndex = leaderBoardData.findIndex(
        user => user.username === username,
      );
      console.log('result>>>>>', result);
      if (result.length > 0) {
        const data = result[0];
        data['userIndex'] = userIndex;
        setUserdata(data);
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  useEffect(() => {
    fetchLeaderBoard();
    // profileData();
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={styles.backButtonContainer}> */}
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity> */}
      {/* </View> */}

      <View style={styles.contentContainer}>
        <View style={styles.backgroundContainer}>
          <Image
            source={require('../../assets/images/Rectangle89.png')}
            style={styles.backgroundImage}
          />
        </View>

        <View style={styles.firstRowBadges}>
          {leaderBoardData.length > 0 && (
            <View style={styles.badgeContainer}>
              <Image
                source={require('../../assets/images/diamond-badge.png')}
                style={[styles.badgeImage, {width: 140, height: 140}]}
              />
              <Image
                style={styles.userImage}
                source={
                  leaderBoardData[0].profile_picture
                    ? {uri: BASE_URL + leaderBoardData[0].profile_picture}
                    : require('../../assets/images/dp.png')
                }
              />
              <Text style={[styles.usernameText, {bottom: -5}]}>
                {leaderBoardData[0].username}
              </Text>
            </View>
          )}
          {leaderBoardData.length > 1 && (
            <View style={styles.badgeContainer}>
              <Image
                source={require('../../assets/images/gold-badge.png')}
                style={[styles.badgeImage, {width: 120, height: 120}]}
              />
              <Image
                style={[styles.userImage, {width: 55, height: 55}]}
                source={
                  leaderBoardData[1].profile_picture
                    ? {uri: BASE_URL + leaderBoardData[1].profile_picture}
                    : require('../../assets/images/dp.png')
                }
              />
              <Text style={[styles.usernameText, {bottom: -10}]}>
                {leaderBoardData[1].username}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.firstRowBadges, {marginBottom: 30}]}>
          {leaderBoardData.length > 2 && (
            <View style={styles.badgeContainer}>
              <Image
                source={require('../../assets/images/earl-badge.png')}
                style={styles.badgeImage}
              />
              <Image
                style={[styles.userImage, {width: 40, height: 40}]}
                source={
                  leaderBoardData[2].profile_picture
                    ? {uri: BASE_URL + leaderBoardData[2].profile_picture}
                    : require('../../assets/images/dp.png')
                }
              />
              <Text style={[styles.usernameText, {bottom: -15}]}>
                {leaderBoardData[2].username}
              </Text>
            </View>
          )}

          <View style={[styles.badgeContainer, {marginLeft: 5}]}>
            {leaderBoardData.length > 3 && (
              <View style={styles.badgeContainer}>
                <Image
                  source={require('../../assets/images/silver-badge.png')}
                  style={styles.badgeImage}
                />
                <Image
                  style={[styles.userImage, {width: 40, height: 40}]}
                  source={
                    leaderBoardData[3].profile_picture
                      ? {uri: BASE_URL + leaderBoardData[3].profile_picture}
                      : require('../../assets/images/dp.png')
                  }
                />
                <Text style={[styles.usernameText, {bottom: -15}]}>
                  {leaderBoardData[3].username}
                </Text>
              </View>
            )}
          </View>

          {leaderBoardData.length > 4 && (
            <View style={styles.badgeContainer}>
              <Image
                source={require('../../assets/images/bronze-badge.png')}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 10,
                  resizeMode: 'contain',
                  zIndex: 1000,
                }}
              />
              <Image
                style={[styles.userImage, {width: 40, height: 40}]}
                source={
                  leaderBoardData[4].profile_picture
                    ? {uri: BASE_URL + leaderBoardData[4].profile_picture}
                    : require('../../assets/images/dp.png')
                }
              />
              <Text style={styles.usernameText}>
                {leaderBoardData[4].username}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Text>AHHA</Text>

      <View style={styles.secondBackgroundContainer}>
        <Image
          source={require('../../assets/images/Rectangle92.png')}
          style={styles.secondBackgroundImage}
        />
      </View>

      <View style={styles.profileCard}>
        <View style={styles.cardHeading}>
          <Text style={styles.cardHeadingText}>Winning Zone</Text>
          <View style={{flexDirection: 'row', gap: 20}}>
            <Text style={styles.cardHeadingText}>Votes</Text>
            <Text style={styles.cardHeadingText}>Ranking</Text>
          </View>
        </View>

        {userdata.username && <View style={[styles.profileContent, {borderBottomWidth: 1, borderColor: '#B94EA0'}]}>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center', width: '40%'}}>
            <Image
              source={require('../../assets/images/Group22.png')}
              style={styles.cardIcon}
            />
            <Image
              source={userdata.profile_picture ? {uri: BASE_URL + userdata.profile_picture} : require('../../assets/images/dp.png')}
              style={styles.profileImage}
            />
            <Text style={styles.profileName2}>{userdata.username}</Text>
          </View>

          <View
            style={{flexDirection: 'row', gap: 40, justifyContent: 'center'}}>
            <Text style={styles.profileStatValue}>{userdata.likes}</Text>
            <Text style={[styles.profileStatValue, {textAlign: 'center'}]}>
              {userdata.userIndex + 1}
            </Text>
          </View>
        </View>}

      </View>
      <ScrollView>
        {leaderBoardData.length > 0 &&
          leaderBoardData
            .slice(0, leaderBoardData.length)
            .map((data, index) => {
              if (data.username != userdata.username){
              return (<View style={styles.profileContent}>
                <View
                  style={{flexDirection: 'row', gap: 10, alignItems: 'center', width: '40%'}}>
                  <Image
                    source={require('../../assets/images/Group22.png')}
                    style={styles.cardIcon}
                  />
                  <Image
                    source={data.profile_picture ? {uri: BASE_URL + data.profile_picture} : require('../../assets/images/dp.png')}
                    style={styles.profileImage}
                  />
                  <Text style={styles.profileName2}>{data.username}</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    gap: 40,
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.profileStatValue}>{data.likes}</Text>
                  <Text
                    style={[styles.profileStatValue, {textAlign: 'center'}]}>
                    {index + 1}
                </Text>
              </View>
            </View>)
              }
})}
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: -1,
  },
  backgroundImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    // flex: 1,
    marginTop: 0,
    paddingBottom: 20,
    height: 260,
    backgroundColor: 'yellow'
  },
  firstRowBadges: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'relative',
    display: 'flex',
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: 'contain',
    zIndex: 1000,
  },
  userImage: {
    position: 'absolute',
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 100,
    backgroundColor: 'white',
    marginBottom: 0,
  },
  usernameText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0,
  },
  secondBackgroundContainer: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    zIndex: -2,
  },
  secondBackgroundImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  profileCard: {
    // padding: 15,
    paddingTop: 10,
    borderRadius: 10,
    marginTop: 15,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    shadowRadius: 5,
    // backgroundColor: 'red'
  },
  cardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  cardHeadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 105,
    // marginBottom: 20,
    paddingVertical: 5,
  },
  cardIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  profileDesignation: {
    fontSize: 14,
    color: '#777',
    textAlign: 'left',
    // marginTop: 5, // Reduced the gap
    marginLeft: 50,
  },
  profileStatsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 5,
    // textAlign: 'center',
    // marginLeft: '30',
  },
  profileName2: {
    // marginLeft: 50,
    fontWeight: 'bold',
    // marginTop: -20, // Reduced the gap from the top
  },
  separationLine: {
    height: 1,
    backgroundColor: '#ddd', // Light gray color
    marginVertical: 15, // Space above and below the line
  },
});

export default LeaderBoard;
