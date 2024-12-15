import React, { useState } from 'react';
import { loginUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData); // Send login data to API
      localStorage.setItem('token', response.data.token); // Store token
      alert('Login successful');
      navigate('/dashboard'); // Redirect to Dashboard page after login
    } catch (error) {
      alert(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="container">
      <div className="form-image">
        <img src="your-image-url-here" alt="Login Illustration" />
      </div>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p>Please enter your credentials to log in.</p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-footer">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

// import React, { useState } from 'react';
// import { loginUser } from '../services/api.js';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError(''); // Clear any previous errors when user starts typing
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Please enter a valid email address');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await loginUser(formData);
//       localStorage.setItem('token', response.data.token);
//       navigate('/dashboard');
//     } catch (error) {
//       setError(error.response?.data?.message || 'Error logging in. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="form-image">
//         <img src="/path-to-your-login-illustration.svg" alt="Login Illustration" />
//       </div>
//       <div className="login-container">
//         <form className="login-form" onSubmit={handleSubmit}>
//           <h2>Login</h2>
//           <p>Please enter your credentials to log in.</p>
          
//           {error && (
//             <div style={{
//               color: '#FB6542', 
//               textAlign: 'center', 
//               marginBottom: '1rem', 
//               backgroundColor: 'rgba(251, 101, 66, 0.1)', 
//               padding: '0.5rem',
//               borderRadius: '5px'
//             }}>
//               {error}
//             </div>
//           )}
          
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               name="email"
//               id="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               name="password"
//               id="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-footer">
//             <button 
//               type="submit" 
//               className="login-btn" 
//               disabled={isLoading}
//             >
//               {isLoading ? 'Logging in...' : 'Login'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
