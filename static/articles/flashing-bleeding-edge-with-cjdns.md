I think I finally understand the difference between `.img` files and sysupgrade `tar` files.

The image file (correct me if I'm wrong) is used when flashing the device for the first time and you use the sysupgrade file whenever you update OpenWRT to another version. They are also very similar in size so it makes sense.

When flashing the device you select `System` and then `Backup / Flash Firmware` in the menu at the top. This will take you to the following page:

![flash1](/images/flashing-page.jpg)

If the `Keep settings:` checkbox is ticked flashing a sysupgrade will keep the current configuration. At the top of the page you can also download a backup of the current configuration. I suggest you do this everytime you do major changes. If something breaks it's easy to revert to a previous configuration.

Now click the `Browse...` button to the right of `Image:` and select your sysupgrade file. In our case this is `openwrt-ar71xx-nand-wndr4300-squashfs-sysupgrade.tar`. OpenWRT will tell you if there is something wrong with the file. So it doesn't just flash any binary you give it, which is nice. E.g. I obviously tried to flash the `.img` file but OpenWRT complained.

Once you have done this, click the `Flash Image...` button. This will take you to the verify page, so you can check that the binary has the correct checksum:

![flash2](/images/flash-firmware-verify.jpg)

The check sums can be found in `./bin/<yourdevice>/{md5sums,sha256sums}`.

Once you click the `Proceed` button luci will show you the following page:

![flash3](/images/system-flashing.jpg)

Anyway, the stuff I built before was causing me some problems. I don't think I enabled `luci` when doing `make menuconfig` because after flashing the device I could not connect to the web ui. I could however ssh into the device and the network was up and running.

I ended up doing:

```
$ ssh router
openwrt # opkg update
openwrt # opkg install luci
Installing luci (git-15.185.69600-cfd8ad8-1) to root...
..
```

After this I could connect to the luci web interface without any problems. This time around we have a new alternative in the `Services` menu: `cjdns`!

I'll leave you with this now since I need to dive into cjdns more. But before we part I have to show you something cool. If we ssh into the router and check `ifconfig` we notice that a new network interface has been created:

```
tuncjdns  Link encap:UNSPEC  HWaddr 00-00-00-00-00-00-00-00-..
          UP POINTOPOINT RUNNING NOARP MULTICAST  MTU:1304  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:2 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:500
          RX bytes:0 (0.0 B)  TX bytes:152 (152.0 B)
```
