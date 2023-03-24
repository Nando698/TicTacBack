const randomCode = () => {
    return Math.random().toString(36).slice(2)
}


let checkSubset = (parentArray, subsetArray) => {
    return subsetArray.every((el) => {
        return parentArray.includes(el)
    })
}


let example = [1,2,2,0,2,2,1,2,2]
let winScores = [
    [1,2,3],
    [1,4,7],
    [1,5,9],
    [2,5,8],
    [3,5,7],
    [3,6,9],
    [4,5,6],
    [7,8,9],
]

const arrayReducer = (array, player) => {
    return array.map((x, i) => {
        if(x == player){
            return i+1}else
            return 0 }).filter(x => x!= 0)
}


const checkWin = (array, player) => {
    let sub = arrayReducer(array,player)
    try{
    if(checkSubset(sub, winScores[0])){return true}
    if(checkSubset(sub, winScores[1])){return true}
    if(checkSubset(sub, winScores[2])){return true}
    if(checkSubset(sub, winScores[3])){return true}
    if(checkSubset(sub, winScores[4])){return true}
    if(checkSubset(sub, winScores[5])){return true}
    if(checkSubset(sub, winScores[6])){return true}
    if(checkSubset(sub, winScores[7])){return true}
    if(checkSubset(sub, winScores[8])){return true}
    }catch(e){
        return false
    }
   }
  
 


export {
    randomCode,
    checkWin
}