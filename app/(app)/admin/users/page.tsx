import type { Metadata } from "next";

import { adjustCreditsAction } from "@/app/actions/admin";
import { Card, SectionTitle } from "@/components/app/ui";
import { listCampaigns, listUsers } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Users | Mehfil Media Admin",
};

export default async function AdminUsersPage() {
  const users = listUsers();

  return (
    <>
      <SectionTitle
        title="Users"
        subtitle="Every account, their balance, and manual credit adjustments."
      />
      <Card className="overflow-x-auto !p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Credits</th>
              <th className="px-5 py-3">Campaigns</th>
              <th className="px-5 py-3">Adjust credits</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </td>
                <td className="px-5 py-3 capitalize">{user.role}</td>
                <td className="px-5 py-3 font-semibold">
                  {user.credits.toLocaleString()}
                </td>
                <td className="px-5 py-3">{listCampaigns(user.id).length}</td>
                <td className="px-5 py-3">
                  <form
                    action={adjustCreditsAction}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="userId" value={user.id} />
                    <input
                      name="delta"
                      type="number"
                      required
                      placeholder="+50 / -20"
                      className="w-24 rounded-lg border border-line bg-white/60 px-2 py-1.5 text-sm outline-none focus:border-rani"
                    />
                    <input
                      name="reason"
                      placeholder="Reason"
                      className="w-36 rounded-lg border border-line bg-white/60 px-2 py-1.5 text-sm outline-none focus:border-rani"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-ivory transition-colors hover:bg-rani"
                    >
                      Apply
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
