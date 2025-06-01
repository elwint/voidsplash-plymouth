# voidsplash-plymouth

A plymouth splash screen theme for Void Linux. Source of original image: <https://github.com/StaticRocket/Linux-Wallpapers>.

I added animations to the original svg image and generated the frames using Puppeteer. See the `generate` folder if you want to make your own modifictions and generate new frames. Note that more frames and larger images slow down plymouth and increase boot time.

## Installation

Copy the folder of the theme variation you want to use to `/usr/share/plymouth/themes/` and run `sudo plymouth-set-default-theme -R voidsplash-X`

## Splash on shutdown/reboot

Copy `00-voidsplash.sh` to `/etc/runit/shutdown.d/`

## Theme variations

| ![voidsplash-1](generate/voidsplash-1.svg) | ![voidsplash-2](generate/voidsplash-2.svg) |
|:-----------------------------------------:|:-----------------------------------------:|
| **voidsplash-1**                          | **voidsplash-2**                          |

| ![voidsplash-1s](generate/voidsplash-1s.svg) | ![voidsplash-2s](generate/voidsplash-2s.svg) |
|:-------------------------------------------:|:-------------------------------------------:|
| **voidsplash-1s**                           | **voidsplash-2s**                           |
