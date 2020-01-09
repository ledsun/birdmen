#!/bin/bash

PEM=birdmen.pem
HOST=$1

ssh -oStrictHostKeyChecking=no -i $PEM ec2-user@$HOST << EOF
  # Install Node.js.
  sudo yum update -y
  curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
  sudo yum -y install nodejs

  # Shared libraries for chronium
  # See https://github.com/GoogleChrome/puppeteer/issues/391#issuecomment-325420271
  sudo yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y

  # Create application directory
  mkdir birdmen
EOF

# Setup node app
export RSYNC_RSH="ssh  -oStrictHostKeyChecking=no -i $PEM"
rsync -rav --delete --exclude .git --exclude .gitignore --exclude node_modules --exclude README.md --exclude .DS_Store --exclude setup --exclude cron --exclude birdmen.pem --exclude secret.json.example $(pwd)/ ec2-user@$HOST:birdmen

ssh  -oStrictHostKeyChecking=no -i $PEM ec2-user@$HOST << EOF
  cd birdmen
  npm i
EOF

# Setup cron
scp -oStrictHostKeyChecking=no -i $PEM cron/birdmen_weekday_morning ec2-user@$HOST:.
ssh  -oStrictHostKeyChecking=no -i $PEM ec2-user@$HOST << EOF
  chmod 644 birdmen_weekday_morning
  sudo chown root:root birdmen_weekday_morning
  sudo mv birdmen_weekday_morning /etc/cron.d/
EOF

echo If you want ssh login the instance:
echo ssh -i $PEM ec2-user@$HOST
