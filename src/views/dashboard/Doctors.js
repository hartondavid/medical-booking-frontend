import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { apiGetDoctors } from "../../api/users";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import dayjs from 'dayjs';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const columns = [
    { field: 'id', headerName: 'Id', type: 'string' },
    { field: 'name', headerName: 'Nume', type: 'string' },
    { field: 'photo', headerName: 'Foto', type: 'filepath' },
    { field: 'email', headerName: 'Email', type: 'string' },
    { field: 'phone', headerName: 'Telefon', type: 'string' },
    { field: 'specialization', headerName: 'Specializare', type: 'string' },
    {
        field: 'updated_at', headerName: 'Data', type: 'date', renderCell: ({ value }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },

];


const Doctors = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const rightCode = userRights[0]?.right_code;
    const [actions, setActions] = useState([]);
    useEffect(() => {


        if (rightCode === RIGHTS_MAPPING.PATIENT) {
            apiGetDoctors((response) => {
                setData(response.data);
                console.log('doctori', response.data);
            }, showErrorToast);

            setActions([
                {
                    icon: <AccessTimeIcon />, color: ' #4A90E2', onClick: (id) => navigate(`/dashboard/addReservation/${id}`)
                }
            ]);
        }


    }, [data.length, rightCode]);


    return (
        <>
            <GenericTable
                title={"Medici"}
                columns={columns}
                data={data}
                actions={actions}
            >

            </GenericTable>

        </>
    );
};
export default Doctors;