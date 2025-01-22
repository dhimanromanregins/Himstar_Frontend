import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Using Ionicons

import Home from './../Home/Home';
import Reels from './../Reels/Reels';
import MyCompetitions from '../MyCompetitions/MyCompetitions';
import Search from '../Search/Search';
import HomeIcon from './../../assets/images/home-icon.svg';
import ReelsIcon from './../../assets/images/video.svg';
import NyCompIcon from './../../assets/images/person.svg';
import SearchIcon from './../../assets/images/search.svg';

const Tab = createBottomTabNavigator();

export default NavBar = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Home') {
                        return <HomeIcon width={30} height={30} />;
                    }
                    else if (route.name === 'Search') {
                        return <SearchIcon width={30} height={30} />;
                    }
                    else if (route.name === 'Reels') {
                        return <ReelsIcon width={30} height={30} />;
                    }
                    else if (route.name === 'MyComps') {
                        return <NyCompIcon width={40} height={40} />;
                    }
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Reels') {
                        iconName = focused ? 'film' : 'film-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Icon name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#B94EA0',
                tabBarInactiveTintColor: 'black',
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60,
                },
                tabBarShowLabel: false,
            })}
        >
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Tab.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <Tab.Screen name="Reels" component={Reels} options={{ headerShown: false }} initialParams={{value: 'ALL', vId: null}} />
            <Tab.Screen name="MyComps" component={MyCompetitions} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};
