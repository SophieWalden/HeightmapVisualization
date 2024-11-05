

from cv2 import imread
import heapq

image_file_name = "bg.png"
#image_file_name = "maze.jpg"
img = imread(image_file_name)

import sys
 
import pygame
from pygame.locals import *

from termcolor import colored

import random

 
pygame.init()
 
fps = 60
fpsClock = pygame.time.Clock()
 
width, height = 1280, 381
screen = pygame.display.set_mode((width, height))

bg = pygame.transform.scale(pygame.image.load(image_file_name), (width, height))

import heapq, math
size = [1080, 720]
def cost(node, origin, target, heightmap):
    distance_from_origin = ((node[0]-origin[0])**2 + (node[1] - origin[1])**2 + (heightmap[node[1]][node[0]] - heightmap[origin[1]][origin[0]])**2*3)**.5
    distance_from_target = ((node[0]-target[0])**2 + (node[1] - target[1])**2 + (heightmap[node[1]][node[0]] - heightmap[target[1]][target[0]])**2*3)**.5

    return distance_from_origin + distance_from_target

def AStar(origin, target, heightmap):
    seenNodes = set([])
    nodes = []
    chosenPath = []
    chosenCost = math.inf
    heapq.heappush(nodes, (0,[origin[:], [origin[:]]]))

    while nodes:
        chosenNode, path = heapq.heappop(nodes)[1]
        print(f"{colored('Nodes Searched: ', 'blue')}{colored(len(seenNodes), 'green')}/{colored(size[0]*size[1],'green')}")


        if chosenNode[0] == target[0] and chosenNode[1] == target[1]:
            return path

        for pos in [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [1, 1], [-1, 1], [1, -1]]:
            new_x, new_y = chosenNode[0] + pos[0], chosenNode[1] + pos[1]

            if new_x in range(len(heightmap[0])) and new_y in range(len(heightmap)) and (new_x, new_y) not in seenNodes:
                seenNodes.add((new_x, new_y))
                heapq.heappush(nodes,(cost((new_x, new_y), origin, target, heightmap),[[new_x, new_y], path + [(new_x, new_y)]]))

    return chosenPath
    

class Pathfinding():
    def __init__(self):
        self.screen = pygame.display.set_mode([width, height])
        self.positions = []
        self.cooldown = False
        self.path = []
        self.computed = []

        self.values = [[sum(bg.get_at((i, j))[:3])//3 for i in range(width)] for j in range(height)]
        self.seenNodes = []

    def draw(self):
        self.screen.blit(bg, (0,0))
        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()

        for pos in self.positions:
            pygame.draw.circle(self.screen, (200, 50, 50), pos, 5)

        for pos in self.seenNodes:
            pygame.draw.circle(self.screen, (50, 50, 50), pos, 1)
        
        for i in range(1, len(self.path)):
            pygame.draw.line(self.screen, (200, 50, 50), self.path[i - 1], self.path[i], 3)
        
        pygame.display.flip()
        fpsClock.tick(fps)

    def events(self):
        pressed, pos = pygame.mouse.get_pressed(), pygame.mouse.get_pos()

        if pressed[0] == 1 and not self.cooldown:
            self.cooldown = True
            self.positions.append(pos)

            self.positions = self.positions[-2:]
        
        if pressed[0] == 0:
            self.cooldown = False

    def cost(self, node):
        return (len(node[2]) + sum(abs(node[i] - self.positions[1][i])for i in range(2))) 

    def path_find(self):
        if len(self.positions) == 2 and (not self.computed or not (self.computed[0] == self.positions[0] and self.computed[1] == self.positions[1])):
            starting_point = self.positions[0]
            ending_point = self.positions[1]


            self.path = AStar(starting_point, ending_point, self.values)
            self.seenNodes = self.path

            import json
            with open("path.json", "w") as output_file:
                output_data = {}
                output_data["size"] = [width, height]
                output_data["path"] = self.add_y_values(self.path)

                json.dump(output_data, output_file)

            self.computed = self.positions[:]
            print([list(node) for node in self.path])

    def add_y_values(self, path):
        retVal = []

        for x, y in path:
            retVal.append([x, self.values[y][x], y])

        return retVal

    def main_loop(self):
        while True:
            self.draw()
            self.events()
            self.path_find()

Pathfinding().main_loop()
