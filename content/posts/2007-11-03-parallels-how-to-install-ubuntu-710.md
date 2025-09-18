---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-11-03T00:00:00Z
excerpt: ""
tags:
- mac
- parallels
- guides
- ubuntu
- virtualization
title: 'Parallels: How To Install Ubuntu 7.10'
url: /2007/11/03/parallels-how-to-install-ubuntu-710/
---

<p>This is a guide to install <strong>Ubuntu 7.10 (Gutsy Gibbon)</strong> on <strong>Parallels 3.0</strong> and <strong>Leopard</strong>.</p>

<h3>Configuration</h3>
<ul><li>MacBook 13&#8221;</li>
  <li>Intel Core Duo 2Ghz</li>
  <li>1Gb RAM</li>
  <li>80Gb HD</li>
  <li>MacOS X 10.5 (Leopard)</li>
  <li>Parallels 3.0 (build 5160)</li>
</ul><h3>Preparation</h3>
<p>If you have installed <strong>Leopard</strong> you should upgrade your Parallels version at the <strong>build 5160</strong> (<a href="http://www.parallels.com/en/support/leopard/" title="Mac OS 10.5 (Leopard) support on Parallels website">Leopard Support</a>).</p>

<h3>Installation</h3>
<ol><li>Download the disk image (<strong>ubuntu-7.10-alternate-i386.iso</strong>) from the Ubuntu website.</li>
  <li>Start Parallels and choose <strong>Typical</strong>, then <strong>Linux</strong> from <strong>OS Type</strong> and <strong>Ubuntu Linux</strong> from <strong>OS Version</strong>.</li>
  <li>Specify a name for the virtual machine: <strong>Ubuntu Linux 7.10</strong>.</li>
  <li>Optimize for better performance of: <strong>Virtual machine</strong>.</li>
  <li>Click on <strong>More Options</strong>, then select <strong>ISO image</strong> and choose the disk image.</li>
  <li>Now should start the installation process: choose <strong>Install in text mode</strong> from the first screen.</li>
  <li>Choose your <strong>language</strong> and <strong>locale</strong>. When prompt for the <strong>keyboard layout detection</strong>, choose <strong>no</strong>. Now should appear a page to pick the keyboard layout. On the following screen <strong>do not</strong> select the <em>Macintosh</em> layout.</li>
  <li><strong>Network configuration:</strong> enter the name of the computer.</li>
  <li><strong>Partition disks:</strong> choose <strong>Guided - use entire disk and set up LVM</strong>. On the following screen choose <strong>Yes</strong>, then <strong>Finish partitioning and write changes to disk</strong>. Don&#8217;t worry about disk dimension, the <acronym title="Logical Volume Manager">LVM</acronym> don&#8217;t really use that space.</li>
  <li>Choose your <strong>timezone</strong>.</li>
  <li>Setup an <strong>user</strong>.</li>
  <li>Have a coffee.</li>
  <li>Optional: If the installation process prompts for the download of your <strong>language pack</strong>, install it <strong>now</strong>.</li>
  <li>Screen resolution: <strong>1280x800</strong>.</li>
  <li>Take a break.</li>
  <li>Installation complete: choose <strong>Continue</strong>. This should reboot your virtual machine.</li>
  <li>Login, click on the <strong>Network Connection</strong> icon, then choose your connection. This should activate your <acronym title="Local Area Network">LAN</acronym> connection.</li>
  <li>Click on the <strong>Updates</strong> icon, then upgrade your system.</li>
</ol><h3>Done</h3>
<p>Now your Linux box should be ready. Feel free to comment if something goes wrong.</p>
