import { AdminLayout } from "@/components/layout/AdminLayout";

export const metadata = {
  title: "Admin Control Center | ComplaintReview",
  description: "Platform management, reviews moderation, company verification, and user administration.",
};

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
