import React, { useEffect } from "react";
import { track } from "@/lib/analytics";
import HomeLanding from "@/components/landing/HomeLanding";

export default function Home() {
  useEffect(() => { track("landing_view"); }, []);
  return <HomeLanding />;
}
