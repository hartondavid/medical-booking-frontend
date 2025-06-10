import { getToken } from '../utils/utilFunctions';

export const apiAddPrescription = async (successCallback, errorCallback, reqData) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {

        const formData = new FormData();

        formData.append('file', reqData.file);
        formData.append('patient_id', reqData.patient_id);

        const response = await fetch(`${apiUrl}/api/prescriptions/addPrescription`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to add prescription" });
    }
};


export const apiGetPrescriptionsByDoctorId = async (successCallback, errorCallback) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/prescriptions/getPrescriptionsByDoctorId`, {
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
        errorCallback({ success: false, message: "Failed to fetch prescriptions" });
    }
};

export const apiGetPrescriptionsByPatientId = async (successCallback, errorCallback) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/prescriptions/getPrescriptionsByPatientId`, {
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
        errorCallback({ success: false, message: "Failed to fetch prescriptions" });
    }
};

export const apiDeletePrescription = async (successCallback, errorCallback, prescriptionId) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/prescriptions/deletePrescription/${prescriptionId}`, {
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
        errorCallback({ success: false, message: "Failed to delete prescription" });
    }
};
