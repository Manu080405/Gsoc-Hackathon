export const sendCrisis = async (data) => {
  const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/analyze", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};