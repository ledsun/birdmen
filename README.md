# Birdmen

The birdmen predicts every worker's schedule in Luxiar company.

I chose the name from a promotional video of THEE MICHELLE GUN ELEPHANT song  '[Birdmen](https://www.youtube.com/watch?v=AKJnR8JPX2Q)'.

# Run as stand alone

```
npm i
npm start
```

# Setup on the AWS
## Prepare
You need ...

1. An AWS account
1. A private key file as `birdmen.pem`

  See http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html

1. `AWS Command Line Interface` was set up already

  See http://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html

1. A profile of `aws` as `birdmen` was set up already

  For example, in `~/.aws/credentials`
```
[birdmen]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

  And in `~/.aws/config`
```
[profile birdmen]
region = ap-northeast-1
```

1. `jq` was set up already

  See https://github.com/stedolan/jq/wiki/Installation

1. `security-group` and `subnet`

  Edit their id in `./setup/create-instance.sh`

1. ID and Password for Fusion workflow

  Rename `secret.json.example` to `secret.json` and edit values.

1. API Token for Chatwork

  Rename `secret.json.example` to `secret.json` and edit values.

1. ID of a room that is sent messages to

  Edit their id in `./cron/birdmen_weekday_morning`

## Create a EC2 instance

```
./setup/create-instance.sh
```

# Debugging errors in running

## The server is alive?
### Get EC2 instance ID

```sh
aws ec2 describe-instances --profile birdmen | jq '.Reservations' | jq 'map(select(.Instances[0].Tags[0].Value == "birdmen"))' |jq '.[].Instances[].InstanceId'
```

### Get EC2 instance Status
```sh
aws ec2 describe-instance-status --profile birdmen --instance-ids i-00a1a71b600652de7
```

Change the instance ID to appropriate one.

## The command was runned by the cron?

### Login to the serever

```sh
ssh -i birdmen.pem ec2-user@ec2-13-115-38-17.ap-northeast-1.compute.amazonaws.com
```

Change the public DNS to appropriate one.

### Look at the log of the cron

```sh
grep ec2-user /var/log/cron
```

## The command finished in success?

```sh
cat /tmp/birdmen.log
cat /tmp/birdmen-error.log
```

## Try to run command

```sh
npm start
```
