package com.sproutli.app;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import android.app.Activity;
import android.content.Intent;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;
import android.util.Log;

import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.answers.Answers;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.common.ConnectionResult;

import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.imagepicker.ImagePickerPackage;

import io.fabric.sdk.android.Fabric;
import io.intercom.android.sdk.Intercom;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Fabric.with(this, new Crashlytics(), new Answers());
        Intercom.initialize(getApplication(), "android_sdk-aba6524a84e6953392e1a8583c15970a6dbe851c", "r18lw9fx");
        Intercom.client().openGcmMessage();
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "sproutli";
    }
}
