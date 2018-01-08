# #########################################
#
# functionality: ( for Dashboard )
# Given the reservation_id and condition
# 1. Change the condition in reservation collection
# 2. If accepted, remove users from waiting_list 
#                 append 'accepted_list' in restaurant collection 
#
# #########################################

import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId



def lambda_handler(event, context):
	print event
	print context

	client = MongoClient()
	db = client.tindertable

	# #########   testcase!!!!!!!
	reservation_id = 
	condition = 
	
	if 'condition' in event and 'reservation_id' in event:
		condition = event['condition']
		reservation_id = event['reservation_id']

	reservation = db.reservation.find_one({"_id":ObjectId(reservation_id)})
	print reservation
	user_to = reservation["user_to"]
	user_from = reservation["user_from"]
	restaurant_id = reservation["restaurant_id"]
	time = reservation["time"]
	# print user_to
	# print user_from

	# db.waiting_list.update({"_id": restaurant_id}, {'$push': {time: user_to}})
	# db.waiting_list.update({"_id": restaurant_id}, {'$push': {time: user_from}})
	# wait_list = db.waiting_list.find_one({"_id":restaurant_id})
	# print "wait_list: "
	# print wait_list
	
	# #######################
	# 1. change the condition in reservation collection
	db.reservation.update(
	        {"_id": ObjectId(reservation_id)},
	        {
	        "$set": {
	            "condition":condition
	        }
	        }
	    )

	# #########################
	# 2. change waiting_list(remove 2 users) and restaurant coll.(accepted_list append)
	if condition == 'accepted':
		if db.waiting_list.find_one({"$and":[{"_id": restaurant_id}, {time: user_to}]}):
			db.waiting_list.update({"_id": restaurant_id}, {'$pull': {time: user_to}})
		if db.waiting_list.find_one({"$and":[{"_id": restaurant_id}, {time: user_from}]}):
			db.waiting_list.update({"_id": restaurant_id}, {'$pull': {time: user_from}})

		wait_list = db.waiting_list.find_one({"_id":restaurant_id})
		print wait_list
		# print wait_list
		# res = db.restaurants.find_one({"_id": restaurant_id})
		# print res

		rest_info = db.restaurants.find_one({"_id": restaurant_id})
		ac_list =  rest_info['accepted_list']

		if time in ac_list:
			print "found time"
			if reservation_id in ac_list[time]:
				print "reservation exits. "
			else:
				db.restaurants.update({"_id": restaurant_id}, {"$push":{'accepted_list.'+ time: reservation_id}})
		else:
			db.restaurants.update({"_id": restaurant_id}, {"$set":{"accepted_list":{time: [reservation_id]}}})

		# db.restaurants.update({"_id": restaurant_id}, {"accepted_list": {"$push": {time: [reservation_id]}}})

	rest = db.restaurants.find_one({"_id":restaurant_id})["accepted_list"]
	print rest
