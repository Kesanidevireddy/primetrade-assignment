const BASE_URL = 'http://localhost:5000/v1/auth';

// ✅ Register API
export const registerUser = async ({ name, email, password }) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  } catch (err) {
    console.error('Register API Error:', err.message);
    throw err;
  }
};

// ✅ Login API
export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  } catch (err) {
    console.error('Login API Error:', err.message);
    throw err;
  }
};
