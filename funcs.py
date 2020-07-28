import numpy as np
import math

#runs sigmoid function on num and returns result
def sigmoid(num):
	return 1/(1+math.exp(num*-1))

#vec_sig is vectorized version of sigmoid function
vec_sig = np.vectorize(sigmoid)

#layer_sigmoid returns array with sigmoid applied to all elements in array
def layer_sigmoid(arr):
	return vec_sig(arr)

#softmax return array that is softmax of input array
def softmax(arr):
	#get array of exponents
	exp_arr = np.exp(arr)
	return exp_arr/exp_arr.sum(axis = 1, keepdims= True)
