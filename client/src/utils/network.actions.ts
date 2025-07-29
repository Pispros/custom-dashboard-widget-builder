export const postAction = async (endpoint: string, payload: object) => {
  try {
    return fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => {
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        throw response.status;
      }
      return response.json();
    });
  } catch (error) {
    console.error("Error in postAction:", error);
    throw error;
  }
};

export const putAction = async (endpoint: string, payload: object) => {
  try {
    return fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => {
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        throw response.status;
      }
      return response.json();
    });
  } catch (error) {
    console.error("Error in postAction:", error);
    throw error;
  }
};

export const getAction = async (endpoint: string) => {
  try {
    return fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        throw response.status;
      }
      return response.json();
    });
  } catch (error) {
    console.error("Error in getAction:", error);
    throw error;
  }
};

export const deleteAction = async (endpoint: string) => {
  try {
    return fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        throw response.status;
      }
      return response.json();
    });
  } catch (error) {
    console.error("Error in getAction:", error);
    throw error;
  }
};
