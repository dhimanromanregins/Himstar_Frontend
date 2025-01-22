import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getpastevents } from '../../actions/ApiActions';
import Icon from 'react-native-vector-icons/Ionicons';

const PastEventsScreen = () => {
  const [tournaments, setTournaments] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetching past events from the API
  const fetchPastEvents = async () => {
    try {
      const response = await getpastevents(navigation);
      parseInt(response, '99999999999999999999')
      // const data = await response.json();
      console.log(data, '00000000000000000000000')
      setTournaments(data.past_tournaments);
      setCompetitions(data.past_competitions);
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

  // Render item for tournaments
  const renderTournamentItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.banner_image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardDate}>End Date: {new Date(item.end_date).toLocaleDateString()}</Text>
      <Text style={styles.cardPrice}>Prize: {item.winning_price}</Text>
    </View>
  );

  // Render item for competitions
  const renderCompetitionItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.banner_image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardDate}>End Date: {new Date(item.end_date).toLocaleDateString()}</Text>
      <Text style={styles.cardPrice}>Prize: {item.winning_price}</Text>
    </View>
  );

  // Render "No data" view
  const renderNoData = (message) => (
    <View style={styles.noDataContainer}>
      <Icon
                  name="trophy-outline"
                  size={30}
                  color='#B94EA0'
                />
      <Text style={styles.noDataText}>{message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Past Events</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <>
          <Text style={styles.subHeader}>Tournaments</Text>
          {tournaments.length > 0 ? (
            <FlatList
              data={tournaments}
              renderItem={renderTournamentItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            renderNoData('No tournaments found')
          )}

          <Text style={styles.subHeader}>Competitions</Text>
          {competitions.length > 0 ? (
            <FlatList
              data={competitions}
              renderItem={renderCompetitionItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            renderNoData('No competitions found')
          )}
        </>
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
  subHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
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
  noDataImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default PastEventsScreen;
