package com.msm.longroll;

import android.net.Uri;
import android.os.Bundle;
import android.app.Activity;
import androidx.browser.customtabs.CustomTabsIntent;

public class MainActivity extends Activity {
    private static final String URL = "https://sjalalhs7.github.io/employee-register/";
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        CustomTabsIntent intent = new CustomTabsIntent.Builder().build();
        intent.launchUrl(this, Uri.parse(URL));
    }
}
