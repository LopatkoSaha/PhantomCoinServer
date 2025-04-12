import { IGame } from "../types/IGame";

type TFieldData = {
    cellId: number,
    hasBomb: boolean,
    isOpen: boolean,
    hasFlag: boolean,
    bombsAround: number,
    cellsAround: number[],
}[];

type TStatus = "win" | "loss" | "active";


export class Minesweeper implements IGame<TFieldData> {
    private status: TStatus;

    constructor(private fieldData: TFieldData) {
        this.status = "active";
    }

    static defaultGameState (x: number, y: number, bombCount: number) {
        const length = x * y; 
        const fieldData = Array.from({ length }, (_, idx) => ({
            cellId: idx,
            isOpen: false,
            hasFlag: false,
            hasBomb: false,
            bombsAround: 0,
            cellsAround: [],
        }));
        return {
            status: "active",
            x,
            y,
            bombCount,
            fieldData,
            bombs: [],
            lastMove: null,
            isFirstClick: false,
        }
    }

    initGame(x: number, y: number, bombCount: number, clickId: number) {
        this.setCellsAround(x, y);
        this.plantBombs(bombCount, clickId);
        this.setBombsAround();
    }

    private setBombsAround () {
        this.fieldData.forEach((item, idx) => {
            let bombsAround = 0;
            for (let i = 0; i < item.cellsAround.length; i++) {
                if (this.fieldData[item.cellsAround[i]].hasBomb) {
                    bombsAround++;
                }
                this.fieldData[idx].bombsAround = bombsAround;
            }
        })
    }

    setCellsAround(x: number, y: number) {
        this.fieldData.forEach((cell, i) => {
            if (i === 0) {
                cell.cellsAround = [1, x, x + 1];
                return;
            }
            if (i === x - 1) {
                cell.cellsAround = [x - 2, 2 * x - 1, 2 * x - 2];
                return;
            }
            if (i === x * (y - 1)) {
                cell.cellsAround = [x * (y - 2), x * (y - 2) + 1, x * (y - 1) + 1];
                return;
            }
            if (i === x * y - 1) {
                cell.cellsAround = [x * y - 2, x * (y - 1) - 1, x * (y - 1) - 2];
                return;
            }
            if (i < x) {
                cell.cellsAround = [i - 1, i + 1, i + x, i + x - 1, i + x + 1];
                return;
            }
            if (i > x * (y - 1)) {
                cell.cellsAround = [i - 1, i + 1, i - x, i - x - 1, i - x + 1];
                return;
            }
            if (i % x === 0) {
                cell.cellsAround = [i - x, i - x + 1, i + 1, i + x, i + x + 1];
                return;
            }
            if (i % x === x - 1) {
                cell.cellsAround = [i - x - 1, i - x, i - 1, i + x - 1, i + x];
                return;
            }
            cell.cellsAround = [i - x - 1, i - x, i - x + 1, i - 1, i + 1, i + x - 1, i + x, i + x + 1];
        })
    }

    plantBombs(bombCount: number, clickId: number) {
        let bombsLeft = bombCount;
        while(bombsLeft > 0) {
            const candidate = Math.floor(Math.random() * this.fieldData.length);
            if(candidate === clickId || this.fieldData[candidate].hasBomb) {
                continue;
            }
            this.fieldData[candidate].hasBomb = true;
            bombsLeft--;
        }
    }

    openCells(clickId: number) {
        this.fieldData[clickId].isOpen = true;
        if (this.fieldData[clickId].bombsAround === 0) {
            this.fieldData[clickId].cellsAround.forEach((cellId) => {
                if (!this.fieldData[cellId].isOpen) {
                    this.openCells(cellId);
                }
            });
        }
    }

    getOpenCellsCount() {
        return this.fieldData.filter(cell => cell.isOpen).length;
    }

    getBombs() {
        return this.fieldData.filter(cell => cell.hasBomb).map(cell => cell.cellId);
    }

    setFlag(clickId: number) {
        this.fieldData[clickId].hasFlag = !this.fieldData[clickId].hasFlag;
    }

    move(clickId: number) {
        if (this.fieldData[clickId].hasBomb) {
            this.status = 'loss';
            return;
        }
        this.openCells(clickId);
        if (this.getOpenCellsCount() + this.getBombs().length === this.fieldData.length) {
            this.status = 'win';
        }
    }

    getData () {
        return this.fieldData;
    }

    createReturn(x: number, y: number, clickId: number | null) {
        return {
            status: this.status,
            x,
            y,
            bombs: this.status === "loss" || this.status === "win" ? this.getBombs() : [],
            lastMove: clickId,
            fieldData: this.fieldData.map((cell) => ({
                cellId: cell.cellId,
                isOpen: cell.isOpen,
                hasFlag: cell.hasFlag,
                bombsAround: cell.isOpen ? cell.bombsAround : 0,
            })),
        }
    }

    createStateDb(x: number, y: number, bombCount: number, clickId: number | null, isFirstClick: boolean) {
        return {
            status: this.status,
            x,
            y,
            bombCount,
            lastMove: clickId,
            isFirstClick,
            fieldData: this.getData(),
        }
    }
}