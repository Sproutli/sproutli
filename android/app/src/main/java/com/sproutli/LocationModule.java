package com.sproutli;

import android.location.Location;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.*;
import com.google.android.gms.location.LocationServices;

import java.util.ArrayList;

public class LocationModule extends ReactContextBaseJavaModule implements ConnectionCallbacks, OnConnectionFailedListener{
  private static final String TAG = "Sproutli";
  private static final ArrayList<RCTLocationRequest> pendingRequests = new ArrayList<>();

  GoogleApiClient mGoogleApiClient;
  Location mLastLocation;

  public LocationModule(ReactApplicationContext reactContext) {
    super(reactContext);

    buildGoogleApiClient(reactContext);
    mGoogleApiClient.connect();
  }

  @Override
  public String getName() {
    return "LocationObserver";
  }

  @ReactMethod
  public void getCurrentPosition(ReadableMap options, Callback successCallback, Callback failureCallback) {
    Log.d(TAG, "getCurrentPosition called. mLastLocation:" + mLastLocation + " ,successCallback: " + successCallback);
    if (mLastLocation != null) {
      successCallback.invoke(convertLocation(mLastLocation));
    } else {
      RCTLocationRequest request = new RCTLocationRequest(options, successCallback, failureCallback);
      pendingRequests.add(request);
    }
  }

  @ReactMethod
  public void watchPosition(Callback successCallback) {
    // Do nothing.
  }

  @Override
  public void onConnected(Bundle connectionHint) {
    mLastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);

    if (pendingRequests.size() < 1) { return; }

    try {
      for (RCTLocationRequest request : pendingRequests) {
        request.successCallback.invoke(mLastLocation);
      }
    } catch (Exception e) {
      Log.e(TAG, "Unable to invoke callbacks - " + pendingRequests, e);
    }
  }

  @Override
  public void onConnectionSuspended(int something) {
    Log.d(TAG, "Connection suspended?");
  }

  @Override
  public void onConnectionFailed(ConnectionResult connectionResult) {
    try {
      for (RCTLocationRequest request : pendingRequests) {
        request.failureCallback.invoke("Error connecting to Google Services");
      }
    } catch (Exception e) {
      Log.e(TAG, "Unable to invoke failure callbacks - " + pendingRequests, e);
    }
  }


  protected synchronized void buildGoogleApiClient(ReactContext reactContext) {
    mGoogleApiClient = new GoogleApiClient.Builder(reactContext)
      .addConnectionCallbacks(this)
      .addOnConnectionFailedListener(this)
      .addApi(LocationServices.API)
      .build();
  }

  private WritableMap convertLocation(Location location) {
    WritableMap coords = Arguments.createMap();
    coords.putDouble("latitude", location.getLatitude());
    coords.putDouble("longitude", location.getLongitude());

    WritableMap result = Arguments.createMap();
    result.putMap("coords", coords);

    return result;
  }
}

class RCTLocationRequest {
  public ReadableMap options;
  public Callback successCallback;
  public Callback failureCallback;

  RCTLocationRequest(ReadableMap aOptions, Callback aSuccessCallback, Callback aFailureCallback) {
    options = aOptions;
    successCallback = aSuccessCallback;
    failureCallback = aFailureCallback;
  }
}
