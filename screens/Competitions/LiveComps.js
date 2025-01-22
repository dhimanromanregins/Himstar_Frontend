import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook
import {getCompetitions} from '../../actions/ApiActions';
import {BASE_URL} from '../../actions/APIs';

const LiveComps = () => {
  const [activeCompetitions, setActiveCompetitions] = useState([]);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async (bannerId = '') => {
    setActiveCompetitions([]);
    setUpcomingCompetitions([]);

    const result = await getCompetitions(navigation, bannerId);
    console.log('Comps Data:', result);

    if (result[0] === 200) {
      const activeComps = result[1]?.active || [];
      setActiveCompetitions(activeComps);

      const upComingComps = result[1]?.upcoming || [];
      setUpcomingCompetitions(upComingComps);
    }
  };

  const viewCompetition = (comp) => {
    navigation.navigate('ViewComp', { compId: comp.id, compType: comp.competition_type });
  };

  return (
    <View style={{flex: 1}}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {activeCompetitions.length > 0 ? (
          activeCompetitions.map(comp => (
            <TouchableOpacity
              key={comp.id}
              onPress={() => viewCompetition(comp)}
              style={[
                styles.competitions,
                !comp.is_active && styles.inactiveCompetition,
              ]}
              activeOpacity={comp.is_active ? 0.7 : 1}>
              <View>
                <Image
                  source={{
                    uri:
                      comp?.banner_image && comp?.banner_image.includes('media')
                        ? BASE_URL + comp.banner_image
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
                      Registration Start: {comp.registration_open_date || 'N/A'}
                    </Text>
                    <Text style={styles.overlayDetailText}>
                      Registration End: {comp.registration_close_date || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.overlayDetailText}>
                      Total Slots: {comp.max_participants || '0'}
                    </Text>
                    <Text style={styles.overlayDetailText}>
                      Remaining Slots: {comp.remaining_slots || '0'}
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
          ))
        ) : (
          <Text style={styles.noCompetitionsText}>
            No Active Competitions Available
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  backButton: {
    padding: 15,
    backgroundColor: '#007bff',
    alignSelf: 'flex-start',
    margin: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  competitions: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inactiveCompetition: {
    opacity: 0.6,
  },
  competitionImage: {
    width: '100%',
    height: 150,
  },
  inactiveCompetitionImage: {
    opacity: 0.5,
  },
  overlayDetails: {
    padding: 10,
  },
  competitionsNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  overlayDetailText: {
    fontSize: 14,
    color: '#666',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  noCompetitionsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  backButtonContainer: {
    top: 10,
    left: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
  },
});

export default LiveComps;