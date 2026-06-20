import inquirer from 'inquirer';
import { input } from "@inquirer/prompts";
import cards from './data/major-arcana.json' with { type: "json" };
import { yesOrNoMessages, header } from './utilities/messages.js';

const menu = [
    {
        type: 'select', 
        name: 'option', 
        message: '\x1b[1;92mSelect which spread you\'d like to use to know your destiny:\x1b[0m',
        choices: [ 
            { 
                name: '\x1b[92mYes or No\x1b[0m',
                value: "yesOrNo" 
            }, 
            {
                name: '\x1b[92mOne Card\x1b[0m',
                value: "oneCard"
            }
        ]
    }
]

console.clear();
console.log('\x1b[1;92m' + header + '\x1b[0m');

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
    return cards[Math.floor(Math.random() * cards.length)];
}

async function oneCardSpread() {
    const question = await askYourQuestion();
    const card = await pickACard();

    console.clear();
    console.log("\x1b[92mThe answer to your question, \"" + question + "\" is....\x1b[0m");

    setTimeout(() => {
        const isReversed = Math.floor(Math.random() * 2) > 0 ? true : false; 
        const meaning = isReversed ? card.interpretations.standard.reversedMeaning : card.interpretations.standard.meaning;

        console.log("You selected " + card.name + "!");
        console.log(meaning);
    }, 2000)
}

async function yayOrNay() {
    const question = await askYourQuestion();
    const card = await pickACard();
    console.clear();
    console.log("\x1b[92mThe answer to your question, \"" + question + "\" is....\x1b[0m");

    setTimeout(() => {
        console.log('\x1b[92m' + yesOrNoMessages[card.interpretations.yesOrNo.toLowerCase()] + '\x1b[0m');
        console.log("\n\n(You received " + card.name + ")");
    }, 2000)
}