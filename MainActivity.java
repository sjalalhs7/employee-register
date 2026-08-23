package com.msm.longroll;

import android.net.Uri;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.browser.customtabs.CustomTabsIntent;

public class MainActivity extends AppCompatActivity {
    private static final String START_URL = "https://REPLACE-WITH-FIREBASE-HOSTING-URL";
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (START_URL.contains("REPLACE-WITH-FIREBASE-HOSTING-URL")) {
            setContentView(new android.widget.TextView(this) {{ setText("MSM Longroll\n\nSet the Firebase Hosting URL in MainActivity.java, then build the APK."); setPadding(32,80,32,32); setTextSize(18); }});
            return;
        }
        CustomTabsIntent intent = new CustomTabsIntent.Builder().build();
        intent.launchUrl(this, Uri.parse(START_URL));
    }
}
