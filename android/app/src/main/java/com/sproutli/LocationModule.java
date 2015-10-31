package com.sproutli;

import java.util.Date;
import java.util.concurrent.CopyOnWriteArrayList;

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
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.*;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationListener;

public class LocationModule extends ReactContextBaseJavaModule implements ConnectionCallbacks, OnConnectionFailedListener, LocationListener {
  private static final String TAG = "LocationObserver";
  private static final CopyOnWriteArrayList<RCTLocationRequest> pendingRequests = new CopyOnWriteArrayList<>();

  GoogleApiClient mGoogleApiClient;
  Location mLastLocation;
  long mLastUpdateTime;
  boolean observingLocation;

  public LocationModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "LocationObserver";
  }

  @ReactMethod
  public void getCurrentPosition(ReadableMap options, Callback successCallback, Callback failureCallback) {
    if (currentLocationValid(options)) {
      successCallback.invoke(buildResponse(mLastLocation));
    } else {
      RCTLocationRequest request = new RCTLocationRequest(options, successCallback, failureCallback);
      pendingRequests.add(request);
    }
  }

  @ReactMethod
  public void startObserving(ReadableMap options) {
    buildGoogleApiClient();
    observingLocation = true;
  }

  @ReactMethod
  public void stopObserving() {
    observingLocation = false;

    if (pendingRequests.size() == 0) {
      stopObservingLocation();
    }
  }

  // LocationServices Lifecycle Methods
  @Override
  public void onLocationChanged(Location currentLocation) {
    receivedLocation(currentLocation);
  }

  // GoogleAPIService Lifecycle Methods

  @Override
  public void onConnected(Bundle connectionHint) {
    LocationRequest mLocationRequest = createLocationRequest(null);
    LocationServices.FusedLocationApi.requestLocationUpdates(
                    mGoogleApiClient, mLocationRequest, this);
  }

  @Override
  public void onConnectionSuspended(int something) {
    Log.d(TAG, "Connection suspended?");
    pendingRequests.clear();
  }

  @Override
  public void onConnectionFailed(ConnectionResult connectionResult) {
    try {
      for (RCTLocationRequest request : pendingRequests) {
        request.failureCallback.invoke("[LocationObserver] - Error connecting to Google Services - " + connectionResult);
        pendingRequests.clear();
      }
    } catch (Exception e) {
      Log.e(TAG, "Unable to invoke failure callbacks - " + pendingRequests, e);
      pendingRequests.clear();
    }
  }

  protected synchronized void buildGoogleApiClient() {
    if (mGoogleApiClient != null) { return; }

    mGoogleApiClient = new GoogleApiClient.Builder(getReactApplicationContext())
      .addConnectionCallbacks(this)
      .addOnConnectionFailedListener(this)
      .addApi(LocationServices.API)
      .build();

    mGoogleApiClient.connect();
  }

  private WritableMap buildResponse(Location location) {
    WritableMap coords = Arguments.createMap();
    coords.putDouble("latitude", location.getLatitude());
    coords.putDouble("longitude", location.getLongitude());

    WritableMap result = Arguments.createMap();
    result.putMap("coords", coords);

    return result;
  }

  private void sendEvent(String eventName, WritableMap params) {
    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  private void receivedLocation(Location location) {
    mLastLocation = location;
    mLastUpdateTime = System.currentTimeMillis();


    for (RCTLocationRequest request : pendingRequests) {
      WritableMap response = buildResponse(location);
      request.successCallback.invoke(response);
    }

    // WritableMaps may only be dispatched once, so create a new one.
    WritableMap response = buildResponse(location);
    response = buildResponse(location);

    pendingRequests.clear();

    if (observingLocation) {
      sendEvent("geolocationDidChange", response);
    } else {
      stopObservingLocation();
    }
  }

  private LocationRequest createLocationRequest(ReadableMap options) {
    //TODO Support reading from options.
    LocationRequest mLocationRequest = new LocationRequest();
    mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

    return mLocationRequest;
  }

  private void stopObservingLocation() {
    LocationServices.FusedLocationApi.removeLocationUpdates(mGoogleApiClient, this);
  }

  private boolean currentLocationValid(ReadableMap options) {
    // TODO: Fetch maximumAge from options.
    return (mLastLocation != null && 
           ((mLastUpdateTime - System.currentTimeMillis()) < 2000));
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
