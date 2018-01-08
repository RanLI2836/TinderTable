# #################################################
#
# Functionality: ( for restaurant info page )
# Get 'restaurant_id', 'user_id', 'time'
# display the waiting list and restaurant info
#
# #################################################
import pymongo
from pymongo import MongoClient
from bson import ObjectId
import boto3
import base64

def get_image(usrAcc):
	# dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")
	Dy_client = boto3.client('dynamodb')
	response = Dy_client.get_item(TableName = '',Key = {})
	# print response

	if 'Item' in response and len(response['Item']) != 0:
		filename = response['Item']['imageID']['S']
		ext = filename.split('.')[-1]
		S3_client = boto3.client('s3')
		response = S3_client.get_object(
			Bucket=,
			Key=
		)
		return "data:image/"+ext.lower()+";base64,"+base64.b64encode(response['Body'].read())
	else:
		return ''



def lambda_handler(event, context):
	client = MongoClient()
	db = client.tindertable
	waiting_list = db.waiting_list
	
	print event

	# default data
	restaurant_id = 
	user_id = 
	time =

	if 'restaurant_id' in event and event['restaurant_id'] != '':
		restaurant_id = event['restaurant_id']
	if 'user_id' in event and event['user_id'] != '':
		user_id = event['user_id']
	if 'date' in event and event['date'] != '' and 'time_slot' in event and event['time_slot'] != '':
		time = ' '.join([event['date'], event['time_slot']])

	print restaurant_id, user_id, time

	#  1. Search waiting_list, fetch the targets
	targets = []
	if not waiting_list.find_one({"_id": restaurant_id}):
		print "No such restaurant in waiting_list"
	else:
		if not waiting_list.find_one({"$and":[{"_id": restaurant_id},
											{ time: { "$exists": "true" }}]}):
			print "No such time slot in waiting_list"
		else:
			user_list = waiting_list.find_one({"_id": restaurant_id})[time]
			for user in user_list:
				# print user
				# img_url = db.user_info.find_one({"_id": user})["image"]
				# print img_url
				targets.append({
					"user_id": user
					})

	#  2. Search restaurant info
	restaurant = db.restaurants.find_one({"_id": restaurant_id})
	# pprint (restaurant)

	restaurant_info = {
		"restaurant_id": restaurant_id,
		"restaurant_name": restaurant["name"],
		"ratings": restaurant["rating"],
		"prices": restaurant["price"],
		"categories": restaurant["categories"][0]["alias"],
		"location": restaurant["location"]["address1"],
		"reviews": restaurant["reviews"],
		"review_count": restaurant["review_count"],
		"phone": restaurant["phone"],
		"image_url": restaurant["image_url"],
		"time" : time
	}
	print (restaurant_info)
	print (" ")
	print (targets)

	for target in targets:
		target["photo"] = get_image(target["user_id"])
	
	return {
		"restaurant_info": restaurant_info,
		"targets": targets
	}

