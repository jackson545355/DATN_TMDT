import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBRadio,
  MDBBtn,
  MDBDropdown,
} from 'mdb-react-ui-kit';

export default function ProfilePage({ updateAvatar }) {
  const [user, setUser] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    birth: '',
    profileImage: '',
    userID:''
  });

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      fetch('http://localhost:3000/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUser({
              username: data.user.username || '',
              fullName: data.user.fullName || '',
              email: data.user.email || '',
              phone: data.user.phone || '',
              gender: data.user.gender || '',
              birth: data.user.Birth || '',
              profileImage: data.user.profileImage || '',
              userID: data.user._id ,
            });
          } else {
            alert('Failed to fetch user profile.');
          }
        })
        .catch(error => console.error('Error:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const token = localStorage.getItem('auth-token');
      const formData = new FormData();
      formData.append('profileImage', file);
  
      fetch(`http://localhost:3001/auth/profile-image/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
        if (data.success) {
          setUser({ ...user, profileImage: data.user.profileImage });
          updateAvatar(data.user.profileImage);
          alert('Profile image updated successfully.');
        } else {
          alert('Failed to update profile image.');
        }
      })
      .catch(error => console.error('Error:', error));
    }
  };
  

  const saveProfile = () => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      fetch('http://localhost:3000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user)
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Profile updated successfully.');
          } else {
            alert('Failed to update profile.');
          }
        })
        .catch(error => console.error('Error:', error));
    }
  };

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="2">
            <MDBRow>
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBDropdown>
                    <MDBCardText>
                      <Link to="/profile" className="text-body">Tài khoản của tôi</Link><br></br>
                    </MDBCardText>
                  </MDBDropdown>
                  <MDBCardText>
                    <Link to="/myorder" className='text-body'>Đơn hàng của tôi</Link>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBRow>
          </MDBCol>
          <MDBCol lg="7">
            <MDBCard className="mb-4">
              <MDBCardBody style={{ height: 400 }}>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Tên</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      name="fullName"
                      value={user.fullName}
                      onChange={handleChange}
                      label="Tên"
                      type="text"
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>{user.email || 'Chưa có thông tin'}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Số điện thoại</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      label="Số điện thoại"
                      type="text"
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Giới tính</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBRadio name="gender" value="Nam" label="Nam" checked={user.gender === 'Nam'} onChange={handleChange} inline />
                    <MDBRadio name="gender" value="Nữ" label="Nữ" checked={user.gender === 'Nữ'} onChange={handleChange} inline />
                    <MDBRadio name="gender" value="Khác" label="Khác" checked={user.gender === 'Khác'} onChange={handleChange} inline />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Ngày sinh</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      name="birth"
                      value={user.birth}
                      onChange={handleChange}
                      label="Ngày sinh"
                      type="text"
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBBtn onClick={saveProfile} className="position-relative">Lưu</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="3">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCol sm="15">
                  <MDBCardImage
                    src={user.profileImage || 'default-avatar.png'}
                    alt="avatar"
                    className="rounded-circle avatar"
                    fluid
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </MDBCol>
                <p className="text-muted mb-1">{user.username || 'Chưa có thông tin'}</p>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                  accept='image/*'
                />
                <MDBBtn className="mt-3" onClick={() => document.getElementById('fileInput').click()}>Chọn ảnh</MDBBtn>
                <div className="text-img">
                  <div>
                    <small className="text-muted">Kích thước file: tối đa 1MB</small>
                  </div>
                  <div>
                    <small className="text-muted">Định dạng file: .JPEG, .PNG</small>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
