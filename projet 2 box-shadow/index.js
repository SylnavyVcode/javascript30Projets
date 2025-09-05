let colorInput = document.getElementById("color");
let horizontalOffsetInput = document.getElementById("shadowHorizontal");
let verticalOffsetInput = document.getElementById("VerticalShadow");
let blurRadiusInput = document.getElementById("BlurRadius");
let spreadRadiusInput = document.getElementById("spreadRadius");
let insetInput = document.getElementById("inset");
let opacity = document.getElementById("opacity");
let btnSubmit = document.getElementById("btnSubmit");
let contentFinal = document.getElementById("content-final");
let resultatBoxShadow = document.getElementById("resultatBoxShadow");

function Input() {
  let horizontal = horizontalOffsetInput.value;

  let vertical = verticalOffsetInput.value;
  let blur = blurRadiusInput.value;
  let spread = spreadRadiusInput.value;
  let color = colorInput.value;
  let inset = insetInput.checked ? "inset" : "";
  let opacite = opacity.value;

  let boxShadowValue = `${inset} ${horizontal}px ${vertical}px ${blur}px ${spread}px rgba(${hexToRgb(
    color
  )}, ${opacite})`;
  resultatBoxShadow.style.boxShadow = boxShadowValue;
  contentFinal.value = `box-shadow: ${boxShadowValue};`;
  console.log("boxShadowValue>>>>>>", boxShadowValue);

  if (inset) {
  } else {
  }
}

function hexToRgb(color) {
  console.log("color>>>>", color);
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function copieText() {
  contentFinal.select();
  contentFinal.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(contentFinal.value);
  btnSubmit.innerText = "Copié !";
}
Input()
// submitBtn.addEventListener("click", submitInput);
