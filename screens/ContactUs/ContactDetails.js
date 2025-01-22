import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { contactUs } from '../../actions/ApiActions';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { getqueries } from '../../actions/ApiActions';

const Contact = ({ navigation }) => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQueries = async () => {
      const result = await getqueries(navigation);
      if (result[0] === 200) {
        setQueries(result[1]);
      } else {
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        navigation.goBack();
      }
      setLoading(false);
    };

  useFocusEffect(
    useCallback(() => {
        fetchQueries();
    }, [])
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'in_review':
        return '#e67e22';
      case 'completed':
        return '#2ecc71';
      default:
        return '#bdc3c7';
    }
  };

  const renderQueryItem = ({ item }) => (
    <View style={[styles.card, { borderLeftColor: getStatusColor(item.status) }]}>
      <Text style={styles.queryTitle}>{item.full_name}</Text>
      <Text style={styles.queryStatus}>{item.status.toUpperCase()}</Text>
      <Text style={styles.queryMessage}>{item.message}</Text>
      <Text style={styles.queryDate}>Created: {moment(item.created_at).format('MMM DD, YYYY hh:mm A')}</Text>
      <Text style={styles.queryDate}>Last Update: {moment(item.updated_at).format('MMM DD, YYYY hh:mm A')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Query Status</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text> 
      ) : (
        <FlatList
          data={queries}
          renderItem={renderQueryItem}
          keyExtractor={(item) => item?.id?.toString() || item?.full_name || 'unknown'} 
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ecf0f1',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  queryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  queryStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#95a5a6',
    marginVertical: 8,
  },
  queryMessage: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  queryDate: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Contact;
