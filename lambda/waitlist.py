# #########################################
#
# Functionality: ( for 'info' page )
# Click button "Add me into the Waitlist"
# Given 'user_id', 'restaurant_id', 'time slot'
#
# #########################################

import pymongo
from pymongo import MongoClient
from bson import ObjectId

def lambda_handler(event, context):
	print event
	print context
	
	client = MongoClient()
	db = client.tindertable
	waiting_list = db.waiting_list

	# testcase
	user_id =  
	restaurant_id =  
	time = 
	
	if "restaurant_id" in event and "time" in event and "user_id" in event:
		restaurant_id = event.restaurant_id
		time = event.time
		user_id = event.user_id

	if not waiting_list.find_one({"_id": restaurant_id}):
		print restaurant_id +" dosen't exist in the waiting_list." 
		wait = {
			"_id" : restaurant_id,
			time: [user_id]
		}
		print wait
		waiting_list.insert(wait)
	else:
		print restaurant_id +" already existed." 
		if not waiting_list.find_one({"$and":[{"_id": restaurant_id},
											{ time: { "$exists": "true" }}]}):
			print "No such time slot in waiting_list"
			waiting_list.update({"_id": restaurant_id}, {"$set": {time: [user_id]}})
		else:
			if not waiting_list.find_one({"$and":[{"_id": restaurant_id},{time: user_id}]}):
				print user_id + " dosen't exist."
				waiting_list.update({"_id": restaurant_id}, {"$push": {time: user_id}})
			else:
				print user_id +" already existed."

	# res = waiting_list.find_one({"_id": "mill-korean-new-york"})
	# print res
	# res = waiting_list.find_one({"_id": "the-dead-poet-new-york"})
	# print res
