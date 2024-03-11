import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import '../styles/ProfilePage.css';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basicInfo');
  const [selectedImage, setSelectedImage] = useState(null);
  const [editableFields, setEditableFields] = useState({
    name: '',
    age: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    profilePicture: []
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      UserService.getUserByAccessToken(accessToken)
        .then((response) => {
          setUser(response.data);
          setEditableFields({
            name: response.data.name,
            age: response.data.age,
            email: response.data.email,
            currentPassword: '',
            password: '',
            profilePicture: response.data.picture
          });
          if(response.data.picture){
            setProfilePicture(JSON.parse(response.data.picture).picture)
            console.log(response.data)
          }
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          setError('Failed to fetch user profile');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('Access token not found');
      setLoading(false);
    }
  }, []);

  const get_user_role_display = () => {
    switch (user.role) {
      case 'CAR_OWNER':
        return 'Car Owner';
      case 'CAR_RENTER':
        return 'Car Renter';
      default:
        return 'Unknown Role';
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (field, value) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        console.log(base64String)
        setSelectedImage(base64String);
      };
  
      reader.readAsDataURL(file);
    }
  };
  
  

  const handleUpdatePassword = () => {
    const { currentPassword, newPassword } = editableFields;
    const userId = user.id;

    UserService.updatePassword(userId, currentPassword, newPassword)
      .then(() => {
        console.log('Password updated successfully');
        setSuccessMessage('Password updated successfully!');
        setShowSuccessModal(true);
        clearFields();
      })
      .catch((error) => {
        console.error('Error updating password:', error);
        setErrorMessage('Error updating password. ');
        setShowErrorModal(true);
        clearFields();
      });
  };

  const handleUpdateEmail = () => {
    const { email } = editableFields;
    const userId = user.id;
    UserService.updateEmail(userId, email)
        .then(() => {
          console.log('Email updated successfully');
          setSuccessMessage('Email updated successfully!');
          setShowSuccessModal(true);
        })
        .catch((error) => {
          console.error('Error updating email:', error);
          setErrorMessage('Error updating email. Email already exists.');
          setShowErrorModal(true);
        });
  };
  
  const handleSaveProfilePictureChange = () => {
    const updatedProfilePicture = selectedImage || user.picture;

    console.log(updatedProfilePicture)
  
    UserService.updateProfilePicture(user.id, updatedProfilePicture)
      .then(() => {
        console.log('User updated successfully');
        setSuccessMessage('Profile updated successfully!');
        setShowSuccessModal(true);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        setErrorMessage('Error updating profile.');
        setShowErrorModal(true);
      });
  }
  

  const handleSaveChanges = () => {
    handleSaveProfilePictureChange();
    const updateData = {
      id: user.id,
      age: editableFields.age,
      name: editableFields.name,
    };
    
  
    const accessToken = localStorage.getItem('access_token');
  
    UserService.update(user.id, updateData)
      .then(() => {
        console.log('User updated successfully');
        setSuccessMessage('Profile updated successfully!');
        setShowSuccessModal(true);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        setErrorMessage('Error updating profile.');
        setShowErrorModal(true);
      });
  };

  const clearFields = () => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      currentPassword: '',
      newPassword: '',
    }));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Profile</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user && (
        <div>
          <div className="tab-container">
            <button
              className={`tab-btn ${activeTab === 'basicInfo' ? 'active' : ''}`}
              onClick={() => handleTabChange('basicInfo')}
            >
              Basic Info
            </button>
            <button
              className={`tab-btn ${activeTab === 'credentials' ? 'active' : ''}`}
              onClick={() => handleTabChange('credentials')}
            >
              Credentials
            </button>
          </div>

          <div className="tab-content info-box">
            {activeTab === 'basicInfo' && (
              <>
                <div className="basic-info-container d-flex">
                  <div className="left-column me-5">
                    <div className="field">
                      <strong>Profile Image:</strong>
                    </div>
                    <div className="edit-field ">
                    {selectedImage ? (
                      <img
                        src={`data:image/png;base64,${selectedImage}`}
                        alt="Profile Preview"
                        className=" img-fluid rounded-circle profilePicture"
                      />
                    ) : (
                      profilePicture ? (
                        <img
                          src={`data:image/png;base64,${profilePicture}`}
                          alt="User Profile"
                          className="profilePicture rounded-circle"
                        />
                      ) : (
                        <img
                          src="/src/Images/profilePicture.png"
                          alt="Default Profile"
                          className="profilePicture rounded-circle"
                        />
                      )
                    )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  <div className="right-column">
                    <div className="field">
                      <strong>Name:</strong> {editableFields.name}
                    </div>
                    <div className="edit-field">
                      <input
                        type="text"
                        value={editableFields.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <strong>Age:</strong> {editableFields.age}
                    </div>
                    <div className="edit-field">
                      <input
                        type="text"
                        value={editableFields.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <strong>Role:</strong> {get_user_role_display()}
                    </div>
                    <div className="edit-field">
                      <input
                        disabled
                        type="text"
                        value={get_user_role_display()}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'credentials' && (
              <>
                <div className="password-email-container">
                  <div className="password-column">
                    <div className="password-fields">
                      <div className="password-field">
                        <label htmlFor="currentPassword">Current Password:</label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={editableFields.currentPassword}
                          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        />
                      </div>

                      <div className="password-field">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                          type="password"
                          id="newPassword"
                          value={editableFields.newPassword || ''}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        />
                      </div>
                    <div className="update-button-container">
                      <button className="update-button" onClick={handleUpdatePassword}>
                        Update Password
                      </button>
                    </div>
                    </div>
                  </div>

                  <div className="email-column">
                    <div className="field">
                      <strong>Email:</strong>
                    </div>
                    <div className="edit-field">
                      <input
                        type="text"
                        value={editableFields.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div className="update-button-container">
                    <button className="update-button" onClick={handleUpdateEmail}>
                      Update Email
                    </button>
                  </div>
                  </div>
                </div>
              </>
            )}
          </div>

            <div className="save-button-container">
            {activeTab === 'basicInfo' && (
              <button className="save-button" onClick={handleSaveChanges}>
                Save changes
              </button>
            )}
          </div>

          {showSuccessModal && (
        <SuccessModal message={successMessage} onClose={() => setShowSuccessModal(false)} />
      )}

      {showErrorModal && (
        <ErrorModal message={errorMessage} onClose={() => setShowErrorModal(false)} />
      )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
