import { magician } from "./magician.js";
import { monster } from "./monster.js";
import consoleInput from "readline-sync";

console.clear();
const difficulty = consoleInput.keyInSelect(
  [
    "Easy — Здоровье Евстафия: 20",
    "Medium — Здоровье Евстафия: 10",
    "Hard — Здоровье Евстафия: 7",
    "Nightmare — Здоровье Евстафия: 5",
  ],
  "Выберите уровень сложности:",
  { cancel: false }
);
magician.maxHealth = [20, 10, 7, 5][difficulty];

const moveDescription = (move) => {
  return (
    move.name +
    ":\nфизический урон " +
    move.physicalDmg +
    ", магический урон " +
    move.magicDmg +
    ", физическая броня " +
    move.physicArmorPercents +
    ", магическая броня " +
    move.magicArmorPercents +
    ", ходов на восстановление " +
    move.cooldown
  );
};

const calcDamage = (from, to) => {
  return (
    (from.physicalDmg * (100 - to.physicArmorPercents)) / 100 +
    (from.magicDmg * (100 - to.magicArmorPercents)) / 100
  );
};

let round = 1;

while (magician.maxHealth > 0 && monster.maxHealth > 0) {
  // Обновление доступности ходов
  magician.moves.forEach((el) => {
    el.movesToReady = el.movesToReady ? el.movesToReady - 1 : 0;
  });
  monster.moves.forEach((el) => {
    el.movesToReady = el.movesToReady ? el.movesToReady - 1 : 0;
  });
  console.clear();
  console.log(`ROUND ${round}! FIGHT!!!`);
  console.log(
    "\nТекущий уровень здоровья:\n" +
      magician.name +
      ": " +
      magician.maxHealth.toFixed(2) +
      "; " +
      monster.name +
      ": " +
      monster.maxHealth.toFixed(2)
  );
  // Ход монстра
  do {
    monster.move = Math.floor(Math.random() * monster.moves.length);
  } while (monster.moves[monster.move].movesToReady > 0);

  monster.moves[monster.move].movesToReady =
    monster.moves[monster.move].cooldown;

  console.log(
    `Монстр использует ${moveDescription(monster.moves[monster.move])}`
  );
  // Ход игрока
  let availableMoves = [];

  magician.moves.forEach((el, idx) => {
    if (el.movesToReady === 0) availableMoves.push(idx);
  });

  magician.move =
    availableMoves[
      consoleInput.keyInSelect(
        availableMoves.map((el) => moveDescription(magician.moves[el])),
        "Чем ответишь ты?",
        { cancel: false }
      )
    ];

  magician.moves[magician.move].movesToReady =
    magician.moves[magician.move].cooldown;
  // Расчёт повреждений
  magician.maxHealth -= calcDamage(
    monster.moves[monster.move],
    magician.moves[magician.move]
  );
  monster.maxHealth -= calcDamage(
    magician.moves[magician.move],
    monster.moves[monster.move]
  );

  round++;
}

console.clear();

if (magician.maxHealth <= 0 && monster.maxHealth <= 0)
  console.log(`Победила ДРУЖБА!`);
else if (magician.maxHealth <= 0)
  console.log(`Поражение! Монстр ${monster.name} одолел Вас!`);
else console.log(`Победа!!! Маг ${magician.name} - молодец!`);
