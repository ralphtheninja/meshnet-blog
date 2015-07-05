First things, first. If you don't have `OpenWRT` installed on your system we need to fix that:

```
$ cd ~/src
$ git clone git://git.openwrt.org/openwrt.git
Cloning into 'openwrt'...
```

You also need to have the correct dependencies for your system. In my case that is Ubuntu. I used [this script](https://github.com/ralphtheninja/dotfiles/blob/6972143d872bcc6cc7e53d64f750a23b5960bbd6/install-openwrt-dependencies).

Make sure all feeds are updated:

```
$ cd openwrt
$ ./scripts/feeds update -a
```

What this means is that `./feeds.conf` (or `./feeds.conf.default` if it's missing) will be read by the feeds script. Check out those files if you are looking to add more feeds to your build. For example you have your own set of applications that should be pulled in and built. You could do that easily since the build system supports all major version control systems.

You *can* install *all* of them by doing:

```
$ ./scripts/feeds install -a
```

This is something you normally wouldn't do. So think about what you really need to add.

We are going to install cjdns though which is in the `luci-app-cjdns` package, which is part of the [`routing feed`](https://github.com/openwrt-routing/packages). If we take a look at the `Makefile` for `luci-app-cjdns` we notice that it in turn depends on [cjdns and luci-base](https://github.com/openwrt-routing/packages/blob/0ead547ab9b5e6489fce702123fb5742d803898f/luci-app-cjdns/Makefile#L34).

Install it by doing:

```
$ ./scripts/feeds install luci-app-cjdns
Installing package 'luci-app-cjdns'
Installing package 'cjdns'
Installing package 'lua-bencode'
Installing package 'dkjson'
Installing package 'luasocket'
Installing package 'lua-sha2'
Installing package 'luci-base'
Installing package 'luci-lib-nixio'
Installing package 'luci-lib-ip'
```

Now `luci-app-cjdns` should be available in the next step. Where we do our configuration:

```
$ make menuconfig
```

This will start up a gui in the console:

![make-menuconfig](/images/mc1.jpg)

The first alternative is picking `Target System`. Here we pick the `Atheros AR7xxx/AR9xxx` alternative:

![target-system](/images/mc2.jpg)

The second alternative is picking `Subtarget`. There might be different versions of the same router model. In this case we want the middle option `Generic devices with NAND flash`:

![subtarget](/images/mc3.jpg)

In the third alternative we have to select `Target Profile`. In our case this means we will build binaries for both `WNDR3700v4` and `WNDR4300`. What the exact difference is, I don't know, if there is any difference at all.

![target-profile](/images/mc4.jpg)

Finally we're also going to select `Build the OpenWRT Image Builder` and `Build the OpenWRT SDK`.

There are *loads* of other things you can configure, but since I don't really know what I'm doing and don't want to dive into more rabbit holes, I'm just going to leave the rest as is.

The first page now looks like:

![main](/images/mc5.jpg)

Before we finish we also need to add `luci-app-cjdns`. From main page we select `LuCI` and then `Applications`. Here we have the option to select if it should be built as a module or built-in.

The difference is that if we select built-in (`<*>`), the binaries will be included in the image when we flash the device. If we pick module (`<M>`) the binaries will be compiled into `.ipk` files which we later can use `opkg` to install, but they will not be part of the final image.

I'm going to go with `<*>` just to try things out.

Save `make menuconfig` by selecting `< Save >` at the bottom. A dialog will be shown asking for the file name, use default `.config`. After we are done, lets take a look at what `.config` looks like. It's basically a text file where each row shows if something is enabled or not:

```
#
# Automatically generated file; DO NOT EDIT.
# OpenWrt Configuration
#
CONFIG_MODULES=y
CONFIG_HAVE_DOT_CONFIG=y
# CONFIG_TARGET_ppc44x is not set
# CONFIG_TARGET_realview is not set
# CONFIG_TARGET_arm64 is not set
# CONFIG_TARGET_sunxi is not set
# CONFIG_TARGET_ath25 is not set
CONFIG_TARGET_ar71xx=y
..
```

We can use `./scripts/diffconfig.sh` to get a diff we can also apply to a standard configuration:

```
$ ./scripts/diffconfig.sh
CONFIG_TARGET_ar71xx=y
CONFIG_TARGET_ar71xx_nand=y
CONFIG_TARGET_ar71xx_nand_WNDR4300=y
CONFIG_IB=y
CONFIG_IB_STANDALONE=y
CONFIG_MAKE_TOOLCHAIN=y
CONFIG_PACKAGE_cjdns=y
CONFIG_PACKAGE_dkjson=y
CONFIG_PACKAGE_kmod-tun=y
CONFIG_PACKAGE_liblua=y
CONFIG_PACKAGE_libpthread=y
CONFIG_PACKAGE_librt=y
CONFIG_PACKAGE_libuci-lua=y
CONFIG_PACKAGE_lua=y
CONFIG_PACKAGE_lua-bencode=y
CONFIG_PACKAGE_lua-sha2=y
CONFIG_PACKAGE_luasocket=y
CONFIG_PACKAGE_luci-app-cjdns=y
CONFIG_PACKAGE_luci-base=y
CONFIG_PACKAGE_luci-lib-ip=y
CONFIG_PACKAGE_luci-lib-nixio=y
CONFIG_PACKAGE_rpcd=y
CONFIG_SDK=y
```

Time to compile.

```
$ make
```

Once make is done the resulting binaries can be found in `./bin/<devicetype>`. In our case that's `ar71xx`:

```
$ ls -l bin/ar71xx/
md5sums
openwrt-ar71xx-nand-root.squashfs
openwrt-ar71xx-nand-root.squashfs-64k
openwrt-ar71xx-nand-uImage-gzip.bin
openwrt-ar71xx-nand-uImage-lzma.bin
openwrt-ar71xx-nand-vmlinux.bin
openwrt-ar71xx-nand-vmlinux.elf
openwrt-ar71xx-nand-vmlinux.gz
openwrt-ar71xx-nand-vmlinux.lzma
openwrt-ar71xx-nand-vmlinux-lzma.elf
openwrt-ar71xx-nand-wndr3700v4-squashfs-sysupgrade.tar
openwrt-ar71xx-nand-wndr3700v4-ubi-factory.img
openwrt-ar71xx-nand-wndr4300-squashfs-sysupgrade.tar
openwrt-ar71xx-nand-wndr4300-ubi-factory.img
OpenWrt-ImageBuilder-ar71xx-nand.Linux-x86_64.tar.bz2
OpenWrt-SDK-ar71xx-nand_gcc-4.8-linaro_musl-1.1.10.Linux-x86_64.tar.bz2
OpenWrt-Toolchain-ar71xx-nand_gcc-4.8-linaro_musl-1.1.10.Linux-x86_64.tar.bz2
packages
sha256sums
```

That's a whole lot of files. The one I'm primarily interested in is `openwrt-ar71xx-nand-wndr4300-ubi-factory.img`. This is the file I have to flash my router with (through the `luci` web interface). There's functionality in OpenWRT to save current configuration that you can copy back over once the system has been re-flashed.

There's also `openwrt-ar71xx-nand-wndr4300-squashfs-sysupgrade.tar` which should also be applied. Currently I'm not sure what this does exactly. Why build a `.img` *and* a sysupgrade? Why can't you just bundle the sysupgrade with the image? Or is it included? I don't know, yet :)

Finally, before I bore you to death, there's a folder `./bin/ar71xx/packages` which contains all the separate packages, i.e. the corresponding `.ipk` files. You can use `opkg` to install files separately as well, which is good to know. So if I wanted to install `cjdns` separately on another device, I could do that.


