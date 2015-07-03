Here we have a variety of protocols to pick from. They also differ on what [`layer`](https://en.wikipedia.org/wiki/OSI_model) they run on.

For example, there's [`batman-adv`](http://www.open-mesh.org/projects/batman-adv/wiki) which runs on layer 2, meaning it's a kernel module which has been part of the linux kernel for a while now, so should be easy to get going by enabling it.

An example of something running on layer 3 is [`cjdns`](https://github.com/cjdelisle/cjdns) which also has a `README` in [russian](https://github.com/cjdelisle/cjdns/blob/master/README_RU.md). Hmm, maybe I should translate it to Swedish and learn something in the process!

I met Caleb in Paris when Jerome arranged #squatconf so I already knew about it before jumping onto routers and mesh networks. A while later I watched a [presentation on youtube](https://www.youtube.com/watch?v=4pC8EPPFmlE) from battlemesh where this other guy named Lars from Germany does crazy stuff. Check out his [meshbox](https://github.com/SeattleMeshnet/meshbox) project, which is a build and test system for running cjdns together with OpenWRT.

Lars also run OpenWRT using [this docker image](https://registry.hub.docker.com/u/lgierth/meshbox/) to simplify development. Since it's on layer 3 there's no need to reflash the device (or rebuilding the docker image), we simply use ssh to deploy some binaries.

Obviously cjdns is a good fit with OpenWRT. You really want a system with complete support for ipv6 and you want that ipv6 address to be tied to your public key.

In cjdns this is handled by a double sha512 of your public key.

It's a no brainer.
