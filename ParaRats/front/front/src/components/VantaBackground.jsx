import React, { useEffect, useRef } from "react";
import NET from "vanta/dist/vanta.net.min"; // efeito "net"
import * as THREE from "three";

export default function VantaBackground() {
  const ref = useRef(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaRef.current) {
      vantaRef.current = NET({
        el: ref.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x0a0a0a, // fundo escuro
        color: 0x0077ff,           // azul (partículas e linhas)
        points: 8.0,
        maxDistance: 22.0,
        spacing: 18.0,
      });
    }

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
}
