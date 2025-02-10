import { enableValidation, settings, resetValidation } from "../scripts/validation.js";
import "./index.css";
import avatar from "../images/avatar.jpg";
import pencile from "../images/pencile.svg";
import plus from "../images/plus.svg";
import close from "../images/close.svg";
import image1 from "../images/1-photo-by-moritz-feldmann-from-pexels.jpg";
import image2 from "../images/2-photo-by-ceiline-from-pexels.jpg";
import image3 from "../images/3-photo-by-tubanur-dogan-from-pexels.jpg";
import image4 from "../images/4-photo-by-maurice-laschet-from-pexels.jpg";
import image5 from "../images/5-photo-by-van-anh-nguyen-from-pexels.jpg";
import image6 from "../images/6-photo-by-moritz-feldmann-from-pexels.jpg";
import image7 from "../images/7-photo-by-griffin-wooldridge-from-pexels.jpg";

const initialCards = [
  {
    name: "Val Thorens",
    link: image1,
  },
  {
    name: "Restaurant terrace",
    link: image2,
  },
  {
    name: "An outdoor cafe",
    link: image3,
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: image4,
  },
  {
    name: "Tunnel with morning light",
    link: image5,
  },
  {
    name: "Mountain house",
    link: image6,
  },
  {
    name: "Golden gate bridge",
    link: image7,
  },
];

//store profile css features from html elments to variables
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileCardModalBtn = document.querySelector(".profile__add-btn");

//store card css features from html elments to variables
const cardModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["card-form"];
const cardModalSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardCaptionInput = cardModal.querySelector("#add-card-caption-input");

//select to preview modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector("#modal-image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

//modal edit profile
const editModal = document.querySelector("#edit-modal"); //use id instead of class
const editModalCloseBtn = editModal.querySelector("#close-image");
editModalCloseBtn.src = close;
const editForm = document.forms["profile-form"];
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const profile = document.querySelector(".profile");
const profileCol = profile.querySelector(".profile__column");

const avatarImage = profile.querySelector("#avatar-image");
avatarImage.src = avatar;

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

  cardDeleteBtn.addEventListener("click", handleRemoveCard);

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
  });

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  return cardElement;
}

//forEach can add second parameter: index and third parameter: array
initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});

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

// The form submission handler. Note that its name
// starts with a verb and concisely describes what it does.
function handleProfileFormSubmit(evt) {
  // Prevent default browser behavior, see explanation below.
  evt.preventDefault();

  // Get the values of each form field from the value property
  // of the corresponding input element.
  // Then insert these new values into the textContent property of the
  // corresponding profile elements.
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;

  //Close the modal.
  closeModal(editModal);
}

function handleRemoveCard(evt) {
  evt.preventDefault();
  const card = evt.target.closest(".card");
  if (card) {
    card.remove();
  }
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    link: cardLinkInput.value,
    name: cardCaptionInput.value,
  };
  const cardEl = getCardElement(inputValues);
  cardsList.prepend(cardEl);
  evt.target.reset();
  disableButton(cardModalSubmitBtn, settings);
  closeModal(cardModal);
}

// open/close with edit profile button
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

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

// Connect the handler to the form, so it will watch for the submit event.
editForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

// open/close with new post button
profileCardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});


enableValidation(settings);