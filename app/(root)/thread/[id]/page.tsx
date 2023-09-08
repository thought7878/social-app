import { currentUser } from "@clerk/nextjs";
import ThreadCard from "../../../../components/cards/ThreadCard";
import { fetchUser } from "../../../../lib/actions/user";
import { redirect } from "next/navigation";
import { fetchThreadById } from "../../../../lib/actions/thread";

const Page = async ({ params }: { params: { id: string } }) => {
	if (!params.id) return null;

	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo.onboarded) redirect("/onboarding");

	const thread = await fetchThreadById(params.id);

	return (
		<section>
			<ThreadCard
				id={thread._id}
				userId={user?.id || ""}
				parentId={thread.parentId}
				content={thread.text}
				author={thread.author}
				community={thread.community}
				createdAt={thread.createdAt}
				comments={thread.children}
			/>
		</section>
	);
};

export default Page;
