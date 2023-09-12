import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "../../../../lib/actions/user";
import { redirect } from "next/navigation";
import ProfileHeader from "../../../../components/shared/ProfileHeader";

const Page = async ({ params }: { params: { id: string } }) => {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const user = await fetchUser(params.id);
	if (!user.onboarded) return redirect("/onboarding");

	return (
		<section>
			<ProfileHeader
				userId={user.id}
				clerkUserId={clerkUser.id}
				name={user.name}
				username={user.username}
				imgUrl={user.image}
				bio={user.bio}
			/>

			<div></div>
		</section>
	);
};

export default Page;
