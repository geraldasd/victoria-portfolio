// src/sanity/client.ts
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "uywgcxdd", // Paste your ID from Step 3.1
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // False means you get fresh data instantly
});