
import {
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Grid
} from '@mui/material';
import { useState } from 'react';

import { toast } from 'react-toastify';
import { storeToken } from '../utils/utilFunctions';

import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../utils/utilFunctions';
import './login.css';
import bgImage from "../../src/assets/login-bg.jpg";
import { addStyleToTextField } from "../utils/utilFunctions";
import { getToken } from '../utils/utilFunctions';

const Register = () => {
    const navigate = useNavigate(); // Initialize navigate function
    // State for form fields and errors
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rightCode, setRightCode] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        rightCode: ''
    });

    const register = async () => {

        console.log('name', name);
        console.log('email', email);
        console.log('password', password);
        console.log('confirmPassword', confirmPassword);
        console.log('phone', phone);
        console.log('rightCode', rightCode);

        const apiUrl = process.env.REACT_APP_API_URL;
        // const token = getToken();
        try {
            const response = await fetch(`${apiUrl}/api/users/register`, {
                method: 'POST', // Change to 'POST' for sending data
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    confirm_password: confirmPassword,
                    phone: phone,
                    right_code: rightCode
                }), // Convert your data to a JSON string
            });

            const data = await response.json();

            if (data.message === 'Utilizatorul a fost creat cu succes') {
                const token = response.headers.get('X-Auth-Token');
                if (token) {
                    storeToken(token)
                }
                showSuccessToast(data.message)
                navigate('/auth/login');

            } else {
                showInvalidCredentials()
                showErrorToast(data.message)
            }
        } catch (error) {
            console.error('Error:', error);

            toast.error('something-went-wrong', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const showInvalidCredentials = () => {

        let newErrors = {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            phone: '',
        };

        if (!email) newErrors.email = 'invalid-credentials';
        if (!password) newErrors.password = 'invalid-credentials';
        if (!confirmPassword) newErrors.confirmPassword = 'invalid-credentials';
        if (!name) newErrors.name = 'invalid-credentials';
        if (!phone) newErrors.phone = 'invalid-credentials';
        setErrors(newErrors);
    }

    const handleKeyPress = (e) => {
        if (e.key == 'Enter') {
            register()
        }
    };

    return (
        <>
            <div
                className="login-bg"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'top center' }}
            >
                {/* <Navbar /> */}
                <Box component="form" noValidate autoComplete="off"
                    onKeyDown={handleKeyPress} sx={{
                        width: '20%', margin: 'auto',
                        marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '10px'
                    }}>
                    <Typography variant="h4">Inregistreaza-te</Typography>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nume"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={addStyleToTextField(name)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={addStyleToTextField(email)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label={'Parola'}
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={addStyleToTextField(password)}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label={'Confirmare parola'}
                        variant="outlined"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        sx={addStyleToTextField(confirmPassword)}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label={'Telefon'}
                        variant="outlined"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={{ ...addStyleToTextField(phone), mb: 3 }}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="rightCode-label">Rol</InputLabel>
                        <Select
                            label={'Rol'}
                            labelId="rightCode-label"
                            name="rightCode"
                            value={rightCode}
                            onChange={(e) => setRightCode(e.target.value)}
                            sx={addStyleToTextField(rightCode)}


                        >
                            <MenuItem value={1}>Doctor</MenuItem>
                            <MenuItem value={2}>Pacient</MenuItem>
                        </Select>
                    </FormControl>


                    <Button variant="contained" sx={{ backgroundColor: '#4A90E2', color: 'white', mb: 1, mt: 2 }} fullWidth onClick={register}>
                        {'Inregistreaza-te'}
                    </Button>
                    <Button variant="outlined" sx={{ color: '#4A90E2', borderColor: '#4A90E2' }} fullWidth onClick={() => navigate('/auth/login')}>
                        {'Inapoi la login'}
                    </Button>
                </Box>
            </div>

        </>
    );
};

export default Register;
