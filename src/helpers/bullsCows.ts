import { IGame } from "../types/IGame";

const colors = {
        1: "red",
        2: "green",
        3: "blue",
        4: "yellow",
        5: "white",
        6: "brown",
        7: "orange",
        8: "gray",
};

type TGamedData = {
    quest: string[],
    moves: {
        bulls: number,
        cows: number,
        moveData: string[],
    }[],
    turns: number,
    colors: Record<string, string>;
};

type TStatus = "win" | "loss" | "active";

export class BullsCows implements IGame<TGamedData> {
    private status: TStatus;

    constructor (private gameData: TGamedData) {
        this.status = "active";
    }

    static defaultState (length: number, turns: number) {
        return {
            turns,
            moves: [],
            quest: [],
            colorsCount: length,
            colors, 
        }
    }

    initGame (length: number, turns: number) {
        this.generateQuest(length);
        this.gameData.turns = turns;
        this.gameData.moves = [];
    }

    private generateQuest (length: number) {
        this.gameData.quest = Object.keys(colors).sort(() => Math.random() - 0.5).slice(0, length);
    }

    calculateBulls (moveData: string[]) {
        let bulls = 0;
        for (let i = 0; i < this.gameData.quest.length; i++) {
            if (this.gameData.quest[i] === moveData[i]) bulls++;
        }
        return bulls;
    }

    calculateCows (moveData: string[]) {
        let cows = 0;
        for (let i = 0; i < moveData.length; i++) {
            if (this.gameData.quest.includes(moveData[i])) cows++;
        }
        return cows;
    }

    move (moveData: string[]) {
        this.gameData.turns = this.gameData.turns < 0 ? 0 : this.gameData.turns - 1;
        const bulls = this.calculateBulls(moveData);
        const cows = this.calculateCows(moveData);
        this.gameData.moves.push({
            bulls,
            cows,
            moveData
        });
        if (bulls === this.gameData.quest.length) {
            this.status = "win";
            return;
        }
        if (this.gameData.turns === 0) {
            this.status = "loss";
        }
    }

    getData () {
        return this.gameData;
    }

    getStatus () {
        return this.status;
    }

    createReturn () {
        return {
            ...this.gameData,
            status: this.status,
            quest: this.status === "win" || this.status === "loss" ? this.gameData.quest : [],
        }
    }
}