import React, {useEffect} from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Store/Auth';

function Signout() {
  const {loggedOutUser} = useAuth();

  useEffect(() => {
    loggedOutUser();
  }, [loggedOutUser]);

  return <Navigate to="/" />;
}

export default Signout
