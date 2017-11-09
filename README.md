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

## Create a EC2 instance

```
./setup/create-instance.sh
```
