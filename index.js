import inquirer from 'inquirer';
import { input } from "@inquirer/prompts";
import majorArcana from './data/major-arcana.json' with { type: "json" };
import cups from './data/cups.json' with { type: "json" };
import pentacles from './data/pentacles.json' with { type: "json" };
import swords from './data/swords.json' with { type: "json" };
import wands from './data/wands.json' with { type: "json" };
import { yesOrNoMessages, header } from './utilities/messages.js';

const colorCode = "\x1b[92m";
const colorCodeBold = "\x1b[1;92m";
const colorCodeReset = "\x1b[0m";

const deck = [];
deck.push(...majorArcana, ...cups, ...pentacles, ...swords, ...wands);

const menu = [
    {
        type: 'select', 
        name: 'option', 
        message: colorCodeBold + 'Select which spread you\'d like to use to know your destiny:' + colorCodeReset,
        choices: [ 
            { 
                name: colorCode + 'Yes or No\x1b[0m',
                value: "yesOrNo" 
            }, 
            {
                name: colorCode + 'One Card\x1b[0m',
                value: "oneCard"
            }
        ]
    }
]

console.clear();
console.log(colorCodeBold + header + colorCodeReset);

inquirer.prompt(menu).then(answer => {
    const choice = answer.option;
    discoverYourDestiny(choice);
});

async function discoverYourDestiny(userChoice) {
    switch (userChoice) {
        case "yesOrNo": 
            yayOrNay();
            return;
        case "oneCard": 
            oneCardSpread();
            return;
    }
}

async function askYourQuestion() {
    const userQuestion = await input({message: "What is your question?"});
    return userQuestion; 
}

async function pickACard() {
    return deck[Math.floor(Math.random() * deck.length)];
}

async function oneCardSpread() {
    const question = await askYourQuestion();
    const card = await pickACard();

    console.clear();
    console.log(colorCodeBold + "The answer to your question, \"" + question + "\" is...." + colorCodeReset);

    setTimeout(() => {
        const isReversed = Math.floor(Math.random() * 2) > 0 ? true : false; 
        const meaning = isReversed ? card.interpretations.standard.reversedMeaning : card.interpretations.standard.meaning;

        console.log(colorCodeBold + "You selected " + card.name + "!" + colorCodeReset);
        console.log(colorCode + meaning + colorCodeReset);
    }, 2000)
}

async function yayOrNay() {
    const question = await askYourQuestion();
    const card = await pickACard();
    console.clear();
    console.log(colorCode + "The answer to your question, \"" + question + "\" is...." + colorCodeReset);

    setTimeout(() => {
        console.log(colorCode + yesOrNoMessages[card.interpretations.yesOrNo.toLowerCase()] + colorCodeReset);
        console.log(colorCode + "\n\n(You received " + card.name + ")" + colorCodeReset);
    }, 2000)
}