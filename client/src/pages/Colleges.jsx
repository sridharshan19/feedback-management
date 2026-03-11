import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Colleges() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    departments: '',
  });
  const [editingCollegeId, setEditingCollegeId] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/college/getcolleges`);
        setColleges(response.data.colleges);
      } catch (err) {
        console.error('Error fetching colleges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const { name, location, departments } = formData;
    const newCollege = {
      collegename: name,
      availabledepartment: departments.split(',').map((d) => d.trim()),
      place: location,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/college/addcollege`, newCollege);
      if (response.status === 201) {
        const addedCollege = {
          _id: response.data.college.id,
          collegename: response.data.college.collegename,
          place: response.data.college.place,
          availabledepartment: response.data.college.availabledepartment,
        };

        setColleges((prevColleges) => [...prevColleges, addedCollege]);
        onClose();
        setFormData({ name: '', location: '', departments: '' });
      } else {
        console.error('Error adding college:', response.data.message);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (college) => {
    setEditingCollegeId(college._id);
    setFormData({
      name: college.collegename,
      location: college.place,
      departments: college.availabledepartment.join(', '),
    });
    onOpen();
  };

  const handleDelete = async (collegeId) => {
    setLoadingId(collegeId);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/college/deletecollege/${collegeId}`);
      if (response.status === 200) {
        setColleges(colleges.filter((college) => college._id !== collegeId));
      } else {
        console.error('Error deleting college:', response.data.message);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const { name, location, departments } = formData;
    const updatedCollege = {
      collegename: name,
      availabledepartment: departments.split(',').map((d) => d.trim()),
      place: location,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/college/updatecollege/${editingCollegeId}`, updatedCollege);
      if (response.status === 200) {
        const updatedColleges = colleges.map((college) =>
          college._id === editingCollegeId ? { ...college, ...updatedCollege } : college
        );
        setColleges(updatedColleges);
        onClose();
        setFormData({ name: '', location: '', departments: '' });
      } else {
        console.error('Error updating college:', response.data.message);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Colleges</Heading>
        <Button colorScheme="blue" onClick={onOpen} isDisabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" /> : 'Add College'}
        </Button>
      </Box>

      {loading ? (
          <Center height="100vh">
          <Spinner width="100px" height="100px" />
        </Center>
        
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Location</Th>
              <Th>Departments</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {colleges.map((college) => (
              <Tr key={college._id}>
                <Td>{college.collegename}</Td>
                <Td>{college.place}</Td>
                <Td>{college.availabledepartment.join(', ')}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    mr={2}
                    onClick={() => handleEdit(college)}
                    isDisabled={loadingId === college._id || isSubmitting}
                  >
                    {loadingId === college._id ? <Spinner size="sm" /> : 'Edit'}
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(college._id)}
                    isDisabled={loadingId === college._id}
                  >
                    {loadingId === college._id ? <Spinner size="sm" /> : 'Delete'}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingCollegeId ? 'Edit College' : 'Add New College'}</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>College Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Departments (comma-separated)</FormLabel>
              <Input
                value={formData.departments}
                onChange={(e) =>
                  setFormData({ ...formData, departments: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={editingCollegeId ? handleUpdate : handleSubmit}
              isLoading={isSubmitting}
            >
              {editingCollegeId ? 'Update' : 'Save'}
            </Button>
            <Button onClick={onClose} isDisabled={isSubmitting}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Colleges;
