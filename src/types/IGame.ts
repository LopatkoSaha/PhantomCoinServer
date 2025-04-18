export interface IGame <T extends Record<string, any>>{
    initGame: (...args: any[]) => void;
    move: (moveData: any) => void;
    getData: () => T;
    createReturn: (...args: any[]) => Record<string, any>;
}