import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Store/Auth'
import './Profile.css'
import { BASE_URL } from '../../../config';
import { toast } from 'react-toastify';

function Username() {
    const { user, authorization, refreshUser } = useAuth();

    const [isEditable, setIsEditable] = useState(false);
    const [username, setUsername] = useState(user?.name || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.name) {
            setUsername(user.name);
        }
    }, [user?.name]);

    const handleEditIcon = async () => {
        if (isEditable) {
            // Save changes
            if (username.trim() === user.name) {
                // No changes made
                setIsEditable(false);
                return;
            }

            if (username.trim().length < 3) {
                toast.error("Username must be at least 3 characters long");
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/api/financely/user/username`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: authorization
                    },
                    body: JSON.stringify({ username: username.trim() }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    setIsEditable(false);
                    toast.success("Username changed successfully");
                    await refreshUser();
                } else {
                    toast.error(data.message || "Failed to update username");
                    // Reset to original username on error
                    setUsername(user.name);
                }
            } catch (error) {
                console.error("Error updating username:", error);
                toast.error("Failed to update username. Please try again.");
                // Reset to original username on error
                setUsername(user.name);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Enter edit mode
            setIsEditable(true);
        }
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isEditable) {
            handleEditIcon();
        } else if (e.key === 'Escape' && isEditable) {
            // Cancel editing on Escape key
            setUsername(user.name);
            setIsEditable(false);
        }
    };

    return (
        <div className='profile-username'>
            <input 
                type="text" 
                className={`username-input my-1 ${isEditable ? 'editable-input' : 'readonly-input'}`} 
                readOnly={!isEditable} 
                value={username} 
                onChange={handleUsername}
                onKeyDown={handleKeyPress}
                placeholder="Enter username"
                disabled={isLoading}
            />
            <button 
                onClick={handleEditIcon} 
                className='fs-3 username-btn'
                disabled={isLoading}
                title={isEditable ? 'Save changes' : 'Edit username'}
            >
                {isLoading ? '⏳' : isEditable ? '📁' : '✏️'}
            </button>
        </div>
    );
}

export default Username;