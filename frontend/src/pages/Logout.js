import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
    const history = useHistory();

    useEffect(() => {
        // Clear user session logic here (e.g., remove token from local storage)
        localStorage.removeItem('token'); // Assuming the token is stored in local storage
        history.push('/login'); // Redirect to login page
    }, [history]);

    return null; // No UI needed, just redirecting
};

export default Logout;
