import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { fetchSpecificCompetition, profile } from "../../actions/ApiActions";


export default function Search({ navigation }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const resetStates = ()=>{
    setQuery('');
    setResults(null);
    setIsLoading(false);
    setError(null);
  };

  useFocusEffect(
      useCallback(() => {
        return () => {
          resetStates();
        };
      }, [])
  );

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    if (query.startsWith('COMP') || query.startsWith('TOUR')){
      const result = await fetchSpecificCompetition(navigation, query);
      console.log('result>>>>', result);
      if (result[0] === 200){
        navigation.navigate('ViewComp', { compId: result[1].id, compType: result[1].competition_type })
      }
      else{
        setError(true);
      }
    }
    else{
      const result = await profile(navigation, query);
      if (result[0] === 200){
        navigation.navigate('Profile', {username: query})
      }
      else{
        setError(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search a user or competition"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.iconContainer} disabled={query.trim() ? false : true} onPress={handleSearch}>
          <Icon name='search' size={22} color='#B94EA0' />
        </TouchableOpacity>
      </View>

      {/* Default Text */}
      {/* {!isLoading && !results && !error && (
        <View style={styles.defaultTextContainer}>
          <Icon name='search' size={100} color='#B94EA0' />
        </View>
      )} */}

      {/* Loader */}
      {isLoading && <ActivityIndicator size="large" color='#B94EA0' />}

      {/* Results */}
      {!isLoading && error && (
        <View style={styles.resultsContainer}>
          <Text style={styles.noResultsText}>No results found.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "'#B94EA0'",
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 15,
  },
  iconContainer: {
    paddingRight: 15,
    position: "absolute",
    right: 10,
  },
  searchIcon: {
    fontSize: 18,
    color: "#888",
  },
  defaultTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultText: {
    fontSize: 18,
    color: "#888",
  },
  resultsContainer: {
    padding: 20,
  },
  resultText: {
    fontSize: 16,
    marginVertical: 5,
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
