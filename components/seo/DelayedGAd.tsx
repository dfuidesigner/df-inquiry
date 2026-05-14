"use client";

import Script from "next/script";

export function GoogleAdsTag() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18024116278"
        strategy="afterInteractive"
      />
      <Script id="google-ads">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', 'AW-18024116278');
        `}
      </Script>
    </>
  );
}