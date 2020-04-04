export class Card {
    text: string;
    isPromptCard: boolean;

    constructor(text: string = "", isPromptCard: boolean = false) { 
        this.text = text;
        this.isPromptCard = isPromptCard;
    }
}