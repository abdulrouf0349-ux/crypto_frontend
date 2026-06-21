import { fetchAllIcoProjects } from "./Ico";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";
  const status = searchParams.get("status") || "Active";
  const page = Number(searchParams.get("page") || "1");

  const result = await fetchAllIcoProjects(locale, status, page);
  return NextResponse.json(result);
}