let card = document.querySelector(".card");
let addCardButton = document.getElementById("addCardButton");
let popUp = document.querySelector(".popUp");
let closePopUp = document.querySelector(".closePopUp");
let yesButton = document.getElementById("yesButton");
let noButton = document.getElementById("noButton");

addCardButton.addEventListener("click", function () {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  let groupCard = document.querySelector(".groupCard");
  let newCard = card.cloneNode(true);
  newCard.style.backgroundColor = "#" + randomColor;
  let textArea = newCard.querySelector("textarea");
  textArea.style.backgroundColor = "#" + randomColor;
  textArea.value = "";
  groupCard.insertBefore(newCard, addCardButton);
  newCard.addEventListener("dblclick", dblclickFunction);
});

// delete card on double click with confirmation popUp
card.addEventListener("dblclick", dblclickFunction);

function dblclickFunction() {
  popUp.style.display = "block";
  let cardToDelete = this;
  yesButton.onclick = function () {
    cardToDelete.remove();
    popUp.style.display = "none";
  };
  noButton.onclick = function () {
    popUp.style.display = "none";
  };
  closePopUp.onclick = function () {
    popUp.style.display = "none";
  };
}

// close popUp when click outside of popUpContent
window.onclick = function (event) {
  if (event.target == popUp) {
    popUp.style.display = "none";
  }
};
