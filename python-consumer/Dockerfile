# Dockerfile for Python Consumer with venv
FROM python:3.7-slim

WORKDIR /usr/src/app

# Create a virtual environment
RUN python -m venv /usr/src/app/venv

# Ensure the virtual environment is active
ENV PATH="/usr/src/app/venv/bin:$PATH"

# Copy the requirements file
COPY requirements.txt ./

# Install dependencies within the virtual environment
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set environment variables if any (example values, update as needed)
ENV MONGODB_URI="mongodb+srv://gokul:UPw3fCb6kDmF5CsE@cluster0.klfb9oe.mongodb.net/?retryWrites=true&w=majority"
ENV RABBITMQ_HOST="localhost"
ENV RABBITMQ_PORT=5672

# Run the application
CMD ["python3", "consumer.py"]
