import { UserButton } from "@clerk/nextjs";
import { fetchThreads } from "../../lib/actions/thread";

export default async function Home() {
	const threads = await fetchThreads(1, 10);

	console.log(threads);

	return (
		<div>
			{/* <UserButton afterSignOutUrl="/" /> */}
			Home...
		</div>
	);
}
