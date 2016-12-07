# Sproutli
This is the Sproutli mobile app. It's written in [ReactNative](https://facebook.github.io/react-native/) using a combination of JavaScript, Objective-C and Java.

# Getting Started
To start hacking on the Sproutli app, follow these steps:

1. Clone the repo to your local machine:
  ```shell
  git clone https://github.com/Sproutli/sproutli.git
  ```

2. Install `node` and `watchman` with [homebrew](http://brew.sh/):
  ```shell
  brew install node
  brew install watchman
  ```

3. Install the `yarn` package manager by following the instructions [on the website](https://yarnpkg.com/en/docs/install)

4. Install the `react-native` command-line tool:
  ```shell
  yarn global add react-native-cli
  ```

5. Use `yarn` to fetch Sproutli's dependencies:
  ```shell
  yarn
  ```

6. Download the [FacebookSDK](https://origincache.facebook.com/developers/resources/?id=facebook-ios-sdk-current.zip) and extract it to ~/Documents/FacebookSDK. This is stupid, but required in order for us to use Facebook's SDK.

7. Run the app on iOS:
  ```shell
  react-native run-ios
  ```

8. Celebrate!
