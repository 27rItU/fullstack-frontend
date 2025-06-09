import { ApiClient } from './api';

export async function testApiConnection() {
  try {
    const client = new ApiClient('http://localhost:5000', 'dev-key-12345');
    
    // Test a simple endpoint (you might need to create this in your backend)
    const response = await fetch('http://localhost:5000/api/health', {
      headers: {
        'Authorization': `Bearer ${client.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ API Connection Successful!');
      return true;
    } else {
      console.error('❌ API Connection Failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ API Connection Error:', error);
    return false;
  }
}