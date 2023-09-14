import "../globals.css";

import { ClerkProvider, UserButton } from "@clerk/nextjs";

import Bottombar from "../../components/shared/Bottombar";
import { Inter } from "next/font/google";
import LeftSidebar from "../../components/shared/LeftSidebar";
import type { Metadata } from "next";
import RightSidebar from "../../components/shared/RightSidebar";
import Topbar from "../../components/shared/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Social App",
	description: "A Next.js Social App",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<Topbar />

					<main className="flex text-light-1">
						<LeftSidebar />
						<section className="main-container">
							<div className="w-full max-w-4xl">{children}</div>
						</section>
						<RightSidebar />
					</main>

					<Bottombar />
				</body>
			</html>
		</ClerkProvider>
	);
}
