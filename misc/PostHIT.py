#! python
from pymongo import MongoClient
from boto.mturk.connection import MTurkConnection
from boto.mturk.question import ExternalQuestion
import boto.mturk.qualification as mtqu
from dateutil.parser import *

ACCESS_ID = 'YourTurkAccessID'
SECRET_KEY = 'YourTurkSecretKey'
#HOST = 'mechanicalturk.sandbox.amazonaws.com' # Use this to post to the sandbox instead
HOST = 'mechanicalturk.amazonaws.com'

def PostHits():
  mtc = MTurkConnection(aws_access_key_id=ACCESS_ID,
                        aws_secret_access_key=SECRET_KEY,
                        host=HOST)
  
  
  q = ExternalQuestion(external_url = "url", frame_height=675)
  keywords = ['memory', 'psychology', 'game', 'fun', 'experiment', 'research']
  title = 'Type the name of the months and days of the week quickly!'
  experimentName = 'MonthNumberGame'
  description = 'Play a short 2 minute game where you have to know the numbers that go with months and days.'
  pay = 0.50
  
  qualifications = mtqu.Qualifications()
  qualifications.add(mtqu.PercentAssignmentsApprovedRequirement('GreaterThanOrEqualTo', 90))
  qualifications.add(mtqu.LocaleRequirement("EqualTo", "US"))
  #qualifications.add(mtqu.Requirement("2Z046OQ1SNQQREGXAFSQPCNR1605PN"))

  theHIT = mtc.create_hit(question=q,
                          lifetime=10 * 60 * 60, # 10 hours
                          max_assignments=3,
                          title=title,
                          description=description,
                          keywords=keywords,
                          qualifications=qualifications,
                          reward=pay,
                          duration=120 * 60, # 120 minutes
                          approval_delay=5 * 60 * 60, # 5 hours
                          annotation=experimentName)

  assert(theHIT.status == True)
  print theHIT
  print theHIT[0].HITId

def InitializeDB():
	client = MongoClient('192.168.99.100', 27017)
	db = client.mturk
	db.drop_collection('condition')
	db.drop_collection('responses')
	conditions = db.condition

	val = 1
	# improve by using bulk insert
	while val <= 100:
		condition = {id: val, worker_id: None, assignment_id: None, hit_id: None, status: 'open'}
		conditions.insert_one(condition)
		val += 1

InitializeDB()
PostHits()