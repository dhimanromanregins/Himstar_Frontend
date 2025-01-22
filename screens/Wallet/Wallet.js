import React, { useState, useEffect } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList, ScrollView, Alert, ToastAndroid, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchUserBank, deleteUserBank, saveUserBank, walletHistory, withdrawReqCreate , profile} from "../../actions/ApiActions";

const Wallet = ({ navigation }) => {
  const [showBankModal, setShowBankModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [walletHistoryData, setWalletHistory] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [bankDetails, setBankDetails] = useState({
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    branch_name: "",
  });
  const [remaining_amount, setRemainingAmount ] = useState(0);
  const [loading, setLoading] = useState(false);


  const [savedBankDetails, setSavedBankDetails] = useState(null); // Store the saved bank details
  const [withdrawAmount, setWithdrawAmount] = useState(null);

  const fetchWithdrawHistory = async()=>{
    setLoading(true);
    const result = await walletHistory(navigation);
    if (result[0] === 200){
      console.log('Result:', result);
      setWalletHistory(result[1].wallet_history);
      setRemainingAmount(result[1].amount)
    }
    else{
      ToastAndroid.show('Something went wrog!', ToastAndroid.SHORT);
    }
    setLoading(false);
  }


//   const fetchprofile = async () => {
//     console.log('Fetching profile...');
//     try {
//         const result = await profile(navigation); 

//         if (result[0] === 200) {
//             setProfileData(result[1]);
//             console.log(result[1], '---------');
//         } else {
//             ToastAndroid.show(result[1], ToastAndroid.SHORT);
//         }
//     } catch (error) {
//         console.error('Error fetching profile:', error);
//         ToastAndroid.show('Failed to fetch profile.', ToastAndroid.SHORT);
//     }
// };

// useEffect(() => {
//     const intervalId = setInterval(() => {
//         fetchprofile();
//         fetchWithdrawHistory();
//     }, 1000);
//     return () => clearInterval(intervalId);
// }, [navigation]);
 

  const createWithdrawHistory = async()=>{
    if (withdrawAmount < 1 || withdrawAmount > remaining_amount){
      ToastAndroid.show('Please enter valid amount.', ToastAndroid.SHORT);
      return;
    };
    setLoading(true);
    const result = await withdrawReqCreate(navigation, withdrawAmount);
    if (result[0] === 201){
      setWalletHistory(result[1].withdrawal_history);
      setRemainingAmount(result[1].amount)
      setShowWithdrawModal(false)
    }
    else{
      ToastAndroid.show('Something went wrog!', ToastAndroid.SHORT);
    }
    setLoading(false);
  }

  // Function to get the user ID from AsyncStorag

  // Fetch Bank Details of a user
  const fetchBankDetails = async () => {
    setLoading(true);
    const result = await fetchUserBank(navigation);
    if (result[0] === 200){
      setSavedBankDetails(result[1]);
    }
    else{
      ToastAndroid.show('No Bank Account Attached to this Profile', ToastAndroid.SHORT);
    }
    setLoading(false);
  };

  // Post Bank Details to the API
  const handleSaveBankDetails = async () => {
    setLoading(true);
    const result = await saveUserBank(navigation, bankDetails);
    if (result[0] === 201){
      setSavedBankDetails(result[1]);
      ToastAndroid.show('Your bank has been added successfully.', ToastAndroid.SHORT);
      setShowBankModal(false);
    }
    else{
      ToastAndroid.show('Somwthing went wrong!', ToastAndroid.SHORT);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBankDetails();
    fetchWithdrawHistory();
  }, []);

  const deleteBank = async () => {
    Alert.alert(
      "Delete Bank Account",
      "Are you sure you want to delete this bank account?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete canceled"),
          style: "cancel",
        },
        {
          text: "Yes, Delete",
          onPress: async () => {
            setLoading(true);
            const result = await deleteUserBank(navigation, savedBankDetails.id);
            if (result[0] === 200){
              setSavedBankDetails(null);
              ToastAndroid.show('Your bank has been deleted successfully!', ToastAndroid.SHORT);
            }
            else{
              ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
            }
            setLoading(false);
          },
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#f4f7fb', padding: 20 }}>
      {/* Wallet Balance Section */}
      <View style={{ marginBottom: 20, backgroundColor: 'white', borderRadius: 10, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 }}>
        <Text style={{ fontSize: 24, fontWeight: "600", color: '#333' }}>Wallet Balance</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
          <Icon name="account-balance-wallet" size={40} color="#B94EA0" />
          <Text style={{ fontSize: 32, marginLeft: 10, fontWeight: '600', color: '#333' }}>₹{remaining_amount}</Text>
        </View>
        <Text style={{ fontSize: 16, color: "#777" }}>INR</Text>
      </View>

      {/* Add Bank Button */}
      {!savedBankDetails && <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 18,
          backgroundColor: "#B94EA0",
          borderRadius: 8,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
        onPress={() => setShowBankModal(true)}
      >
        <Icon name="credit-card" size={24} color="white" />
        <Text style={{ marginLeft: 12, color: "white", fontWeight: "500", fontSize: 16 }}>Add Bank Account</Text>
      </TouchableOpacity>}

      {/* Display Bank Details if available */}
      {savedBankDetails && (
        <View style={{ marginBottom: 20, backgroundColor: 'white', borderRadius: 10, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 }}>
          <TouchableOpacity onPress={deleteBank} style={{ 
            backgroundColor: '#B94EA0', 
            width: 40, 
            height: 40, 
            borderRadius: 50, 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <Icon name='close' size={24} color='white' />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#333', textAlign: 'center' }}>Your Bank</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10, fontWeight: '500' }}>Account Holder:</Text>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10 }}>{savedBankDetails.account_holder_name}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10, fontWeight: '500' }}>Account Number:</Text>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10 }}>{savedBankDetails.account_number}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10, fontWeight: '500' }}>IFSC:</Text>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10 }}>{savedBankDetails.ifsc_code}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10, fontWeight: '500' }}>Branch:</Text>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10 }}>{savedBankDetails.branch_name}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10, fontWeight: '500' }}>Bank Name:</Text>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10 }}>{savedBankDetails.bank_name}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10, fontWeight: '500' }}>Bank Name:</Text>
            <Text style={{ fontSize: 16, color: '#777', marginTop: 10 }}>{savedBankDetails.branch_name}</Text>
          </View>
        </View>
      )}

      {/* Withdraw Button */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 18,
          backgroundColor: "#B94EA0",
          borderRadius: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
        onPress={() => savedBankDetails ? setShowWithdrawModal(true) : ToastAndroid.show('Please add your bank details to withdraw your balance.', ToastAndroid.SHORT)}
      >
        <Icon name="arrow-downward" size={24} color="white" />
        <Text style={{ marginLeft: 12, color: "white", fontWeight: "500", fontSize: 16 }}>Withdraw</Text>
      </TouchableOpacity>

      {/* Withdraw Modal */}
      <Modal visible={showWithdrawModal} animationType="fade" transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <View style={{ backgroundColor: "white", padding: 30, borderRadius: 12, width: "85%", shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 20, color: '#333' }}>Withdraw Funds</Text>
            <TextInput
              style={{
                height: 45,
                borderColor: "#ccc",
                borderWidth: 1,
                marginBottom: 20,
                paddingLeft: 12,
                borderRadius: 8,
                fontSize: 16,
                backgroundColor: '#f9f9f9',
              }}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />
            <TouchableOpacity
              style={{
                marginBottom: 10,
                paddingVertical: 12,
                backgroundColor: "#B94EA0",
                borderRadius: 8,
                alignItems: "center",
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={createWithdrawHistory}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                backgroundColor: "#e74c3c",
                borderRadius: 8,
                alignItems: "center",
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={() => {setShowWithdrawModal(false); setWithdrawAmount(null);}}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Bank Details Modal */}
      <Modal visible={showBankModal} animationType="fade" transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <View style={{ backgroundColor: "white", padding: 30, borderRadius: 12, width: "85%", shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 20, color: '#333' }}>Add Bank Details</Text>
            <TextInput
              style={{
                height: 45,
                borderColor: "#ccc",
                borderWidth: 1,
                marginBottom: 15,
                paddingLeft: 12,
                borderRadius: 8,
                fontSize: 16,
                backgroundColor: '#f9f9f9',
              }}
              placeholder="Account Holder Name"
              value={bankDetails.account_holder_name}
              onChangeText={(text) => setBankDetails({ ...bankDetails, account_holder_name: text })}
            />
            <TextInput
              style={{
                height: 45,
                borderColor: "#ccc",
                borderWidth: 1,
                marginBottom: 15,
                paddingLeft: 12,
                borderRadius: 8,
                fontSize: 16,
                backgroundColor: '#f9f9f9',
              }}
              placeholder="Account Number"
              keyboardType="numeric"
              maxLength={20}
              value={bankDetails.account_number}
              onChangeText={(text) => setBankDetails({ ...bankDetails, account_number: text })}
            />
            <TextInput
              style={{
                height: 45,
                borderColor: "#ccc",
                borderWidth: 1,
                marginBottom: 15,
                paddingLeft: 12,
                borderRadius: 8,
                fontSize: 16,
                backgroundColor: '#f9f9f9',
              }}
              maxLength={11}
              placeholder="IFSC Code"
              value={bankDetails.ifsc_code}
              onChangeText={(text) => setBankDetails({ ...bankDetails, ifsc_code: text })}
            />
            <TextInput
              style={{
                height: 45,
                borderColor: "#ccc",
                borderWidth: 1,
                marginBottom: 15,
                paddingLeft: 12,
                borderRadius: 8,
                fontSize: 16,
                backgroundColor: '#f9f9f9',
              }}
              placeholder="Bank Name"
              value={bankDetails.bank_name}
              onChangeText={(text) => setBankDetails({ ...bankDetails, bank_name: text })}
            />
            <TextInput
              style={{
                height: 45,
                borderColor: "#ccc",
                borderWidth: 1,
                marginBottom: 20,
                paddingLeft: 12,
                borderRadius: 8,
                fontSize: 16,
                backgroundColor: '#f9f9f9',
              }}
              placeholder="Branch Name"
              value={bankDetails.branch_name}
              onChangeText={(text) => setBankDetails({ ...bankDetails, branch_name: text })}
            />
            <TouchableOpacity
              style={{
                marginBottom: 10,
                paddingVertical: 12,
                backgroundColor: "#B94EA0",
                borderRadius: 8,
                alignItems: "center",
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={handleSaveBankDetails}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                backgroundColor: "#e74c3c",
                borderRadius: 8,
                alignItems: "center",
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={() => setShowBankModal(false)}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdrawal Request History */}
      <ScrollView style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "500", color: '#333', marginBottom: 10 }}>Withdrawal History</Text>
        {
          walletHistoryData.length === 0 &&
          <Text style={{textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginTop: 20}}>No History</Text>
        }
        <FlatList
          data={walletHistoryData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
              backgroundColor: 'white',
              borderRadius: 8,
              marginBottom: 10,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 5,
            }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "500", color: item.invitee ? 'green' : 'red' }}>{item.invitee ? '+' : '- '}₹{item.amount}</Text>
                <Text style={{ fontSize: 14, color: "#777" }}>{item.date}</Text>
              </View>
              <Text
                style={{
                  color: item.invitee ? "green" : (item.status === "COMPLETED" ? "green" : item.status === "PENDING" ? "orange" : "red"),
                  fontWeight: "600",
                }}
              >
                {item.invitee ? 'Referral' : item.status}
              </Text>
            </View>
          )}
        />
      </ScrollView>
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }}>
          <ActivityIndicator size="large" color="#B94EA0" />
        </View>
      </Modal>
    </View>
  );
};

export default Wallet;
