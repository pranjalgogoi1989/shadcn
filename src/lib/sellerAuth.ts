import { getServerSession } from "next-auth";

export async function requireSeller(req) {
  const session = await getServerSession();
  if (!session || !session.user) return { ok: false, status: 401, message: "Unauthorized" };

  if (session.user.role !== "seller") {
    return { ok: false, status: 403, message: "Forbidden - seller only" };
  }
  return { ok: true, session };
}