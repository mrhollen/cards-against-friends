"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Card = /** @class */ (function () {
    function Card(text, isPromptCard) {
        if (text === void 0) { text = ""; }
        if (isPromptCard === void 0) { isPromptCard = false; }
        this.text = text;
        this.isPromptCard = isPromptCard;
    }
    return Card;
}());
exports.Card = Card;
