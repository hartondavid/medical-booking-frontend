export const askClinicAssistant = async (message) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const response = await fetch(`${apiUrl}/api/assistant/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to get assistant response');
    }

    return data.data;
};
