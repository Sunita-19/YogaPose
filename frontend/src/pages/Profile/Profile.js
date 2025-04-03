import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const defaultPlaceholder = 'https://via.placeholder.com/200?text=Profile';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    mobile: '',
    profilePhoto: ''
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Fetch the user details on mount
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setLoading(false);
      });
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if(e.target.files && e.target.files[0]){
      setPhotoFile(e.target.files[0]);
      // For immediate preview, set the profilePhoto URL
      setProfile(prev => ({ ...prev, profilePhoto: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('username', profile.username);
    formData.append('email', profile.email);
    formData.append('mobile', profile.mobile);
    if(photoFile) {
      formData.append('profilePhoto', photoFile);
    }

    axios.put('http://localhost:5000/api/profile', formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setProfile(response.data); // update fields with latest data from backend
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile.');
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <div className="profile-photo-container">
        <img 
          src={profile.profilePhoto ? `http://localhost:5000/${profile.profilePhoto}` : defaultPlaceholder} 
          alt="Profile" 
          className="profile-photo" 
        />
        {isEditing && (
          <label className="change-photo-wrapper">
            ✏️
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange} 
            />
          </label>
        )}
      </div>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={profile.username}
          disabled={!isEditing}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          disabled={!isEditing}
          onChange={handleChange}
        />

        <label>Mobile:</label>
        <input
          type="text"
          name="mobile"
          value={profile.mobile}
          disabled={!isEditing}
          onChange={handleChange}
        />

        {isEditing && (
          <div className="btn-group">
            <button type="submit" className="edit-btn">Save</button>
            <button type="button" className="edit-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}
        {!isEditing && (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)} 
            className="edit-btn">
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;