import Image from 'next/legacy/image';
import Button from '../../shared/button/button';
import React, { useState } from 'react';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';
import CopyrightNotice from '../app/CopyrightNotice';
import { useRouter } from 'next/router';
import Link from 'next/link';
import eyeIcon from '../../public/icons/eye.svg';
import eyeSlashIcon from '../../public/icons/eye-slash.svg';
import NavigationLogin from '@/app/navigation-login';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Signup = () => {
    const router = useRouter();
    const [signupMessage, setSignupMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleLogin = () => {
        router.push('/');
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [passwordStrengthError, setPasswordStrengthError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'password') {
            const strengthErrors = [];
            if (value.length < 8) {
                strengthErrors.push('Password should be minimum 8 characters');
            }
            if (!/[A-Z]/.test(value)) {
                strengthErrors.push('Password should have at least one uppercase letter');
            }
            if (!/[!@#$%^&*]/.test(value)) {
                strengthErrors.push('Password should have at least one special character');
            }
            setPasswordStrengthError(strengthErrors.join(', '));
        }

        if (name === 'confirmPassword') {
            if (value !== formData.password) {
                setConfirmPasswordError('Passwords do not match');
            } else {
                setConfirmPasswordError('');
            }
        }

        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordStrengthError || confirmPasswordError) {
            console.error('Signup failed: Password requirements not met');
            return;
        }

        try {
            setIsLoading(true)
            const response = await fetch(`${apiUrl}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();



            if (responseData.status === 'SUCCESS') {
                setSignupMessage(responseData.message || 'SUCCESS')
                setError('');
            } else {
                setSignupMessage(responseData.message || 'Failed')
                setError(responseData.error || 'An error occurred while fetching balance');
            }

            setShow(true);

        } catch (error) {
            console.error('Error during signup:', error);
        } finally {
            setIsLoading(false)
        }
    };

    const isFormValid = () => {
        return (
            formData.email.trim() !== '' &&
            formData.password.trim() !== '' &&
            formData.name.trim() !== '' &&
            formData.password === formData.confirmPassword &&
            passwordStrengthError === '' &&
            confirmPasswordError === ''
        );
    };

    return (
        <div className='login-page'>
            <NavigationLogin />
            <div className='container'>
                <Row className="justify-content-md-center pt-5">
                    <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 8 }} className='login-container'>
                        <div className='golden-border-left'></div>
                        <Card className='login input-elements'>
                            <h2 className='title text-center'>Admin Signup</h2>
                            <p className='sub-text text-center'>Fill the Signup form</p>
                            <Form className='login-form' onSubmit={handleSubmit}>
                                <Form.Group controlId="name" className='mb-3'>
                                    <Form.Label>
                                        <Image
                                            src="/icons/user-icon.svg"
                                            width={16}
                                            height={20}
                                            alt='User Name'
                                        />
                                        Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name='name'
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="email" className='mb-3'>
                                    <Form.Label>
                                        <Image
                                            src="/icons/user-icon.svg"
                                            width={16}
                                            height={20}
                                            alt='User Name'
                                        />
                                        Email address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name='email'
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>
                                        <Image
                                            src="/icons/lock-icon.svg"
                                            width={20}
                                            height={20}
                                            alt='Password'
                                        />
                                        Password
                                    </Form.Label>
                                    <div className="password-input position-relative">
                                        <Form.Control 
                                            type={passwordVisible ? 'text' : 'password'}
                                            name='password'
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <div className='eye-icon position-absolute'>
                                            <Image
                                                src={passwordVisible ? eyeSlashIcon : eyeIcon}
                                                width={20}
                                                height={20}
                                                alt={passwordVisible ? 'Hide password' : 'Show password'}
                                                onClick={togglePasswordVisibility}
                                                className="password-toggle"
                                            />
                                        </div>
                                    </div>
                                    {passwordStrengthError && <p style={{ color: 'red' }}>{passwordStrengthError}</p>}
                                </Form.Group>

                                <Form.Group controlId="confirmPassword">
                                    <Form.Label>
                                        <Image
                                            src="/icons/lock-icon.svg"
                                            width={20}
                                            height={20}
                                            alt='Confirm Password'
                                        />
                                        Confirm Password
                                    </Form.Label>
                                    <div className="password-input position-relative">
                                        <Form.Control 
                                            type={confirmPasswordVisible ? 'text' : 'password'}
                                            name='confirmPassword'
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        <div className='eye-icon position-absolute'>
                                            <Image
                                                src={confirmPasswordVisible ? eyeSlashIcon : eyeIcon}
                                                width={20}
                                                height={20}
                                                alt={confirmPasswordVisible ? 'Hide password' : 'Show password'}
                                                onClick={toggleConfirmPasswordVisibility}
                                                className="password-toggle"
                                            />
                                        </div>
                                    </div>
                                    {confirmPasswordError && <p style={{ color: 'red' }}>{confirmPasswordError}</p>}
                                </Form.Group>
                                
                                <div className='d-flex justify-content-center align-items-center'>
                                    <Button label="Signup" className="golden" disabled={!isFormValid()}/>
                                </div>
                            </Form>
                            {signupMessage.status === 'SUCCESS' && ( 
                                <Link className='text-center' href="/admin">Login here</Link>
                            )}
                        </Card>
                        <div className='golden-border-right'></div>
                    </Col>
                    <Col md={{ span: 12 }}>
                        <div className='copy-right text-center'>
                            <CopyrightNotice />
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Loading Modal for API call */}
            <Modal className='loader-modal' show={isLoading} centered>
                <Modal.Body>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/login-loading.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                </Modal.Body>
            </Modal>

            <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                <Modal.Body className='p-5'>               
                    {error !== '' ? (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: 'red' }}>{signupMessage}</h3>
                            <button className='warning' onClick={handleClose}>Ok</button>
                        </>
                    ) : (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/check-mark.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: '#198754' }}>{signupMessage}</h3>
                            <p className='text-center mb-0 mt-3'>Redirecting to login page</p>
                            <button className='success' onClick={handleClose && handleLogin}>Ok</button>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Signup;
