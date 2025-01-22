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
import {getTournaments} from '../../actions/ApiActions';
import {BASE_URL} from '../../actions/APIs';

const AllTournaments = ({ route }) => {
  const { categoryId } = route.params;
  const [tournaments, setTournaments] = useState([]);
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    console.log('category>>>>>>>>>>', categoryId);
    fetchTournaments();
  }, []);

    const fetchTournaments = async () => {
      setTournaments([]);
      const result = await getTournaments(navigation, categoryId ? categoryId : '');
      console.log(result, '=========================')
      console.log(result[1], '=====================')
      if (result[0] === 200) {
        setTournaments(result[1]);
        
      }
    };

  const viewCompetition = comp => {
    console.log('Viewing competition:', comp);
    // Navigate to competition details or perform any action
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
        {tournaments.length > 0 ? (
          tournaments.map(comp => (
            <TouchableOpacity
              key={comp.id}
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
           <View style={styles.container}>
           <View style={styles.iconWrapper}>
        <Icon name="trophy-outline" size={60} color="#bbb" />
      </View>
           <Text style={styles.noCompetitionsText}>
           No Active Mega Contests Available
           </Text>
         </View>
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
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noCompetitionsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
    fontWeight: '500',
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

export default AllTournaments;
