import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { apiGetPatients } from "../../api/users";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import dayjs from 'dayjs';

const columns = [
    { field: 'id', headerName: 'Id', type: 'string' },
    { field: 'name', headerName: 'Nume', type: 'string' },
    { field: 'photo', headerName: 'Foto', type: 'filepath' },
    { field: 'email', headerName: 'Email', type: 'string' },
    { field: 'phone', headerName: 'Telefon', type: 'string' },
    {
        field: 'updated_at', headerName: 'Data', type: 'date', renderCell: ({ value }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },

];


const Patients = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const rightCode = userRights[0]?.right_code;
    useEffect(() => {


        if (rightCode === RIGHTS_MAPPING.DOCTOR) {
            apiGetPatients((response) => {
                setData(response.data);
                console.log('pacienti', response.data);
            }, showErrorToast);
        }


    }, [data.length, rightCode]);


    return (
        <>
            <GenericTable
                title={"Pacienti"}
                columns={columns}
                data={data}
            >

            </GenericTable>

        </>
    );
};
export default Patients;