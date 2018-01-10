#!/bin/bash

# Delete old instances with the **birdmen** tag, and append the **birdmen** tag to the new instance
NEW_INSTANCE=$1

aws ec2 describe-instances --profile birdmen | jq '.Reservations' | jq 'map(select(.Instances[0].Tags[0].Value == "birdmen"))' |jq '.[].Instances[].InstanceId' | xargs aws ec2 terminate-instances --profile birdmen --instance-ids
aws ec2 create-tags --profile birdmen --resources $NEW_INSTANCE --tags Key=Name,Value=birdmen
