const URL_BACK = import.meta.env.VITE_URL_BACK;

interface DataLogin{
    numero_documento:string,
    password:string
}

export const login = async (data:DataLogin) => {
  try {
    const url = `${URL_BACK}/login`.replace(/([^:]\/)\/+/g, "$1");
    const auth = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials:"include",
      body: JSON.stringify(data)
    });
    return auth
  } catch (e) {}
};
