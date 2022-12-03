import { fetchPictures } from './js/fetch-img';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  imgCard: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  formInput: document.querySelector('#search-form input'),
};

refs.form.addEventListener('submit', onRenderImg);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

refs.loadMoreBtn.style = 'display: none;';
let pageNumber = 1;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function onRenderImg(e) {
  e.preventDefault();
  cleanerImg();

  const inputValue = refs.formInput.value.trim();

  if (inputValue !== '') {
    const img = await fetchPictures(inputValue, pageNumber);

    if (!img.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { timeout: 1000 }
      );
      return;
    }
    if (img.hits.length < 40) {
      refs.loadMoreBtn.style = 'display: none;';
      notifyEndSearchImg();
      notifyTotalImg(img);
      renderCardImg(img);
      return;
    }

    renderCardImg(img);

    lightbox.refresh();

    refs.loadMoreBtn.style = 'display: block;';
    Notiflix.Notify.success(`Hooray! We found ${img.totalHits} images.`, {
      timeout: 1000,
    });
  }
}

async function onLoadMore() {
  pageNumber += 1;
  const inputValue = refs.formInput.value.trim();
  const img = await fetchPictures(inputValue, pageNumber);

  if (img.hits.length < 40) {
    refs.loadMoreBtn.style = 'display: none;';
    notifyEndSearchImg();
    notifyTotalImg(img);
    renderCardImg(img);
    return;
  }
  renderCardImg(img);

  lightbox.refresh();
}

function renderCardImg(img) {
  const markupCard = img.hits
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
<a class="info-link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"  />
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
  </div></a>
</div>`
    )
    .join('');
  return refs.imgCard.insertAdjacentHTML('beforeend', markupCard);
}

function cleanerImg() {
  refs.imgCard.innerHTML = '';
  pageNumber = 1;
  refs.loadMoreBtn.style = 'display: none;';
}

function notifyTotalImg(img) {
  Notiflix.Notify.success(`Hooray! We found ${img.totalHits} images.`, {
    timeout: 1000,
  });
}

function notifyEndSearchImg() {
  Notiflix.Notify.info(
    `We're sorry, but you've reached the end of search results.`,
    { timeout: 1000 }
  );
}
