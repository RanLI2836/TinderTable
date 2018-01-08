# #########################################
#
# Functionality: ( for 'info' page )
# Click button "Invite"
# Given 'user_to'(list), 'restaurant_id', 'time slot', 'user_id'
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

	# testcase
	user_to_id = 
	restaurant_id = 
	time = 
	user_id = 

	
	if "user_to_id" in event and "restaurant_id" in event and "time" in event and "user_id" in event:
		user_to_id = event.user_to_id
		restaurant_id = event.restaurant_id
		time = event.time
		user_id = event.user_id

	# Create reservation
	if db.reservation.find_one({"$and":[{"user_id": user_id},
										{"user_to": user_to_id},
										{"restaurant_id": restaurant_id},
										{"time":time}]}):
		print "Reservation exists." 
		
	else:
		# print "Reservation doesn't exist."
		reservation = {
			"user_id": user_id,
			"user_to": user_to_id,
			"restaurant_id": restaurant_id,
			"time":time,
			"condition":"pending"
		}
		res_id = db.reservation.insert(reservation)
		print res_id
		db.user_info.update({"_id": user_id}, {"$push": {"requests": res_id}})
		db.user_info.update({"_id": user_to_id}, {"$push":{"invitations":res_id}})
		print "Done! Already push the request and invitation"




