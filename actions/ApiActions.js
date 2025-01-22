import axios from "axios";
import { ENDPOINTS, MusicAPI, MusciAPIKey } from "./APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";


const logoutUser = async(navigation)=>{
    await AsyncStorage.removeItem('AuthToken');
    await AsyncStorage.removeItem('AuthUser');
    await AsyncStorage.removeItem('AuthId');
    await AsyncStorage.removeItem('RegAuthId');
    await AsyncStorage.removeItem('AuthEmail');
    await AsyncStorage.removeItem('AuthName');
    await AsyncStorage.removeItem('AuthPhone');
    await AsyncStorage.removeItem('AuthImage');
    ToastAndroid.show('Session expired, please login!', ToastAndroid.SHORT);
    navigation.navigate('Login');
};

const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem("AuthToken");
        console.log('Token:', token);
        return token || null;
    } catch (error) {
        console.error("Error fetching AuthToken:", error);
        return null;
    }
};

export const userRegistration = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.registration, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const userGoogleRegistration = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.googleRegistration, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const userLogin = async (data) => {
    try {
        console.log('ENDPOINTS.login>>>', ENDPOINTS.login)
        const response = await axios.post(ENDPOINTS.login, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const verifyOtp = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.verifyOtp, data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const contactUs = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.contactUs, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('Registration API error:', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const searchMusic = async (query = 'diljit') => {
    const options = {
        method: 'GET',
        url: MusicAPI,
        params: { q: query },
        headers: {
            'x-rapidapi-key': MusciAPIKey,
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        return response.data.data;
    } catch (error) {
        return false;
    }
};

export const mergeVideo = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.mergeVideo, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('Error:', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const removeTempVideo = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.removeTempVideo, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('Error:', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getCategories = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.categories, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getBanners = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.banners, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getCompetitions = async (navigation, category_id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${ENDPOINTS.competitions}?category_id=${category_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getqueries = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${ENDPOINTS.queriesHistory}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};


export const getpastevents = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${ENDPOINTS.pastEvents}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getStartedCompetitions = async (navigation, category_id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${ENDPOINTS.startedcompetitions}?category_id=${category_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getTournaments = async (navigation, category_id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${ENDPOINTS.tournaments}?category_id=${category_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};


export const getStartedTournaments = async (navigation, category_id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${ENDPOINTS.startedtournaments}?category_id=${category_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getPaymentHistory = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.paymentHistory, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const myCompetitions = async (navigation, username=null) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.myCompetitions + (username ? `?username=${username}` : ''), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postCreate = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.patch(ENDPOINTS.postCreate, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const listParticipantsVideos = async (navigation, params = {}) => {
    try {
        const token = await getAuthToken();

        const response = await axios.get(ENDPOINTS.listParticipantsVideos, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: params,
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401) {
            await logoutUser(navigation);
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const userVideos = async (navigation, username=null) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.userVideos + (username ? `?username=${username}` : ''), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postLikes = async (navigation, post_id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.postLikes + post_id, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const likePost = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.likePost, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postComments = async (navigation, post_id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.postComments + post_id, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const postComment = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.postComment, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const makePayment = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.makePayment, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const profile = async (navigation, username=null) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.profile + (username ? `?username=${username}` : ''), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log(error?.response, '|||', error?.response?.status);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const updateProfile = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        console.log('data>>>', data);
        const response = await axios.patch(ENDPOINTS.profile, data, {
            headers: {
             'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data)
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const getLeaderBoard = async (navigation, id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.leaderBoard, {competition_id: id}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const fetchSpecificCompetition = async (navigation, id, compType='null') => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.specificCompetition + id + '/' + compType + '/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const saveTempParticipant = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.saveTempParticipant, data, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const prizeBreakdown = async (navigation, data) => {
    console.log(data, '------------------')
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${ENDPOINTS.prizeBreakdown}?id=${data.id}&type=${data.type}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const deleteUserBank = async (navigation, id) => {
    try {
        const token = await getAuthToken();
        const response = await axios.delete(ENDPOINTS.bankDetails, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const fetchUserBank = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.bankDetails, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const saveUserBank = async (navigation, data) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.bankDetails, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const withdrawReqCreate = async (navigation, amount) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(ENDPOINTS.withdrawalRequest, {amount: amount}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const walletHistory = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.walletHistory, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};

export const referralHistory = async (navigation) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(ENDPOINTS.referralHistory, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return [response.status, response.data];
    } catch (error) {
        console.log('error?.response?.data>>>', error?.response?.data);
        if (error?.response?.status === 401){
            await logoutUser(navigation)
        }
        return [error?.response?.status || 500, error?.response?.data || 'An error occurred'];
    }
};