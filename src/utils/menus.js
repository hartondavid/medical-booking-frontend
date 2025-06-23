
import { RIGHTS_MAPPING } from './utilConstants';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HistoryIcon from '@mui/icons-material/History';
import ReviewsIcon from '@mui/icons-material/Reviews';

export const menus = [

    {
        id: 1,
        parentId: null,
        name: "Pacienti",
        to: "/dashboard/patients",
        icon: PeopleAltIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.DOCTOR],
        order: 90,
        children: [

        ]
    },

    {
        id: 2,
        parentId: null,
        name: "Rezervari",
        to: "/dashboard/reservations",
        icon: AccessTimeIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.DOCTOR, RIGHTS_MAPPING.PATIENT],
        order: 90,
        children: [

        ]
    },
    {
        id: 3,
        parentId: null,
        name: "Retete",
        to: "/dashboard/prescriptions",
        icon: ReceiptLongIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.DOCTOR, RIGHTS_MAPPING.PATIENT],
        order: 90,
        children: [

        ]
    },
    {
        id: 4,
        parentId: null,
        name: "Medici",
        to: "/dashboard/doctors",
        icon: PeopleAltIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.PATIENT],
        order: 90,
        children: [

        ]
    },
    {
        id: 5,
        parentId: null,
        name: "Istoric rezervari",
        to: "/dashboard/pastReservations",
        icon: HistoryIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.DOCTOR, RIGHTS_MAPPING.PATIENT],
        order: 90,
        children: [
        ]
    },
    {
        id: 6,
        parentId: null,
        name: "Recenzii",
        to: "/dashboard/reviews",
        icon: ReviewsIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.DOCTOR],
        order: 90,
        children: [
        ]
    }

]
