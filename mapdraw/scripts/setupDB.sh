
# Wait for MongoDB to start
until mongosh --eval "print(\"waited for connection\")"
do
    sleep 1
done


mongosh --file indexes.js --file exampleData.js
