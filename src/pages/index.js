import './index.css';

import { Card } from '../scripts/components/Card.js';
import { FormValidator } from '../scripts/components/FormValidator.js';
import PopupWithForm from '../scripts/components/PopupWithForm.js';
import PopupDell from '../scripts/components/PopupDell.js';
import PopupWithImage from '../scripts/components/PopupWithImage.js';
import Section from '../scripts/components/Section.js';
import UserInfo from '../scripts/components/UserInfo.js';
import Api from '../scripts/components/Api.js';
import { selectors } from '../scripts/utils/selectors.js';
import {
  user,
  nameInput,
  jobInput,
  editButton,
  addButton,
  popupEditFormSelector,
  popupAddFormSelector,
  popupAvatarFormSelector,
  profileImageContainer,
  submitButtons
} from "../scripts/utils/constants.js";


const api = new Api('https://nomoreparties.co/v1/cohort-28');
const userId = api.getUserInfo().then((data) => {
  return data._id;
});

const userInfo = new UserInfo({nameSelector: user.nameInfo, jobSelector: user.jobInfo, avatarSelector: user.avatar});
const popupWithImage = new PopupWithImage('.popup-image');
const popupAdd = new PopupWithForm('.popup-add', addFormSubmitHandler);
const popupEdit = new PopupWithForm('.popup-edit', editFormSubmitHandler);
const popupAvatar = new PopupWithForm('.popup-avatar', avatarFormSubmitHandler);
const popupDelete = new PopupDell('.popup-delete', deleteFormSubmitHandler);
const popupEditFormValidator = new FormValidator(selectors, popupEditFormSelector);
const popupAddFormValidator = new FormValidator(selectors, popupAddFormSelector);
const popupAvatarFormValidator = new FormValidator(selectors, popupAvatarFormSelector);

function addFormSubmitHandler( {title, link} ) {
  submitButtons.addCard.textContent = 'Сохранение...';
  api
    .addCard({ name: title, link: link })
    .then((item) => {
      const cardsSection = new Section({ renderer: createCard }, ".elements");
      cardsSection.addItem(item);
    })
    .finally(() => {
      submitButtons.addCard.textContent = "Создать";
      popupAdd.close();
    });
}

function editFormSubmitHandler({name, about}) {
  submitButtons.editProfile.textContent = 'Сохранение...';
  api
    .editProfile({ name, about })
    .then((data) => {
      userInfo.setUserInfo(data);
    })
    .finally(() => {
      submitButtons.editProfile.textContent = "Сохранить";
    });
}

function avatarFormSubmitHandler({avatar}) {
  submitButtons.avatar.textContent = 'Сохранение...';
  api
    .editAvatar({ avatar })
    .then((res) => {
      userInfo.setUserInfo(res);
    })
    .finally(() => {
      submitButtons.avatar.textContent = "Сохранить";
    });
}

function deleteFormSubmitHandler(card, cardId) {
  submitButtons.deleteCard.textContent = 'Удаление....';
  api
    .deleteCard(cardId)
    .then(() => {
      card.remove();
    })
    .finally(() => {
      submitButtons.deleteCard.textContent = "Да";
    });
}

function createCard(item) {
  return new Card(
    item,
    "#element-template",
    onCardClick,
    userId,
    onRemoveButtonClick,
    onLikeButtonClick
  ).generateCard();
}

function onCardClick(evt) {
  const popupImageSrc = evt.target.getAttribute("src");
  const popupImageAlt = evt.target.getAttribute("alt");

  popupWithImage.open( {src: popupImageSrc, alt: popupImageAlt} );
}

function onRemoveButtonClick(card, cardId) {
  popupDelete.open(card, cardId);
}

function onLikeButtonClick(likeButton, cardId, likeCounter) {
  if (likeButton.classList.contains('element__like-button_active')) {
    api
      .removeLike(cardId)
      .then((res) => {
        likeCounter.textContent = res.likes.length;
      })
      .then(() => {
        likeButton.classList.toggle("element__like-button_active");
      });
  } else {
    api
      .addLike(cardId)
      .then((res) => {
        likeCounter.textContent = res.likes.length;
      })
      .then(() => {
        likeButton.classList.toggle("element__like-button_active");
      });
  }
}

function editProfile() {
  popupEdit.open();
  nameInput.value = userInfo.getUserInfo().name;
  jobInput.value = userInfo.getUserInfo().about;
}

function addElement() {
  popupAdd.open();
}

function editAvatar() {
  popupAvatar.open();
}

api.getUserInfo().then(data => {
  userInfo.setUserInfo(data);
});

api.getInitialCards().then((data) => {
  const cardsSection = new Section(
    {
      items: data,
      renderer: createCard,
    },
    ".elements"
  );
  cardsSection.renderItems();
});



editButton.addEventListener('click', editProfile);
addButton.addEventListener('click', addElement);
profileImageContainer.addEventListener('click', editAvatar);

popupEditFormValidator.enableValidation();
popupAddFormValidator.enableValidation();
popupAvatarFormValidator.enableValidation();
popupAdd.setEventListeners();
popupEdit.setEventListeners();
popupWithImage.setEventListeners();
popupDelete.setEventListeners();
popupAvatar.setEventListeners();