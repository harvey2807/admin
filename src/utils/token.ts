export const saveToken = async (token: string) => {
  try {
    // localStorage.setItem nhận vào key và value đều là string
    localStorage.setItem("userToken", token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const loadTokenFromStorage = async (): Promise<string | null> => {
  try {
    return localStorage.getItem("userToken");
  } catch (error) {
    console.error("Error loading token:", error);
    return null;
  }
};

export const removeTokenFromStorage = async () => {
  try {
    localStorage.removeItem("userToken");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};