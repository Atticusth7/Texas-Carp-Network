import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    username: string | null;
    email_addresses: Array<{ email_address: string; id: string }>;
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
};

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: ClerkUserEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created") {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    );

    await prisma.user.create({
      data: {
        id: data.id,
        username: data.username ?? data.id,
        email: primaryEmail?.email_address ?? "",
        name: [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
        avatarUrl: data.image_url ?? null,
      },
    });
  }

  if (type === "user.updated") {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    );

    await prisma.user.update({
      where: { id: data.id },
      data: {
        username: data.username ?? data.id,
        email: primaryEmail?.email_address ?? "",
        name: [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
        avatarUrl: data.image_url ?? null,
      },
    });
  }

  if (type === "user.deleted") {
    await prisma.user.delete({ where: { id: data.id } }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
