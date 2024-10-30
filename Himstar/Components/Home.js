import React, { useState } from 'react';
import { StyleSheet, View, Image, Dimensions, Text, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
// import Carousel from 'react-native-snap-carousel';
import Footer from './Footer';

// Sample images for banner slider (replace with actual paths)
const bannerImages = [
  require('/home/tanya/Downloads/Himstar-App/Himstar/assets/banner.png'),
  require('/home/tanya/Downloads/Himstar-App/Himstar/assets/banner.png'),
  require('/home/tanya/Downloads/Himstar-App/Himstar/assets/banner.png'),
];
// Sample tab scenes with static images
const FirstRoute = ({ onSelect, selectedActivity }) => (
  <View style={styles.scene}>
    <Text style={styles.routeTitle}>Sing</Text>
    <View style={styles.activityContainer}>
      <TouchableOpacity 
        style={[styles.activityItem, selectedActivity === 'sing' && styles.selectedActivityItem]} 
        onPress={() => onSelect('sing')}
      >
        <Image
          source={require('/home/tanya/Downloads/Himstar-App/Himstar/assets/sing.png')}
          style={styles.activityImage}
        />
        <Text style={styles.activityText}>Sing</Text>
      </TouchableOpacity>
    </View>
  </View>
);
const SecondRoute = ({ onSelect, selectedActivity }) => (
  <View style={styles.scene}>
    <Text style={styles.routeTitle}>Dance</Text>
    <View style={styles.activityContainer}>
      <TouchableOpacity 
        style={[styles.activityItem, selectedActivity === 'dance' && styles.selectedActivityItem]} 
        onPress={() => onSelect('dance')}
      >
        <Image
          source={require('/home/tanya/Downloads/Himstar-App/Himstar/assets/dance.png')}
          style={styles.activityImage}
        />
        <Text style={styles.activityText}>Dance</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ThirdRoute = ({ onSelect, selectedActivity }) => (
  <View style={styles.scene}>
    <Text style={styles.routeTitle}>Act</Text>
    <View style={styles.activityContainer}>
      <TouchableOpacity 
        style={[styles.activityItem, selectedActivity === 'act' && styles.selectedActivityItem]} 
        onPress={() => onSelect('act')}
      >
        <Image
          source={require('/home/tanya/Downloads/Himstar-App/Himstar/assets/sing.png')}
          style={styles.activityImage}
        />
        <Text style={styles.activityText}>Act</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FourthRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.routeText}>This is the Fourth Tab Content</Text>
  </View>
);

const FifthRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.routeText}>This is the Fifth Tab Content</Text>
  </View>
);

const Home = () => {
  const [index, setIndex] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [routes] = useState([
    { key: 'first', title: 'Sing' },
    { key: 'second', title: 'Dance' },
    { key: 'third', title: 'Act' },
    { key: 'fourth', title: 'Tab 4' },
    { key: 'fifth', title: 'Tab 5' },
  ]);

  const renderScene = SceneMap({
    first: () => <FirstRoute onSelect={setSelectedActivity} selectedActivity={selectedActivity} />,
    second: () => <SecondRoute onSelect={setSelectedActivity} selectedActivity={selectedActivity} />,
    third: () => <ThirdRoute onSelect={setSelectedActivity} selectedActivity={selectedActivity} />,
    fourth: FourthRoute,
    fifth: FifthRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      labelStyle={styles.label}
      scrollEnabled={true}
    />
  );

  const renderBannerItem = ({ item }) => (
    <Image source={item} style={styles.bannerImage} resizeMode="cover" />
  );

  return (
    <View style={styles.container}>
      {/* Header container with logo and profile image */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/profile.png')}
          style={styles.profileImage}
          resizeMode="contain"
        />
      </View>

      {/* Tab View Component */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />

      {/* Banner Slider */}
      {/* <Carousel
        data={bannerImages}
        renderItem={renderBannerItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width * 0.9}
        loop={true}
        autoplay={true}
        autoplayInterval={3000}
      /> */}

      {/* Footer Component */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#B94EA0',
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFB6C1', // Pink background color for the tab panes
  },
  routeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  activityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  activityItem: {
    alignItems: 'center',
    margin: 10,
    borderWidth: 2,
    borderColor: '#B94EA0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedActivityItem: {
    borderColor: '#B94EA0',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activityImage: {
    width: 60,
    height: 60,
  },
  activityText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },
  routeText: {
    color: '#000000',
    fontSize: 20,
  },
  tabBar: {
    backgroundColor: '#fff',
  },
  indicator: {
    backgroundColor: '#B94EA0',
  },
  label: {
    color: '#B94EA0',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default Home;
