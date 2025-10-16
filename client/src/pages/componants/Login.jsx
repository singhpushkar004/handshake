import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import logo from '../../assets/images/logo.png'; // Ensure the logo matches Softpro India's logo
import { Link, useNavigate } from 'react-router'; // Updated to react-router-dom
// import Header from './header';
import './Login.css'; // New CSS file for validation styles

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (form.password.length < 4) {
            newErrors.password = 'Password must be at least 4 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear errors on input change
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please correct the errors in the form',
                confirmButtonColor: '#ff6f61',
            });
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/api/handshakeAdmin/admin/login', form);
            if (res.data.message === 'Login Successfully' && res.data.token) {
                if (res.data.admin.role === 'Admin') {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('adminEmail', res.data.admin.email);
                    localStorage.setItem('id', res.data.admin.id);
                    localStorage.setItem('role', res.data.admin.role);
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Welcome to Softpro India Admin Panel!',
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(() => {
                        navigate('/admin/');
                    });
                }
                else if(res.data.admin.role === 'Student'){
                     localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', res.data.admin.email);
                    localStorage.setItem('userId', res.data.admin.id);
                    localStorage.setItem('userRole', res.data.admin.role);
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Welcome to Softpro India Student Panel!',
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(() => {
                        navigate('/userDashboard');
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unauthorized',
                        text: 'You do not have admin privileges',
                        confirmButtonColor: '#ff6f61',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Something went wrong!',
                    confirmButtonColor: '#ff6f61',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || 'An error occurred',
                confirmButtonColor: '#ff6f61',
            });
        }
    };

    const styles = {
        page: {
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f5f6fa',
            fontFamily: '"Poppins", sans-serif',
        },
        card: {
            width: '900px',
            maxWidth: '95%',
            display: 'flex',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
        },
        leftPanel: {
            flex: 1,
            background: 'linear-gradient(135deg, #5a2888, #ff6f61)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            position: 'relative',
        },
        abstractCircles: {
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 111, 97, 0.2)',
            zIndex: 0,
        },
        bigCircle: {
            width: '120px',
            height: '120px',
            top: '15%',
            left: '15%',
        },
        smallCircle: {
            width: '80px',
            height: '80px',
            bottom: '15%',
            right: '15%',
        },
        logo: {
            width: '150px',
            marginBottom: '20px',
            zIndex: 1,
        },
        welcomeText: {
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '10px',
            zIndex: 1,
            color: '#fff',
        },
        subText: {
            fontSize: '14px',
            opacity: 0.9,
            zIndex: 1,
            textAlign: 'center',
            lineHeight: '1.5',
        },
        rightPanel: {
            flex: 1,
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
        },
        formBox: {
            width: '100%',
            maxWidth: '320px',
        },
        heading: {
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#5a2888',
            textAlign: 'center',
            borderBottom: '3px solid #ff6f61',
            paddingBottom: '8px',
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            color: '#333',
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '15px',
            outline: 'none',
            transition: 'border-color 0.3s ease',
        },
        submitBtn: {
            width: '100%',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: 'linear-gradient(to right, #5a2888, #ff6f61)',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.3s ease',
            marginTop: '10px',
        },
        orDivider: {
            textAlign: 'center',
            color: '#666',
            fontSize: '13px',
            margin: '15px 0',
        },
        googleButton: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '15px',
            transition: 'border-color 0.3s ease',
        },
        createAccount: {
            textAlign: 'center',
            fontSize: '13px',
            color: '#333',
        },
        link: {
            marginLeft: '5px',
            color: '#ff6f61',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.3s ease',
        },
    };

    return (
        <>
            <div style={styles.page}>
                <div style={styles.card}>
                    {/* Left Panel */}
                    <div style={styles.leftPanel}>
                        <div style={{ ...styles.abstractCircles, ...styles.bigCircle }} />
                        <div style={{ ...styles.abstractCircles, ...styles.smallCircle }} />
                        <img src={logo} alt="Softpro India Logo" style={styles.logo} />
                        <div style={styles.welcomeText}>Welcome to Softpro India</div>
                        <div style={styles.subText}>
                            Your gateway to innovative IT solutions and seamless digital experiences.
                        </div>
                        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                            <i className="fa fa-arrow-left"></i> Go Back
                        </Link>
                    </div>

                    {/* Right Panel */}
                    <div style={styles.rightPanel}>
                        <form style={styles.formBox} onSubmit={handleSubmit}>
                            <div style={styles.heading}>Sign In</div>
                            <label htmlFor="email" style={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                placeholder="Enter Email"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.email ? '#ff4d4f' : '#ddd',
                                }}
                                required
                            />
                            {errors.email && (
                                <div style={{ color: '#ff4d4f', fontSize: '12px', marginBottom: '10px' }}>
                                    {errors.email}
                                </div>
                            )}
                            <label htmlFor="password" style={styles.label}>Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                placeholder="••••"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.password ? '#ff4d4f' : '#ddd',
                                }}
                                required
                            />
                            {errors.password && (
                                <div style={{ color: '#ff4d4f', fontSize: '12px', marginBottom: '10px' }}>
                                    {errors.password}
                                </div>
                            )}
                            <button
                                type="submit"
                                style={styles.submitBtn}
                                onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
                                onMouseLeave={(e) => (e.target.style.opacity = '1')}
                            >
                                Log In
                            </button>
                            <div style={styles.orDivider}>or</div>
                            <div
                                style={styles.googleButton}
                                onMouseEnter={(e) => (e.target.style.borderColor = '#ff6f61')}
                                onMouseLeave={(e) => (e.target.style.borderColor = '#ddd')}
                            >
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                    style={{ width: '18px', verticalAlign: 'middle' }}
                                />
                                Sign in with Google
                            </div>
                            <div style={styles.createAccount}>
                                Forgot Password?
                                <a href="#" style={styles.link}>Click Here</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;