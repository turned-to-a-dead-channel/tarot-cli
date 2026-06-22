import inquirer from 'inquirer';
import { input } from "@inquirer/prompts";
import majorArcana from './data/major-arcana.json' with { type: "json" };
import cups from './data/cups.json' with { type: "json" };
import pentacles from './data/pentacles.json' with { type: "json" };
import swords from './data/swords.json' with { type: "json" };
import wands from './data/wands.json' with { type: "json" };
import { yesOrNoMessages, header } from './utilities/messages.js';
import readline from "node:readline";
import { processingMessages } from './utilities/processing-messages.js';

const colorCode = "\x1b[92m";
const colorCodeBold = "\x1b[1;92m";
const colorCodeReset = "\x1b[0m";

const deck = [];
deck.push(...majorArcana, ...cups, ...pentacles, ...swords, ...wands);

async function mainMenu() {
    const menu = [
        {
            type: 'select', 
            name: 'option', 
            message: colorCodeBold + 'Select which spread you\'d like to use to know your destiny:' + colorCodeReset,
            choices: [ 
                { 
                    name: colorCode + 'Yes or No' + colorCodeReset,
                    value: "yesOrNo" 
                }, 
                {
                    name: colorCode + 'One Card' + colorCodeReset,
                    value: "oneCard"
                },
                {
                    name: colorCode + "I no longer wish to see the future. (Quit)" + colorCodeReset,
                    value: "quit"
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
}

async function discoverYourDestiny(userChoice) {
    switch (userChoice) {
        case "yesOrNo": 
            yayOrNay();
            return;
        case "oneCard": 
            oneCardSpread();
            return;
        case "quit": 
            console.clear();
            process.exit();
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

        mainMenu();
    }, 2000)
}

async function yayOrNay() {
    const question = await askYourQuestion();
    const card = await pickACard();
    const theFuture = yesOrNoMessages[card.interpretations.yesOrNo.toLowerCase()].trim();
    const terminalWidth = process.stdout.columns;
    let messageToPad = theFuture.split('\n');
    let pad;

    console.log("messagetoPad: " + messageToPad);
    
    messageToPad = messageToPad.map((line, index) => {
        pad = Math.floor((terminalWidth - line.length)/2);
        return line = ' '.repeat(pad) + line;        
    });

    messageToPad = messageToPad.join("\n");

    console.clear();
    console.log(colorCode + "The answer to your question, \"" + colorCode + colorCodeBold + question + colorCodeReset + colorCode + "\" is...." + colorCodeReset);

    let count = 0;

    const pondering = setInterval(() => {
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);

        let processingMessage = processingMessages[Math.floor(Math.random() * processingMessages.length)];
        process.stdout.write(processingMessage);
    }, 1000)

    setTimeout(async () => {
        console.clear();
        console.log(colorCode + messageToPad + colorCodeReset);
        console.log(colorCode + "\n\n(You received " + card.name + ")" + colorCodeReset);
        clearInterval(pondering);
        
        await input ({ message: "Press any key to return to the menu..."});
        mainMenu();
    }, 4000)
}

mainMenu();