class Player {
    public name: string;
    public position: string;
    public unlocked: boolean;


    constructor(name: string, position: string, unlocked: boolean) {
        this.name = name;
        this.position = position;
        this.unlocked = unlocked;
    }

    static fromJSON(playerJSON: any): Player {
        return new Player(playerJSON.name, playerJSON.position, playerJSON.unlocked);
    }
}

export default Player;
