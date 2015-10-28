package com.sproutli;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;

public class LocationModule extends ReactContextBaseJavaModule {

  public LocationModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "Location";
  }

  @ReactMethod
  public void getCurrentPosition(Callback successCallback, Callback failureCallback) {
    failureCallback.invoke("Sorry, not implemented yet.");
  }

  @ReactMethod
  public void watchPosition(Callback successCallback) {
    // Do nothing.
  }
}
