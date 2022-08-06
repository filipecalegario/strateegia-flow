const API_URL_NOTIFICATION = "https://api.strateegia.digital/notifications/v1/"
const API_URL_PROJECTS = 'https://api.strateegia.digital/projects/v1/';

export async function getFlowNotifications(token) {

  const response = await fetch(`${API_URL_NOTIFICATION}flow?size=5000&sort=true&page=0`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  return data;
}

export async function addCommentAgreement(token, commentId) {
  const response = await fetch(`${API_URL_PROJECTS}question/comment/${commentId}/agreement`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // body: JSON.stringify({
    //     title: title
    // })
  });

  const data = await response.json();

  return data;
}

export async function deleteCommentAgreement(token, commentId) {
  const response = await fetch(`${API_URL_PROJECTS}question/comment/${commentId}/agreement`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // body: JSON.stringify({
    //     title: title
    // })
  });

  const data = await response.json();

  return data;
}

export async function markProjectNotificationsAsRead(token, notificationId){
  const response = await fetch(`${API_URL_NOTIFICATION}flow/${notificationId}/read/project`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // body: JSON.stringify({
    //     title: title
    // })
  });

  const data = await response.json();

  return data;
}
