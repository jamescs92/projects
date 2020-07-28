#NN with one hidden layer
import numpy as np
import csv
import sys
import funcs
import matplotlib.pyplot as plt 


#command line args----------------------------------------------------
#for final version remember to take out the test label file
#python3 NN.py train_image.csv train_label.csv test_image.csv test_label.csv

#open files
train_image_file = open("train_image.csv", 'r')
train_label_file = open("train_label.csv", 'r')
test_image_file = open("test_image.csv", 'r')

#create csv readers
train_image = csv.reader(train_image_file)
train_label = csv.reader(train_label_file)
test_image = csv.reader(test_image_file)

#constants------------------------------------------------------------
EPOCHS = 30
LEARN_RATE = 1e-1
BATCH_SIZE = 100

INPUT_SIZE = 784
OUTPUT_SIZE = 10
LAYER_SIZE = 100

#functions-------------------------------------------------------------

#return oneHot matrix from list of y values
def oneHot(labelList):
	array = np.zeros((len(labelList),10))
	for vert in range(0,len(labelList)):
		array[vert][labelList[vert]] = 1
	return array

def strToNormalized(str):
	return float(str)/256
strToNormalizedVec = np.vectorize(strToNormalized)

#return input matrix from list of x values
def createInputArray(imageList):
	array = strToNormalizedVec(np.array(imageList))
	return array


#Run Program----------------------------------------------------------
#initialize all required matrices

w1 = np.random.randn(INPUT_SIZE,LAYER_SIZE)
b1 = np.random.randn(LAYER_SIZE)

w2 = np.random.randn(LAYER_SIZE,OUTPUT_SIZE)
b2 = np.random.randn(OUTPUT_SIZE)

#list of loss per epoch
lossList = []

#list of training accuracy percentage per epoch
trainAccuracyList = []

#epochList
epochList = []

for epoch in range (1,EPOCHS+1):
	if epoch >= 8:
		LEARN_RATE = 1e-4
	epoLoss = 0
	epoRight = 0
	epoWrong = 0
	#jump to the top of the train csv files
	train_image_file.seek(0)
	train_label_file.seek(0)

	reachedEnd = False
	while not reachedEnd:
		trainImageList = []
		trainLabelList = []
		for batch_count in range(1,BATCH_SIZE+1):
			try:
				trainImageList.append(next(train_image))
				trainLabelList.append(int(next(train_label)[0]))
			except StopIteration:
				reachedEnd = True
				break
		if len(trainImageList)== 0:
			break

		Y = oneHot(trainLabelList)
		X = createInputArray(trainImageList)

		#now we have our input matrix X and one hot output matrix Y.  run forward propogation
		l1_out = funcs.vec_sig(np.dot(X,w1) + b1)
		final_out = funcs.softmax(np.dot(l1_out,w2) + b2)

		#get gradients
		d2 = final_out - Y
		d1 = l1_out * (1-l1_out) * np.dot(d2, w2.T) 

		#update weights and bias with gradient descent

		w2 = w2 - LEARN_RATE * np.dot(l1_out.T, d2)
		b2 = b2 - LEARN_RATE * d2.sum(axis = 0)

		w1 = w1 - LEARN_RATE * np.dot(X.T,d1)
		b1 = b1 - LEARN_RATE * d1.sum(axis = 0)

		#get batchLoss and update epoLoss
		batchLoss = -1*np.sum(Y * np.log(final_out))
		epoLoss = epoLoss + batchLoss

		#get number of right and wrong for this batch
		maxMat = np.argmax(final_out, axis = 1)
		for index in maxMat:
			if Y[index][maxMat[index]] == 1:
				epoRight = epoRight + 1
			else:
				epoWrong = epoWrong + 1
	epoAccuracy = float(epoRight)/(float(epoRight + epoWrong))

	#print("Loss:" + str(epoLoss))
	#print ("Training Accuracy:" + str(epoAccuracy))
	
	lossList.append(epoLoss)
	trainAccuracyList.append(epoAccuracy)

	if epoAccuracy > .965:
		break



#now create output csv file
test_image_file.seek(0)
testImageList =[]

reachedEnd = False
while not reachedEnd:
	try:
		testImageList.append(next(test_image))
	except StopIteration:
		reachedEnd = True
		break

X = createInputArray(testImageList)

#forward prop
l1_out = funcs.vec_sig(np.dot(X,w1) + b1)
final_out = funcs.softmax(np.dot(l1_out,w2) + b2)

maxMat = np.argmax(final_out, axis = 1)

prediction_file = open("test_predictions.csv", "w")
pfile = csv.writer(prediction_file)

for index in range(0,len(maxMat)):
	pfile.writerow([str(maxMat[index])])





		

















		











