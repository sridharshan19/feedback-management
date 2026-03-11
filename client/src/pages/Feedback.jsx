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
  Select,
  Badge,
  Link as ChakraLink,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  VStack,
  Text,
  useToast,
  Spinner
} from '@chakra-ui/react';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Feedback() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    college: '',
    departments: '',
    selectedTutor: '',
    selectedTutors: [],
    fromDate: '',
    toDate: '',
  });
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
  const toast = useToast();

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/feedback/feedbacks`);
      setFeedbacks(response.data.reverse());
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      toast({
        title: 'Error fetching feedbacks',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegesRes, tutorsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/college/getcolleges`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/tutor/gettutors`)
        ]);
        setColleges(collegesRes.data.colleges);
        setTutors(tutorsRes.data.tutors);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast({
          title: 'Error fetching data',
          status: 'error',
          duration: 3000,
        });
      }
    };
    fetchData();
  }, []);

  const calculateDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAddTutor = () => {
    if (formData.selectedTutor && !formData.selectedTutors.some(t => t._id === formData.selectedTutor)) {
      const selectedTutor = tutors.find(t => t._id === formData.selectedTutor);
      if (selectedTutor) {
        setFormData({
          ...formData,
          selectedTutors: [...formData.selectedTutors, selectedTutor],
          selectedTutor: '',
        });
      }
    }
  };

  const handleRemoveTutor = (tutorToRemove) => {
    setFormData({
      ...formData,
      selectedTutors: formData.selectedTutors.filter((tutor) => tutor._id !== tutorToRemove._id),
    });
  };

  const handleEdit = (feedback, e) => {
    e.stopPropagation(); 
    setCurrentFeedbackId(feedback._id);
    setFormData({
      title: feedback.sessionname,
      college: feedback.college_id._id, 
      departments: Array.isArray(feedback.departments) ? feedback.departments.join(', ') : feedback.departments,
      selectedTutors: feedback.tutors,
      fromDate: new Date(feedback.startdate).toISOString().split('T')[0],
      toDate: new Date(feedback.enddate).toISOString().split('T')[0],
      selectedTutor: '',
    });
    setEditMode(true);
    onOpen();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/feedback/deletefeedback/${id}`);
      toast({
        title: 'Feedback deleted successfully',
        status: 'success',
        duration: 3000,
      });
      fetchFeedbacks();
    } catch (err) {
      console.error('Error deleting feedback:', err);
      toast({
        title: 'Error deleting feedback',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.college || !formData.fromDate || !formData.toDate || formData.selectedTutors.length === 0) {
      toast({
        title: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const days = calculateDays(formData.fromDate, formData.toDate);
    const departments = formData.departments.split(',').map(dept => dept.trim()).filter(dept => dept !== '');
    
    const feedbackData = {
      sessionname: formData.title,
      college_id: formData.college,
      departments: departments,
      days,
      tutors: formData.selectedTutors.map(t => t._id),
      startdate: formData.fromDate,
      enddate: formData.toDate,
    };

    try {
      if (editMode) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/feedback/updatefeedback/${currentFeedbackId}`, feedbackData);
        toast({
          title: 'Feedback updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/feedback/addfeedback`, feedbackData);
        toast({
          title: 'Feedback created successfully',
          status: 'success',
          duration: 3000,
        });
      }
      
      fetchFeedbacks();
      onClose();
      setFormData({
        title: '',
        college: '',
        departments: '',
        selectedTutor: '',
        selectedTutors: [],
        fromDate: '',
        toDate: '',
      });
      setEditMode(false);
      setCurrentFeedbackId(null);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: `Error ${editMode ? 'updating' : 'creating'} feedback`,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleRowClick = (feedback) => {
    navigate(`/feedback/${feedback._id}`);
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Box>
    );
  }
  
  return (
    <Box p={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <VStack align="start" spacing={1}>
          <Heading size="lg">Feedback Forms</Heading>
          <Text color="gray.600">Manage and track feedback across departments</Text>
        </VStack>
        <Button colorScheme="blue" size="lg" onClick={() => {
          setEditMode(false);
          setCurrentFeedbackId(null);
          setFormData({
            title: '',
            college: '',
            departments: '',
            selectedTutor: '',
            selectedTutors: [],
            fromDate: '',
            toDate: '',
          });
          onOpen();
        }}>
          Create Feedback
        </Button>
      </Box>

      <Table variant="simple" bg="white" shadow="sm" rounded="lg">
        <Thead bg="gray.50">
          <Tr>
            <Th>Title</Th>
            <Th>College</Th>
            <Th>Departments</Th>
            <Th>Tutors</Th>
            <Th>Duration</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {feedbacks.map((feedback) => (
            <Tr
              key={feedback._id}
              onClick={() => handleRowClick(feedback)}
              style={{ cursor: 'pointer' }}
              _hover={{ bg: 'gray.50' }}
            >
              <Td>{feedback.sessionname}</Td>
              <Td>{feedback.college_id.collegename}</Td>
              <Td>
                {Array.isArray(feedback.departments) 
                  ? feedback.departments.join(', ')
                  : feedback.departments}
              </Td>
              <Td>
                <HStack spacing={2} wrap="wrap">
                  {feedback.tutors.map((tutor, index) => (
                    <Tag key={index} size="md" colorScheme="blue" borderRadius="full">
                      <TagLabel>{tutor.name}</TagLabel>
                    </Tag>
                  ))}
                </HStack>
              </Td>
              <Td>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm">
                    {new Date(feedback.startdate).toLocaleDateString()} to {new Date(feedback.enddate).toLocaleDateString()}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    ({feedback.days} days)
                  </Text>
                </VStack>
              </Td>
              <Td>
              <Badge
  colorScheme={
    feedback.status === "Active"
      ? "green"
      : feedback.status === "cancelled"
      ? "red"
      : feedback.status === "completed"
      ? "yellow"
      : "gray" 
  }
  px={2}
  py={1}
  borderRadius="full"
>
  {feedback.status}
</Badge>

              </Td>
              <Td onClick={e => e.stopPropagation()}>
                <HStack spacing={2}>
                  <Button size="sm" colorScheme="yellow" onClick={(e) => handleEdit(feedback, e)}>Edit</Button>
                  <Button size="sm" colorScheme="red" onClick={(e) => handleDelete(feedback._id, e)}>Delete</Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editMode ? 'Edit Feedback' : 'Create New Feedback'}</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter feedback title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>College</FormLabel>
                <Select
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="Select college"
                >
                  {colleges.map((college) => (
                    <option key={college._id} value={college._id}>
                      {college.collegename}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Departments</FormLabel>
                <Input
                  value={formData.departments}
                  onChange={(e) => setFormData({ ...formData, departments: e.target.value })}
                  placeholder="Enter departments (comma-separated, e.g., CSE, ECE, MECH)"
                />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Separate multiple departments with commas
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Add Tutors</FormLabel>
                <HStack>
                  <Select
                    value={formData.selectedTutor}
                    onChange={(e) => setFormData({ ...formData, selectedTutor: e.target.value })}
                    placeholder="Select tutor"
                  >
                    {tutors
                      .filter(tutor => !formData.selectedTutors.some(st => st._id === tutor._id))
                      .map((tutor) => (
                        <option key={tutor._id} value={tutor._id}>
                          {tutor.name}
                        </option>
                      ))}
                  </Select>
                  <Button colorScheme="blue" onClick={handleAddTutor}>Add</Button>
                </HStack>
              </FormControl>

              {formData.selectedTutors.length > 0 && (
                <Box w="100%">
                  <Text mb={2} fontWeight="medium">Selected Tutors:</Text>
                  <HStack spacing={2} wrap="wrap">
                    {formData.selectedTutors.map((tutor) => (
                      <Tag key={tutor._id} size="lg" colorScheme="blue" borderRadius="full">
                        <TagLabel>{tutor.name}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveTutor(tutor)} />
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              )}

              <FormControl isRequired>
                <FormLabel>Date Range</FormLabel>
                <HStack>
                  <Input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  />
                  <Text>to</Text>
                  <Input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  />
                </HStack>
              </FormControl>

              {formData.fromDate && formData.toDate && (
                <Box w="100%">
                  <Text color="gray.600">
                    Duration: {calculateDays(formData.fromDate, formData.toDate)} days
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {editMode ? 'Update' : 'Create'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Feedback;