package com.sproutli.app;

import java.util.HashMap;
import java.util.Map;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferObserver;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferUtility;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferState;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferListener;
import com.amazonaws.regions.Regions;
import com.amazonaws.regions.Region;
import com.amazonaws.services.s3.AmazonS3Client;

import java.io.File;
import java.io.IOException;
import java.util.UUID;


public class ImageUploaderModule extends ReactContextBaseJavaModule {
  private static AmazonS3Client sS3Client;
  private static CognitoCachingCredentialsProvider sCredProvider;
  private static TransferUtility sTransferUtility;
  private static String TAG = "ImageUploader";

  public ImageUploaderModule(ReactApplicationContext reactContext) {
    super(reactContext);

    sCredProvider = new CognitoCachingCredentialsProvider(
            getReactApplicationContext(),
            "ap-northeast-1:2d493c6f-6ebf-4397-ab18-4c930ebc2850",
            Regions.AP_NORTHEAST_1);

    sS3Client         =  new AmazonS3Client(sCredProvider);
    sTransferUtility  =  new TransferUtility(sS3Client, getReactApplicationContext());

    sS3Client.setRegion(Region.getRegion(Regions.AP_SOUTHEAST_2));
  }

  @Override
  public String getName() {
    return "ImageUploader";
  }

  @ReactMethod
  public void uploadImage(String filePath, Promise thePromise) {
    File file               = new File(filePath);
    final String imageName  = UUID.randomUUID().toString();
    final Promise promise   = thePromise;

    TransferObserver observer = sTransferUtility.upload(
        "sproutli-images",
        imageName,
        file
    );

    observer.setTransferListener(new TransferListener() {
      @Override
      public void onStateChanged(int id, TransferState state) {
        if (TransferState.COMPLETED.equals(state)) {
          Log.d(TAG, "File upload complete!"); 
          promise.resolve(imageName);
          return;
        }
      }

      @Override
      public void onProgressChanged(int id, long bytesCurrent, long bytesTotal) {
        // Do nothing.
      }

      @Override
      public void onError(int id, Exception ex) {
        Log.e(TAG, "Error uploading file!", ex);
        promise.reject(ex);
      }
    });
        
  }
}
