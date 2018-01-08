# import requests
import json
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
import boto3
import base64

def get_image(usrAcc):
	# dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")
	Dy_client = boto3.client('dynamodb')
	response = Dy_client.get_item(TableName = ,Key = {})
	# print response
	# table = dynamodb.Table('tinder_user')
	# response = table.query(
	#     KeyConditionExpression=Key('user_account').eq(usrAcc)
	# )
	# prefix = png
	if 'Item' in response and len(response['Item']) != 0:
		filename = response['Item']['imageID']['S']
		ext = filename.split('.')[-1]
		S3_client = boto3.client('s3')
		response = S3_client.get_object(
			Bucket= ,
			Key=
		)
		return "data:image/"+ext.lower()+";base64,"+base64.b64encode(response['Body'].read())
	else:
		return ''

def lambda_handler(event, context):
    # TODO implement
    print event

    client = MongoClient()
    db = client.tindertable

    # # given the user_id, fetch the requests and invitations from the database
    given_id = event[]


    res = db.user_info.find_one({"_id":given_id})
    # ####################################
    results = {
        "firstname" : res['firstname'].capitalize(),
        "lastname" : res['lastname'].capitalize()
    }
    
    requests = []
    invitations = []
    
    for i in range(len(res['requests'])):
        req_reservation = db.reservation.find_one({"_id":ObjectId(res['requests'][i])})
        # print reservation

        # # given reservation_id
        # # fetch restaurant info and user Info from the databas    
        req_time = req_reservation['time']
        req_condition = req_reservation['condition']

        req_user_id = req_reservation['user_to']
        req_restaurant_id = req_reservation['restaurant_id']
        
        user_entity = db.user_info.find_one({"_id":req_user_id})
        
        # print "req_time:             " + req_time
        # print "req_user_id:          " + req_user_id
        # print "req_condition:        " + req_condition
        # print "req_restaurant_id:    " + req_restaurant_id
        restaurant_info = db.restaurants.find_one({"_id": req_restaurant_id})
        # pprint (restaurant_info)
        restaurant_name = restaurant_info["name"]
        ratings = restaurant_info["rating"]
        prices = restaurant_info["price"]
        categories = restaurant_info["categories"][0]["alias"]
        location = restaurant_info["location"]["address1"]
        # print "restaurant_name:       " + restaurant_name
        # print "ratings:               " + str(ratings)
        # print "categories:            " + categories
        # print "price:                 " + prices
        # print "location:              " + location
        # getUser = db.user_info.find_one({"_id":req_user_id})
        # TODO: get the user image from user_info collection
        requests.append({
            "req_id": str(res['requests'][i]),
            "req_time": req_time,
            "req_user_id" : req_user_id,
            "req_condition" : req_condition,
            "restaurant_name" : restaurant_name,
            "ratings" : str(ratings),
            "categories" : categories,
            "price" : prices,
            "location" : location,
            "firstname": user_entity['firstname'],
            "lastname":user_entity['lastname'],
            "photo": get_image(req_user_id)
        })
    
    results['requests'] = requests

    ###################################
    print "      "

    for i in range(len(res['invitations'])):
        inv_reservation = db.reservation.find_one({"_id":ObjectId(res['invitations'][i])})
        print 'inv_reservation_id:  '
        print res['invitations'][i]
        print '   '
        inv_time = inv_reservation['time']
        inv_condition = inv_reservation['condition']

        inv_user_id = inv_reservation['user_from']
        inv_restaurant_id = inv_reservation['restaurant_id']
        
        user_entity = db.user_info.find_one({"_id":inv_user_id})
        
        # print "inv_time:             " + inv_time
        # print "inv_user_id:          " + inv_user_id
        # print "inv_condition:        " + inv_condition
        # print "inv_restaurant_id:    " + inv_restaurant_id
        restaurant_info = db.restaurants.find_one({"_id": inv_restaurant_id})
        # pprint (restaurant_info)
        restaurant_name = restaurant_info["name"]
        ratings = restaurant_info["rating"]
        prices = restaurant_info["price"]
        categories = restaurant_info["categories"][0]["alias"]
        location = restaurant_info["location"]["address1"]
        # print "restaurant_name:       " + restaurant_name
        # print "ratings:               " + str(ratings)
        # print "categories:            " + categories
        # print "price:                 " + prices
        # print "location:              " + location
        
        # getUser = db.user_info.find_one({"_id":inv_user_id})
        # TODO: get the user image from user_info collection

        invitations.append({
            "inv_id" : str(res['invitations'][i]),
            "inv_time" : inv_time,
            "inv_user_id" : inv_user_id,
            "inv_condition" : inv_condition,
            "inv_restaurant_id" : inv_restaurant_id,
            "restaurant_name" : restaurant_name,
            "ratings" : str(ratings),
            "categories" : categories,
            "price" : prices,
            "location" : location,
            "firstname": user_entity['firstname'],
            "lastname":user_entity['lastname'],
            "photo": get_image(inv_user_id)
        })
    results['invitations'] = invitations
    
    return json.dumps(results)
