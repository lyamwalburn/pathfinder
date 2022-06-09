import { NODE_STATUS } from "./main.js";
import { BOARD_WIDTH,BOARD_HEIGHT } from "./main.js";
const FILL_WALL_ANIMATION_STEP = 15
const REMOVE_WALL_ANIMATION_STEP = 10

export function generateMaze(grid,startPos,targetPos){
    fillGridWithWalls(grid,{x:0,y:0}) 
    setTimeout(() => {
        makeMazePath(grid,{x:0,y:0})
        ensurePathToNode(grid[startPos.y][startPos.x],grid)
        ensurePathToNode(grid[targetPos.y][targetPos.x],grid)
    }, BOARD_WIDTH  * FILL_WALL_ANIMATION_STEP + 5);    
}

function makeMazePath(grid,startPos){
    let stack = []
    // Choose the initial cell, mark it as visited and push it to the stack    
     grid[startPos.y][startPos.x].visited = true
     stack.push(grid[startPos.y][startPos.x])
     //While the stack is not empty
     let k = 0
      while(stack.length >0){
         // Pop a cell from the stack and make it a current cell
         let current = stack.pop()
         let neighbours = getUnvisitedNeighbours(current,grid)
         //If the current cell has any neighbours which have not been visited
          if(neighbours.length > 0){
             //Push the current cell to the stack
             stack.push(current)
             //Choose one of the unvisited neighbours
             let i = Math.floor(Math.random()*neighbours.length)
             //Remove the wall between the current cell and the chosen cell
             setTimeout(() => {
                removeWallBetween(current,neighbours[i],grid)
             }, k * REMOVE_WALL_ANIMATION_STEP);
             
             //Mark the chosen cell as visited and push it to the stack
             neighbours[i].visited = true
             if(neighbours[i].get() != NODE_STATUS.TARGET && neighbours[i].get() != NODE_STATUS.START){
                neighbours[i].set(NODE_STATUS.EMPTY)
             }
             stack.push(neighbours[i])
             k++
         }
      }
}

function fillGridWithWalls(grid){
    //fill everytile in grid as wall bar start and target
    grid.forEach(row => {    
            row.forEach( (n,i)=> {
                setTimeout(() => {
                    if(n.get() === NODE_STATUS.EMPTY ){ //make sure we dont overwrite start or target
                        if(n.x % 2 != 0 ){
                            n.set(NODE_STATUS.WALL)
                            n.visited = true
                        }
                        if(n.y % 2 != 0 ){
                            n.set(NODE_STATUS.WALL)
                            n.visited = true
                        }
                    }
                }, FILL_WALL_ANIMATION_STEP * i)
            })
        })
}

function removeWallBetween(a,b,grid){
    let xdiff = a.x - b.x
    let ydiff = a.y - b.y
    if(xdiff < 0){
        if(a.x < BOARD_WIDTH-1){
            if(grid[a.y][a.x+1].get() === NODE_STATUS.WALL)
                grid[a.y][a.x+1].set(NODE_STATUS.EMPTY)
        }
            
    }
    if(xdiff > 0){
        if(a.x > 0){
            if(grid[a.y][a.x-1].get() === NODE_STATUS.WALL)
                grid[a.y][a.x-1].set(NODE_STATUS.EMPTY)
        }
            
    }
    if(ydiff < 0){
        if(a.y < BOARD_HEIGHT-1){
            if(grid[a.y+1][a.x].get() === NODE_STATUS.WALL)
                grid[a.y+1][a.x].set(NODE_STATUS.EMPTY)
        }
            
    }
    if(ydiff > 0){
        if(a.y > 0){
            if(grid[a.y-1][a.x].get() === NODE_STATUS.WALL)
                grid[a.y-1][a.x].set(NODE_STATUS.EMPTY)
        }
            
    }
}

function getUnvisitedNeighbours(node,grid){
    let neighbours = []
    //get nodes n+1/s+1/e+1/w+1
    // x+2 y , x-2 y , x y+2 , x y-2
    if(node.x < BOARD_WIDTH-2 && !grid[node.y][node.x+2].visited)
        neighbours.push(grid[node.y][node.x+2])
    if(node.x > 1 && !grid[node.y][node.x-2].visited)
        neighbours.push(grid[node.y][node.x-2])
    if(node.y < BOARD_HEIGHT-2 && !grid[node.y+2][node.x].visited)
         neighbours.push(grid[node.y+2][node.x])
    if(node.y > 1 && !grid[node.y-2][node.x].visited)
        neighbours.push(grid[node.y-2][node.x])
    //this will be used to get neighbours for the next path so a wall can be left between
    return neighbours
}

function ensurePathToNode(node,grid){
    //ensure a given node is open on at least 1 neighbour
    let openNeighbours = 0
    let neighbours = []
    //get the neighbours
    if(node.x < BOARD_WIDTH-1)
        neighbours.push(grid[node.y][node.x+1])
    if(node.x > 0 )
        neighbours.push(grid[node.y][node.x-1])
    if(node.y < BOARD_HEIGHT-1)
        neighbours.push(grid[node.y+1][node.x])
    if(node.y > 0 )
        neighbours.push(grid[node.y-1][node.x])
    //find how many are EMPTY
    neighbours.forEach(n =>{
        if(n.get() === NODE_STATUS.EMPTY)
            openNeighbours++
    })
    //if > 0 we have an open neighbour already
    if(openNeighbours > 0) return
    //pick a neighbour at random and set it to empty
    removeWallBetween(node,neighbours[Math.floor(Math.random()*neighbours.length)],grid)
}