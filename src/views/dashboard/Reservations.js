import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { apiGetReservationsByDoctorId, apiGetReservationsByPatientId, apiUpdateReservationStatus, apiDeleteReservation } from "../../api/reservations";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import dayjs from 'dayjs';
import { addStyleToTextField } from "../../utils/utilFunctions";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const colorMap = {
    pending: 'orange',
    confirmed: 'blue',
    rejected: 'red',
    finished: 'green'
};

const columns = [
    { field: 'id', headerName: 'Id', type: 'string' },
    { field: 'name', headerName: 'Nume', type: 'string' },
    { field: 'photo', headerName: 'Foto', type: 'filepath' },
    { field: 'phone', headerName: 'Telefon', type: 'string' },
    { field: 'email', headerName: 'Email', type: 'string' },
    { field: 'subject', headerName: 'Subiect', type: 'string' },
    { field: 'description', headerName: 'Descriere', type: 'string' },
    {
        field: 'status', headerName: 'Status', type: 'string',
        renderCell: ({ value }) => {
            const statusMap = {
                pending: 'In asteptare',
                confirmed: 'Confirmata',
                rejected: 'Respinsa',
                finished: 'Finalizata'
            };

            const statusLabel = statusMap[value] || value;
            const color = colorMap[value] || 'default';

            return (
                <Chip
                    label={statusLabel}
                    variant="outlined"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: color,
                        borderColor: color,

                    }}
                    onClick={() => {

                    }}

                />
            );
        }
    },
    {
        field: 'date', headerName: 'Data si ora', type: 'date', renderCell: ({ value }) => {
            return dayjs(value).format('DD.MM.YYYY HH:mm');
        }
    },

];


const Reservations = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const rightCode = userRights[0]?.right_code;
    const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
    const [reservationToUpdate, setReservationToUpdate] = useState(null);
    const [formData, setFormData] = useState({
        status: 'pending'
    });

    const [completedForm, setCompletedForm] = useState(false);

    const [actions, setActions] = useState([]);
    const [openDeleteStatusDialog, setOpenDeleteStatusDialog] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);

    useEffect(() => {
        const isFormCompleted =
            formData.status;

        setCompletedForm(isFormCompleted);
    }, [formData]);


    useEffect(() => {
        console.log('rightCode', rightCode);

        if (rightCode === RIGHTS_MAPPING.DOCTOR) {
            apiGetReservationsByDoctorId((response) => {
                setData(response.data);
                console.log('rezervari doctor', response.data);
            }, showErrorToast);
            setActions([
                {
                    icon: <ChangeCircleIcon />, color: ' #4A90E2', onClick: (id) => handleOpenChangeStatusDialog(id),

                }, {
                    icon: <DeleteIcon />, color: 'red', onClick: (id) => handleOpenDeleteStatusDialog(id)
                }
            ]);
        } else if (rightCode === RIGHTS_MAPPING.PATIENT) {
            apiGetReservationsByPatientId((response) => {
                setData(response.data);
                console.log('rezervari patient', response.data);
            }, showErrorToast);
        }


    }, [data.length, rightCode]);

    // Function to open the delete confirmation dialog
    const handleOpenChangeStatusDialog = (reservationId) => {
        setReservationToUpdate(reservationId); // Store the seminar ID to be deleted
        setOpenChangeStatusDialog(true); // Open the dialog
    };


    const handleUpdateReservationStatusRequest = () => {
        apiUpdateReservationStatus((response) => {
            showSuccessToast(response.message);
            setOpenChangeStatusDialog(false);

            const updatedData = data.filter((reservation) => reservation.id !== reservationToUpdate);
            setData(updatedData);


        }, showErrorToast, reservationToUpdate, formData.status);


    };

    const handleCloseChangeStatusDialog = () => {
        setOpenChangeStatusDialog(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };



    // Function to open the delete confirmation dialog
    const handleOpenDeleteStatusDialog = (reservationId) => {
        setReservationToDelete(reservationId); // Store the seminar ID to be deleted
        setOpenDeleteStatusDialog(true); // Open the dialog
    };


    const handleDeleteReservationRequest = () => {
        apiDeleteReservation((response) => {
            showSuccessToast(response.message);
            const updatedData = data.filter((reservation) => reservation.id !== reservationToDelete);
            setData(updatedData);
            setOpenDeleteStatusDialog(false);

        }, showErrorToast, reservationToDelete);
    };

    const handleCloseDeleteStatusDialog = () => {
        setOpenDeleteStatusDialog(false);
    };

    return (
        <>
            <GenericTable

                title={"Rezervari"}
                columns={columns}
                data={data}
                actions={actions}

            >

            </GenericTable>

            <Dialog open={openChangeStatusDialog} onClose={handleCloseChangeStatusDialog}>
                <DialogTitle>Schimba status</DialogTitle>
                <DialogContent >

                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <FormControl fullWidth sx={{ ...addStyleToTextField(formData.status), mt: 1 }}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                label="Status"
                                labelId="status-label"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}

                            >
                                <MenuItem value={'pending'}>In asteptare</MenuItem>
                                <MenuItem value={'confirmed'}>Confirmata</MenuItem>
                                <MenuItem value={'rejected'}>Respinsa</MenuItem>
                                <MenuItem value={'finished'}>Finalizata</MenuItem>


                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>


                    <Button onClick={handleUpdateReservationStatusRequest} sx={{ backgroundColor: ' #4A90E2', color: 'white', mb: 1, ml: 1 }}>
                        Schimba status
                    </Button>

                    <Button onClick={handleCloseChangeStatusDialog} variant="contained" color="error" sx={{ mb: 1, mr: 1 }}>
                        Anuleaza
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteStatusDialog} onClose={handleCloseDeleteStatusDialog}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    Esti sigur ca vrei sa stergi rezervarea?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteStatusDialog} sx={{ backgroundColor: ' #4A90E2', color: 'white' }}>
                        Anuleaza
                    </Button>
                    <Button onClick={handleDeleteReservationRequest} variant="contained" color="error">
                        Sterge
                    </Button>
                </DialogActions>
            </Dialog>



        </>
    );
};
export default Reservations;