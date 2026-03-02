"use client";
import dynamic from "next/dynamic";

const CamClient = dynamic(() => import("./CamClient"), {
  ssr: false,
});

export default function Page() {
  return <CamClient />;
}