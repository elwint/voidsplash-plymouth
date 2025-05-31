#!/bin/sh
check () {
	if ! grep -q "/bin/plymouth" "$1"; then
		sudo sed -i "2 a/bin/plymouthd && /bin/plymouth --show-splash change-mode --shutdown &" "$1"
	fi
}

check /etc/runit/3 # Shutdown
