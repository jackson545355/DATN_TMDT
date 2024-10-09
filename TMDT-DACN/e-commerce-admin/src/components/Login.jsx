import React, { useState, useContext, useEffect } from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
} from 'mdb-react-ui-kit';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Mount CSS khi component được render
    const mdbCSS = document.createElement('link');
    mdbCSS.rel = 'stylesheet';
    mdbCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.10.2/mdb.min.css';
    
    const fontAwesomeCSS = document.createElement('link');
    fontAwesomeCSS.rel = 'stylesheet';
    fontAwesomeCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';

    document.head.appendChild(mdbCSS);
    document.head.appendChild(fontAwesomeCSS);

    // Cleanup CSS khi component bị unmount
    return () => {
      document.head.removeChild(mdbCSS);
      document.head.removeChild(fontAwesomeCSS);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
    navigate('/home');
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <form onSubmit={handleSubmit}>
        <MDBInput
          wrapperClass='mb-4'
          label='Username'
          id='form1'
          type='text'
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
        <MDBInput
          wrapperClass='mb-4'
          label='Password'
          id='form2'
          type='password'
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <MDBBtn className="mb-4" type="submit">Sign in</MDBBtn>
      </form>
    </MDBContainer>
  );
}
