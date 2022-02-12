# electron-openxr-example
Example of how to make a WebXR application running inside Electron being able,
to launch using OpenXR (using a custom electron build with checkout_openxr enabled).

This allows you to build useable VR/AR apps using web technologies, and distribute them as a desktop app.

This is not a template, but just a working, 100% complete proof of concept app.

# Running this Example App:

1. Clone this repo
2. Note: node_modules is intentionally included just to provide a 100% complete proof of concept app.

# Required Windows ACLs
The electron app when running on windows will need to grant ACLs in order to be able to talk to OpenXR to launch
the VR app in immersive mode. See src/WindowsACLs.js for the code that takes care of this.

# The Custom Electron Build
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
