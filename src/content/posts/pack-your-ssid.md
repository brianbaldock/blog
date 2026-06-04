---
title: "Pack your SSID"
description: "A pocket travel router with an IPsec tunnel back to a network I actually control, broadcasting a dedicated SSID that follows me into every hotel, airport, and coffee shop. Untrusted wifi stops being a thing I have to think about. And by total coincidence, the Chromecast at home thinks it lives somewhere it can watch what I pay for."
pubDate: "2026-06-04T03:30:00.000Z"
cover: "/images/pack-your-ssid/cover.png"
coverAlt: "Dark terminal-style cover graphic. A shield-with-checkmark icon and a wifi signal sit beside the tagline TRUSTED WI-FI ANYWHERE, with the headline 'Pack your SSID.' in bold orange."
tags:
  - "networking"
  - "homelab"
  - "vpn"
  - "openwrt"
  - "ipsec"
slug: "pack-your-ssid"
draft: false
---

## Why this exists

I do not trust most of the wifi I end up on. Hotel networks, conference networks, the airport, the coffee shop, the in-law's flat router that hasn't been updated since 2018. They all do the same thing: hand me a default route into a network full of other devices I know nothing about, and watch what I send over the air.

The easy version is a VPN client on each device. Done in three taps, and I do that for my laptop and phone anyway. But "each device" is the problem. The work laptop has one, the personal laptop has another, the kid's tablet doesn't, the Chromecast can't, the e-reader has no idea what a VPN is. And every time I sit down somewhere new, I'm re-toggling them.

So I started packing my SSID. A dedicated wifi network called `CanadaExit-WiFi` that I bring with me, broadcast off a pocket router, and tunnel back to a network I run, on hardware I trust, with DNS I trust, before it touches the internet. The phone joins it and behaves like it's at home. The Chromecast joins it and behaves like it's at home. The kid's tablet joins it once and never has to think about it again.

There is also, theoretically, a side benefit: because the network it tunnels back to happens to live in Quebec, anything that geo-detects on IP or DNS thinks the device is in Quebec. I am not going to belabor this point. You can imagine what that's useful for.

## "Yeah, I know, why not just use your phone hotspot?"

Fair question. The phone hotspot is the path of least resistance and for a one-off "I need ten minutes of trusted internet in a coffee shop" it's the right call. For everything else, the seams show fast:

- **The phone has to be on, charged, and tethering.** Anything that needs trusted wifi for more than fifteen minutes becomes a battery and thermal problem. The phone gets hot, dies, and now the entire household's internet died with it.
- **Multi-device casting and mDNS break.** Anything that relies on devices discovering each other on the same network falls apart when half the devices are on cellular through the phone and the other half are on the local wifi. Casting, AirPlay, printers, smart-home pairing, all of it.
- **Re-pair every time.** No persistent SSID means every device gets re-introduced to a new network with a new password every trip. The kid's tablet, the e-reader, the streaming stick, the work laptop. Every. Trip.
- **Doesn't scale past one user.** The moment a second person wants trusted internet, you are either standing up a second hotspot or sharing one phone's battery and bandwidth across two people's days.
- **Data caps and throttling.** "Unlimited" hotspot data isn't, and the throttle hits exactly when you'd notice it.
- **Everything on the phone routes through the tunnel by accident.** Maps, work email, the doorbell app, every background sync the phone makes for its own reasons. That's a latency and battery tax on traffic that has no business being in the tunnel.
- **Cellular egress is not the same as your home egress.** Even with a "Canadian SIM" or whatever clever provisioning trick, carrier-NAT aggregates to regional pops and the public IP can land anywhere. Anything that cares about the appearance of geography won't get a reliable answer from cellular.
- **The Chromecast and TV stick can't join a phone hotspot meaningfully.** They want a persistent SSID on a stable network. Phone hotspot is the opposite of that on both counts.

Packing the SSID solves all of it by making the trust property of the *network*, not the device. Join the wifi, you're inside. Leave it, you're not. The phone stays a phone.

## The hardware

GL.iNet GL-A1300. Cheap, pocketable, runs OpenWrt, ships with strongSwan and Tailscale already in the image. I have no loyalty to it beyond "it was on the desk and it works."

The catch: it shipped with OpenWrt 21.02.2, which is EOL upstream. No security updates. Fine for a single-purpose travel router behind another firewall; not fine for anything load-bearing. I'll revisit firmware before this becomes a permanent fixture.

## The architecture (and why it changed)

First pass was the obvious one: dial-up IPsec, FortiGate hands the router a virtual IP from a pool (`10.10.10.100`), the router sets that as a default route, everything goes through Quebec.

That works for the router. It does not work cleanly for clients on a separate SSID, because now the default route on the router is fighting Tailscale, fighting the management plane, fighting anything I want to keep local. And the moment something on the router tries to talk to the internet, it has to remember to source-bind to `10.10.10.100` or it goes out the wrong door.

Second pass, the one that actually works: site-to-site IPsec with a phase-2 selector of `192.168.9.0/24 <-> 0.0.0.0/0`. Translation: "any traffic whose source is the wifi subnet, going anywhere, encrypt it and ship it to Quebec." The router itself is *outside* the selector by design. Clients on `CanadaExit-WiFi` get a Quebec tunnel. The router does not. Tailscale lives in peace.

This is the part most home-VPN guides skip. The selector is the policy. Routes don't matter the way they do with WireGuard or OpenVPN. You think about who you want to send through the tunnel, you express it as a source/destination pair, and the kernel handles the rest.

## The failure that taught me the most: DNS leaks

The tunnel came up. ICMP from a LAN address to `1.1.1.1` got there in 88ms instead of 12ms, which is exactly the cross-continent delta you'd expect for traffic actually going to Quebec and back. Counters on the SA were ticking. `ifconfig.me` from my phone showed the FortiGate's wan IP. Beautiful.

Then I checked browserleaks.com/dns.

Seattle.

The web traffic was riding the tunnel. The DNS queries telling the web traffic *where to go* were not. From a privacy standpoint, that means my browsing history is still being narrated to whoever runs the resolver on the untrusted wifi. From the side-benefit standpoint, anything that geo-detects on the resolver IP still sees me as Seattle regardless of where the TCP handshake came from.

### Why this happens

dnsmasq on OpenWrt forwards DNS queries upstream. By default it sources those queries from the router's own IP, which is on the WAN side. That address is not in the phase-2 selector. xfrm looks at it, decides this packet isn't supposed to be encrypted, and sends it out the WAN to the nearest 1.1.1.1 anycast node, which is in Seattle.

The fix is one line of configuration. Here's the broken state I inherited from the GL.iNet web UI (it had cheerfully written source-binds pointing at a *dead* virtual IP from the dial-up phase, so dnsmasq was failing to bind at all):

```
# /etc/config/dhcp - broken
list server '1.1.1.1#53@10.10.10.100'
list server '1.0.0.1#53@10.10.10.100'
```

Replace with the LAN IP as the source anchor:

```sh
uci delete dhcp.@dnsmasq[0].server
uci add_list dhcp.@dnsmasq[0].server='1.1.1.1@192.168.9.1'
uci add_list dhcp.@dnsmasq[0].server='1.0.0.1@192.168.9.1'
uci set dhcp.@dnsmasq[0].noresolv='1'
uci commit dhcp
/etc/init.d/dnsmasq restart
```

The `@192.168.9.1` tells dnsmasq to source-bind upstream queries to the wifi-subnet IP. That address is inside the selector. xfrm encrypts. The query rides the tunnel out the far side, and the resolver only ever sees the far-side egress IP. The local wifi sees encrypted UDP/4500 and nothing else.

`noresolv=1` is the second half of the fix. It prevents dnsmasq from silently falling back to `/tmp/resolv.conf.d/resolv.conf.auto`, which only contains the WAN gateway and would leak the moment your configured upstreams flap.

### Why I almost missed it

I had been running `nslookup google.com 127.0.0.1` on the router itself to check that DNS was working. It always came back fast and with a correct answer. Which is the trap: *fast and correct does not mean tunneled*. A 4ms response time from a router that should be reaching across the continent is the leak signal, not the success signal. The actual verification is the geo of the resolver, not the existence of an answer.

Real test, in order:

```sh
# from a client joined to CanadaExit-WiFi
curl https://ifconfig.me                    # must show the far-side egress IP
curl https://browserleaks.com/dns           # must show a resolver on the far side too
```

If both pass, the device is fully wrapped. If only the first passes, the IP is right but DNS is leaking, and anything paying attention to your resolver (including, but not limited to, the local wifi operator) still knows what you are looking up.

## Clients that ignore your resolver

Even with dnsmasq forwarding through the tunnel correctly, the Chromecast still leaked. Smart TVs, casting devices, and a non-trivial chunk of IoT will ignore the DNS server you handed them via DHCP and hardcode 8.8.8.8. Plenty of reasons, none of them malicious, all of them inconvenient when you're trying to control where queries go.

Fix is a NAT redirect at the router. Any traffic from the LAN destined to port 53 anywhere on the internet gets DNAT'd to the router's own resolver before it leaves:

```sh
uci add firewall redirect
uci set firewall.@redirect[-1].name='Hijack-DNS-UDP'
uci set firewall.@redirect[-1].src='lan'
uci set firewall.@redirect[-1].proto='udp'
uci set firewall.@redirect[-1].src_dport='53'
uci set firewall.@redirect[-1].dest_port='53'
uci set firewall.@redirect[-1].target='DNAT'

# repeat with proto='tcp' for the TCP variant
uci commit firewall
/etc/init.d/firewall restart
```

The client thinks it's talking to Google. It's actually talking to my dnsmasq, which is forwarding upstream through the tunnel. The client never knows. This is the thing that turns "DNS works correctly if the device cooperates" into "DNS works correctly, full stop."

## The thing that wasted the most time on the night this came together

The tunnel was working. Then I came back from dinner and nothing was working. I spent an hour debugging dnsmasq, route tables, source bindings, and the FortiGate's listening services before checking the obvious:

```
# gl-a1300
root@GL-A1300:~# ipsec statusall
Security Associations (0 up, 0 connecting): none
```

The SA had dropped. No DPD restart, no log entry that grabbed my attention, just gone. `ipsec up abts2s` brought it back in two seconds. Everything I'd been debugging downstream of the tunnel was correct; the tunnel itself was the problem.

Lesson, with feeling: when an IPsec setup that was working stops working, check the SA first. Not the routes, not the firewall, not the resolver. The SA.

After that night I changed the conn from `auto=add` (load config, wait for someone to bring it up) to `auto=start` (load config, bring it up now, and keep bringing it back when it falls):

```sh
sed -i 's/auto=add/auto=start/' /etc/ipsec.conf
ipsec restart
```

## When the IPsec selector eats your DHCP

Worth its own section because the symptom is bizarre and the cause is unobvious. After splitting wifi clients onto their own subnet (`192.168.9.0/24`) and pointing the IPsec selector at it, wifi clients stopped getting DHCP leases. DISCOVER, DISCOVER, DISCOVER, no OFFER ever arrived. Wired clients were fine.

What was happening: the xfrm OUT policy `src 192.168.9.0/24 dst 0.0.0.0/0` was greedy enough to capture dnsmasq's DHCPOFFER replies. Those replies have a source on the same subnet and a broadcast destination (`255.255.255.255`), which matched the selector. The kernel handed them to xfrm before they could reach the bridge, and they got encrypted into the tunnel and sent to the FortiGate. The Chromecast was waiting for an OFFER that was halfway to Quebec.

Fix: a passthrough shunt that tells xfrm to leave intra-subnet traffic alone.

```
# /etc/ipsec.conf
conn wifi-local-passthrough
    leftsubnet=192.168.9.0/24
    rightsubnet=192.168.9.0/24
    type=passthrough
    auto=route
```

`ipsec restart`, tunnel back in three seconds, Chromecast pulled DHCPACK on first retry. The fix is two lines. The diagnosis was an hour of tcpdump on every interface in the path wondering why I could see DISCOVERs but no OFFERs anywhere on the wire.

## The hour I spent blaming the upstream router for something it didn't do

This one earns its place because the wrong conclusion was confidently delivered, and the right conclusion only came from getting bored and stopping.

Symptom: after a config change, `abts2s` would not establish. Phase 1 stuck in CONNECTING, AUTH retransmits every four to eight seconds. I ran a sniffer on the FortiGate to see what was happening to those packets.

```
# FGT01
diagnose sniffer packet any 'host <gl-wan-ip> and port 4500' 4 0 a
# trimmed output
... 292 bytes  GL  -> FGT   IKE AUTH request
... 228 bytes  FGT -> GL    IKE AUTH response
... 292 bytes  GL  -> FGT   IKE AUTH retransmit (4-8s later)
... 228 bytes  FGT -> GL    IKE AUTH response (retransmit)
...   1 byte   GL <-> FGT   NAT keepalive (both directions, fine)
```

Request arrives, response leaves, response never comes back. Keepalives pass cleanly in both directions. That pattern looks exactly like an IPsec ALG mangling IKE payloads while letting tiny keepalives through, which is what I told myself was happening. the upstream router must have a sneaky IKE inspector that strips or rewrites the AUTH response.

It was wrong.

What actually happened: the tunnel came up on its own about fifteen minutes after I stopped poking it. No config change. Most likely the upstream router needed time to settle a fresh UDP/4500 NAT mapping after the port forwards landed, and every `ipsec restart` was resetting the source port and making it relearn from scratch. IKE's retransmit cadence is faster than the upstream NAT takes to stabilize that mapping under load, and I kept resetting the clock.

The lessons that stuck:

- Look it up before claiming it. I asserted "the upstream router has an IPsec ALG" with zero documentation. Plenty of people run L2TP/IPsec through the same class of device successfully with port forwards alone. No KB article, no firmware note, no thread mentions an IKE inspector on it. Pattern-matching off a sniffer trace is not proof.
- Same symptom rarely means same cause. The trace was consistent with both ALG mangling and a NAT mapping that hadn't settled. The fact that the tunnel came up unchanged falsifies the ALG story cleanly. I should have been looking for the cheaper falsifiable test, not adding theory on top of theory.
- Stop bouncing things while diagnosing transient NAT. Watching `tcpdump` for two minutes without poking would have shown it stabilize. Every restart resets the experiment.

The port forwards stayed in place (UDP 500, UDP 4500, UDP 41641). They don't hurt and the WireGuard one was wanted anyway for Tailscale direct-path stability.

## The detour into running DNS on the FortiGate tunnel interface

I went down a long detour on running the DNS server *on the FortiGate's tunnel interface*. Idea was clean: instead of trusting a public resolver, point the GL.iNet at a recursor running directly on the Forti side. Self-contained, no third-party dependency, no edge case where Cloudflare's anycast routing decides to hand me a US node.

It didn't work, and the reasons are useful even though the path was wrong:

- FortiOS won't let a tunnel interface have a normal subnet mask. It must be `/32`, with a separate `remote-ip` field also `/32`. Subnet masks get rejected with an unhelpful error:

  ```
  FGT01 # config system interface
  FGT01 (interface) # edit abts2s
  FGT01 (abts2s) # set ip 10.255.0.1 255.255.255.252
  A tunnel IP must have a mask of 255.255.255.255

  # correct shape
  set ip 10.255.0.1 255.255.255.255
  set remote-ip 10.255.0.2 255.255.255.255
  set allowaccess ping
  ```

- After giving the interface a `/32` and `allowaccess ping`, pings from the GL.iNet to the FortiGate's tunnel IP still failed silently. Sniffer on the FortiGate saw zero packets. Routes on the GL.iNet looked correct. xfrm state looked correct. I never proved exactly why, because:
- The use case (DNS for streaming) doesn't need a private resolver. Public DNS sourced from the right interface gets the same geo result with less moving pieces. The detour was solving a problem I didn't have.

The lesson: when the answer to "do I need this layer" is "it would be cleaner," check whether "it would be cleaner" is doing any actual work for you. Sometimes cleaner is just more.

## What this looks like in practice

- Phone joins `CanadaExit-WiFi`. Browser shows the far-side egress IP. DNS resolves through the far-side resolver. mDNS and casting work because every device on that SSID is on the same logical network.
- Phone joins whatever wifi happens to be local, normal or otherwise. The travel router stays out of it. Nothing is tunneled.
- Router itself stays on the local wifi for management, Tailscale, and updates. The IPsec tunnel only carries traffic that originates from `192.168.9.0/24`.
- The local wifi sees an encrypted blob to one IP and has no visibility into anything beyond that. The far side sees one source subnet, `192.168.9.0/24`, and nothing about the local environment.

End-state verification on the router:

```
root@GL-A1300:~# ipsec statusall
abts2s[8]: ESTABLISHED, 192.168.4.10[abts2s-router]...203.0.113.42[10.0.0.10]
abts2s{20}: INSTALLED, TUNNEL, ESP in UDP SPIs: c0d1007c_i b779cb0d_o
            2.3 MB in / 91 KB out, rekey in 11h

root@GL-A1300:~# curl --interface 192.168.9.1 https://ifconfig.me
203.0.113.42
```

## What I'd do differently

- Start with site-to-site. The dial-up profile was a detour that taught me how mode-config works and burned a few hours fighting masquerade rules I didn't need.
- Verify with geo, not with `nslookup`. Saved me the second night.
- Skip the FortiGate-as-DNS idea entirely. Public resolver, right source binding, done.
- Add the DNS hijack NAT rule on day one, not after watching a Chromecast leak.
- When IPsec gets weird, stop touching it for two minutes before adding theory. The fix for the upstream-NAT saga was patience, not a new hypothesis.

## What's next

- Tailscale on the router as an exit node, routed *around* the IPsec tunnel so the two don't fight.
- Make the masquerade-exempt rule persistent across reboots (still living in `iptables -I` for now).
- Reconsider firmware. OpenWrt 21.02 EOL is not a place to leave a permanent device.


The thing is up. Every device that joins `CanadaExit-WiFi` is on a network I trust, regardless of where I happen to be standing. That was the goal: pack the SSID, and the trust goes with it. The side benefits write themselves.
