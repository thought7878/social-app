import { UserButton, currentUser } from "@clerk/nextjs";
import { fetchThreads } from "../../lib/actions/thread";
import ThreadCard from "../../components/cards/ThreadCard";

export default async function Home() {
	const res = await fetchThreads(1, 10);
	const user = await currentUser();

	return (
		<>
			<section>
				{res.threads.length === 0 ? (
					<p>No threads</p>
				) : (
					<>
						{res.threads.map((thread) => (
							<ThreadCard
								key={thread._id}
								id={thread._id}
								userId={user?.id || ""}
								parentId={thread.parentId}
								content={thread.text}
								author={thread.author}
								community={thread.community}
								createdAt={thread.createdAt}
								comments={thread.children}
							/>
						))}
					</>
				)}
			</section>
		</>
	);
}
