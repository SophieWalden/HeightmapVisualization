import sys
 
import pygame
from pygame.locals import *
import json
 
pygame.init()
 
fps = 60
fpsClock = pygame.time.Clock()
 
width, height = 1280, 381
image_file_name = "bg.png"
bg = pygame.transform.scale(pygame.image.load(image_file_name), (width, height))


class PathfindingDisplay:
    def __init__(self):
        self.screen = pygame.display.set_mode((width, height))
        self.input_file = "path.json"
        self.heightmap, self.path = self.load_data()
        
        

    def load_data(self):
        
        with open(self.input_file) as input_file:
            input_data = json.load(input_file)

            return input_data["size"], input_data["path"]
 
    def draw(self):
        self.screen.blit(bg, (0, 0))
        
        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()

    
        for i in range(len(self.path) - 1):
            pygame.draw.line(self.screen, (255, 0, 0), [self.path[i][0],self.path[i][2]], [self.path[i + 1][0],self.path[i+1][2]], 3)

        pygame.display.flip()
        fpsClock.tick(fps)

    def main_loop(self):
        while True:
            self.draw()

PathfindingDisplay().main_loop()