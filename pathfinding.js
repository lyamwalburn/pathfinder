import {NODE_STATUS,BOARD_WIDTH,BOARD_HEIGHT} from './main.js'


let path = []
const TRACKING_TIME = 10
const PATH_TIME = 30

export function aStar(grid){
    let openSet = []
    let closedSet = []
    let startNode
    let targetNode
    //find start position and target position from grid
    grid.forEach(row => {
        row.forEach(node => {
            if(node.get() === NODE_STATUS.START) startNode = node
            if(node.get() === NODE_STATUS.TARGET) targetNode = node
        })
    })
    startNode.g = 0
    openSet.push(startNode)
    let step = 0
    while(openSet.length > 0){
        let lowestIndex = 0
        
        for(let i=0;i<openSet.length;i++){
             if(openSet[i].f < openSet[lowestIndex].f){
                 lowestIndex = i
             }
        }
        let current = openSet[lowestIndex]
        if(current.x === targetNode.x && current.y === targetNode.y){
            //found the target
            let temp = current
            path.push(temp)
            while(temp.parent) {
                path.push(temp.parent)
                temp = temp.parent
                //temp.set(NODE_STATUS.PATH)
            }
            console.log('DONE!')
            console.log(path)
            setTimeout(() => {
                drawPath()
            }, step * TRACKING_TIME);
            return
        }
        //remove current from openset
        openSet.splice(lowestIndex,1)
        //add to closed set
        closedSet.push(current)

        //get neighbours from grid
        // x+1 y , x-1 y , x y+1 , x y-1
        let cx = current.x
        let cy = current.y
        let neighbours = []
        if(cx < BOARD_WIDTH-1)
            neighbours.push(grid[cy][cx+1])
        if(cx > 0)
            neighbours.push(grid[cy][cx-1])
        if(cy < BOARD_HEIGHT-1)
            neighbours.push(grid[cy+1][cx])
        if(cy > 0)
            neighbours.push(grid[cy-1][cx])

        //corners
        if(cx < BOARD_WIDTH-1 && cy > 0)
            neighbours.push(grid[cy-1][cx+1])
        if(cx > 0 && cy > 0)
            neighbours.push(grid[cy-1][cx-1])
        if(cy < BOARD_HEIGHT-1 && cx >0)
            neighbours.push(grid[cy+1][cx-1])
        if(cy < BOARD_HEIGHT-1 && cx < BOARD_WIDTH-1)
            neighbours.push(grid[cy+1][cx+1])
        
        
        //comapre node neighbours
        neighbours.forEach( n=> {
            if(n.get() !== NODE_STATUS.WALL){
                if(!closedSet.includes(n)){
                    let tempG = current.g + 1
                    let newPath = false
                    if(openSet.includes(n)){
                        if(tempG < n.g){
                            n.g = tempG
                            newPath = true
                        }
                    }
                    else {
                        n.g = tempG
                        newPath = true
                        openSet.push(n)
                    }
                    if(newPath){
                        n.h = heuristic(n,targetNode)
                        n.f = n.g + n.h
                        n.parent = current
                    }
                    if(n.get() === NODE_STATUS.EMPTY){
                        //n.set(NODE_STATUS.TRACKED)
                        drawTracking(n,step)
                    }
                        
                }
            }
        })
        step++
    }
    //no solution
}

export function resetPath(){
    path=[]
}

function heuristic(a,b){
    return distance(a.x,a.y,b.x,b.y)
}

function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2)) 
}

function drawPath(){
    let count = 0
    for(let i = path.length-1; i >=0  ; i--){
        setTimeout(() => {
            if(path[i].get() === NODE_STATUS.TRACKED)
                path[i].set(NODE_STATUS.PATH)
        }, PATH_TIME * count);
        count++
    }
}

function drawTracking(node,step) {
    setTimeout(() => {
        node.set(NODE_STATUS.TRACKED)
    }, TRACKING_TIME * step);
}