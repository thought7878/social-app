import React from "react";
import ThreadCard from "../cards/ThreadCard";
import { ThreadType } from "../../lib/types/ThreadType";
import { fetchCommunityThreads } from "../../lib/actions/community";
import { fetchThreadsByUserId } from "../../lib/actions/user";
import { redirect } from "next/navigation";

interface Props {
	userId: string;
	type: string;
}

const ThreadList = async ({ userId, type }: Props) => {
	let result: any;

	if (type === "Community") {
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
							type === "User"
								? {
										name: result.name,
										image: result.image,
										id: result.id,
								  }
								: {
										name: thread?.author?.name,
										image: thread?.author?.image,
										id: thread?.author?.id,
								  }
						}
						community={thread?.community}
						createdAt={thread?.createdAt}
						comments={thread?.children}
					/>
				);
			})}
		</section>
	);
};

export default ThreadList;
