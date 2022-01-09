import consoleInput from "readline-sync";

let target = "";
let userInput = "";
let tries = 7;

const difficulty =
  consoleInput.keyInSelect(
    [
      "Easy — 3-значное число",
      "Medium — 4-значное число",
      "Hard — 5-значное число",
      "Nightmare — 6-значное число",
    ],
    "Выберите уровень сложности:",
    { cancel: false }
  ) + 3;

while (target.length < difficulty) {
  let digit = Math.floor(Math.random() * 10).toString();
  if (target.includes(digit)) continue;
  target += digit;
}

while (tries > 0) {
  let bulls = 0;
  let cows = 0;

  userInput = consoleInput.question(
    `
Попыток осталось: ${tries}.
Введите число из ${difficulty} разных цифр: `
  );

  if (
    !userInput.match(/^\d+/) ||
    userInput.length !== difficulty ||
    userInput.length !== new Set(userInput).size
  )
    continue;

  for (let i = 0; i < difficulty; i++) {
    if (userInput[i] === target[i]) bulls++;
    else if (target.includes(userInput[i])) cows++;
  }

  console.log("Быки: ", bulls, "Коровы: ", cows);

  if (bulls === difficulty) break;

  tries--;
}

if (userInput === target) {
  console.log("\nПобеда!!! Загаданное число:", target);
} else {
  console.log("\nПоражение!!! Попытки исчерпаны! Загаданное число:", target);
}
