# electron-openxr-example
This is an example hello-world style electron app, that demonstrates a working VR app (that can enter immersive-vr on a headset connecting to your PC).
With normal electron builds, this is currently not possible due to how the version of chromium can not use OpenXR to launch the VR app.

Web App -> Electron/Chromium BrowserWindow -> electron.exe app running on windows -> Open XR -> Open XR Runtime -> Connected VR Headset

* Where the web app may be a set of javascripts locally packaged by the app, or instead a URL to a website like: https://threejs.org/examples/webxr_vr_ballshooter.html

of how to make a WebXR application running inside Electron being able,
to launch using OpenXR (using a custom electron build with checkout_openxr enabled).

This allows you to build useable VR/AR apps using web technologies, and distribute them as a desktop app.

This is not a template, but just a working, 100% complete proof of concept app.

# Running this Example App:

1. Clone this repo
2. Note: node_modules is intentionally included just to provide a 100% complete proof of concept app.
3. Install the latest KTS release Node (https://nodejs.org/en/download/) at the time i used 16.14.0.
4. Run npm start within the repo from a command prompt (this runs electron.exe pointing it to main.js)
5. Make sure your headset (eg. Occulus Quest 2) is connected.
 * For a Quest 2: install the Occulus app for windows, ensure in settings OpenXR runtime is set, connect via a USB C cable or Air link, in headset make sure to "Enable Link"
6. Click the "Enter VR" button inside the browser window of the app to launch the app, so you can view/play it on your conected headset.

# Required Windows ACLs
The electron app when running on windows will need to grant ACLs in order to be able to talk to OpenXR to launch
the VR app in immersive mode. See src/WindowsACLs.js for the code that takes care of this.

# The Custom Electron Build
To make this work, allowing you to actually enter immersive vr (navigator.xr.requestSession('immersive-vr')), I needed to make a custom
build of the latest electron npm package (at the time of this 17.0.0 was the latest release of electron).

Secondly, I used an Occulus Quest 2, and installed the Occulus windows app, and made sure the device was connected, and that I had enabled occulus link,
via the prompt from within the headset.

Normal builds of electron will not work, due to the fact that they are not setup to be able to use OpenXR, it is
necessary to follow the procedure of building a custom version of electron where the ENABLE_VR flag is on, and
the build flag (checkout_openxr) is enabled to produce a version of chromium that can work with open xr.

On a windows machine, follow the steps here to setup a custom electron build.
NOTE: I believe this will not work for Mac OS builds.
On linux, after glancing through the code that sets the chromium ENABLE_VR flag, I think things would already be setup of linux,
so you may not need to use a custom electron build, and using any recent official release of the electron npm package would possibly work.

https://github.com/electron/build-tools

NOTE: I ran into a issue where post-install script for installing via npm electron-build-tools resulting in me
needing to manually git https://github.com/electron/build-tools ~/.electron_build_tools, then run npm install inside that folder.

Use the e command from build-tools to create a new config:

```
e init --root=~/electron testing
```

Use e sync to pull all the necessary source code that will be needed to build:

```
e sync
```

Checkout the desired version of electron (unless you want to use the tip of the main branch which is the default):

```
cd ~\electron\src\electron
git checkout tags/v17.0.0 -b custom-build-17.0.0
```

Modify ~/electron/src/electron/DEPS, changing checkout_openxr to True.

```
  'checkout_openxr':
    True,
```

Build it by running:

```
e build
```

The output folder (including electron.exe) will then be produced in ~/electron/src/out/Testing/

# TO DO

More work would be needed to take the custom electron build, and integrate it into an installer. That could
possibly be accomplished by instructing electron-packager to use the custom build, or maybe even
manually using electron-winstaller. For electron-forge, forge internally uses electron-packager passing packagerConfig: {...} to it),
so likely you could integrate the custom electron.exe and supporting files there as well.
