
#!/bin/sh
if !(mongo 127.0.0.1/metabot --eval "db.dropDatabase()" --quiet | jq ".dropped" -e > /dev/null)
	then echo 'Bruh! The Database is already reset.';
fi

id=$(cat ~/.metabotid)
secret=$(cat ~/.metabotsecret)
mongo 127.0.0.1/metabot --eval "db.getCollection('global').insertOne({id:'$id',secret:'$secret'})"
