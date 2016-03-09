package com.sproutli.app;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.crashlytics.android.Crashlytics;

public class CrashlyticsReporterModule extends ReactContextBaseJavaModule {
  private static String TAG = "Crashlytics";

  public CrashlyticsReporterModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "CrashlyticsReporter";
  }

  @ReactMethod
  public void reportError(String errorMessage, Promise promise) {
    Crashlytics.logException(new Exception(errorMessage));
    promise.resolve(null);
  }
}
