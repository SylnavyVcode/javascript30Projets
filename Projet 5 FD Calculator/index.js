// // Sélection des éléments du DOM
// let btn = document.querySelectorAll(".btn");
// let display = document.getElementById("display");
// let result = document.getElementById("resultat");
// let clear = document.getElementById("clear");
// let equals = document.getElementById("equals");
// let operator = document.querySelectorAll(".operator");
// let negate = document.getElementById("negate");
// let backspace = document.getElementById("backspace");
// let percent = document.getElementById("percent");
// let reciprocal = document.getElementById("reciprocal");
// let mod = document.getElementById("mod");
// let enterParenthese = document.getElementById("enterParenthese");
// let outerParenthese = document.getElementById("outerParenthese");

// const listOperator = ["+", "-", "*", "/"];
// // Ajout des écouteurs d'événements
// btn.forEach((button) =>
//   button.addEventListener("click", () => appendValue(button))
// );

// equals.addEventListener("click", () => calculate());

// if (operator)
//   operator.forEach((op) =>
//     op.addEventListener("click", () => addOperatorToDisplay(op))
//   );

// function appendValue(button) {
//   const value = button.dataset.value || button.innerText;
//   display.value += value;
// }

// function addOperatorToDisplay(btnOperator) {
//   const operateur = btnOperator.innerText;
//   const lastValueDisplay = display.value.slice(-1);
//   const displayLast = display.value.slice(0, display.value.length - 1);

//   const respInclude = listOperator.filter(
//     (element) => lastValueDisplay == element
//   );

//   if (respInclude.length > 0) {
//     display.value = displayLast + operateur;
//   } else {
//     if (display.value.slice(-1) == operateur) {
//       display.value = display.value;
//     } else display.value += operateur;
//   }
// }

// function calculate() {
//   console.log("entrer dans la méthode");

//   result.value = eval(display.value);
//   console.log(">>>>>", result.value);
// }

// ============================
// SÉLECTION DES ÉLÉMENTS DOM
// ============================
let btn = document.querySelectorAll(".btn");
let display = document.getElementById("display");
let result = document.getElementById("resultat");
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

let btnNoSecond = document.querySelectorAll(".nosecond");
let btnYesSecond = document.querySelectorAll(".yessecond");

let btnSecond = document.querySelector(".second");
let statutBtnSecond = false;

btnSecond.addEventListener("click", () => {
  console.log(">>>>>>>>", statutBtnSecond);

  statutBtnSecond = !statutBtnSecond;
  console.log(">>>>>>>>", statutBtnSecond);
  if (!statutBtnSecond) {
    btnNoSecond.forEach((el) => (el.style.display = "none"));
    btnYesSecond.forEach((el) => (el.style.display = "block"));
  } else {
    btnNoSecond.forEach((el) => (el.style.display = "block"));
    btnYesSecond.forEach((el) => (el.style.display = "none"));
  }
});

// ============================
// VARIABLES D'ÉTAT GLOBALES
// ============================
let currentExpression = ""; // Expression complète affichée (ex: "2+(3×4)-5")
let parenthesesCount = 0; // Compteur de parenthèses ouvertes non fermées
let shouldResetScreen = false; // Flag pour réinitialiser après un résultat
let hasDecimalInCurrentNumber = false; // Vérifie si le nombre en cours a un point décimal
let lastWasOperator = false; // Vérifie si le dernier caractère était un opérateur
let calculationHistory = []; // Historique des calculs

// ============================
// INITIALISATION DES ÉVÉNEMENTS
// ============================
function initializeEventListeners() {
  // Boutons numériques et point décimal
  btn.forEach((button) => {
    button.addEventListener("click", () => handleButtonClick(button));
  });

  // Parenthèses
  if (enterParenthese)
    enterParenthese.addEventListener("click", () => addParenthesis("("));
  if (outerParenthese)
    outerParenthese.addEventListener("click", () => addParenthesis(")"));

  // Opérations principales
  if (clear) clear.addEventListener("click", clearAll);
  if (equals) equals.addEventListener("click", calculateResult);

  // Opérateurs arithmétiques
  if (operator) {
    operator.forEach((op) => {
      op.addEventListener("click", () => addOperator(op));
    });
  }

  // Fonctions spéciales
  if (negate) negate.addEventListener("click", toggleSign);
  if (backspace) backspace.addEventListener("click", deleteLastCharacter);
  if (percent) percent.addEventListener("click", convertToPercentage);
  if (reciprocal) reciprocal.addEventListener("click", calculateReciprocal);
  if (mod) mod.addEventListener("click", calculateModulus);

  // Clavier
  window.addEventListener("keydown", handleKeyboardInput);
}

// ============================
// GESTION DES BOUTONS ET ENTRÉES
// ============================

/**
 * AMÉLIORATION MAJEURE 1: Gestion unifiée des clics de boutons
 * Centralise toute la logique d'entrée pour éviter les incohérences
 */
function handleButtonClick(button) {
  const value = button.dataset.value || button.innerText.trim();

  console.log("Button clicked:", value, "Type:", getInputType(value));

  // Réinitialiser après un calcul si on commence par un nombre
  if (shouldResetScreen && isNumber(value)) {
    resetCalculator();
  }

  const inputType = getInputType(value);

  switch (inputType) {
    case "number":
      addNumber(value);
      break;
    case "decimal":
      addDecimalPoint();
      break;
    case "operator":
      addOperatorFromValue(value);
      break;
    default:
      console.warn("Type d'entrée non reconnu:", value);
  }

  updateDisplay();
}

/**
 * AMÉLIORATION MAJEURE 2: Détection intelligente du type d'entrée
 */
function getInputType(value) {
  if (/^[0-9]$/.test(value)) return "number";
  if (value === ".") return "decimal";
  if (/^[+\-×÷*/]$/.test(value)) return "operator";
  return "unknown";
}

function isNumber(value) {
  return /^[0-9]$/.test(value);
}

function isOperator(char) {
  return /^[+\-×÷*/]$/.test(char);
}

// ============================
// GESTION DES NOMBRES ET DÉCIMALES
// ============================

/**
 * AMÉLIORATION 3: Ajout de nombres avec gestion d'état
 */
function addNumber(digit) {
  if (currentExpression === "0" && digit !== "0") {
    currentExpression = digit;
  } else if (currentExpression === "0" && digit === "0") {
    // Ne rien faire, rester à "0"
    return;
  } else {
    currentExpression += digit;
  }

  lastWasOperator = false;
  shouldResetScreen = false;
}

/**
 * AMÉLIORATION 4: Gestion intelligente du point décimal
 * Vérifie qu'on n'a pas déjà un point dans le nombre actuel
 */
function addDecimalPoint() {
  // Trouver le dernier nombre dans l'expression
  const lastNumberMatch = currentExpression.match(/([\d.]+)$/);

  // Si pas de nombre ou si le dernier nombre n'a pas de point décimal
  if (!lastNumberMatch || !lastNumberMatch[0].includes(".")) {
    if (
      currentExpression === "" ||
      lastWasOperator ||
      currentExpression.endsWith("(")
    ) {
      currentExpression += "0.";
    } else {
      currentExpression += ".";
    }
    lastWasOperator = false;
    hasDecimalInCurrentNumber = true;
  }
}

// ============================
// GESTION DES OPÉRATEURS
// ============================

/**
 * AMÉLIORATION MAJEURE 5: Gestion complète des opérateurs
 * Affiche TOUT dans le display, gère les opérateurs consécutifs
 */
function addOperator(operatorButton) {
  const operatorValue =
    operatorButton.dataset.value || operatorButton.innerText.trim();
  addOperatorFromValue(operatorValue);
  updateDisplay();
}

function addOperatorFromValue(operatorValue) {
  console.log("Adding operator:", operatorValue);

  // Si l'expression est vide et c'est un moins, permettre (pour les nombres négatifs)
  if (currentExpression === "" && operatorValue === "-") {
    currentExpression = "-";
    lastWasOperator = true;
    return;
  }

  // Si l'expression est vide et ce n'est pas un moins, ne rien faire
  if (currentExpression === "") {
    return;
  }

  const lastChar = currentExpression.slice(-1);

  // Si le dernier caractère est un opérateur
  if (isOperator(lastChar)) {
    if (operatorValue === "-" && lastChar !== "-") {
      // Permettre le signe moins après un autre opérateur (pour les négatifs)
      currentExpression += operatorValue;
    } else if (operatorValue !== lastChar) {
      // Remplacer l'opérateur précédent
      currentExpression = currentExpression.slice(0, -1) + operatorValue;
    }
    // Si c'est le même opérateur, ne rien faire
  } else {
    // Ajouter l'opérateur normalement
    currentExpression += operatorValue;
  }

  lastWasOperator = true;
  hasDecimalInCurrentNumber = false;
}

// ============================
// GESTION DES PARENTHÈSES
// ============================

/**
 * AMÉLIORATION MAJEURE 6: Gestion avancée des parenthèses multiples
 * Gère automatiquement l'ouverture et fermeture intelligente
 */
function addParenthesis(parenthesis) {
  if (parenthesis === "(") {
    addOpeningParenthesis();
  } else if (parenthesis === ")") {
    addClosingParenthesis();
  }
  updateDisplay();
}

function addOpeningParenthesis() {
  const lastChar = currentExpression.slice(-1);

  // Si l'expression est vide ou se termine par un opérateur ou une parenthèse ouvrante
  if (currentExpression === "" || isOperator(lastChar) || lastChar === "(") {
    currentExpression += "(";
  } else {
    // Ajouter une multiplication implicite avant la parenthèse
    currentExpression += "×(";
  }

  parenthesesCount++;
  lastWasOperator = false;
  hasDecimalInCurrentNumber = false;
}

function addClosingParenthesis() {
  // Ne fermer que s'il y a des parenthèses ouvertes
  if (parenthesesCount > 0) {
    const lastChar = currentExpression.slice(-1);

    // Ne pas permettre de fermer après un opérateur
    if (!isOperator(lastChar) && lastChar !== "(") {
      currentExpression += ")";
      parenthesesCount--;
      lastWasOperator = false;
    }
  }
}

// ============================
// CALCUL ET ÉVALUATION
// ============================

/**
 * AMÉLIORATION MAJEURE 7: Moteur de calcul avec priorités et parenthèses
 * Gère les priorités d'opérations et les parenthèses multiples imbriquées
 */
function calculateResult() {
  if (!currentExpression || currentExpression === "0") {
    if (result) result.value = "0";
    return;
  }

  try {
    console.log("Expression à calculer:", currentExpression);

    // Créer une copie de l'expression pour l'évaluation
    let expressionToEvaluate = currentExpression;

    // Fermer automatiquement toutes les parenthèses ouvertes
    while (parenthesesCount > 0) {
      expressionToEvaluate += ")";
      parenthesesCount--;
    }

    // Nettoyer l'expression (enlever les espaces, gérer les opérateurs en fin)
    expressionToEvaluate = cleanExpression(expressionToEvaluate);

    console.log("Expression nettoyée:", expressionToEvaluate);

    // Évaluer avec le moteur de calcul personnalisé
    const calculatedResult =
      evaluateExpressionWithPriorities(expressionToEvaluate);

    if (
      calculatedResult === null ||
      isNaN(calculatedResult) ||
      !isFinite(calculatedResult)
    ) {
      throw new Error("Résultat invalide");
    }

    const roundedResult = roundToSignificantDigits(calculatedResult, 12);

    // Afficher le résultat dans le champ result
    if (result) {
      result.value = formatResult(roundedResult);
      updateResultColor(roundedResult);
    }

    // Sauvegarder dans l'historique
    calculationHistory.push({
      expression: currentExpression,
      result: roundedResult,
      timestamp: new Date(),
    });

    // Préparer pour la prochaine opération
    currentExpression = roundedResult.toString();
    shouldResetScreen = true;
    lastWasOperator = false;
    parenthesesCount = 0;

    console.log("Résultat calculé:", roundedResult);
  } catch (error) {
    console.error("Erreur de calcul:", error);
    if (result) {
      result.value = "Erreur";
      result.style.color = "red";
    }
    alert("Erreur dans l'expression mathématique: " + error.message);
  }
}

/**
 * AMÉLIORATION MAJEURE 8: Moteur de calcul personnalisé avec priorités
 * Remplace eval() par un parser personnalisé qui respecte les priorités
 */
function evaluateExpressionWithPriorities(expression) {
  // Convertir les symboles d'affichage en symboles JavaScript
  expression = expression.replace(/×/g, "*").replace(/÷/g, "/");

  console.log("Expression convertie:", expression);

  // Vérifier les divisions par zéro
  if (expression.includes("/0")) {
    throw new Error("Division par zéro détectée");
  }

  // Utiliser un parser d'expression sécurisé
  return parseAndEvaluate(expression);
}

/**
 * AMÉLIORATION MAJEURE 9: Parser d'expression mathématique complet
 * Implémente la logique de priorité des opérations et des parenthèses
 */
function parseAndEvaluate(expression) {
  // Tokeniser l'expression
  const tokens = tokenize(expression);
  console.log("Tokens:", tokens);

  // Convertir en notation postfixe (Reverse Polish Notation)
  const postfix = infixToPostfix(tokens);
  console.log("Postfix:", postfix);

  // Évaluer l'expression en notation postfixe
  return evaluatePostfix(postfix);
}

function tokenize(expression) {
  const tokens = [];
  let currentNumber = "";

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (/[0-9.]/.test(char)) {
      currentNumber += char;
    } else {
      if (currentNumber) {
        tokens.push({ type: "number", value: parseFloat(currentNumber) });
        currentNumber = "";
      }

      if (/[+\-*/()]/.test(char)) {
        tokens.push({ type: "operator", value: char });
      }
    }
  }

  if (currentNumber) {
    tokens.push({ type: "number", value: parseFloat(currentNumber) });
  }

  return tokens;
}

function infixToPostfix(tokens) {
  const output = [];
  const operators = [];

  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const isLeftAssociative = { "+": true, "-": true, "*": true, "/": true };

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
    } else if (token.value === "(") {
      operators.push(token);
    } else if (token.value === ")") {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].value !== "("
      ) {
        output.push(operators.pop());
      }
      operators.pop(); // Enlever la parenthèse ouvrante
    } else if (token.type === "operator") {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].value !== "(" &&
        (precedence[operators[operators.length - 1].value] >
          precedence[token.value] ||
          (precedence[operators[operators.length - 1].value] ===
            precedence[token.value] &&
            isLeftAssociative[token.value]))
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  }

  while (operators.length > 0) {
    output.push(operators.pop());
  }

  return output;
}

function evaluatePostfix(postfix) {
  const stack = [];

  for (const token of postfix) {
    if (token.type === "number") {
      stack.push(token.value);
    } else if (token.type === "operator") {
      const b = stack.pop();
      const a = stack.pop();

      let result;
      switch (token.value) {
        case "+":
          result = a + b;
          break;
        case "-":
          result = a - b;
          break;
        case "*":
          result = a * b;
          break;
        case "/":
          if (b === 0) throw new Error("Division par zéro");
          result = a / b;
          break;
        default:
          throw new Error("Opérateur inconnu: " + token.value);
      }

      stack.push(result);
    }
  }

  return stack[0];
}

// ============================
// FONCTIONS UTILITAIRES
// ============================

function cleanExpression(expression) {
  // Enlever les espaces
  expression = expression.replace(/\s/g, "");

  // Enlever les opérateurs en fin d'expression
  expression = expression.replace(/[+\-×÷*/]+$/, "");

  return expression;
}

function roundToSignificantDigits(number, digits) {
  if (number === 0) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(number)));
  const factor = Math.pow(10, digits - magnitude - 1);
  return Math.round(number * factor) / factor;
}

function formatResult(number) {
  // Formater le résultat pour l'affichage
  if (Math.abs(number) >= 1e12 || (Math.abs(number) < 1e-6 && number !== 0)) {
    return number.toExponential(6);
  }
  return number.toString();
}

function updateResultColor(value) {
  if (!result) return;

  if (value > 0) {
    result.style.color = "green";
  } else if (value < 0) {
    result.style.color = "red";
  } else {
    result.style.color = "#333";
  }
}

// ============================
// FONCTIONS DE GESTION D'AFFICHAGE
// ============================

function updateDisplay() {
  if (display) {
    display.value = currentExpression || "0";
  }
  console.log("Display mis à jour:", currentExpression);
}

function clearAll() {
  currentExpression = "";
  parenthesesCount = 0;
  shouldResetScreen = false;
  hasDecimalInCurrentNumber = false;
  lastWasOperator = false;

  if (display) display.value = "0";
  if (result) {
    result.value = "0";
    result.style.color = "";
  }

  console.log("Calculatrice réinitialisée");
}

function resetCalculator() {
  currentExpression = "";
  parenthesesCount = 0;
  shouldResetScreen = false;
  hasDecimalInCurrentNumber = false;
  lastWasOperator = false;
}

// ============================
// FONCTIONS SPÉCIALES
// ============================

function deleteLastCharacter() {
  if (currentExpression.length === 0) return;

  const lastChar = currentExpression.slice(-1);

  // Ajuster les compteurs selon le caractère supprimé
  if (lastChar === "(") {
    parenthesesCount--;
  } else if (lastChar === ")") {
    parenthesesCount++;
  } else if (lastChar === ".") {
    hasDecimalInCurrentNumber = false;
  }

  currentExpression = currentExpression.slice(0, -1);

  if (currentExpression === "") {
    currentExpression = "0";
    if (display) display.value = "0";
  } else {
    updateDisplay();
  }

  // Mettre à jour les flags
  const newLastChar = currentExpression.slice(-1);
  lastWasOperator = isOperator(newLastChar);
}

function toggleSign() {
  // Fonctionnalité pour inverser le signe du dernier nombre
  const lastNumberMatch = currentExpression.match(/([\d.]+)$/);
  if (lastNumberMatch) {
    const lastNumber = lastNumberMatch[1];
    const negatedNumber = (-parseFloat(lastNumber)).toString();
    currentExpression = currentExpression.replace(/([\d.]+)$/, negatedNumber);
    updateDisplay();
  }
}

function convertToPercentage() {
  const lastNumberMatch = currentExpression.match(/([\d.]+)$/);
  if (lastNumberMatch) {
    const lastNumber = parseFloat(lastNumberMatch[1]);
    const percentValue = (lastNumber / 100).toString();
    currentExpression = currentExpression.replace(/([\d.]+)$/, percentValue);
    updateDisplay();
  }
}

function calculateReciprocal() {
  const lastNumberMatch = currentExpression.match(/([\d.]+)$/);
  if (lastNumberMatch) {
    const lastNumber = parseFloat(lastNumberMatch[1]);
    if (lastNumber !== 0) {
      const reciprocalValue = (1 / lastNumber).toString();
      currentExpression = currentExpression.replace(
        /([\d.]+)$/,
        reciprocalValue
      );
      updateDisplay();
    } else {
      alert("Erreur : Division par zéro !");
    }
  }
}

function calculateModulus() {
  // Implémentation du modulo entre deux nombres
  if (currentExpression.includes("%")) return;

  const numbers = currentExpression.split(/[+\-×÷*/]/);
  if (numbers.length >= 2) {
    const lastNumber = parseFloat(numbers[numbers.length - 1]);
    const secondLastNumber = parseFloat(numbers[numbers.length - 2]);

    if (!isNaN(lastNumber) && !isNaN(secondLastNumber)) {
      const modResult = secondLastNumber % lastNumber;
      if (result) {
        result.value = modResult.toString();
        updateResultColor(modResult);
      }
    }
  }
}

// ============================
// GESTION DU CLAVIER
// ============================

function handleKeyboardInput(e) {
  console.log("Touche pressée:", e.key);

  // Empêcher le comportement par défaut pour certaines touches
  if (
    ["Enter", "=", "Escape", "Delete"].includes(e.key) ||
    /^[0-9+\-*/.()]$/.test(e.key)
  ) {
    e.preventDefault();
  }

  if (e.key >= "0" && e.key <= "9") {
    addNumber(e.key);
    updateDisplay();
  } else if (e.key === ".") {
    addDecimalPoint();
    updateDisplay();
  } else if (e.key === "=" || e.key === "Enter") {
    calculateResult();
  } else if (e.key === "Escape" || e.key === "Delete") {
    clearAll();
  } else if (e.key === "Backspace") {
    deleteLastCharacter();
  } else if (["+", "-", "*", "/"].includes(e.key)) {
    let op = e.key;
    if (op === "*") op = "×";
    if (op === "/") op = "÷";
    addOperatorFromValue(op);
    updateDisplay();
  } else if (e.key === "(") {
    addParenthesis("(");
  } else if (e.key === ")") {
    addParenthesis(")");
  }
}

// ============================
// INITIALISATION
// ============================

// Initialiser la calculatrice au chargement
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  clearAll();
  console.log("Calculatrice initialisée");
});
