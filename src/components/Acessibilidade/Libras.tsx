"use client"

import React, { useEffect } from "react";

type Props = {
  forceOnload?: boolean;
};

function VLibras({ forceOnload }: Props): JSX.Element {
  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      const widgetUrl = `https://vlibras.gov.br/app`;

      script.onload = () => {
        // @ts-ignore
        new window.VLibras.Widget(widgetUrl, {
            s:"",
          rootPath: "/app",
          personalization: "https://vlibras.gov.br/config/configs.json",
          opacity: 0.75,
          position: "L",
          avatar: "hosana",
        });
        if (forceOnload) {
          // @ts-ignore
          window.onload();
        }
      };
      document.head.appendChild(script);
    },
    [forceOnload]
  );

  return (
    // @ts-ignore
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active" />
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}

export default VLibras;
