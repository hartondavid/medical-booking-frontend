import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Box, Modal, Slide, Typography, Avatar, Divider, Rating } from "@mui/material";
import { apiGetReservationsByDoctorId, apiGetReservationsByPatientId, apiUpdateReservationStatus, apiDeleteReservation } from "../../api/reservations";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import dayjs from 'dayjs';
import { addStyleToTextField } from "../../utils/utilFunctions";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { apiGetReservationsWithoutReviewsByPatientId, apiAddReview } from "../../api/reviews";

const colorMap = {
    pending: 'orange',
    confirmed: 'blue',
    rejected: 'red',
    finished: 'green'
};




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
    const [rating, setRating] = useState(0);
    const [openReviewPopup, setOpenReviewPopup] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [count, setCount] = useState(0);
    const [showContent, setShowContent] = useState(true);
    const [contentSlideDirection, setContentSlideDirection] = useState('up');
    const [isInitialOpen, setIsInitialOpen] = useState(true);

    const [appointmentsWithoutReviews, setAppointmentsWithoutReviews] = useState([]);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [particles, setParticles] = useState([]);

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
                    icon: <DeleteIcon />, color: 'red', onClick: (id) => handleOpenDeleteStatusDialog(id)
                }
            ]);
        } else if (rightCode === RIGHTS_MAPPING.PATIENT) {
            apiGetReservationsByPatientId((response) => {
                setData(response.data);
                console.log('rezervari patient', response.data);
            }, showErrorToast);

            apiGetReservationsWithoutReviewsByPatientId((response) => {
                setAppointmentsWithoutReviews(response.data);
                console.log('rezervari patient fara recenzii', response.data);
                if (response.data.length > 0) {
                    setOpenReviewPopup(true);
                }
                console.log('rezervari patient fara recenzii', response.data);
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



    const totalAppointments = useMemo(() => {
        return appointmentsWithoutReviews?.length || 0;
    }, [appointmentsWithoutReviews]);


    const currentAppointment = useMemo(() => {

        return appointmentsWithoutReviews?.[currentIndex] || null;
    }, [appointmentsWithoutReviews, currentIndex]);


    const prepareForNextReview = () => {
        if (currentIndex < (appointmentsWithoutReviews?.length || 0) - 1) {
            return { found: true, nextIndex: currentIndex + 1 };
        }
        return { found: false };
    };


    const [pendingNextIndex, setPendingNextIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleNextAppointment = () => {
        if (!currentAppointment) return;

        const review = {

            reservation_id: currentAppointment.id || currentIndex,
            rating: rating,
        };

        apiAddReview(
            () => {
                const { found, nextIndex } = prepareForNextReview();

                if (found) {
                    setPendingNextIndex(nextIndex);
                    setIsTransitioning(true);
                    setContentSlideDirection('right');
                    setShowContent(false);
                    setIsInitialOpen(false);
                } else {
                    handleCloseModal();
                }
            },
            showErrorToast,
            review
        );
    };

    const handleCloseModal = () => {
        setOpenReviewPopup(false);
        setShowContent(false);
        setCurrentIndex(0); // Resetăm indexul
    };

    const handleContentExited = () => {
        if (isTransitioning) {
            setCurrentIndex(pendingNextIndex);
            setContentSlideDirection('left');
            setShowContent(true);
            setIsTransitioning(false);
        }
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
            renderCell: ({ value, row }) => {
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
                            if (rightCode === RIGHTS_MAPPING.DOCTOR) {
                                handleOpenChangeStatusDialog(row.id)
                            }
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


            <Modal
                open={openReviewPopup}
                onClose={handleCloseModal}
                closeAfterTransition
            >
                <Slide
                    direction="up"
                    in={openReviewPopup}
                    mountOnEnter
                    unmountOnExit
                    timeout={count === totalAppointments ? 400 : 700}
                >
                    <Box sx={{
                        transform: 'translateX(-50%)',
                        bgcolor: ' #FBFBFB',
                        p: 3,
                        outline: 'none',
                        width: '100%',
                        height: '100%',
                        marginBottom: '80px'
                    }}>
                        <Typography
                            style={{
                                fontWeight: 'bold',
                                fontSize: isAndroid ? '18px' : '25px',
                                textAlign: 'center',
                                paddingBottom: isAndroid ? '10px' : '5px',
                                margin: isAndroid ? '40px' : '50px',
                                borderRadius: '20px',
                            }}
                        >
                            {'Lasă o recenzie pentru medic!'}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginTop: '-30px',
                            ...(totalAppointments === 1 &&
                                { marginBottom: isAndroid ? '40px' : '50px' })

                        }}>
                            {totalAppointments > 1 && (<Typography sx={{
                                backgroundColor: ' #1C1C1C', color: 'white', py: '5px', px: '19px',
                                borderRadius: '50px', marginBottom: '10px', fontSize: isAndroid ? '10px' : '15px'
                            }}>{count + ' / ' + totalAppointments}</Typography>)}

                        </Box>

                        <Box
                            sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '30px',
                                backgroundColor: 'transparent',
                                padding: '1px',
                                [`@keyframes ${showContent}`]: {
                                    '0%': {
                                        transform: 'rotate(0deg)',
                                    },
                                    '100%': {
                                        transform: 'rotate(360deg)',
                                    }
                                },

                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    zIndex: 0,
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    borderRadius: '30px',
                                    background: ' #EFEFEF',
                                    animation: showContent
                                        ? `${showContent} 20.0s linear forwards`
                                        : 'none',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    backgroundColor: ' #FBFBFB',
                                    borderRadius: '30px',
                                    height: isAndroid ? '550px' : '570px',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    border: '1px solid #EFEFEF',
                                }}
                            >
                                <Slide
                                    direction={contentSlideDirection}
                                    in={showContent}
                                    mountOnEnter
                                    unmountOnExit
                                    onExited={handleContentExited}
                                    timeout={isInitialOpen ? 0 : 700}
                                >
                                    <Box>
                                        {currentAppointment && (

                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                padding: isAndroid ? '10px' : '20px',
                                                marginTop: isAndroid ? '20px' : '10px',
                                                marginLeft: isAndroid ? '25px' : '10px'
                                            }}>
                                                <Avatar
                                                    src={currentAppointment?.photo || ''}
                                                    alt=""
                                                    style={{
                                                        width: isAndroid ? '70px' : '80px',
                                                        height: isAndroid ? '70px' : '80px',
                                                    }}
                                                />
                                                <Divider orientation="vertical" sx={{
                                                    my: 2, height: '70px', marginLeft: '15px', backgroundColor: 'rgb(240, 237, 237)'
                                                }} />

                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    paddingLeft: '15px'
                                                }}>
                                                    {currentAppointment && (
                                                        <Box>
                                                            <Typography
                                                                variant="h6"
                                                                style={{ fontSize: isAndroid ? '15px' : '20px', fontWeight: 'bold', color: 'black', marginLeft: '5px' }}
                                                            >
                                                                {currentAppointment.name}
                                                            </Typography>

                                                            <Typography
                                                                variant="h6"
                                                                style={{ fontSize: isAndroid ? '12px' : '17px', color: 'black', paddingLeft: '5px' }}
                                                            >
                                                                {dayjs(currentAppointment.created_at).format('DD.MM.YYYY HH:mm')}
                                                            </Typography>
                                                            <Typography
                                                                variant="h6"
                                                                style={{ fontSize: isAndroid ? '12px' : '17px', color: 'black', paddingLeft: '5px' }}
                                                            >
                                                                {currentAppointment.subject}
                                                            </Typography>
                                                            <Typography
                                                                variant="h6"
                                                                style={{ fontSize: isAndroid ? '12px' : '17px', color: 'black', paddingLeft: '5px' }}
                                                            >
                                                                {currentAppointment.description}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>)}


                                        <Box
                                            style={{
                                                marginTop: '20px',
                                                display: 'flex',
                                                gap: '16px',
                                                justifyContent: 'center',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                position: 'relative',
                                            }}
                                        >

                                            <Rating
                                                name="simple-controlled"
                                                value={rating}
                                                size="large"
                                                onChange={(event, newValue) => {
                                                    setRating(newValue);
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Slide>

                                <Typography
                                    style={{
                                        fontSize: isAndroid ? '12px' : '17px',
                                        color: 'black',
                                        marginTop: '40px',
                                        textAlign: 'center',
                                        padding: isAndroid ? '15px' : '15px',
                                        paddingBottom: isAndroid ? '30px' : '30px'

                                    }}
                                >
                                    {'Recenzia este anonimă.'}
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNextAppointment}
                                    style={{
                                        padding: '14px 55px 14px 55px',
                                        backgroundColor: ' #4A90E2',
                                        borderRadius: '30px',
                                        width: '300px',
                                        textTransform: 'none',
                                        height: '50px',
                                        fontSize: isAndroid ? '14px' : '19px',
                                        color: 'white',

                                        ...(!rating && {
                                            backgroundColor: '#4A90E2',
                                            opacity: 0.5,
                                            cursor: 'not-allowed',
                                            color: 'white'
                                        })
                                    }}
                                    disabled={!rating}
                                    endIcon={<SendIcon />}
                                >
                                    {'Trimite feedback'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Slide>
            </Modal>


        </>
    );
};
export default Reservations;