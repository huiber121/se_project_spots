import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import "./index.css";
import pencile from "../images/pencile.svg";
import plus from "../images/plus.svg";
import close from "../images/close.svg";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "2921140f-2f5b-422b-8a24-1d43ce58fd90",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  //destrucure the second item in the callback of the '.then' method
  .then(([cards, userInfo]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.prepend(cardElement);
    });

    //handle the user's information
    //set the src of the avatar image
    //set the text content of the profile name and description
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatarImage.src = userInfo.avatar;
  })
  .catch((err) => {
    console.error(err);
  });

//store profile css features from html elments to variables
const profile = document.querySelector(".profile");
const profileCol = profile.querySelector(".profile__column");
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileCardModalBtn = document.querySelector(".profile__add-btn");
const profileAvatarImage = profile.querySelector("#avatar-image");
const profileAvatarBtn = document.querySelector(".profile__avatar-btn");

//modal - avatar
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.forms["avatar-form"];
const avatarModalCloseBtn = avatarModal.querySelector("#close-image");
avatarModalCloseBtn.src = close;
const avatarInput = avatarModal.querySelector("#add-avatar-link-input");

//store card css features from html elments to variables
const cardModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["card-form"];
const cardModalSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardCaptionInput = cardModal.querySelector("#add-card-caption-input");

//modal - card preview
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector("#modal-image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

//modal - edit profile
const editModal = document.querySelector("#edit-modal"); //use id instead of class
const editModalCloseBtn = editModal.querySelector("#close-image");
editModalCloseBtn.src = close;
const editForm = document.forms["profile-form"];
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//modal - delete card
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.forms["delete-form"];
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

const pencileImage = profileCol.querySelector("#pencile-image");
pencileImage.src = pencile;

const plusImage = profile.querySelector("#plus-image");
plusImage.src = plus;

const closeImage = cardModalCloseBtn.querySelector("#close-image");
closeImage.src = close;

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

//store the defualt container to varibales before adding cards
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  //copy the general content of the template
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector("#card-image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");


  cardNameEl.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  //=====================open image preview form===============
  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
  });

  cardDeleteBtn.addEventListener("click", () =>
    handleRemoveCard(cardElement, data._id)
  );

  cardLikeBtn.addEventListener("click", (evt) =>
    handleLikeButton(evt, data._id)
  );

  return cardElement;
}

//=======================modal functions=============================
function closeModalOnEscape(evt) {
  if (evt.key === "Escape") {
    modals.forEach(closeModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.activeElement.blur();
  document.removeEventListener("keydown", closeModalOnEscape);
}

//======================= handlers =================================== //TODO set button text for all handlers
// The form submission handler. Note that its name
// starts with a verb and concisely describes what it does.
//global variable to store the submit button
let submitButton = null
function handleProfileFormSubmit(evt) {
  // Prevent default browser behavior, see explanation below.
  evt.preventDefault();

  //rest API call to update user info
  //change text content to "saving...""
  submitButton = evt.submitter;
  //helper function to change the text content of the button
  setButtonText(submitButton, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      // Get the values of each form field from the value property
      // of the corresponding input element.
      // Then insert these new values into the textContent property of the
      // corresponding profile elements.
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      //Close the modal.
      closeModal(editModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      //change text content back to "Save"
      setButtonText(submitButton, false);
    });
}

//use for card delete - remove the card from the DOM
let selectedCard = null;
//use for card delete - remove the card from server
let selectedCardId = null;

function handleRemoveCard(cardEl, id) {
  selectedCard = cardEl; // Assign the card element to selectedCard
  selectedCardId = id; // Assign the card's ID to selectedCardId
  openModal(deleteModal); // open the delete confirmation modal
}

function handleDeleteCancel(evt) {
  closeModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  //change text content to "saving...""
  submitButton = evt.submitter;
  //helper function to change the text content of the button
  setButtonText(submitButton, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId) // pass the ID the the api function and remove it from the server
    .then(() => {
      // remove the card from the DOM
      if (selectedCard) {
        selectedCard.remove();
      }
      // close the modal
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Delete", "Deleting...");
  });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  //change text content to "saving...""
  submitButton = evt.submitter;
  //helper function to change the text content of the button
  setButtonText(submitButton, true);
  api.addCard({ name: cardCaptionInput.value, link: cardLinkInput.value })
  .then((data) => {
    const cardEl = getCardElement(data);
    cardsList.prepend(cardEl);
    evt.target.reset();
    disableButton(cardModalSubmitBtn, settings);
    closeModal(cardModal);
  })
  .catch(console.error)
  .finally(() => {
    //change text content back to "Save"
    setButtonText(submitButton, false);
  });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  //To do add api call to update the avatar
  //change text content to "saving...""
  submitButton = evt.submitter;
  //helper function to change the text content of the button
  setButtonText(submitButton, true);
  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleLikeButton(evt, id) {
  //get the card like status
  const isLiked = evt.target.classList.contains("card__like-btn_liked");
  //call the api to change the like status
  api
    .changeLike(id, isLiked)
    .then(() => {
      //toggle the like status
      evt.target.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
}

//=============submit forms for save/edit/delete====================
// Connect the handler to the form, so it will watch for the submit event.
editForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
//use "click" responses to button type "button" to cancel the delete
//note: do not set preventDefault() to the click event otherwsie
//it will override the form submission
deleteForm.addEventListener("click", handleDeleteCancel);
deleteForm.addEventListener("submit", handleDeleteSubmit);

//====================open forms===================================
// open/close with new post button
profileCardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

//open with avatar edit button
profileAvatarBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

// open with edit profile button
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

//====================close forms===================================
avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

enableValidation(settings);
