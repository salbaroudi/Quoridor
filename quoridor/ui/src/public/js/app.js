export let gameState = 0;

/*
Shortens our constuctor inputs, and makes initialization easier.
Input: Integers: 1,2,3,4 only. Report error otherwise.
*/
export function playerinit(num) {
    let tuple = 0;
    switch(num) {
        case 1:
            tuple = [1,"blue",4,"0.4"];
            break;
        case 2:
            tuple = [2,"orange",4,"6.2"];
            break;
        case 3:
            tuple = [3,"green", 4,"2.0"];
            break;
        case 4:
            tuple = [4,"purple",4,"4.6"];
            break;
        default:
            console.error("Error: Player Number not recognized.");
    }
    return tuple;
}
