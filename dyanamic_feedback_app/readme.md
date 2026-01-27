command fo docker docke
docker run -d --name dynamic_feedback_app -v user_feedback:/app/user_feedback -v $(pwd):/app -v /app/node_modules -p 8000:8080  --env-file ./.env  dynamic_feedback_app:env