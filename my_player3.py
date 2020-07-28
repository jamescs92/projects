#9158627914:James Christiansen-Salameh

import sys
import funcs
import numpy as np
import random

#CLASSES---------------------------------------------
class Node:
    
    #init method
    def __init__(self, parent, board, prevboard, iden, depth, turn, move):  
        self.parent = parent
        self.children = []
        self.board = board
        self.prevboard = prevboard
        self.score = None
        self.iden = iden
        self.turn = turn
        self.depth = depth
        self.leaf = False
        self.move = move

#FUNCTIONS--------------------------------------------
#play a move at x,y, or PASS
def do_move(coord):
    if coord == "PASS":
        outFile = open("output.txt", "w")
        outFile.write("PASS")
        outFile.close()
    else:
        outFile = open("output.txt", "w")
        outFile.write(str(coord[0]) + "," + str(coord[1]))
        outFile.close()

def printNode(node):
    print (node.board)
    print ("identity: " + str(node.iden))
    print ("turn: " + str(node.turn))
    print ("depth: " + str(node.depth))
    print ("score: " + str(node.score))
    print ("move: " + str(node.move))
    print("leaf: " + str(node.leaf))
    print("score: " + str(node.score))


#GLOBAL VARS--------------------------------------------
prevArray = np.zeros((5,5))
curArray = np.zeros((5,5))

#Black is 1, white is 2.  black goes first
identity = 0

#what turn are we about to complete
turn = 0

rootNode = None
nodeList = []

#NODE FUNCTIONS---------------------------

#creates root node from input information
def root_node():
    global rootNode
    rootNode =  Node(None, curArray,prevArray,identity,0,turn,None)

#check if the last move at this node was a pass
def check_pass(node):
    if funcs.check_board_same(node.board,node.prevboard) == True and node.turn != 1:
        return True
    return False

#check if this the last turn of the game, meaning child will be a leaf node
def check_last(node):
    if node.turn  == 24:
        return True
    return False

#retrieves valid and best moves for a node. bias towards nodes at the center of the board at the beginning of the game
def get_best_moves(node):
    validMoves = funcs.find_valid_moves(node.prevboard,node.board,node.iden)
    if node.turn < 7:
        newList = []
        for entry in validMoves:
            if entry[0] > 0 and entry[0] < 4 and entry[1] > 0 and entry[1] < 4:
                newList.append(entry)
        return newList
    return validMoves

#recursively creates children of a node
def create_children(parent_node, steps_remaining):
    #first, check if we have any more steps to do or if this is a leaf node
    if steps_remaining == 0 or parent_node.leaf == True:
        return

    #check if this is last move
    isLast = check_last(parent_node)

    #now get the best moves for this node:
    moveList = get_best_moves(parent_node)
    

    #create non-pass children from all moves
    for move in moveList:
        child_board = funcs.make_move(parent_node.board,move,parent_node.iden)
        tempChildNode = Node(parent_node, child_board, parent_node.board, 
        funcs.opponent(parent_node.iden),parent_node.depth+1,parent_node.turn +1, move)
        tempChildNode.leaf = isLast

        #add node to parent child list
        parent_node.children.append(tempChildNode)

    #create pass child
    tempChildNode = Node(parent_node,parent_node.board,parent_node.board,funcs.opponent(parent_node.iden),parent_node.depth+1,parent_node.turn +1,"PASS")
    tempChildNode.leaf = check_pass(parent_node) or isLast
    parent_node.children.append(tempChildNode)

    #recursively call create children
    for child in parent_node.children:
        create_children(child, steps_remaining -1)

def create_tree(depth):
    create_children(rootNode,depth)


def leaf_score(node):

    #get the actual end score of the game
    finalScore = funcs.get_final_score(node.board, identity)

    #add 100 pts if we won,subtract 100 if we lost
    if finalScore > 0:
        finalScore = finalScore + 200
        #add another 1000 pts if we win with single move from root node
        if node.parent != None and node.parent == rootNode:
            finalScore = finalScore + 1000
    elif finalScore < 0:
        finalScore = finalScore - 200

    return finalScore

def intermediate_score(node):
    #get the actual end score of the game
    finalScore = funcs.get_final_score(node.board, identity)

    #if this is going to be the last turn
    """
    if node.turn == 24:

        if node.iden == identity:
            moves = funcs.find_valid_moves(node.prevboard,node.board,node.iden)
            max = -1000000
            for move in moves:
                tempScore = funcs.get_final_score(funcs.make_move(node.board,move,node.iden),identity)
                if tempScore > max:
                    max = tempScore

            finalScore = max
        else:
            moves = funcs.find_valid_moves(node.prevboard,node.board,node.iden)
            min = 1000000
            for move in moves:
                tempScore = funcs.get_final_score(funcs.make_move(node.board,move,node.iden),identity)
                if tempScore < min:
                    min = tempScore
            finalScore = min

        if finalScore > 0:
            finalScore = finalScore + 200
        
        elif finalScore < 0:
            finalScore = finalScore - 200

        return finalScore
    """



    defenseWeights = np.zeros(5)
    offenseWeights = np.zeros(5)
    futureWeight = 1

    if node.turn == 24:
        defenseWeights = np.array([0,0,0,0,0])
        offenseWeights = np.array([5,0,0,0,0])
        futureWeight = .05

    if node.turn == 23:
        defenseWeights = np.array([5,0,0,0,0])
        offenseWeights = np.array([5,0,0,0,0])
        futureWeight = .1
    elif node.turn == 22 or node.turn == 21:
        defenseWeights = np.array([5,4,0,0,0])
        offenseWeights = np.array([5,4,0,0,0])
        futureWeight = .2
    elif node.turn == 20 or node.turn == 19:
        defenseWeights = np.array([5,4,3,0,0])
        offenseWeights = np.array([5,4,3,0,0])
        futureWeight = .2
    elif node.turn == 18 or node.turn == 17:
        defenseWeights = np.array([5,4,3,2,0])
        offenseWeights = np.array([5,4,3,2,0])
        futureWeight = .2

    else:
        defenseWeights = np.array([5,4,3,2,1])
        offenseWeights = np.array([5,4,3,2,1])
        futureWeight = .3



    ourGroups = funcs.get_groups(node.board,identity)
    defenseScores = np.zeros(5)
    for group in ourGroups:
        for index in range(0,5):
            if len(group[1]) == index + 1:
                defenseScores[index] = len(group[0]) + defenseScores[index]
    defenseTotal = np.sum(np.multiply(defenseScores,defenseWeights))
        
    #get opponent group information
    theirGroups = funcs.get_groups(node.board, funcs.opponent(identity))
    offenseScores = np.zeros(5)
    for group in theirGroups:
        for index in range(0,5):
            if len(group[1]) == index + 1:
                offenseScores[index] = len(group[0]) + offenseScores[index]
    offenseTotal = np.sum(np.multiply(offenseScores,offenseWeights))

    futureTotal = offenseTotal-defenseTotal

    finalScore = finalScore + futureWeight*futureTotal

    #weight actual score a bit more than the scoreing potential



    return finalScore

def get_score(node):
    if node.leaf == True:
        return leaf_score(node)

    elif node.children == [] or node.children == None:
        #add method here to calculate score based on intermediate state
        return intermediate_score(node)
    else:
        #call the get_score method on children.  want to get the maximum score of all children if the iden == identity.
        #want to get minimum score if iden != identity

        if node.iden == identity:
            max = -1000000
            for child in node.children:
                tempscore = get_score(child)
                if tempscore > max:
                    max = tempscore
            return max

        else:
            min = 1000000
            for child in node.children:
                tempscore = get_score(child)
                if tempscore < min:
                    min = tempscore
            return min

def execute_move():
    root_node()
    if rootNode.turn == 1:
        do_move([2,2])
        return



    if len(funcs.find_valid_moves(rootNode.prevboard,rootNode.board,rootNode.iden)) < 8:
        create_tree(4)
    else:
        create_tree(3)

    #list of nodes that are currently the maximum score
    maxList = []
    max = -1000000

    #find the max scores of the leaf nodes. choose one of the max score moves at random
    for child in rootNode.children:
        tempscore = get_score(child)
        if tempscore > max:
            max = tempscore
            maxList = []
            maxList.append(child)
        elif tempscore == max:
            maxList.append(child)

    do_move(random.choice(maxList).move)






#START------------------------------------------------

#get the boards from input.txt
inFile = open("input.txt", "r")
#grab first line 
identity = int(inFile.readline())

sum = 0
sum2 = 0
#get first 5 lines
for lineNum in range (0,5):
    line = str(inFile.readline())
    for hIndex in range(0,5):
        prevArray[lineNum][hIndex] = int(line[hIndex])
        sum = sum + int(line[hIndex])

#get next 5 lines
for lineNum in range (0,5):
    line = str(inFile.readline())
    for hIndex in range(0,5):
        curArray[lineNum][hIndex] = int(line[hIndex])
        sum2 = sum2 + int(line[hIndex])


#check what turn we are about to complete
if sum == 0 and sum2 == 0 and identity ==1:
    turn = 1
    turnFile = open("turnFile.txt", "w")
    turnFile.write("1")
    turnFile.close()
elif sum == 0 and (sum2 == 1 or sum2 == 0) and identity == 2:
    turn = 2
    turnFile = open("turnFile.txt", "w")
    turnFile.write("2")
    turnFile.close()
else:
    turnFile = open("turnFile.txt", "r")
    turn = int(turnFile.readline()) + 2
    turnFile.close
    turnFile = open("turnFile.txt", "w")
    turnFile.write(str(turn))


execute_move()













