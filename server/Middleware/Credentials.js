export const getUserInfo = async () => {
  const token = localStorage.getItem("token"); // Or wherever JWT is stored
  const response = await fetch("/api/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch user info");
  return response.json(); // Should contain name, height, weight, gender
};