import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { Chip } from "@mui/material";
import { apiGetPastReservationsByDoctorId, apiGetPastReservationsByPatientId } from "../../api/reservations";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import dayjs from 'dayjs';

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


const PastReservations = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const rightCode = userRights[0]?.right_code;

    useEffect(() => {
        console.log('rightCode', rightCode);

        if (rightCode === RIGHTS_MAPPING.DOCTOR) {
            apiGetPastReservationsByDoctorId((response) => {
                setData(response.data);
                console.log('rezervari doctor', response.data);
            }, showErrorToast);

        } else if (rightCode === RIGHTS_MAPPING.PATIENT) {
            apiGetPastReservationsByPatientId((response) => {
                setData(response.data);
                console.log('rezervari patient', response.data);
            }, showErrorToast);
        }


    }, [data.length, rightCode]);



    return (
        <>
            <GenericTable

                title={"Istoric rezervari"}
                columns={columns}
                data={data}


            >

            </GenericTable>



        </>
    );
};
export default PastReservations;