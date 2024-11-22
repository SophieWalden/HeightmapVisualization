from cv2 import imread
import heapq

image_file_name = "bg.png"
#image_file_name = "maze.jpg"
img = imread(image_file_name)

import sys
 
import pygame
from pygame.locals import *

from termcolor import colored
import torch
import random
import numpy as np
from skimage.transform import resize


DEPTH_FILENAME = "depth_suburb.pt"
COLORED_FILENAME = "colored_suburb.pt"
SEGMENTATION_FILENAME = "segmented_suburb.pt"


def load_pt_file(filename):
    tensor = torch.load(filename, weights_only=True)
    loaded_data = tensor.numpy()

    data_normalized = (255 * (loaded_data - loaded_data.min()) / (loaded_data.max() - loaded_data.min())).astype(np.uint8)
    data_transposed = np.transpose(data_normalized) 
    
    if data_transposed.ndim == 2:  # Grayscale, convert to RGB
        data_transposed = np.stack([data_transposed] * 3, axis=-1) 

    return data_transposed

bg = pygame.surfarray.make_surface(load_pt_file(DEPTH_FILENAME))

 
pygame.init()
 
fps = 60
fpsClock = pygame.time.Clock()
 
# image_file_name = "bg4.jpg"
# bg = pygame.image.load(image_file_name)
width, height = bg.get_width() // 3, bg.get_height() // 3

bg = pygame.transform.scale(bg, (width, height))
screen = pygame.display.set_mode((width, height))

import heapq, math
def cost(node, origin, target, heightmap, segmentation):
    segmentation_value = segmentation[node[0]][node[1]][0]
    distance_from_origin = ((node[0]-origin[0])**2 + (node[1] - origin[1])**2 + (heightmap[node[1]][node[0]] - heightmap[origin[1]][origin[0]])**2*30)**.5
    distance_from_target = ((node[0]-target[0])**2 + (node[1] - target[1])**2 + (heightmap[node[1]][node[0]] - heightmap[target[1]][target[0]])**2*30)**.5

    return (distance_from_origin + distance_from_target * (241 - segmentation_value))

def AStar(origin, target, heightmap, segmentation_map):
    seenNodes = set([])
    nodes = []
    chosenPath = []
    chosenCost = math.inf
    heapq.heappush(nodes, (0,[origin[:], [origin[:]]]))

    while nodes:
        chosenNode, path = heapq.heappop(nodes)[1]
        print(f"{colored('Nodes Searched: ', 'blue')}{colored(len(seenNodes), 'green')}/{colored(width * height,'green')}")


        if chosenNode[0] == target[0] and chosenNode[1] == target[1]:
            return path

        for pos in [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [1, 1], [-1, 1], [1, -1]]:
            new_x, new_y = chosenNode[0] + pos[0], chosenNode[1] + pos[1]

            if new_x in range(len(heightmap[0])) and new_y in range(len(heightmap)) and (new_x, new_y) not in seenNodes:
                seenNodes.add((new_x, new_y))
                heapq.heappush(nodes,(cost((new_x, new_y), origin, target, heightmap, segmentation_map),[[new_x, new_y], path + [(new_x, new_y)]]))

    return chosenPath
    

class Pathfinding():
    def __init__(self):
        self.screen = pygame.display.set_mode([width, height])
        self.positions = []
        self.cooldown = False
        self.path = []
        self.computed = []

        self.values = [[sum(bg.get_at((i, j))[:3])//3 for i in range(width)] for j in range(height)]
        self.segmentation_values = np.repeat(np.flipud(resize(torch.load(SEGMENTATION_FILENAME), (len(self.values[0]), len(self.values)))) * 120, 3, axis=-1)
        self.display_segmentation = pygame.surfarray.make_surface(self.segmentation_values)
        self.display_image = pygame.transform.scale(pygame.surfarray.make_surface(load_pt_file(COLORED_FILENAME)), (width, height))
        self.seenNodes = []
        self.mode = 0

    def draw(self):

        self.screen.blit([bg, self.display_segmentation, self.display_image][self.mode], (0,0))
    

        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_c:
                    self.mode = (self.mode + 1 ) % 3
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


            self.path = AStar(starting_point, ending_point, self.values, self.segmentation_values)
            self.seenNodes = self.path
            import json
            with open("output/path.json", "w") as output_file:
                output_data = {}
                output_data["size"] = [width, height]
                output_data["path"] = self.add_y_values(self.path)

                json.dump(output_data, output_file)

            self.save_images()

            self.computed = self.positions[:]
            print(colored("ACTION - Saved to output directory", "yellow"))

    def save_images(self):
        """

            Converts depth_suburb and colored_suburb back to images so the website can use them
        
        """
        pygame.image.save(pygame.surfarray.make_surface(load_pt_file(DEPTH_FILENAME)), "output/heightmap.png")
        pygame.image.save(pygame.surfarray.make_surface(load_pt_file(COLORED_FILENAME)), "output/original.png")


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
