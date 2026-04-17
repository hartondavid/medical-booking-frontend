import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { apiAddReservation } from "../../api/reservations";
import { addStyleToTextField } from "../../utils/utilFunctions";

const SLOT_MINUTES = 30;
const SLOT_STEP_SECONDS = SLOT_MINUTES * 60;

/** Următorul moment permis (rotunjit la 30 min), pentru atributul min pe datetime-local */
function nextAllowedDatetimeLocal() {
    const d = new Date();
    d.setSeconds(0, 0);
    let m = d.getMinutes();
    const r = m % SLOT_MINUTES;
    if (r !== 0) {
        d.setMinutes(m + (SLOT_MINUTES - r));
    }
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60 * 1000);
    return local.toISOString().slice(0, 16);
}

/** Valoarea din input type=datetime-local este interpretată în timezone local */
function isLocalHalfHourSlot(datetimeLocalValue) {
    if (!datetimeLocalValue) return false;
    const d = new Date(datetimeLocalValue);
    if (Number.isNaN(d.getTime())) return false;
    if (d.getSeconds() !== 0 || d.getMilliseconds() !== 0) return false;
    const min = d.getMinutes();
    return min === 0 || min === 30;
}

const AddReservation = ({ userRights }) => {
    const navigate = useNavigate(); // Initialize navigate function

    const rightCode = userRights[0].right_code;


    const [completedForm, setCompletedForm] = useState(false);

    const { doctorId } = useParams();

    const currDate = new Date();
    currDate.setSeconds(0, 0);
    let cm = currDate.getMinutes();
    const cr = cm % SLOT_MINUTES;
    if (cr !== 0) {
        currDate.setMinutes(cm + (SLOT_MINUTES - cr));
    }

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

        if (!isLocalHalfHourSlot(formData.date)) {
            showErrorToast('Alegeți o oră la intervale de 30 de minute (ex. 10:00, 10:30).');
            return;
        }

        const chosen = new Date(formData.date);
        if (chosen < new Date()) {
            showErrorToast('Data și ora trebuie să fie în viitor.');
            return;
        }

        apiAddReservation((response) => { navigate(`/dashboard/reservations`); showSuccessToast(response.message) },
            showErrorToast, doctorId, formData.date, formData.subject, formData.description)


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
                                min: nextAllowedDatetimeLocal(),
                                step: SLOT_STEP_SECONDS,
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