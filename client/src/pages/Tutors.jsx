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

function Tutors() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tutors, setTutors] = useState([]);
  const [isFetching, setFetching] = useState(true);
  const [isActionLoading, setActionLoading] = useState({}); 
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
  });
  const [editTutorId, setEditTutorId] = useState(null);

  useEffect(() => {
    const fetchTutors = async () => {
      setFetching(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tutor/gettutors`);
        setTutors(response.data.tutors.filter((tutor) => tutor.status === 'active')); 
      } catch (err) {
        console.error('Error fetching tutors:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchTutors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, specialization, experience } = formData;
    const newTutor = { name, specialization, experience };

    setActionLoading((prev) => ({ ...prev, addOrUpdate: true }));
    try {
      if (editTutorId) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/tutor/updatetutor/${editTutorId}`,
          newTutor
        );
        if (response.status === 200) {
          setTutors((prevTutors) =>
            prevTutors.map((tutor) =>
              tutor._id === editTutorId ? { ...tutor, ...newTutor } : tutor
            )
          );
        }
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tutor/addtutor`, newTutor);
        if (response.status === 201) {
          setTutors((prevTutors) => [...prevTutors, response.data.tutor]);
        }
      }
      setFormData({ name: '', specialization: '', experience: '' });
      onClose();
      setEditTutorId(null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, addOrUpdate: false }));
    }
  };

  const handleEdit = (tutor) => {
    setFormData({
      name: tutor.name,
      specialization: tutor.specialization,
      experience: tutor.experience,
    });
    setEditTutorId(tutor._id);
    onOpen();
  };

  const handleDelete = async (tutorId) => {
    setActionLoading((prev) => ({ ...prev, [tutorId]: true }));
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/tutor/deletetutor/${tutorId}`);
      if (response.status === 200) {
        setTutors((prevTutors) => prevTutors.filter((tutor) => tutor._id !== tutorId));
      }
    } catch (err) {
      console.error('Error deleting tutor:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [tutorId]: false }));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Tutors</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Add Tutor
        </Button>
      </Box>

      {isFetching ? (
       <Center height="100vh">
       <Spinner width="100px" height="100px" />
     </Center>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Specialization</Th>
              <Th>Experience</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tutors.map((tutor) => (
              <Tr key={tutor._id}>
                <Td>{tutor.name}</Td>
                <Td>{tutor.specialization}</Td>
                <Td>{tutor.experience}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    mr={2}
                    onClick={() => handleEdit(tutor)}
                    isLoading={isActionLoading[tutor._id]}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(tutor._id)}
                    isLoading={isActionLoading[tutor._id]} // Loader for delete button
                  >
                    Delete
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
          <ModalHeader>{editTutorId ? 'Edit Tutor' : 'Add New Tutor'}</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Specialization</FormLabel>
              <Input
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Experience</FormLabel>
              <Input
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={isActionLoading.addOrUpdate} // Loader for Add/Update button
            >
              {editTutorId ? 'Update' : 'Save'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Tutors;
