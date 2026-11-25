"use server";

import { prisma } from "@/lib/prisma";
import { setAdminSessionCookie, clearAdminSessionCookie, getAdminSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { adminLoginSchema } from "@/validations/schemas";
import { redirect } from "next/navigation";

export async function adminLoginAction(formData: any) {
  try {
    const { email, password } = adminLoginSchema.parse(formData);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return { success: false, error: "ভুল ইমেইল অথবা অ্যাকাউন্টটি সক্রিয় নয়।" };
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: "ভুল পাসওয়ার্ড দেওয়া হয়েছে।" };
    }

    await setAdminSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "User",
        entityId: user.id,
        details: "অ্যাডমিন সফলভাবে লগইন করেছেন।",
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Admin login error:", err);
    return { success: false, error: err?.message || "লগইন করতে ব্যর্থ হয়েছে।" };
  }
}

export async function adminLogoutAction() {
  const session = await getAdminSession();
  if (session) {
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "LOGOUT",
        entity: "User",
        entityId: session.userId,
        details: "অ্যাডমিন লগআউট করেছেন।",
      },
    });
  }
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
