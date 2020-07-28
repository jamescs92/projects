import sys
import numpy as np

#recursive function to check for a group on the board.  input is a subset of the group, returns the full group. 
#board is the 5 by 5 array containing locations of players 
#currentMembers is a list containing the coordinates of the current group members
#freedomGroup is a list containing the coordinates of the freedoms of the group
#iden is the identity of the group that we are checking

def opponent(iden):
    if iden == 1:
        return 2
    elif iden == 2:
        return 1

#finds the freedom points and entire group given a single input. return list that contains 2 items [list of full group, list of freedom points]
def check_group(board,currentMembers,freedomGroup, iden):
    nextGroup = []
    addList = [[-1,0],[0,1],[1,0],[0,-1]]
    #for all members of the group
    for member in currentMembers:
        #for each neighbor
        for index in addList:
            testpoint = [member[0]+index[0], member[1] + index[1]]
            #check if in bounds
            if testpoint[0] < 0 or testpoint[0] > 4 or testpoint[1] < 0 or testpoint[1] > 4:
                continue

            #check if it is a freedom
            if board[testpoint[0]][testpoint[1]] == 0:
                #check if it is in the freedomGroup, add if it is not
                if testpoint not in freedomGroup:
                    freedomGroup.append(testpoint)

            #check if it is our piece.
            if board[testpoint[0]][testpoint[1]] == iden:
                #it is our piece.  add to nextGroup if it is not already in there
                if testpoint not in nextGroup and testpoint not in currentMembers:
                    nextGroup.append(testpoint)

    if nextGroup == []:
        return(currentMembers,freedomGroup)
    else:
        currentMembers.extend(nextGroup)
        return(check_group(board,currentMembers,freedomGroup,iden))

#get all groups of a board for a particular identity
def get_groups(board, iden):
    alreadyCounted = []
    groupList=[]
    for i in range(0,5):
        for j in range(0,5):
            #check if it is same iden
            if board[i][j] != iden:
                continue

            #check if it already belongs to a group
            if [i,j] in alreadyCounted:
                continue
            else:
                answer = check_group(board,[[i,j]],[],iden)
                groupList.append(answer)
                alreadyCounted.extend(answer[0])
    return groupList

#identify all dead stones on the board.  iden is the group that is have its stones removed, meaning that the opponent of iden just made a move
def identify_dead(board,iden):
    deadGroup = []

    #find all groups of iden on the board
    groups = get_groups(board,iden)

    #for all groups 
    for item in groups:
        #check if the group has any freedoms
        if item[1] != []:
            continue
        #group has no freedoms.
        deadGroup.extend(item[0])

    return deadGroup

#remove all dead stones on the board.  iden is the group that is having its stones removed, meaning that the opponent of iden just made a move
def remove_dead(board,iden):
    boardCopy = np.copy(board)
    deadGroup = identify_dead(board,iden)
    for item in deadGroup:
        boardCopy[item[0]][item[1]] = 0
    return boardCopy

#find all moves that will be captures.  iden is the player that will make the capture move
def find_capture_moves(board,iden):
    captureMoves = []
    groupList = get_groups(board,opponent(iden))

    #find lists that only have one member in the freedom group
    for index in groupList:
        if len(index[1]) == 1 and index[1][0] not in captureMoves:
            captureMoves.append(index[1][0])

    return captureMoves

#check if move is suicide(excluding capture moves) iden is the player that is making the suicide move. returns 1 if suicide move, 0 if not
def test_suicide_move(board, iden, coord):
    boardCopy = np.copy(board)
    boardCopy[coord[0]][coord[1]] = iden
    deadGroup = identify_dead(boardCopy,iden)
    if deadGroup != []:
        return 1
    return 0
    


#find all valid moves on board, excluding a pass.  iden is the group that will be placing the stone
#ADD CHECK OF KO
def find_valid_moves(prevboard,board,iden):
    validMoves = []
    captureMoves = find_capture_moves(board,iden)
    for i in range (0,5):
        for j in range(0,5):
            if board[i][j] != 0:
                continue
            if test_suicide_move(board,iden,[i,j]) == 1 and [i,j] not in captureMoves:
                continue
            #now check if this move results in ko.  make sure to rule out the double pass 
            newBoard = make_move(board,[i,j],iden)
            if check_board_same(prevboard,newBoard) == True and check_board_same(board,newBoard) == False:
                continue

            validMoves.append([i,j])

    return validMoves 



#place a piece on a board at the given location and return a new board
def place_piece(board,loc,iden):
    boardCopy = np.copy(board)
    boardCopy[loc[0]][loc[1]] = iden
    return boardCopy

#place piece on board and remove dead pieces. return new board
def make_move(board,loc,iden):
    boardCopy= place_piece(board,loc,iden)
    boardCopy = remove_dead(boardCopy,opponent(iden))
    return boardCopy



#check if board1 and board2 are identical
def check_board_same(board1,board2):
    return np.array_equal(board1,board2)


#get final board score.  positive if good for iden passed into fuction, negative if bad
def get_final_score(board,iden):
    ones = 0
    twos = 0
    for i in range(0,5):
        for j in range(0,5):
            if board[i][j] == 1:
                ones = ones + 1
            elif board[i][j] == 2:
                twos = twos + 1
    score = twos - ones + 2.5
    if iden == 2:
        return score
    elif iden == 1:
        return score*(-1)



    




    
    
