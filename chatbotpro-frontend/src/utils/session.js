import { v4 as uuidv4 } from 'uuid';

export const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem('chatbotpro_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('chatbotpro_session_id', sessionId);
  }
  return sessionId;
};

export const resetSessionId = () => {
  const sessionId = uuidv4();
  localStorage.setItem('chatbotpro_session_id', sessionId);
  return sessionId;
};
