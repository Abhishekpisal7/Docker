FROM ubuntu:22.04

WORKDIR /app

COPY . /app

RUN apt update && apt install -y python3 && rm -rf /var/lib/apt/lists/*

ENV NAME world

CMD ["python3", "app.py"]