import axios from 'axios';
const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '31629181-f048b32387df13005b2e6ea0c',
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  },
});

export async function fetchPictures(q, page) {
  const { data } = await instance.get('/', {
    params: {
      q,
      page,
    },
  });
  return data;
}
