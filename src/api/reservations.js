import { getToken } from '../utils/utilFunctions';

export const apiAddReservation = async (successCallback, errorCallback, doctorId, date, subject, description) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/reservations/addReservation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ doctor_id: doctorId, date: date, subject: subject, description: description })
        });
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to add reservation" });
    }
};

export const apiUpdateReservationStatus = async (successCallback, errorCallback, reservationId, status) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/reservations/updateReservationStatus/${reservationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: status })
        });
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to update reservation status       " });
    }
};

export const apiDeleteReservation = async (successCallback, errorCallback, reservationId) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/reservations/deleteReservation/${reservationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to delete reservation" });
    }
};



export const apiGetReservationsByDoctorId = async (successCallback, errorCallback) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/reservations/getReservationsByDoctorId`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!data.success) {
            // errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch reservations" });
    }
};

export const apiGetReservationsByPatientId = async (successCallback, errorCallback) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/reservations/getReservationsByPatientId`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!data.success) {
            // errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch reservations" });
    }
};

export const apiGetPastReservationsByDoctorId = async (successCallback, errorCallback) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/reservations/getPastReservationsByDoctorId`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!data.success) {
            // errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch past reservations" });
    }
};


export const apiGetPastReservationsByPatientId = async (successCallback, errorCallback) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/reservations/getPastReservationsByPatientId`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!data.success) {
            // errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch past reservations" });
    }
};



