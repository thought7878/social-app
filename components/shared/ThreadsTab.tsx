import React from "react";
import { fetchThreadsByUserId } from "../../lib/actions/user";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
	clerkUserId: string;
	userId: string;
	accountType: string;
}

const ThreadsTab = async ({ clerkUserId, userId, accountType }: Props) => {
	const userResult: any = await fetchThreadsByUserId(userId);
	if (!userResult) return redirect("/");

	return (
		<section>
			{userResult.threads?.map((thread: any) => {
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
										name: userResult.name,
										image: userResult.image,
										id: userResult.id,
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
