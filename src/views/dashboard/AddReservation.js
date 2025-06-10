import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { apiAddReservation } from "../../api/reservations";
import { addStyleToTextField } from "../../utils/utilFunctions";

const AddReservation = ({ userRights }) => {
    const navigate = useNavigate(); // Initialize navigate function

    const rightCode = userRights[0].right_code;


    const [completedForm, setCompletedForm] = useState(false);

    const { doctorId } = useParams();

    const currDate = new Date();
    currDate.setSeconds(0);
    currDate.setMilliseconds(0);
    currDate.setMinutes(0);

    const toDatetimeLocal = (date) => {
        if (!date) return '';
        // Convert UTC date to local datetime-local string (yyyy-MM-ddTHH:mm)
        const d = new Date(date);
        d.setSeconds(0, 0);
        const off = d.getTimezoneOffset();
        const local = new Date(d.getTime() - off * 60 * 1000);
        return local.toISOString().slice(0, 16);
    };



    const [formData, setFormData] = useState({
        date: toDatetimeLocal(currDate),
        subject: '',
        description: ''
    });



    useEffect(() => {
        const isFormCompleted =
            formData.date && formData.subject && formData.description;

        setCompletedForm(isFormCompleted);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        // Convert local datetime-local input to UTC ISO string
        const toUTCISOString = (localDateString) => {
            if (!localDateString) return null;
            // localDateString is in 'yyyy-MM-ddTHH:mm' format
            const local = new Date(localDateString);
            return local.toISOString(); // always UTC
        };

        console.log('formData', formData);

        apiAddReservation((response) => { navigate(`/dashboard/reservations`); showSuccessToast(response.message) },
            showErrorToast, doctorId, toUTCISOString(formData.date), formData.subject, formData.description)


    };

    return (
        <>
            <Box sx={{ m: 2 }}  >
                <Typography variant="h4" sx={{ mb: 2 }}>
                    <span className="font-bold text-black">{"Programeaza o vizita"}</span>
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    gap={2}
                    sx={{
                        backgroundColor: 'white',
                        width: '100%'
                    }}
                >

                    <Box sx={{ position: 'relative', width: '100%' }}>

                        <TextField
                            label="Data si ora"
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            style={{ marginTop: '1rem' }}
                            inputProps={{
                                min: new Date().toISOString().slice(0, 16),
                            }}
                            sx={addStyleToTextField(formData.date)}

                        />
                    </Box>


                    <Box sx={{ position: 'relative', width: '100%' }}>

                        <TextField
                            label="Subiect"
                            name="subject"
                            type='text'
                            value={formData.subject || ''}
                            fullWidth
                            onChange={handleChange}
                            sx={addStyleToTextField(formData.subject)}
                        >
                        </TextField>
                    </Box>


                    <Box sx={{ position: 'relative', width: '100%' }}>

                        <TextField
                            label="Descriere"
                            name="description"
                            type='text'
                            value={formData.description || ''}
                            fullWidth
                            onChange={handleChange}
                            sx={addStyleToTextField(formData.description)}
                        >
                        </TextField>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <Button type="submit" variant="contained"
                            style={{
                                marginRight: 5, backgroundColor: ' #4A90E2', color: 'white',
                                ...(!completedForm && {
                                    backgroundColor: '  #4A90E2',
                                    opacity: 0.5,
                                    color: 'white'
                                })
                            }}
                            disabled={!completedForm}
                            onClick={handleSubmit}
                        >
                            {'Programeaza'}
                        </Button>
                        <Button variant="contained" color="error"

                            onClick={() => navigate(-1)}>
                            Renunta
                        </Button>
                    </Box>
                </Box>


            </Box >
        </>
    )
}

export default AddReservation;