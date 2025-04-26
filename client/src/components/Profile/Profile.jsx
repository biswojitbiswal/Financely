import React, { useRef, useState, useEffect } from 'react'
import './Profile.css'
import { Image, Button } from 'react-bootstrap';
import User from '/User.jpg'
import { BASE_URL } from '../../../config'
import { useAuth } from '../../Store/Auth'
import { toast } from 'react-toastify';
import Username from './Username';
import PasswordReset from './PasswordReset';

function Profile() {
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState(User);
  

  const fileInputRef = useRef(null);

  const { authorization, user } = useAuth();
  // console.log(user)

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFile = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));

      try {
        const formData = new FormData();
        formData.append('profile', selectedFile);

        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]); // Should print: profile File { ... }
        }

        const response = await fetch(`${BASE_URL}/api/financely/user/profile/image`, {
          method: "PATCH",
          headers: {
            Authorization: authorization,
          },
          body: formData,
        })

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          toast.success('Profile Image Updated');
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Error uploading image");
      }
    }
  }

  useEffect(() => {
    return () => {
      if (preview && preview !== User) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div id='profile'>
      <div className="profile-page">

        <div className="profile-box" >
          <div className="profile-circle">
            <div className="inner-circle">
              <Image src={user.profile || preview} className='profile-img' style={{ cursor: 'pointer', width: "100%" }} onClick={handleImageClick} loading='lazy' roundedCircle />

              <input onChange={handleFile} type="file" id='profile_img' className='d-none' ref={fileInputRef} />
            </div>
          </div>

          <div className="profile-options">
            <Username />
            <PasswordReset />
          </div>
          
          
        </div>
      </div>
    </div>
  )
}

export default Profile
