export const baseUrl = 'http://localhost:5000/api';

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, message };
  }

  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    let message = 'An error occured.';

    if (data?.message) {
      message = data.message;
    }

    return { error: true, message };
  }

  return data;
};

export const messagePostRequest = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body, // Directly pass the FormData object
    });

    const data = await response.json();

    if (!response.ok) {
      let message = data?.message || 'An error occurred';
      return { error: true, message };
    }

    return data; // Success
  } catch (error) {
    return { error: true, message: error.message || 'Network error' };
  }
};
