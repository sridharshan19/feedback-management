import { Box, VStack, Text, Icon, Tooltip, Button } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUniversity, FaChalkboardTeacher, FaComments, FaUserPlus } from 'react-icons/fa';
import { useState } from 'react';
import AddUserModal from './AddUserModal'; 
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const menuItems = [
    { icon: FaComments, text: 'Feedback', path: '/feedback' },
    { icon: FaUniversity, text: 'Colleges', path: '/college' },
    { icon: FaChalkboardTeacher, text: 'Tutors', path: '/tutors' },
   
  ];

  const handleAddUserClick = () => {
    setIsModalOpen(true); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); 
  };

  return (
    <Box
      w="250px"
      h="100vh"
      bgGradient="linear(to-b, blue.600, blue.800)"
      color="white"
      p={5}
      position="sticky"
      top={0}
      boxShadow="lg"
    >
      <Box
        textAlign="center"
        mb={10}
        py={4}
        bg="blue.700"
        borderRadius="md"
        boxShadow="md"
      >
        <Text fontSize="2xl" fontWeight="bold">
          FMS
        </Text>
      </Box>
      <VStack spacing={3} align="stretch">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Tooltip label={item.text} hasArrow placement="right">
              <Box
                display="flex"
                alignItems="center"
                p={3}
                borderRadius="md"
                bg={location.pathname === item.path ? 'blue.700' : 'transparent'}
                _hover={{ bg: 'blue.700', transform: 'scale(1.05)' }}
                transition="all 0.2s ease-in-out"
                boxShadow={location.pathname === item.path ? 'md' : 'none'}
              >
                <Icon as={item.icon} boxSize={5} mr={3} />
                <Text fontSize="md" fontWeight="medium">
                  {item.text}
                </Text>
              </Box>
            </Tooltip>
          </Link>
        ))}
        <Button
          leftIcon={<FaUserPlus />}
          colorScheme="blue"
          variant="solid"
          onClick={handleAddUserClick}
          width="full"
        >
Add Admin        </Button>
      </VStack>

      <Box position="absolute" bottom={5} left="20%" >
        <Button
          colorScheme="red"
          variant="solid"
          size="lg"
          width="full"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}

export default Sidebar;
