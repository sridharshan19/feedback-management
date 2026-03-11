import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Tag,
  HStack,
  VStack,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function FeedbackDetails() {
  const { id } = useParams();
  const [feedbackDetails, setFeedbackDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewMode, setViewMode] = useState('all');

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/feedback/feedbacks/${id}`);
        setFeedbackDetails(response.data);
      } catch (error) {
        console.error('Error fetching feedback details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!feedbackDetails) {
    return <Text color="red.500">Feedback details could not be loaded.</Text>;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayContent = feedbackDetails.feedbackcontent.find(
    (content) => new Date(content.date).toISOString().split('T')[0] === today
  );
  const remainingContent = feedbackDetails.feedbackcontent.filter(
    (content) => new Date(content.date).toISOString().split('T')[0] !== today
  );

  const handleViewAll = () => {
    setViewMode('all');
    onOpen();
  };

  const handleDayClick = (day) => {
    setSelectedDay({
      ...day,
      records: day.records.map(record => ({
        ...record,
        date: new Date(day.date).toISOString().split('T')[0], // Ensure consistent format
      }))
    });
    setViewMode('single');
  };
  
  const handleViewAllFeedback = () => {
    setSelectedDay(null);
  };

  return (
    <Box p={8}>
      <VStack align="start" spacing={8}>
        <Box w="100%">
          <Heading size="lg" mb={2}>{feedbackDetails.sessionname}</Heading>
          <HStack spacing={4}>
            <Badge colorScheme={feedbackDetails.status === 'Active' ? 'green' : 'red'} px={2} py={1}>
              {feedbackDetails.status}
            </Badge>
            <Text color="gray.600">
              {formatDate(feedbackDetails.startdate)} to {formatDate(feedbackDetails.enddate)} ({feedbackDetails.days} days)
            </Text>
          </HStack>
        </Box>

        <Grid templateColumns="repeat(2, 1fr)" gap={6} w="100%">
          <GridItem>
            <Card>
              <CardHeader>
                <Heading size="md">Session Information</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Box>
                    <Text fontWeight="bold">College:</Text>
                    <Text>{feedbackDetails.college_id?.collegename || 'N/A'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Departments:</Text>
                    <HStack wrap="wrap" spacing={2}>
                      {feedbackDetails.departments.map((dept, index) => (
                        <Tag key={index} colorScheme="blue">{dept}</Tag>
                      ))}
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Tutors:</Text>
                    <HStack wrap="wrap" spacing={2}>
                      {feedbackDetails.tutors.map((tutor, index) => (
                        <Tag key={index} colorScheme="green">{tutor.name}</Tag>
                      ))}
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Feedback Link:</Text>
                    <Text>
                      {feedbackDetails.link ? (
                        <a href={feedbackDetails.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3182ce' }}>
                          {feedbackDetails.link}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader>
                <Heading size="md">Today's Statistics</Heading>
              </CardHeader>
              <CardBody>
                {todayContent ? (
                  <VStack align="start" spacing={4}>
                    <Box>
                      <Text fontWeight="bold">{formatDate(todayContent.date)}</Text>
                      <Text>Total Responses: {todayContent.totalResponses}</Text>
                      <Text>Feedback Type: {todayContent.feedbacktype}</Text>
                      <HStack spacing={2} mt={2}>
                        <Button 
                          size="sm" 
                          colorScheme="blue"
                          onClick={() => handleDayClick(todayContent)}
                        >
                          View Today's Feedback
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme="teal"
                          onClick={handleViewAll}
                        >
                          View All Days Statistics
                        </Button>
                      </HStack>
                    </Box>
                  </VStack>
                ) : (
                  <VStack align="start" spacing={4}>
                    <Text>No responses for today.</Text>
                    <Button colorScheme="teal" size="sm" onClick={handleViewAll}>
                      View All Days Statistics
                    </Button>
                  </VStack>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Box w="100%">
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">
                  {selectedDay ? `Feedback for ${formatDate(selectedDay.date)}` : 'All Feedback Records'}
                </Heading>
                {selectedDay && (
                  <Button 
                    colorScheme="blue" 
                    size="sm"
                    onClick={handleViewAllFeedback}
                  >
                    View All Feedback
                  </Button>
                )}
              </HStack>
            </CardHeader>
            <CardBody>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Date</Th>
                      <Th>Student ID</Th>
                      <Th>Department</Th>
                      <Th>Topic required</Th>
                      <Th>To improve</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
  {(selectedDay ? selectedDay.records : feedbackDetails.feedbackcontent.flatMap(content => 
    content.records.map(record => ({
      ...record,
      date: new Date(content.date).toISOString().split('T')[0],
    }))
  )).map((record, index) => (
    <Tr key={index}>
      <Td>{formatDate(record.date)}</Td>
      <Td>{record.email || 'Anonymous'}</Td>  
      <Td>{record.department || 'N/A'}</Td>
      <Td>{record.specificTopic || 'No Comment'}</Td>
      <Td>{record.description || 'No Comment'}</Td>
    </Tr>
  ))}
</Tbody>

                </Table>
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Statistics Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>All Days Statistics</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack align="stretch" spacing={4}>
                {feedbackDetails.feedbackcontent.map((content, index) => (
                  <Card key={index} variant="outline">
                    <CardBody>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{formatDate(content.date)}</Text>
                          <Text>Total Responses: {content.totalResponses}</Text>
                          <Text>Feedback Type: {content.feedbacktype}</Text>
                        </VStack>
                        <Button 
                          size="sm" 
                          colorScheme="blue"
                          onClick={() => {
                            handleDayClick(content);
                            onClose();
                          }}
                        >
                          View Feedback
                        </Button>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}

export default FeedbackDetails;