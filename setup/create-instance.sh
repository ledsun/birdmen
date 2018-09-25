#!/bin/bash
# 注意1：awsコマンドとjqコマンドが必要です。
# http://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-install-macos.html
# https://github.com/stedolan/jq/wiki/Installation
INSTANCE_ID=$(aws ec2 run-instances --image-id ami-08847abae18baa040 --count 1 --instance-type t2.micro --key-name birdmen --security-group-ids sg-20a1f244 --subnet-id subnet-998a7cee --profile birdmen |jq -r .Instances[].InstanceId
)

echo $INSTANCE_ID was created

PUBLIC_DNS=$(aws ec2 describe-instances --profile birdmen --instance-ids $INSTANCE_ID |jq -r .Reservations[].Instances[].PublicDnsName
)

echo waiting for starting the ssh server
sleep 60s

echo ./setup/provisioning.sh $PUBLIC_DNS
./setup/provisioning.sh $PUBLIC_DNS

echo If you want to delete the instance:
echo aws ec2 terminate-instances --profile birdmen --instance-ids $INSTANCE_ID
echo If you want to use the instance:
echo ./setup/blue-green-deployment.sh $INSTANCE_ID
