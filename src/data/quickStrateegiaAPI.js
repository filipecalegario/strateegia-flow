const API_URL_NOTIFICATION = "https://api.strateegia.digital/notifications/v1/"

export async function getFlowNotifications(token) {

  const response = await fetch(`${API_URL_NOTIFICATION}flow?size=100&sort=true&page=0`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  return data;
}