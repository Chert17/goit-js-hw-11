import { getImg } from './js/fetch-img';
import Notiflix from 'notiflix';
import { fetchPictures } from './js/fetch-img';

const refs = {
  form: document.querySelector('#search-form'),
  imgCard: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  formInput: document.querySelector('#search-form input'),
};

refs.form.addEventListener('submit', onRenderImg);

async function onRenderImg(e) {
  e.preventDefault();
  cleanerImg();

  try {
    const inputValue = refs.formInput.value.trim();

    if (inputValue !== '') {
      const img = await fetchPictures(inputValue, pageNumber);
      if (!img.hits.length) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          { timeout: 1000 }
        );
      }
      renderCardImg(img);
    }
  } catch (error) {}
}

function omLoadMore() {
  pageNumber++;
  const inputValue = refs.formInput.value.trim();

  getImg(inputValue, pageNumber)
    .then(img => {
      renderCardImg(img);
      refs.loadMoreBtn.style = `display: block;`;
    })

    .catch(img => {
      if (img.hits === []) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          { timeout: 1000 }
        );
      }
    });
}

function renderCardImg(img) {
  const markupCards = img.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"  />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  return refs.imgCard.insertAdjacentHTML('beforeend', markupCards);
}

function cleanerImg() {
  refs.imgCard.innerHTML = '';
  pageNumber = 1;
}
