import { IGame } from "../types/IGame";

type TGamedData = {
    x: number,
    y: number,
    turns: number,
    field: Record<string, any>[],
    moves: number[],
    endOfGame: number,
    exercise: number | null,
    timeShowField: number | null,
};

type TStatus = "win" | "loss" | "active";

export class CheckIQ implements IGame<TGamedData> {
    private status: TStatus;

    constructor (private gameData: TGamedData) {
        this.status = "active";
    }

    static defaultState (turns: number, timeGaming: number, timeShowField: number, x: number, y: number, min = 1, max = 100) {
        if ((x * y) > max - min + 1) {
            throw new Error("Невозможно сгенерировать столько уникальных чисел в заданном диапазоне");
        }
        const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        const numbersField = numbers.slice(0, x * y);
        const field = numbersField.map((item, idx) => {
            return {
                index: idx,
                value: item,
                isOpen: true,
            }
        });
        const endOfGame = Date.now() + ((timeGaming + timeShowField ) * 1000);
        
        return {
             x,
             y,
             turns,
             field,
             moves: [],
             endOfGame,
             exercise: null,
             timeShowField,
        };
    }

    initGame () {
        this.gameData.exercise = Math.floor(Math.random() * (this.gameData.x * this.gameData.y));
        this.gameData.timeShowField = null;
        this.allIsClose();
    }

    chackGameExpired () {
        return this.gameData.endOfGame < Date.now();
    };

    setGameLoss () {
        this.status = "loss";
    }

    move (index: number) {
        if (this.chackGameExpired()) return this.setGameLoss();
        this.gameData.moves.push(index);
        this.gameData.turns--;
        if(this.gameData.exercise === index){
            this.status = "win";
            return;
        }
        if(this.gameData.turns <= 0) {
            this.status = "loss";
            return;
        }
            this.gameData.field[index].isOpen = true;
    }

    allIsOpen () {
        this.gameData.field.forEach((item) => {
            item.isOpen = true;
        });
        return this.gameData.field;
    }

    allIsClose () {
        this.gameData.field.forEach((item) => {
            item.isOpen = false;
        });
    }

    getData () {
        return this.gameData;
    }

    getStatus () {
        return this.status;
    }

    createReturn () {
        let field = this.gameData.field ? this.gameData.field.filter((item) => item.isOpen) : [];
        if(this.status === "win" || this.status === "loss") {
            field = this.allIsOpen();
        }
        return {
            status: this.status,
            x: this.gameData.x,
            y: this.gameData.y,
            turns: this.gameData.turns,
            moves: this.gameData.moves,
            field,
            endOfGame: this.gameData.endOfGame,
            exercise: this.gameData.exercise !== null ? this.gameData.field.find((item) => item.index === this.gameData.exercise)!.value : null,
            timeShowField: this.gameData.timeShowField,
        }
    }
}