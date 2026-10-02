import axios from 'axios';
import { etherpadMiddlewareUrl } from './urls';

const etherpadAPI = axios.create({
  baseURL: etherpadMiddlewareUrl,
  headers: {
    'Content-Type': 'application/json',
  }
});

etherpadAPI.interceptors.request.use((config) => {
  if (!etherpadMiddlewareUrl) {
    throw new Error('NEXT_PUBLIC_ETHERPAD_MIDDLEWARE_URL is required');
  }
  return config;
});

export const createPad = async (padID) => {
  try {
    const response = await etherpadAPI.post('/createPad', null, {
      params: { padID },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating pad:', error);
    throw error;
  }
};

export const getPadText = async (padID) => {
  try {
    const response = await etherpadAPI.get(`/pad/${padID}/text`);
    console.log(response.data);
    return response.data.text;
  } catch (error) {
    console.error('Error getting pad text:', error);
    throw error;
  }
};

export const setPadText = async (padID, text) => {
  try {
    const response = await etherpadAPI.put(`/pad/${padID}/text`, null, {
      params: { text },
    });
    return response.data;
  } catch (error) {
    console.error('Error setting pad text:', error);
    throw error;
  }
};

export const appendPadText = async (padID, text, blankSpace = 'enter') => {

  try {

    const blankSpaceMap = { "enter": "\r", "space": " ", "doubleEnter": "\n" };

    const currentText = await getPadText(padID);
    const newText = currentText + blankSpaceMap[blankSpace] +  text;

    console.log("currentText");
    console.log(currentText);

    const salida = await setPadText(padID, newText);    
    return salida;

  } catch (error) {
    console.error('Error appending pad text:', error);
    throw error;
  }
}
