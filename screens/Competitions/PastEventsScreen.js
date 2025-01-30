import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getpastevents } from '../../actions/ApiActions';
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '../../actions/APIs';

const PastEventsScreen = () => {
  const [tournaments, setTournaments] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tournaments'); // Default tab
  const navigation = useNavigation();

  const fetchPastEvents = async () => {
    try {
      const response = await getpastevents(navigation);
      setTournaments(response[1].past_tournaments);
      setCompetitions(response[1].past_competitions);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPastEvents();
    }, [])
  );

  const viewCompetition = (comp) => {
    navigation.navigate('ViewComp', {
      compId: comp.id,
      compType: comp.competition_type,
    });
  };

  const renderCardItem = ({ item }) => (
    <TouchableOpacity onPress={() => viewCompetition(item)} key={item.id}>
      <View style={styles.card}>
        <Image source={{ uri: BASE_URL + item.banner_image }} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardDate}>End Date: {new Date(item.end_date).toLocaleDateString()}</Text>
        <Text style={styles.cardPrice}>Prize: {item.winning_price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderNoData = (message) => (
    <View style={styles.noDataContainer}>
      <Icon name="trophy-outline" size={30} color="#B94EA0" />
      <Text style={styles.noDataText}>{message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Past Events</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Tournaments' && styles.activeTab]}
          onPress={() => setActiveTab('Tournaments')}
        >
          <Text style={[styles.tabText, activeTab === 'Tournaments' && styles.activeTabText]}>
            Tournaments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Competitions' && styles.activeTab]}
          onPress={() => setActiveTab('Competitions')}
        >
          <Text style={[styles.tabText, activeTab === 'Competitions' && styles.activeTabText]}>
            Competitions
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : activeTab === 'Tournaments' ? (
        tournaments.length > 0 ? (
          <FlatList
            data={tournaments}
            renderItem={renderCardItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          renderNoData('No tournaments found')
        )
      ) : competitions.length > 0 ? (
        <FlatList
          data={competitions}
          renderItem={renderCardItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        renderNoData('No competitions found')
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#B94EA0',
  },
  tabText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default PastEventsScreen;
