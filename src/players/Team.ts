import Player from "./Player";

class Team {
    public coach: string;
    public name: string;
    public shortName: string;
    public players: Player[];

    constructor(coach: string, name: string, players: Player[]) {
        this.coach = coach;
        this.name = name;
        this.shortName = this.name[0] + this.name.split(" ")[1];
        this.players = players;
    }

    static fromJSON(teamJSON: any): Team {
        const players = [];
        for (let i = 0; i < teamJSON.players.length; i++) {
            players.push(Player.fromJSON(teamJSON.players[i]));
        }
        return new Team(teamJSON.coach, teamJSON.name, players);
    }
}

export default Team;
