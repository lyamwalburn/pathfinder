import { aStar, resetPath} from './pathfinding.js'
import { generateMaze } from './maze.js'

export const BOARD_WIDTH = 51
export const BOARD_HEIGHT = 31
export const NODE_STATUS = {
    EMPTY: 'empty',
    WALL: 'wall',
    START: 'start',
    TARGET: 'target',
    PATH: 'path',
    TRACKED: 'tracked'
}
const startPosition = {
    x: 0,
    y: 0
}

//Controls setup
const xStartInput = document.querySelector('#start-x')
const yStartInput = document.querySelector('#start-y')
const xEndInput = document.querySelector('#end-x')
const yEndInput = document.querySelector('#end-y')
xStartInput.max = BOARD_WIDTH-1
yStartInput.max = BOARD_HEIGHT-1
xEndInput.max = BOARD_WIDTH-1
yEndInput.max = BOARD_HEIGHT-1
xStartInput.value = startPosition.x
yStartInput.value = startPosition.y
xEndInput.value = BOARD_WIDTH-1
yEndInput.value = BOARD_HEIGHT-1
xStartInput.addEventListener('change',e =>{
    startPosition.x = e.target.value
    let lastStart = document.querySelector("[data-status = 'start']")
    if(lastStart){
        lastStart.dataset.status = NODE_STATUS.EMPTY
    }
    grid[startPosition.y][startPosition.x].set(NODE_STATUS.START)
})
yStartInput.addEventListener('change',e =>{
    startPosition.y = e.target.value
    let lastStart = document.querySelector("[data-status = 'start']")
    if(lastStart){
        lastStart.dataset.status = NODE_STATUS.EMPTY
    }
    grid[startPosition.y][startPosition.x].set(NODE_STATUS.START)
})
const startButton = document.querySelector('#start').addEventListener('click',()=>{
    aStar(grid)
})
const resetButton = document.querySelector('#reset').addEventListener('click',resetGrid)

//Grid Setup
const grid = createGrid(BOARD_WIDTH,BOARD_HEIGHT)
const gridElement = document.querySelector('.grid-container')
gridElement.style.setProperty('--height',BOARD_HEIGHT)
gridElement.style.setProperty('--width',BOARD_WIDTH)

//set initial start and end points
grid[startPosition.y][startPosition.x].set(NODE_STATUS.START)
grid[BOARD_HEIGHT-1][BOARD_WIDTH-1].set(NODE_STATUS.TARGET)

//create nodes object into array
function createGrid(width,height){
    const grid =[]
    for(let y =0; y < height; y++){
        const row = []
        for(let x= 0; x < width; x++){
           const nodeElement = document.createElement('div')
           nodeElement.dataset.status = NODE_STATUS.EMPTY
            const node = {
                nodeElement,    
                x,              //nodes x/y position in grid top left 0,0
                y,
                f: Infinity,    //computation values for pathfinding
                g: Infinity,
                h: Infinity,
                parent: null,   //used to backtrack when finding path
                visited: false, //used for maze generation
                get(){
                    return this.nodeElement.dataset.status
                },
                set(value){
                    this.nodeElement.dataset.status = value
                }
            }
            row.push(node)
        }
        grid.push(row)
    }
    return grid
}

//setup mouse interaction on grid and load tiles into container
grid.forEach( row => {
    row.forEach( node => {
        //add nodes to grid
        gridElement.append(node.nodeElement)

        //listen for click and click/drag to place walls
        node.nodeElement.addEventListener('mousedown',()=>{
            if(node.get() === NODE_STATUS.EMPTY)
                node.set(NODE_STATUS.WALL)
            else if(node.get() === NODE_STATUS.WALL)
                 node.set(NODE_STATUS.EMPTY)
        })
        node.nodeElement.addEventListener('mouseenter',e=>{
            if(e.buttons == 1 && node.get() === NODE_STATUS.EMPTY)
                node.set(NODE_STATUS.WALL)
            else if(e.buttons == 1 && node.get() === NODE_STATUS.WALL)
                node.set(NODE_STATUS.EMPTY)
            
        })
        //right click to set target
        node.nodeElement.addEventListener('contextmenu', e=>{
            e.preventDefault()
            if(e.shiftKey){
                if(node.get() !== NODE_STATUS.TARGET){
                    let lastStart = document.querySelector("[data-status = 'start']")
                    if(lastStart){
                        lastStart.dataset.status = NODE_STATUS.EMPTY
                    }
                    node.set(NODE_STATUS.START)
                    startPosition.x = node.x
                    startPosition.y = node.y
                    xStartInput.value = node.x
                    yStartInput.value = node.y
                }
            }

            if(node.get() !== NODE_STATUS.START){
                let lastTarget = document.querySelector("[data-status = 'target']")
                if(lastTarget){
                    lastTarget.dataset.status = NODE_STATUS.EMPTY
                }
                node.set(NODE_STATUS.TARGET)
            }
        })
    })
})

generateMaze(grid,{x:0,y:0})

//reset the grid to initial state
function resetGrid(){
    resetPath()
    grid.forEach(row=>{
        row.forEach(node=>{
            if(node.get() !== NODE_STATUS.START && node.get() !== NODE_STATUS.TARGET){
                node.set(NODE_STATUS.EMPTY)
                node.f = Infinity
                node.g =Infinity
                node.h = Infinity
                node.parent =  null
                node.visited = false
            }
        })
    })
    generateMaze(grid,{x:0,y:0})
    console.log(grid)
}

