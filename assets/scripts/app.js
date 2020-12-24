//constant global variables
const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 18;
const HEAL_VALUE = 20;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_NORMAL_ATTACK = "NORMAL_ATTACK";
const LOG_EVENT_STRONG_ATTACK = "STRONG ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

function getHealthValues() {
  const userEnteredValue = prompt(
    "Enter the max health value for you & monster",
    "100"
  );

  let parsedHealthValue = parseInt(userEnteredValue);
  //validates the health input by user
  if (isNaN(parsedHealthValue) || parsedHealthValue <= 0) {
    throw { message: "This is not a valid input" };
  }
  return parsedHealthValue;
}

let maxHealth;
try {
  maxHealth = getHealthValues();
} catch (error) {
  console.log(error);
  maxHealth = 100;
  alert(
    "As you entered invalid input, The default value of 100 has been choosen"
  );
}

let currentMonsterHealth = maxHealth;
let currentPlayerHealth = maxHealth;
let hasBonusLife = true;
let battleLog = [];

//console.log(maxHealth);
adjustHealthBars(maxHealth);

//writes log
function writeToLog(eventType, damage, playerHealth, monsterHealth) {
  //log entries object
  const logEntries = {
    attackType: eventType,
    damage: damage,
    finalPlayerHealth: playerHealth,
    finalMonsterHealth: monsterHealth,
  };
  //extra conditional check for log events
  if (
    eventType === LOG_EVENT_NORMAL_ATTACK ||
    eventType === LOG_EVENT_STRONG_ATTACK ||
    eventType === LOG_EVENT_MONSTER_ATTACK ||
    eventType === LOG_EVENT_HEAL ||
    eventType === LOG_EVENT_GAME_OVER
  ) {
    switch (eventType) {
      case LOG_EVENT_NORMAL_ATTACK:
        logEntries.target = "MONSTER";
        break;

      case LOG_EVENT_STRONG_ATTACK:
        logEntries.target = "MONSTER";
        break;

      case LOG_EVENT_MONSTER_ATTACK:
        logEntries.target = "PLAYER";
        break;

      case LOG_EVENT_HEAL:
        logEntries.target = "PLAYER";
        break;

      case LOG_EVENT_GAME_OVER:
        break;

      default:
        logEntries = {};
    }
    // if (eventType === LOG_EVENT_NORMAL_ATTACK) {
    //   logEntries.target = "MONSTER";
    // } else if (eventType === LOG_EVENT_STRONG_ATTACK) {
    //   logEntries.target = "MONSTER";
    // } else if (eventType === LOG_EVENT_MONSTER_ATTACK) {
    //   logEntries.target = "PLAYER";
    // } else if (eventType === LOG_EVENT_HEAL) {
    //   logEntries.target = "PLAYER";
    // } else if (eventType === LOG_EVENT_GAME_OVER) {
    // }

    //pushing entries to battleLog array.
    battleLog.push(logEntries);
  } else {
    return;
  }
}

//resets the game
function reset() {
  currentMonsterHealth = maxHealth;
  currentPlayerHealth = maxHealth;
  resetGame(maxHealth);

  // if(hasBonusLife === false){
  //     hasBonusLife = true;
  //     addBonusLife();
  // }
}

// checks the wining loosing or draw condotions
function conditionCheck() {
  const playerInitialHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentPlayerHealth,
    currentMonsterHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife === true) {
    //bonus life condition
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = playerInitialHealth;
    setPlayerHealth(playerInitialHealth);
    alert("You'd be dead by now but, Bonus life got you covered");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentPlayerHealth,
      currentMonsterHealth
    );
    reset();
  } else if (currentPlayerHealth <= 0) {
    alert("Monster Won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentPlayerHealth,
      currentMonsterHealth
    );
    reset();
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Its a draw!!!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "DRAW",
      currentPlayerHealth,
      currentMonsterHealth
    );
    reset();
  }
}

function attackType(mode) {
  //  condition check using ternary operator
  let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEvent =
    mode === MODE_ATTACK ? LOG_EVENT_NORMAL_ATTACK : LOG_EVENT_STRONG_ATTACK;

  //   if (mode === MODE_ATTACK) {
  //     maxDamage = ATTACK_VALUE;
  //     logEvent = LOG_EVENT_NORMAL_ATTACK;

  //   } else if (mode === MODE_STRONG_ATTACK) {
  //     maxDamage = STRONG_ATTACK_VALUE;
  //     logEvent = LOG_EVENT_STRONG_ATTACK; 
  //   }

  const mosnterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= mosnterDamage;
  writeToLog(
    logEvent,
    mosnterDamage,
    currentPlayerHealth,
    currentMonsterHealth
  );
  conditionCheck();
}

function normalAttackHandler() {
  attackType(MODE_ATTACK);
}

function strongAttcakHandler() {
  attackType(MODE_STRONG_ATTACK);
}

//heal functionality
function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= maxHealth - HEAL_VALUE) {
    alert("you can't heal above your max health.");
    healValue = maxHealth - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_HEAL,
    healValue,
    currentPlayerHealth,
    currentMonsterHealth
  );
  conditionCheck();
}

function battleLogHandler() {
  let i = 0;
  // for of loop to access array values
  for (const logEntries of battleLog) {
    console.log(`#${i} Log Entry`);
    //for in loop to access object values
    for (const key in logEntries) {
      console.log(`${key} => ${logEntries[key]}`);
    }
    i++;
    console.log("____________________________");
  }
}

attackBtn.addEventListener("click", normalAttackHandler);
strongAttackBtn.addEventListener("click", strongAttcakHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", battleLogHandler);
