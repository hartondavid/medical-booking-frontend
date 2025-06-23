import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { Rating } from "@mui/material";

import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import dayjs from 'dayjs';
import { apiGetReviewsByDoctorId } from "../../api/reviews";


const columns = [
    { field: 'id', headerName: 'Id', type: 'string' },
    { field: 'name', headerName: 'Nume', type: 'string' },
    { field: 'photo', headerName: 'Foto', type: 'filepath' },
    { field: 'phone', headerName: 'Telefon', type: 'string' },
    { field: 'email', headerName: 'Email', type: 'string' },
    { field: 'subject', headerName: 'Subiect', type: 'string' },
    { field: 'description', headerName: 'Descriere', type: 'string' },
    {
        field: 'rating', headerName: 'Rating', type: 'string', renderCell: ({ value }) => {
            return <Rating value={value ? Number(value) : null} readOnly />
        }
    },

    {
        field: 'date', headerName: 'Data si ora', type: 'date', renderCell: ({ value }) => {
            return dayjs(value).format('DD.MM.YYYY HH:mm');
        }
    },

];


const Reviews = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const rightCode = userRights[0]?.right_code;

    useEffect(() => {
        console.log('rightCode', rightCode);

        if (rightCode === RIGHTS_MAPPING.DOCTOR) {
            apiGetReviewsByDoctorId((response) => {
                setData(response.data);
                console.log('recenzii doctor', response.data);
            }, showErrorToast);

        }


    }, [data.length, rightCode]);



    return (
        <>
            <GenericTable

                title={"Recenzii"}
                columns={columns}
                data={data}


            >

            </GenericTable>



        </>
    );
};
export default Reviews;