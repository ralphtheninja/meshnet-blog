I've always been fascinated by networks but haven't really gotten to create them to understand them better. A network is so important to all sorts of topologies and especially for decentralized applications. I believe that for decentralized applications to really thrive you also need a decentralized network infrastructure.

So anyway, I realized I wanted to know more about mesh networks and how to build them so I asked on twitter if anyone knew anything about upcoming conferences involving mesh networks (*always* go to the source!). A friend responded and mentioned [`#battlemesh`](http://battlemesh.org/BattleMeshV8) in Maribor, Slovenia. The conference is, believe it or not, a battle between different network routing protocols, to name a few:

* [B.A.T.M.A.N.](http://www.open-mesh.org/projects/open-mesh/wiki)
* [BMX6](http://bmx6.net/projects/bmx6)
* [Babel](http://www.pps.univ-paris-diderot.fr/~jch/software/babel/)
* [802.11s](http://open80211s.org/open80211s/)
* [Static Routing](https://en.wikipedia.org/wiki/Static_routing)

At the bottom they are running [`OpenWRT`](https://openwrt.org/), which is small linux distribution for embedded devices. What's also cool is that `OpenWRT` has a package manager called `opkg` and with it you can install software for your needs.

Based on the information above and Wikipedia I decided to buy a router that I know works well with `OpenWRT`. I picked [`Netgear WNDR4300`](http://www.netgear.com/home/products/networking/wifi-routers/wndr4300.aspx) because of the following reasons:

* It has an Atheros MIPS processor, which means I can run `node` on it. I might want to try out `luvit` and `jxcore` as well, since they have lower memory footprint.
* It has 128MB RAM, which is a lot of memory compared to other smaller routers. Values in the range 4MB to 16MB is not uncommon.
* It has 128MB flash memory. This is also a lot higher than most routers.
* The cpu clocks in on 560MHz. There are both faster and slower routers. I didn't pick the fastest because I think memory is more important.
* USB. This obviously means I'll be able to connect other devices, such as usb pen drives, extra hard drives or other things, why not a camera? :)

Tomorrow I'll have a smoking router in my hands so flashing `OpenWRT` onto the device will have high priority!

Cheers

/Magnus
