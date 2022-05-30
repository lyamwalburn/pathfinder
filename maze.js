import { NODE_STATUS } from "./main.js";
import { BOARD_WIDTH,BOARD_HEIGHT } from "./main.js";
export function generateMaze(grid,startPos){
    fillGridWithWalls(grid,startPos) 
    setTimeout(() => {
        makeMazePath(grid,startPos)
    }, BOARD_WIDTH  * 20);
    //ensureTargetPath() -- make sure at least one of the targets neighbours is empty TODO
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
             }, k * 10);
             
             //Mark the chosen cell as visited and push it to the stack
             neighbours[i].visited = true
             if(neighbours[i].get() != NODE_STATUS.TARGET){
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
                    if(n.get() === NODE_STATUS.EMPTY ){
                        if(n.x % 2 != 0 ){
                            n.set(NODE_STATUS.WALL)
                            n.visited = true
                        }
                        if(n.y % 2 != 0 ){
                            n.set(NODE_STATUS.WALL)
                            n.visited = true
                        }
                    }
                }, 15 * i)
            })
        })
}

function removeWallBetween(a,b,grid){
    let xdiff = a.x - b.x
    let ydiff = a.y - b.y
    if(xdiff < 0){
        if(a.x < BOARD_WIDTH-1){
            grid[a.y][a.x+1].set(NODE_STATUS.EMPTY)
            //grid[a.y][a.x+1].visited = true
        }
            
    }
    if(xdiff > 0){
        if(a.x > 0){
            grid[a.y][a.x-1].set(NODE_STATUS.EMPTY)
           // grid[a.y][a.x+1].visited = true
        }
            
    }
    if(ydiff < 0){
        if(a.y < BOARD_HEIGHT-1){
            grid[a.y+1][a.x].set(NODE_STATUS.EMPTY)
           // grid[a.y][a.x+1].visited = true
        }
            
    }
    if(ydiff > 0){
        if(a.y > 0){
            grid[a.y-1][a.x].set(NODE_STATUS.EMPTY)
          //  grid[a.y][a.x+1].visited = true
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