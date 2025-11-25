"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function AboutPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/teacher/login");
  }, [router]);
  return (
    <main>
      <h1>About Page</h1>
      <p>This is my about page.</p>
    </main>
  );
}
