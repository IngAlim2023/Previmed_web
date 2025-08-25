const URL_BACK = import.meta.env.VITE_URL_BACK;

interface DataLogin{
    numero_documento:string,
    password:string
}

export const login = async (data:DataLogin) => {
  try {
    const auth = await fetch(`${URL_BACK}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials:"include",
      body: JSON.stringify(data)
    });
    return auth
  } catch (e) {}
};
