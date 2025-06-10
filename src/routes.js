import Login from "./views/Login.js";
import Dashboard from "./views/dashboard/index.js";
import Patients from "./views/dashboard/Patients.js";
import Doctors from "./views/dashboard/Doctors.js";
import AddReservation from "./views/dashboard/AddReservation.js";
import Reservations from "./views/dashboard/Reservations.js";
import PastReservations from "./views/dashboard/PastReservations.js";
import Prescriptions from "./views/dashboard/Prescriptions.js";
var routes = [
    {
        path: "/login",
        name: "Login",
        icon: "ni ni-key-25 text-info",
        component: <Login />,
        layout: "/auth",
    },

    {
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: Dashboard,
        layout: "/dashboard",
    },

    {
        path: "/patients",
        name: "Pacienti",
        component: Patients,
        layout: "/dashboard",
    },

    {
        path: "/doctors",
        name: "Doctori",
        component: Doctors,
        layout: "/dashboard",
    },

    {
        path: "/addReservation/:doctorId",
        name: "Programeaza o vizita",
        component: AddReservation,
        layout: "/dashboard",
    },

    {
        path: "/reservations",
        name: "Rezervari",
        component: Reservations,
        layout: "/dashboard",
    },

    {
        path: "/pastReservations",
        name: "Rezervari trecute",
        component: PastReservations,
        layout: "/dashboard",
    },
    {
        path: "/prescriptions",
        name: "Retete",
        component: Prescriptions,
        layout: "/dashboard",
    },

]

export default routes;  