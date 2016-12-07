package com.sproutli.app;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.robinpowered.react.Intercom.IntercomPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.answers.Answers;

import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.common.ConnectionResult;

import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.imagepicker.ImagePickerPackage;

import io.fabric.sdk.android.Fabric;
import io.intercom.android.sdk.Intercom;

public class MainApplication extends Application implements ReactApplication {
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new LocationPackage(),
        new MainReactPackage(),
            new FBSDKPackage(),
            new IntercomPackage(),
        new AnswersReporterPackage(),
        new CrashlyticsReporterPackage(),
        new RNGeocoderPackage(),
        new IntercomPackage(),
        new ImageUploaderPackage(),
        new ImagePickerPackage(),
        new VectorIconsPackage(),
        new ReactMaterialKitPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
