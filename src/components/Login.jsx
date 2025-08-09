import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (email === 'vegify@gmail.com' && password === 'admin123') {
            setSuccess(true);
            navigate('/enquiry')
            // In a real app, you would redirect or handle authentication here
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div style={{
            backgroundImage: `url('/foodImage.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            padding: '20px 0'
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card style={{ borderRadius: '15px', overflow: 'hidden' }}>
                            {/* <Card.Img
                                variant="top"
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Delicious food"
                                style={{ height: '200px', objectFit: 'cover' }}
                            /> */}
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/857/857718.png"
                                        alt="Logo"
                                        style={{ width: '80px', height: '80px' }}
                                    />
                                    <h2 className="mt-3" style={{ color: '#ff6b6b' }}>Foodie Delights</h2>
                                </div>

                                {error && <Alert variant="danger">{error}</Alert>}
                                {success && <Alert variant="success">Login successful!</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-grid gap-2">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            style={{ backgroundColor: '#ff6b6b', borderColor: '#ff6b6b' }}
                                        >
                                            Login
                                        </Button>
                                    </div>
                                </Form>

                                <div className="text-center mt-3">
                                    <p className="mb-0">Don't have an account? <a href="#register">Sign up</a></p>
                                    <p><a href="#forgot-password">Forgot password?</a></p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;