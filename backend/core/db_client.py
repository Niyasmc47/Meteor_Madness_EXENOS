# backend/core/db_client.py
import os
from pymongo import MongoClient

# Get the MongoDB connection string from the .env file
MONGO_URI = os.getenv('MONGO_URI')

# Create a singleton client instance
client = MongoClient(MONGO_URI)

# Specify the database to use
db = client['meteor-madness-db']