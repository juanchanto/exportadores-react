import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Row, Col, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExporterForm = () => {
    const BASE_URL_LOCAL = 'http://localhost:8080';
    const [exporters, setExporters] = useState([]);
    const [newExporter, setNewExporter] = useState({
        status: 'I',
        company: {
            identificationType: '',
            identification: '',
            name: ''
        },
        acceptance: '',
        expiration: '',
        province: '',
        canton: '',
        district: '',
        email: '',
        sector: ''
    });

    useEffect(() => {
        fetchExporters();
    }, []);

    const fetchExporters = () => {
        axios.get(`${BASE_URL_LOCAL}/api/exporters`)
            .then(response => {
                setExporters(response.data);
            })
            .catch(error => {
                console.error('Error fetching exporters:', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('company.')) {
            const companyField = name.split('.')[1];
            setNewExporter(prevState => ({
                ...prevState,
                company: {
                    ...prevState.company,
                    [companyField]: value
                }
            }));
        } else if (name === 'province' || name === 'canton' || name === 'district') {
            if (/^\d{0,2}$/.test(value)) {
                setNewExporter(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            }
        } else if (type === 'checkbox') {
            setNewExporter(prevState => ({
                ...prevState,
                [name]: checked ? 'A' : 'I'
            }));
        } else {
            setNewExporter(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleDateChange = (date, field) => {
        setNewExporter(prevState => ({
            ...prevState,
            [field]: date
        }));
    };

    const handleCreateExporter = (e) => {
        e.preventDefault();
        axios.post(`${BASE_URL_LOCAL}/api/exporters`, newExporter)
            .then(response => {
                setNewExporter({
                    status: 'I',
                    company: {
                        identificationType: '',
                        identification: '',
                        name: ''
                    },
                    acceptance: '',
                    expiration: '',
                    province: '',
                    canton: '',
                    district: '',
                    email: '',
                    sector: ''
                });
                fetchExporters(); // Refrescar la lista después de crear
            })
            .catch(error => {
                console.error('Error creating exporter:', error);
            });
    };

    const handleDeleteExporter = (id) => {
        axios.delete(`${BASE_URL_LOCAL}/api/exporters/${id}`)
            .then(response => {
                fetchExporters(); // Refrescar la lista después de eliminar
            })
            .catch(error => {
                console.error('Error deleting exporter:', error);
            });
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Exportadores</h2>

            {/* Formulario para crear un nuevo exportador */}
            <Form onSubmit={handleCreateExporter}>
                <Row className="mb-3">
                    <Col md={1}>
                        <Form.Control type="text" name="company.identificationType" value={newExporter.company.identificationType} onChange={handleInputChange} placeholder="ID Type" required />
                    </Col>
                    <Col md={2}>
                        <Form.Control type="text" name="company.identification" value={newExporter.company.identification} onChange={handleInputChange} placeholder="ID" required />
                    </Col>
                    <Col md={3}>
                        <Form.Control type="text" name="company.name" value={newExporter.company.name} onChange={handleInputChange} placeholder="Company Name" required />
                    </Col>
                    <Col md={2}>
                        <Form.Control type="text" name="sector" value={newExporter.sector} onChange={handleInputChange} placeholder="Sector" maxLength={4} required />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={2}>
                        <Form.Control type="date" name="acceptance" value={newExporter.acceptance} onChange={e => handleDateChange(e.target.value, 'acceptance')} placeholder="Acceptance" required />
                    </Col>
                    <Col md={2}>
                        <Form.Control type="date" name="expiration" value={newExporter.expiration} onChange={e => handleDateChange(e.target.value, 'expiration')} placeholder="Expiration" required />
                    </Col>
                    <Col md={2}>
                        <Form.Control type="email" name="email" value={newExporter.email} onChange={handleInputChange} placeholder="Email" required />
                    </Col>
                    <Col md={2}>
                        <Form.Check
                            type="checkbox"
                            name="status"
                            label="Activo"
                            checked={newExporter.status === 'A'}
                            onChange={handleInputChange}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={1}>
                        <Form.Control type="number" name="province" value={newExporter.province} onChange={handleInputChange} placeholder="Province" min={0} max={99} required />
                    </Col>
                    <Col md={1}>
                        <Form.Control type="number" name="canton" value={newExporter.canton} onChange={handleInputChange} min={0} max={99} placeholder="Canton" required />
                    </Col>
                    <Col md={1}>
                        <Form.Control type="number" name="district" value={newExporter.district} onChange={handleInputChange} min={0} max={99} placeholder="District" required />
                    </Col>

                </Row>
                <Button type="submit" variant="primary">Crear Exportador</Button>
            </Form>

            {/* Lista de exportadores */}
            <ListGroup className="mt-4">
                {exporters.map(exporter => (
                    <ListGroup.Item key={exporter.id} className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{exporter.company.name}</strong> - {exporter.email}
                            <br />
                            <small>{exporter.id}</small>
                        </div>
                        <Button variant="danger" onClick={() => handleDeleteExporter(exporter.id)}>Eliminar</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default ExporterForm;
