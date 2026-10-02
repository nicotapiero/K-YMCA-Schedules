# K-YMCA-Schedules

Note: I wrote this scriptlet modeling it off of very simple examples like https://github.com/amruthadasapathi-maker/K-weather (kindle modding discord is full of them - just check out https://github.com/crizmo/ for KWordle, KNotes, KAnki, etc)

Thing is, check the jailbreak you used on your kindle - for my kindle 4th gen, the jailbreak I used didn't support scriptlets :(

the workaround I did was making a KUAL app instead - basically copying the filestructure from KOReader, got close to what I wanted with these scripts:

launch.sh:
```bash
#!/bin/sh

URL="http://www.cambridgeymca.org/wp-content/uploads/2026/06/6826-GROUP-EXERCISE-SCHEDULE.pdf"
FILE="/mnt/us/documents/schedule.pdf"

eips -c
eips 2 2 "Downloading..."
sleep 1

wget "$URL" -O "$FILE"

if [ ! -f "$FILE" ]; then
    eips -c
    eips 2 2 "Download failed"
    sleep 10
    exit 1
fi

eips -c
eips 2 2 "Opening in KOReader..."

sleep 1

# KOReader path (most common installs)
if [ -x /mnt/us/koreader/koreader.sh ]; then
    sh /mnt/us/koreader/koreader.sh "$FILE"
    exit 0
fi

# fallback locations (some installs differ)
if [ -x /mnt/us/extensions/koreader/koreader.sh ]; then
    sh /mnt/us/extensions/koreader/koreader.sh "$FILE"
    exit 0
fi

# if KOReader not found
eips -c
eips 2 2 "KOReader not found!"
eips 2 4 "Install KOReader first"
sleep 15
```


launch_copy.sh
```
#!/bin/sh
# --- True Native Freeze Kindle Engine ---

BASEDIR=$(dirname "$0")
cd "$BASEDIR"

# 1. FIND AND FREEZE THE NATIVE INTERFACE (The KOReader Method)
# This looks for the active Amazon GUI process name (usually 'cvm', 'awesome', or 'lipc')
# and puts it to sleep using standard Linux signals.
GUI_PID=$(pgrep -f "cvm|awesome|lab126_gui" | head -n 1)

if [ ! -z "$GUI_PID" ]; then
    # Send SIGSTOP to freeze the touch grid and interface completely
    kill -STOP "$GUI_PID"
fi

# Disable screen saver sleep
lipc-set-prop com.lab126.powerd preventScreenSaver 1 2>/dev/null

# Clean the canvas
eips -c
sleep 0.5

# 2. THE APP ENVIRONMENT LOOP
TIMER=10
while [ $TIMER -gt 0 ]; do
    eips 2 2  "========================================="
    eips 2 4  "             NICO'S ISOLATED PAD         "
    eips 2 6  "========================================="
    
    eips 4 12 "  [ SUCCESS ] Home screen is fully frozen! "
    eips 4 14 "  Time remaining in app: $TIMER seconds   "
    
    sleep 1
    TIMER=$((TIMER - 1))
done

# 3. CLEANUP AND CLEAN UNFREEZE
eips -c
eips 2 12 "Resuming Kindle interface..."

# Restore power saver settings
lipc-set-prop com.lab126.powerd preventScreenSaver 0 2>/dev/null

if [ ! -z "$GUI_PID" ]; then
    # Send SIGCONT to instantly wake up the touch grid and interface
    kill -CONT "$GUI_PID"
fi

# FIX THE BLANK PAGE BUG: Force the Kindle to completely redraw the KUAL menu
# -f forces a full e-ink refresh flash, -g forces a complete UI redraw
sleep 0.5
eips -f -g

exit 0
```
