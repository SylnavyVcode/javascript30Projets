let btn = document.querySelectorAll(".btn");
let display = document.getElementById("display");
let clear = document.getElementById("clear");
let equals = document.getElementById("equals");
let operator = document.querySelectorAll(".operator");
let negate = document.getElementById("negate");
let backspace = document.getElementById("backspace");
let percent = document.getElementById("percent");
let reciprocal = document.getElementById("reciprocal");
let mod = document.getElementById("mod");
let enterParenthese = document.getElementById("enterParenthese");
let outerParenthese = document.getElementById("outerParenthese");
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let shouldResetScreen = false;
let hasDecimal = false;

btn.forEach((button) =>
  button.addEventListener("click", () => appendValue(button))
);
clear.addEventListener("click", clearDisplay);
equals.addEventListener("click", evaluate);
operator.forEach((op) => op.addEventListener("click", () => setOperation(op)));
negate.addEventListener("click", negateNumber);
backspace.addEventListener("click", backspaceNumber);
percent.addEventListener("click", percentage);
reciprocal.addEventListener("click", reciprocalNumber);
mod.addEventListener("click", modNumber);
window.addEventListener("keydown", handleKeyboardInput);

// Ajouter les valeurs
function appendValue(button) {
  const value = button.dataset.value;
  // Gestion du point décimal
  if (value === "." && hasDecimal) return;
  if (value === "." && !hasDecimal) hasDecimal = true;

  // Réinitialisation de l'écran si nécessaire
  if (display.value === "0" || shouldResetScreen) {
    resetScreen();
    shouldResetScreen = false;
  }

  // Concaténation directe
  display.value === "0" && value != "."
    ? (display.value = value)
    : (display.value += value);

  console.log("display >>>>>>>>>>", display.value);
}

// réinitialiser l'écran
function resetScreen() {
  console.log("resetScreen called");

  display.value = "0";
  shouldResetScreen = false;
  hasDecimal = false;
}

// nétoyer l'écran
function clearDisplay() {
  display.value = "0";
  firstOperand = null;
  secondOperand = null;
  currentOperator = null;
  shouldResetScreen = false;
  hasDecimal = false;
}

// les Evaluations
function evaluate() {
  if (currentOperator === null || shouldResetScreen) return;
  if (currentOperator === "÷" && display.value === "0") {
    alert("You can't divide by 0!");
    return;
  }
  secondOperand = display.value;
  display.value = roundResult(
    operate(currentOperator, firstOperand, secondOperand)
  );
  currentOperator = null;
}

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9) appendValue({ dataset: { value: e.key } });
  if (e.key === ".") appendValue({ dataset: { value: e.key } });
  if (e.key === "=" || e.key === "Enter") evaluate();
  if (e.key === "Backspace") backspaceNumber();
  if (e.key === "Escape") clearDisplay();
  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    let op = e.key;
    if (op === "*") op = "×";
    if (op === "/") op = "÷";
    setOperation({ dataset: { value: op } });
  }
}

// operate
function operate(operator, a, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return a / b;
    default:
      return null;
  }
}

function roundResult(number) {
  return Math.round(number * 100000) / 100000;
}
function setOperation(button) {
  console.log("setOperation called with button:", button);
  console.log("setOperation called with button:", button.dataset.value);

  if (currentOperator !== null) evaluate();
  firstOperand = display.value;
  currentOperator = button.dataset.value;
  console.log("Current Operator:", currentOperator);

  shouldResetScreen = true;
}
function negateNumber() {
  display.value = display.value * -1;
}
function backspaceNumber() {
  display.value = display.value.slice(0, -1);
  if (display.value === "") display.value = "0";
}

function percentage() {
  display.value = display.value / 100;
}
function reciprocalNumber() {
  display.value = 1 / display.value;
}
function modNumber() {
  display.value = (display.value / 100) * firstOperand;
}
