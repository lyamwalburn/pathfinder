# pathfinder
project to demonstrate different pathfinding algorithms. 

Initial setup with customizeable grid size, choice of start/ end point and walls.

Walls can be placed by clicking and dragging accross the grid
End point can be chosen by right click on grid or via input box
Start point can be chosen by shift right click on grid or via input box

A* Algorithm following - https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
set with a hueristic using Euclidean distance as diagonals are permitted

Maze generation using randomized depth first search following - https://en.wikipedia.org/wiki/Maze_generation_algorithm

TODO:
[]  Different Algorithms to compare against one another
[]  Allow A* with and without diagonals
[X] Maze Generation to create random mazes for the algorithms to traverse
[X] Basic animation of maze generating
[]  Error messaging should no path be avaliable 
[]  Better styling 
[]  Fix issue with startPos & targetPos being enclosed by maze if on odd tile