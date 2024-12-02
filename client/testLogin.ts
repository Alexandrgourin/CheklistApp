import { login } from './src/api/auth';

async function testLogin() {
  try {
    const response = await login({ email: 'alexandrgourin@gmail.com', password: 'Belomorsk' });
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

testLogin();
