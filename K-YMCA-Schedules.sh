#!/bin/sh

# Name: K YMCA Schedules
# Author: nicotapiero

SOURCE_DIR="/mnt/us/documents/k-ymca-schedules"
TARGET_DIR="/var/local/mesquite/k-ymca-schedules"

DB="/var/local/appreg.db"
APP_ID="xyz.nicotapiero.k.ymca.schedules"

# Copy app files into runtime directory
if [ -d "$SOURCE_DIR" ]; then
    if [ -d "$TARGET_DIR" ]; then
        rm -rf "$TARGET_DIR"
    fi
    cp -r "$SOURCE_DIR" "$TARGET_DIR"
else
    exit 1
fi

# Register app in system database
sqlite3 "$DB" <<EOF
INSERT OR IGNORE INTO interfaces(interface) VALUES('application');

INSERT OR IGNORE INTO handlerIds(handlerId) VALUES('$APP_ID');

INSERT OR REPLACE INTO properties(handlerId,name,value)
  VALUES('$APP_ID','lipcId','$APP_ID');

INSERT OR REPLACE INTO properties(handlerId,name,value)
  VALUES('$APP_ID','command','/usr/bin/mesquite -l $APP_ID -c file://$TARGET_DIR/');

INSERT OR REPLACE INTO properties(handlerId,name,value)
  VALUES('$APP_ID','supportedOrientation','U');
EOF

echo "Registered YMCA Schedules ($APP_ID)"

sleep 2

# Launch app
nohup lipc-set-prop com.lab126.appmgrd start app://$APP_ID >/dev/null 2>&1 &
