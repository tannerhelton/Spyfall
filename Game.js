class Game {
    constructor(argId) {
        this.id = argId;
    }

    getId() {
        return this.id;
    }

    getPlayers() {
        return this.players;
    }

    addPlayer(name) {
        this.players.push(name);
    }

    removePlayer(name) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].equals(name)) {
                this.players.splice(i, 1);
            }
        }
    }
}

export default Game;