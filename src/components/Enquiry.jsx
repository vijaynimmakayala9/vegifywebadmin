import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Card, Spinner, Badge, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync, FaSignOutAlt, FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentEnquiry, setCurrentEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();

  // Color theme
  const primaryColor = '#076e24';
  const primaryHover = '#055a1c';
  const secondaryColor = '#f8f9fa';
  const textOnPrimary = '#ffffff';

  const API_URL = 'https://vegifyy-backend-2.onrender.com/api/enquiries';

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setEnquiries(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enquiries');
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccessMessage('Enquiry deleted successfully');
        fetchEnquiries();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete enquiry');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentEnquiry._id) {
        await axios.put(`${API_URL}/${currentEnquiry._id}`, currentEnquiry);
        setSuccessMessage('Enquiry updated successfully');
      } else {
        await axios.post(API_URL, currentEnquiry);
        setSuccessMessage('Enquiry added successfully');
      }
      setShowModal(false);
      fetchEnquiries();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Operation failed');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEnquiry({
      ...currentEnquiry,
      [name]: value
    });
  };

  const filteredEnquiries = enquiries.filter(enquiry =>
    enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.mobile.includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  const openEditModal = (enquiry) => {
    setCurrentEnquiry(enquiry);
    setShowModal(true);
  };

  const openNewModal = () => {
    setCurrentEnquiry({
      name: '',
      mobile: '',
      email: '',
      message: ''
    });
    setShowModal(true);
  };

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('token');
    navigate('/login');
  };

  const exportToExcel = () => {
    const dataToExport = filteredEnquiries.map(enquiry => ({
      Name: enquiry.name,
      Email: enquiry.email,
      Mobile: enquiry.mobile,
      Message: enquiry.message,
      'Date & Time': formatDateTime(enquiry.createdAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
    XLSX.writeFile(workbook, "Vegify_Enquiries.xlsx");
  };

  return (
    <div className="admin-panel" style={{ backgroundColor: secondaryColor, minHeight: '100vh' }}>
      <Container className="py-5">
        <Card className="shadow-lg">
          <Card.Header 
            className="d-flex justify-content-between align-items-center"
            style={{ backgroundColor: primaryColor, color: textOnPrimary }}
          >
            <h3 className="mb-0">Vegify Enquiries Dashboard</h3>
            <div>
              <Badge pill bg="light" text="dark" className="me-2">
                Total: {enquiries.length}
              </Badge>
              <Button 
                variant="outline-light" 
                onClick={handleLogout}
                size="sm"
              >
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <div className="d-flex justify-content-between mb-4">
              <div className="w-50">
                <div className="input-group">
                  <span className="input-group-text" style={{ backgroundColor: primaryColor, color: textOnPrimary }}>
                    <FaSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Button 
                  variant="success" 
                  onClick={openNewModal} 
                  className="me-2"
                  style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                >
                  <FaPlus /> Add New
                </Button>
                <Button 
                  variant="outline-success" 
                  onClick={exportToExcel}
                  className="me-2"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  <FaFileExcel /> Export
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={fetchEnquiries}
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  <FaSync /> Refresh
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: primaryColor }} />
                <p className="mt-2">Loading enquiries...</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead style={{ backgroundColor: primaryColor, color: textOnPrimary }}>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Message</th>
                        <th>Date & Time</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((enquiry) => (
                          <tr key={enquiry._id}>
                            <td>{enquiry.name}</td>
                            <td>{enquiry.email}</td>
                            <td>{enquiry.mobile}</td>
                            <td className="text-truncate" style={{ maxWidth: '200px' }} title={enquiry.message}>
                              {enquiry.message}
                            </td>
                            <td>{formatDateTime(enquiry.createdAt)}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => openEditModal(enquiry)}
                                className="me-2"
                                style={{ color: primaryColor, borderColor: primaryColor }}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(enquiry._id)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            No enquiries found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                      <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Pagination.Item
                            key={pageNum}
                            active={pageNum === currentPage}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      })}
                      <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
                      <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: primaryColor, color: textOnPrimary }}>
          <Modal.Title>{currentEnquiry?._id ? 'Edit Enquiry' : 'Add New Enquiry'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentEnquiry?.name || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentEnquiry?.email || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="tel"
                name="mobile"
                value={currentEnquiry?.mobile || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={currentEnquiry?.message || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            >
              {currentEnquiry?._id ? 'Update' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Enquiry;