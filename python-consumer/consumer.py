import os
import pika
import pymongo
import json



# Get MongoDB connection string from environment variables
mongodb_uri = os.getenv("MONGODB_URI", "mongodb+srv://gokul:UPw3fCb6kDmF5CsE@cluster0.klfb9oe.mongodb.net/?retryWrites=true&w=majority")

# Connect MangoDB Client
client = pymongo.MongoClient(mongodb_uri)

db = client.userdb
collection = db.users


def callback(ch, method, properties, body):
    user = json.loads(body)
    collection.insert_one(user)
    print(f"Inserted user: {user}")

# Get RabbitMQ connection parameters from environment variables
rabbitmq_host = os.getenv('RABBITMQ_HOST', 'localhost')
rabbitmq_port = int(os.getenv('RABBITMQ_PORT', 5672))

# Connect to RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host, port=rabbitmq_port))
channel = connection.channel()
channel.queue_declare(queue='userQueue')

channel.basic_consume(queue='userQueue', on_message_callback=callback, auto_ack=True)

print('Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
