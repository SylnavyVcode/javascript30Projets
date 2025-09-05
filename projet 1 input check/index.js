let submitBtn = document.getElementById("btnSubmit");
let usernameInput = document.getElementById("username");
let form = document.getElementById("form");
let sectionForm = document.getElementById("sectionForm");
let label = document.querySelector("label");

function submitInput() {
  // e.preventDefault();
  // console.log("event>>>>>>>", e);

  let username = usernameInput.value.trim();

  if (username) {
    usernameInput.style.border = "0.2em solid black";
    label.style.color = "green";
    label.innerText = `Bonjour, ${username}!`;
  } else {
    usernameInput.style.border = "0.2em solid red";
    label.style.color = "red";
    usernameInput.classList.add("shake");
    setTimeout(() => {
      usernameInput.classList.remove("shake");
    }, 500);
    label.innerText = "Veuillez entrer un nom d'utilisateur.";
  }
  console.log("username>>>>>>>", username);
  usernameInput.value = "";
}

// submitBtn.addEventListener("click", submitInput);
