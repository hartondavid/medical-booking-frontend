import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, List, ListItemButton, ListItemText } from "@mui/material";
import { apiAddPrescription, apiGetPrescriptionsByDoctorId, apiGetPrescriptionsByPatientId, apiDeletePrescription } from "../../api/prescriptions";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { addStyleToTextField } from "../../utils/utilFunctions";
import { apiGetPatients } from "../../api/users";
const columns = [
    { field: 'id', headerName: 'Id', type: 'string' },
    { field: 'name', headerName: 'Nume', type: 'string' },
    { field: 'photo', headerName: 'Foto', type: 'filepath' },
    { field: 'phone', headerName: 'Telefon', type: 'string' },
    { field: 'email', headerName: 'Email', type: 'string' },
    { field: 'file_path', headerName: 'Reteta', type: 'filepath' },

    {
        field: 'created_at', headerName: 'Data', type: 'date', renderCell: ({ value }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },

];


const Prescriptions = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const rightCode = userRights[0]?.right_code;
    const [openAddPrescriptionDialog, setOpenAddPrescriptionDialog] = useState(false);
    const [prescriptionToAdd, setPrescriptionToAdd] = useState(null);
    const [formData, setFormData] = useState({
        file_path: '',
        patient_id: ''
    });
    const [actions, setActions] = useState([]);
    const [openDeletePrescriptionDialog, setOpenDeletePrescriptionDialog] = useState(false);
    const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);

    const [patientSearchTerm, setPatientSearchTerm] = useState('');
    const [patientSearchResults, setPatientSearchResults] = useState([]);
    const [patients, setPatients] = useState([]);
    const [completedForm, setCompletedForm] = useState(false);

    useEffect(() => {
        const isFormCompleted =
            formData.file_path &&
            formData.patient_id;

        setCompletedForm(isFormCompleted);
    }, [formData]);

    useEffect(() => {
        console.log('rightCode', rightCode);

        if (rightCode === RIGHTS_MAPPING.DOCTOR) {
            apiGetPrescriptionsByDoctorId((response) => {
                setData(response.data);
                console.log('rezervari doctor', response.data);
            }, showErrorToast);
            setActions([
                {
                    icon: <DeleteIcon />, color: 'red', onClick: (id) => handleOpenDeleteStatusDialog(id)
                }
            ]);
            apiGetPatients((response) => {
                setPatients(response.data);
                console.log('pacienti', response.data);
            }, showErrorToast);

        } else if (rightCode === RIGHTS_MAPPING.PATIENT) {
            apiGetPrescriptionsByPatientId((response) => {
                setData(response.data);
                console.log('prescriptii patient', response.data);
            }, showErrorToast);
        }


    }, [data.length, rightCode]);



    // Function to open the delete confirmation dialog
    const handleOpenAddPrescriptionDialog = (reservationId) => {
        setPrescriptionToAdd(reservationId); // Store the seminar ID to be deleted
        setOpenAddPrescriptionDialog(true); // Open the dialog
    };


    const handleAddPrescriptionRequest = () => {
        // Construiește un obiect FormData pentru upload fișier
        // const formDataToSend = new FormData();
        // formDataToSend.append('file', formData.file_path); // file_path conține obiectul File
        // formDataToSend.append('patient_id', 2 || '');

        apiAddPrescription((response) => {
            showSuccessToast(response.message);
            setOpenAddPrescriptionDialog(false);

            apiGetPrescriptionsByDoctorId((response) => {
                setData(response.data);
                console.log('prescriptii doctor', response.data);
            }, showErrorToast);
        }, showErrorToast, { file: formData.file_path, patient_id: formData.patient_id });
    };

    const handleCloseAddPrescriptionDialog = () => {
        setOpenAddPrescriptionDialog(false);
        setFormData({
            file_path: '',
            patient_id: ''
        });
        setPatientSearchTerm('');
        setPatientSearchResults([]);
    };


    // Function to open the delete confirmation dialog
    const handleOpenDeleteStatusDialog = (reservationId) => {
        setPrescriptionToDelete(reservationId); // Store the seminar ID to be deleted
        setOpenDeletePrescriptionDialog(true); // Open the dialog
    };


    const handleDeletePrescriptionRequest = () => {
        apiDeletePrescription((response) => {
            showSuccessToast(response.message);
            const updatedData = data.filter((prescription) => prescription.id !== prescriptionToDelete);
            setData(updatedData);
            setOpenDeletePrescriptionDialog(false);

        }, showErrorToast, prescriptionToDelete);
    };

    const handleCloseDeletePrescriptionDialog = () => {
        setOpenDeletePrescriptionDialog(false);
    };

    const handlePatientSearchChange = (event) => {
        const value = event.target.value;
        setPatientSearchTerm(value);

        console.log('patients', patients);
        if (value.trim()) {
            const searchTermLower = value.trim().toLowerCase();
            const filtered = patients.filter(patient => {

                if (patient && patient.name) {
                    return patient.name.toLowerCase().includes(searchTermLower);
                }
                return false;
            });
            setPatientSearchResults(filtered);
        } else {
            setPatientSearchResults([]);
        }
    };


    const handleAddPatient = (patient) => {

        console.log('patient', patient.name);

        setPatientSearchTerm(patient.name);
        setPatientSearchResults([]);

        formData.patient_id = patient.id;

        setPatientSearchResults([]);

    };

    return (
        <>
            <GenericTable

                title={"Retete"}
                columns={columns}
                data={data}
                buttonText={rightCode === RIGHTS_MAPPING.DOCTOR && "Adauga reteta"}
                buttonAction={() => {
                    handleOpenAddPrescriptionDialog();
                }}
                actions={actions}
            >

            </GenericTable>


            <Dialog open={openAddPrescriptionDialog} onClose={handleCloseAddPrescriptionDialog}>
                <DialogTitle>Adauga reteta</DialogTitle>
                <DialogContent >


                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <TextField
                            label="Cauta pacient"
                            variant="outlined"
                            fullWidth
                            value={patientSearchTerm}
                            onChange={handlePatientSearchChange}
                            sx={{ ...addStyleToTextField(patientSearchTerm), mt: 1 }}

                        />


                        {patientSearchResults.length > 0 && (
                            <List sx={{
                                position: 'absolute',
                                width: '100%',
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                borderRadius: '8px',
                                zIndex: 1300,
                                mt: 1,

                            }}>
                                {patientSearchResults.map((patient) => (
                                    <ListItemButton
                                        key={patient.id}
                                        onClick={() => handleAddPatient(patient)}
                                    >
                                        <ListItemText
                                            primary={patient.name}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        )}

                        {/* File upload button */}
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ mb: 2, mt: 2 }}
                        >
                            Încarcă fișier
                            <input
                                type="file"
                                hidden
                                name="file"
                                onChange={e => setFormData({ ...formData, file_path: e.target.files[0] })}
                            />
                        </Button>
                        {/* Show selected file name */}
                        {formData.file_path && (
                            <div style={{ marginBottom: 8 }}>
                                Fișier selectat: {formData.file_path.name}
                            </div>
                        )}


                    </Box>



                </DialogContent>
                <DialogActions>


                    <Button onClick={handleAddPrescriptionRequest} style={{
                        backgroundColor: ' #4A90E2', color: 'white', ...(!completedForm && {
                            backgroundColor: ' #4A90E2',
                            opacity: 0.5,
                            color: 'white',
                        })
                    }}
                        disabled={!completedForm}>
                        Adauga reteta
                    </Button>

                    <Button onClick={handleCloseAddPrescriptionDialog} variant="contained" color="error" sx={{ mr: 1 }}>
                        Anuleaza
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog open={openDeletePrescriptionDialog} onClose={handleCloseDeletePrescriptionDialog}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    Esti sigur ca vrei sa stergi reteta?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeletePrescriptionDialog} sx={{ backgroundColor: ' #4A90E2', color: 'white' }}>
                        Anuleaza
                    </Button>
                    <Button onClick={handleDeletePrescriptionRequest} variant="contained" color="error">
                        Sterge
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    );
};
export default Prescriptions;