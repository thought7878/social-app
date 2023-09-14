import React from "react";
import { fetchThreadsByUserId } from "../../lib/actions/user";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityThreads } from "../../lib/actions/community";

interface Props {
	clerkUserId: string;
	userId: string;
	accountType: string;
}

const ThreadsTab = async ({ clerkUserId, userId, accountType }: Props) => {
	let result: any;

	if (accountType === "Community") {
		result = await fetchCommunityThreads(userId);
	} else {
		result = await fetchThreadsByUserId(userId);
	}

	if (!result) return redirect("/");

	return (
		<section>
			{result.threads?.map((thread: any) => {
				return (
					<ThreadCard
						key={thread._id}
						id={thread._id}
						userId={userId || ""}
						parentId={thread.parentId}
						content={thread.text}
						author={
							accountType === "User"
								? {
										name: result.name,
										image: result.image,
										id: result.id,
								  }
								: {
										name: thread.author.name,
										image: thread.author.image,
										id: thread.author.id,
								  }
						}
						community={thread.community}
						createdAt={thread.createdAt}
						comments={thread.children}
					/>
				);
			})}
		</section>
	);
};

export default ThreadsTab;
