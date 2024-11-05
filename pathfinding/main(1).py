from termcolor import colored
import heapq, math
size = [1080, 720]
def cost(node, origin, target, heightmap):
    distance_from_origin = ((node[0]-origin[0])**2 + (node[1] - origin[1])**2 + (heightmap[node[1]][node[0]] - heightmap[origin[1]][origin[0]])**2)**.5
    distance_from_target = ((node[0]-target[0])**2 + (node[1] - target[1])**2 + (heightmap[node[1]][node[0]] - heightmap[target[1]][target[0]])**2)**.5

    return distance_from_origin + distance_from_target

def AStar(origin, target, heightmap):
    seenNodes = set([])
    nodes = []
    chosenPath = []
    chosenCost = math.inf
    heapq.heappush(nodes, (0,[origin[:], [origin[:]]]))

    while nodes:
        print(f"{colored('Nodes Searched: ', 'blue')}{colored(len(seenNodes), 'green')}/{colored(size[0]*size[1],'green')}")
        chosenNode, path = heapq.heappop(nodes)[1]


        if chosenNode == target and cost(chosenNode, origin, target, heightmap) < chosenCost:
            chosenCost = cost(chosenNode, origin, target, heightmap)
            chosenPath = path

        for pos in [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [1, 1], [-1, 1], [1, -1]]:
            new_x, new_y = chosenNode[0] + pos[0], chosenNode[1] + pos[1]

            if new_x in range(len(heightmap[0])) and new_y in range(len(heightmap)) and (new_x, new_y) not in seenNodes:
                seenNodes.add((new_x, new_y))
                heapq.heappush(nodes,(cost((new_x, new_y), origin, target, heightmap),[[new_x, new_y], path + [(new_x, new_y)]]))

    return chosenPath
    



import random


noise = [[random.randint(0, 255) for _ in range(size[0])] for _ in range(size[1])]
heightmap = [[0 for _ in range(size[0])] for _ in range(size[1])]

for j, row in enumerate(noise):
    for i, tile in enumerate(row):
        total, count = 0, 0

        for y in [-1, 0, 1]:
            for x in [-1, 0, 1]:
                new_x, new_y = i + x, j + y

                if new_x in range(len(noise[0])) and new_y in range(len(noise)):
                    total += noise[new_y][new_x]
                    count += 1

        total = total if total > 120 * count else total * 0.2
        heightmap[j][i] = total // count

origin = [20, 20]
target = [1060, 700]
path = AStar(origin, target, heightmap)

import json
with open("path.json", "w") as output_file:
    output_data = {}
    output_data["heightmap"] = heightmap
    output_data["path"] = path

    json.dump(output_data, output_file)