import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Row, Col, Button, Table, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExporterForm = () => {
    const BASE_URL_LOCAL = 'http://localhost:8080';
    const [exporters, setExporters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
    const [selectedExporter, setSelectedExporter] = useState(null);

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
        } else if (type === 'checkbox' || name === 'status') {
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

    const handleToggleStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'A' ? 'I' : 'A';
        axios.put(`${BASE_URL_LOCAL}/api/exporters/updateStatus/${id}`, { status: newStatus })
            .then(response => {
                fetchExporters(); // Refrescar la lista después de actualizar el estado
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRowClick = (exporter) => {
        setSelectedExporter(exporter);
    };

    const handleCloseModal = () => {
        setSelectedExporter(null);
    };

    const filteredExporters = exporters.filter(exporter =>
        exporter.company.identification.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Exporters</h2>
            {/* Formulario para crear exportador */}
            <Form onSubmit={handleCreateExporter}>
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Control type="text" name="company.identificationType" value={newExporter.company.identificationType} onChange={handleInputChange} placeholder="ID Type" required />
                    </Col>
                    <Col md={3}>
                        <Form.Control type="text" name="company.identification" value={newExporter.company.identification} onChange={handleInputChange} placeholder="ID" required />
                    </Col>
                    <Col md={3}>
                        <Form.Control type="text" name="company.name" value={newExporter.company.name} onChange={handleInputChange} placeholder="Company Name" required />
                    </Col>
                    <Col md={3}>
                        <Form.Control type="text" name="sector" value={newExporter.sector} onChange={handleInputChange} placeholder="Sector" maxLength={4} required />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Control type="date" name="acceptance" value={newExporter.acceptance} onChange={e => handleDateChange(e.target.value, 'acceptance')} placeholder="Acceptance" required />
                    </Col>
                    <Col md={3}>
                        <Form.Control type="date" name="expiration" value={newExporter.expiration} onChange={e => handleDateChange(e.target.value, 'expiration')} placeholder="Expiration" required />
                    </Col>
                    <Col md={3}>
                        <Form.Control type="email" name="email" value={newExporter.email} onChange={handleInputChange} placeholder="Email" required />
                    </Col>
                    <Col md={3}>
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
                    <Col md={4}>
                        <Form.Control type="number" name="province" value={newExporter.province} onChange={handleInputChange} placeholder="Province" min={0} max={99} required />
                    </Col>
                    <Col md={4}>
                        <Form.Control type="number" name="canton" value={newExporter.canton} onChange={handleInputChange} min={0} max={99} placeholder="Canton" required />
                    </Col>
                    <Col md={4}>
                        <Form.Control type="number" name="district" value={newExporter.district} onChange={handleInputChange} min={0} max={99} placeholder="District" required />
                    </Col>
                </Row>
                <Button type="submit" variant="primary">Create Exporter</Button>
            </Form>

            {/* Componente para búsqueda */}
            <Form.Group as={Row} className="mb-3">
                <Col sm="3">
                    <Form.Control
                        type="text"
                        placeholder="Search by ID"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
            </Form.Group>

            {/* Tabla para exportadores */}
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Identification</th>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExporters.map(exporter => (
                        <tr key={exporter.id} onClick={() => handleRowClick(exporter)}>
                            <td>{exporter.company.identification}</td>
                            <td>{exporter.company.name}</td>
                            <td>{exporter.email}</td>
                            <td>{exporter.status === 'A' ? 'Active' : 'Inactive'}</td>
                            <td>
                                <Button 
                                    variant={exporter.status === 'A' ? 'warning' : 'success'} 
                                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(exporter.id, exporter.status); }}
                                >
                                    {exporter.status === 'A' ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDeleteExporter(exporter.id); }} className="ml-2">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para mostrar los detalles del exportador seleccionado */}
            <Modal show={selectedExporter !== null} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Exporter details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedExporter && (
                        <div>
                            <p><strong>Identification Type:</strong> {selectedExporter.company.identificationType}</p>
                            <p><strong>Identification:</strong> {selectedExporter.company.identification}</p>
                            <p><strong>Company Name:</strong> {selectedExporter.company.name}</p>
                            <p><strong>Sector:</strong> {selectedExporter.sector}</p>
                            <p><strong>Acceptance:</strong> {selectedExporter.acceptance}</p>
                            <p><strong>Expiration:</strong> {selectedExporter.expiration}</p>
                            <p><strong>Email:</strong> {selectedExporter.email}</p>
                            <p><strong>Status:</strong> {selectedExporter.status === 'A' ? 'Active' : 'Inactive'}</p>
                            <p><strong>Province:</strong> {selectedExporter.province}</p>
                            <p><strong>Canton:</strong> {selectedExporter.canton}</p>
                            <p><strong>District:</strong> {selectedExporter.district}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ExporterForm;
