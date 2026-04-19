
import {
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { useState } from 'react';

import { toast } from 'react-toastify';
import { storeToken } from '../utils/utilFunctions';

import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '../utils/utilFunctions';
import './login.css';
import bgImage from "../../src/assets/login-bg.jpg";
import { addStyleToTextField } from '../utils/utilFunctions';
import { askClinicAssistant } from '../api/assistant';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';

const Login = () => {
    const navigate = useNavigate(); // Initialize navigate function
    // State for form fields and errors
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [assistantOpen, setAssistantOpen] = useState(false);
    const [assistantInput, setAssistantInput] = useState('');
    const [assistantLoading, setAssistantLoading] = useState(false);
    const [assistantMessages, setAssistantMessages] = useState([
        {
            role: 'assistant',
            text: 'Buna ziua! Cu ce te pot ajuta? Intreaba-ma orice.'
        }
    ]);

    // Validate form fields
    const validateForm = () => {
        let valid = true;
        let newErrors = {
            email: '',
            password: '',
        };

        if (!email) {
            newErrors.email = 'email-required';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'password-required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };


    const login = async () => {
        if (!validateForm()) {
            return
        }

        console.log('login');

        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            const response = await fetch(`${apiUrl}/api/users/login`, {
                method: 'POST', // Change to 'POST' for sending data
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }), // Convert your data to a JSON string
            });

            const data = await response.json();

            if (data.message === 'Successfully logged in!') {
                const token = response.headers.get('X-Auth-Token');
                if (token) {
                    storeToken(token)
                }
                showSuccessToast('login-success')
                navigate('/dashboard');

            } else {
                showInvalidCredentials()
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
        };

        newErrors.email = 'invalid-credentials';
        newErrors.password = 'invalid-credentials';

        setErrors(newErrors);
    }

    const handleKeyPress = (e) => {
        if (e.key == 'Enter') {
            login()
        }
    };

    const sendAssistantMessage = async () => {
        const question = assistantInput.trim();
        if (!question || assistantLoading) {
            return;
        }

        setAssistantInput('');
        setAssistantLoading(true);
        setAssistantMessages((prev) => [...prev, { role: 'user', text: question }]);

        try {
            const response = await askClinicAssistant(question);
            const parts = [response.reply, response.availabilitySummary, response.bookingCtaFooter].filter(Boolean);
            const assistantText = parts.join('\n\n');
            setAssistantMessages((prev) => [...prev, { role: 'assistant', text: assistantText }]);
        } catch (error) {
            setAssistantMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: error.message || 'I am currently unavailable. Please try again.'
                }
            ]);
        } finally {
            setAssistantLoading(false);
        }
    };

    const handleAssistantKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendAssistantMessage();
        }
    };

    return (
        <>
            <div
                className="login-bg"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* <Navbar /> */}
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onKeyDown={handleKeyPress}
                    sx={{
                        width: '100%',
                        maxWidth: { xs: 440, sm: 420, md: 400 },
                        mx: 'auto',
                        my: { xs: 0, sm: 2 },
                        backgroundColor: 'white',
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2.5, sm: 3 },
                        borderRadius: 2,
                        boxShadow: { xs: 2, sm: 3 },
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontSize: { xs: '1.65rem', sm: '2rem', md: '2.75rem' },
                            lineHeight: 1.2,
                            mb: 0.5,
                        }}
                    >
                        Intra in cont
                    </Typography>
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
                        label={'password'}
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={addStyleToTextField(password)}
                    />

                    <Button variant="contained" sx={{ backgroundColor: ' #4A90E2', color: 'white', mb: 1, mt: 1 }} fullWidth onClick={login}>
                        {'login'}
                    </Button>
                    <Button variant="outlined" sx={{ color: ' #4A90E2', borderColor: ' #4A90E2' }} fullWidth onClick={() => navigate('/auth/register')}>
                        {'Inregistreaza-te'}
                    </Button>
                </Box>

                {assistantOpen && (
                    <Paper
                        elevation={6}
                        sx={{
                            position: 'fixed',
                            left: { xs: 12, sm: 'auto' },
                            right: { xs: 12, sm: 24 },
                            bottom: { xs: 72, sm: 88 },
                            width: { xs: 'auto', sm: 380 },
                            maxWidth: { sm: 'min(380px, calc(100vw - 48px))' },
                            maxHeight: { xs: 'min(520px, calc(100dvh - 100px))', sm: 'min(480px, calc(100dvh - 120px))' },
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2,
                            zIndex: 1400,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexShrink: 0, gap: 1 }}>
                            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                                Clinic Assistant
                            </Typography>
                            <IconButton size="small" onClick={() => setAssistantOpen(false)} aria-label="Inchide asistentul">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                flex: '1 1 auto',
                                minHeight: 0,
                                overflowY: 'auto',
                                mb: 1,
                                pr: 0.5,
                                WebkitOverflowScrolling: 'touch',
                            }}
                        >
                            {assistantMessages.map((message, index) => (
                                <Box
                                    key={`${message.role}-${index}`}
                                    sx={{
                                        mb: 1,
                                        p: 1,
                                        borderRadius: 1,
                                        backgroundColor: message.role === 'user' ? '#E3F2FD' : '#F5F5F5',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    <Typography variant="body2">{message.text}</Typography>
                                </Box>
                            ))}
                            {assistantLoading && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                                    <CircularProgress size={16} />
                                    <Typography variant="body2">Thinking...</Typography>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ flexShrink: 0 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Intreaba-ma orice..."
                                value={assistantInput}
                                onChange={(e) => setAssistantInput(e.target.value)}
                                onKeyDown={handleAssistantKeyDown}
                                disabled={assistantLoading}
                            />
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 1, backgroundColor: '#4A90E2', color: 'white' }}
                                disabled={assistantLoading || !assistantInput.trim()}
                                onClick={sendAssistantMessage}
                            >
                                Trimite
                            </Button>
                        </Box>
                    </Paper>
                )}

                <Button
                    variant="contained"
                    onClick={() => setAssistantOpen((prev) => !prev)}
                    startIcon={<ChatIcon />}
                    aria-label={assistantOpen ? 'Inchide chat AI' : 'Deschide chat AI'}
                    sx={{
                        position: 'fixed',
                        right: { xs: 12, sm: 24 },
                        bottom: { xs: 12, sm: 24 },
                        borderRadius: '999px',
                        backgroundColor: '#4A90E2',
                        zIndex: 1400,
                        color: 'white',
                        minWidth: { xs: 48, sm: 64 },
                        px: { xs: 1.25, sm: 2 },
                        boxShadow: 3,
                        '& .MuiButton-startIcon': {
                            marginRight: { xs: 0, sm: 1 },
                            marginLeft: { xs: 0, sm: -0.5 },
                        },
                    }}
                >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        AI Chat
                    </Box>
                </Button>
            </div>

        </>
    );
};

export default Login;
