# #########################################
#
# Functionality: ( for 'home' page )
# Search the location, keyword
# Given 'search_stirng', 'date', 'time'
#
# #########################################

import requests
import json
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
# from pprint import pprint
import re
from urllib import quote


def lambda_handler(event, context):
	print event
	print context
	client = MongoClient()
	db = client.tindertable
	restaurants = db.restaurants

	# user input
	search_string = 
	date = 
	time =
	
	if 'location' in event:
		print 'location info found'
		search_string = event['location']
	if 'date' in event:
		print 'date info found'
		date = event['date']
	if 'time' in event:
		print 'time info found'
		time = event['time']
	
	print search_string, date, time

	regx = re.compile(search_string, re.IGNORECASE)

	cursor = restaurants.find({'name': regx})
	# cursor = restaurants.find({"name":{"$regex":"*columbia/"}})

	# print cursor
	results = []
	if cursor != None:
		for i in cursor:
			results.append(i)
	print "name match results:", len(results)

	# if cannot find name matches, using geometric matching
	if len(results) == 0:
		g_api =  
		g_url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+quote(search_string)+'&key='+g_api
		r = requests.get(g_url)
		data = json.loads(r.text)['results']
		if len(data) > 0:
			loc = data[0]['geometry']['location']
			print loc
			cur = restaurants.find({"$and" : 
				[{'coordinates.latitude': {"$lt": loc['lat']+0.002}},
				{'coordinates.longitude': {"$lt": loc['lng']+0.002}},
				{'coordinates.latitude': {"$gt": loc['lat']-0.002}},
				{'coordinates.longitude': {"$gt": loc['lng']-0.002}}
				]})

			for j in cur:
				results.append(j)
		print "GPS match results:", len(results)

	restaurants = []
	for tmp_rest in results:
		res = {
			"restaurant_id": tmp_rest['id'],
			"time":[],
			"waitlist":[],
			"available":[],
			"restaurant_name": tmp_rest['name'],
			"image_url": tmp_rest['image_url'],
			"categories": tmp_rest['categories'],
			# "price": tmp_rest['price'],
			"location": tmp_rest['location']
			}
		if 'rating' in tmp_rest:
			res["rating"] = tmp_rest["rating"]
		else:
			res["rating"] = 4
		if 'price' in tmp_rest:
			res["price"] = tmp_rest['price']
		else:
			res["price"] = '$'
			
		if 'review_count' in tmp_rest:
			res['review_count'] = tmp_rest['review_count']
		else:
			res['review_count'] = 0
		
		if 'reviews' in tmp_rest and 'reviews' in tmp_rest['reviews'] and \
		len(tmp_rest['reviews']['reviews']) > 0:
			res['first_review'] = tmp_rest['reviews']['reviews'][0]
			
		restaurants.append(res)

	waiting_list = db.waiting_list

	hh = int(time.split(':')[0])
	mm = int(time.split(':')[1])
	times = []
	if mm == 0:
		times = [str(hh - 1).zfill(2)+':00',
				str(hh - 1).zfill(2)+':30',
				str(hh).zfill(2)+':00',
				str(hh).zfill(2)+':30',
				str(hh + 1).zfill(2)+':00']
	else:
		times = [str(hh - 1).zfill(2)+':30',
				str(hh).zfill(2)+':00',
				str(hh).zfill(2)+':30',
				str(hh + 1).zfill(2)+':00',
				str(hh + 1).zfill(2)+':30']
	# print times


	for restaurant in restaurants:
		restaurant["time"] = times
		for i in xrange(5):
			time_slot = date + " " + times[i]
			if db.restaurants.find_one({"_id": restaurant["restaurant_id"]}):
				# print "found the restaurant: " + restaurant["restaurant_id"]
				ac_list = db.restaurants.find_one({"_id": restaurant["restaurant_id"]})["accepted_list"]
				# print ac_list
				# print time_slot
				if time_slot in ac_list:
					# print " Found the restaurant list! " 
					# print ac_list[time_slot]
					length = len(ac_list[time_slot])
					# print length
					if length >= 5:
						restaurant["available"].append("false")
					else:
						restaurant["available"].append("true")
				else:
					restaurant["available"].append("true")

			# search waiting_list
			if waiting_list.find_one({"_id": restaurant["restaurant_id"]}):
				# print "found the restaurant: " + restaurant["restaurant_id"]
				if waiting_list.find_one({"$and":[{"_id": restaurant["restaurant_id"]},
												{time_slot: { "$exists": "true" }}]}):
					num_in_wl = len(waiting_list.find_one({"_id": restaurant["restaurant_id"]})[time_slot])
					# print num_in_wl
					restaurant["waitlist"].append(num_in_wl)
				else:
					restaurant["waitlist"].append(0)
				
			else:
				# print "Cannot find the restaurant: " + restaurant["restaurant_id"]
				restaurant["waitlist"] = [0, 0, 0, 0, 0]
		restaurant["aw_list"] = []
		for i in range(5):
			restaurant["aw_list"].append({
				'time': times[i],
				'available':restaurant["available"][i],
				'waitlist':restaurant["waitlist"][i]
			})
	return restaurants

# pprint (restaurants)