class Session {
    constructor(code, playerOne ,playerTwo, classes, matrix, score, turn, init, timer){
        this.code = code
        this.playerOne = playerOne
        this.playerTwo = playerTwo
        this.score = { p1: 0, p2: 0}
        this.matrix = [0,0,0,0,0,0,0,0,0]
        this.classes = {
            'casillero1':'',
            'casillero2':'',
            'casillero3':'',
            'casillero4':'',
            'casillero5':'',
            'casillero6':'',
            'casillero7':'',
            'casillero8':'',
            'casillero9':''
    
        }
        this.turn = Math.floor(Math.random() * (1 - 0 + 0) + 0)
        this.init = 1
        setInterval(() => this.timer =  this.init++ ,  1000)
        
    }

    setPlayerTwo(player){
        this.playerTwo = player;
    }

    restoreSession(){
        this.matrix = [0,0,0,0,0,0,0,0,0]
        this.classes = {
            'casillero1':'',
            'casillero2':'',
            'casillero3':'',
            'casillero4':'',
            'casillero5':'',
            'casillero6':'',
            'casillero7':'',
            'casillero8':'',
            'casillero9':''
    
        }
    }

    restartTimer(){
        this.init = 1
    }
}

export {
    Session
}