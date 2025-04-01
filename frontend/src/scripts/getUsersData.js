const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = async () => {
    try {
        const response = await fetch(`${apiUrl}/api/users/getUsersData`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Errore nel recupero dei dati utente');
        }
    } catch (error) {
        console.error('Errore nella richiesta dei dati utente:', error);
        throw error;
    }
};

export default getUserData;
