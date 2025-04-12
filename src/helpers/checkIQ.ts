import { IGame } from "../types/IGame";

type TGamedData = {
    
};

type TStatus = "win" | "loss" | "active";

export class checkIQ implements IGame<TGamedData> {
    private status: TStatus;

    constructor (private gameData: TGamedData) {
        this.status = "active";
    }

    static defaultState () {
        return {
             
        }
    }

    initGame () {}

    move () {}

    getData () {
        return this.gameData;
    }

    getStatus () {
        return this.status;
    }

    createReturn () {
        return {
            
            status: this.status,
            
        }
    }

}