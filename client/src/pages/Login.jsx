import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Text, 
  Heading, 
  useToast 
} from '@chakra-ui/react';  
import axios from 'axios'; 
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token); 
    return decodedToken?.exp > Math.floor(Date.now() / 1000); 
  } catch {
    return false;
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/feedback'); 
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/loginuser`, { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      navigate('/feedback');
    } catch (err) {
      setError('Invalid email or password');
      toast({
        title: "Error",
        description: "Invalid email or password",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      bg="#f7fafc"
    >
      <Box 
        p={8} 
        maxWidth="400px" 
        width="100%" 
        bg="white" 
        boxShadow="lg" 
        borderRadius="md"
      >
        <Heading as="h2" size="xl" textAlign="center" mb={6}>
          Login
        </Heading>
        
        {error && (
          <Text color="red.500" textAlign="center" mb={4}>
            {error}
          </Text>
        )}

        <form onSubmit={handleLogin}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              focusBorderColor="blue.500"
            />
          </FormControl>
          
          <FormControl mb={6}>
            <FormLabel>Password</FormLabel>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              focusBorderColor="blue.500"
            />
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full" 
            isLoading={loading} 
            loadingText="Logging in..."
          >
            Login
          </Button>
        </form>
        
       
      </Box>
    </Box>
  );
};

export default Login;
