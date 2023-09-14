import { fetchActivity, fetchUser } from "../../../lib/actions/user";

import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;
	const user = await fetchUser(clerkUser.id);
	if (!user?.onboarded) return redirect("/onboarding");

	const activities = await fetchActivity(user._id);

	return (
		<section>
			<h1 className="head-text mb-10">Activity</h1>

			<section className="mt-10 flex flex-col gap-5">
				{activities.length > 0 ? (
					activities.map((activity) => {
						return (
							<Link key={activity._id} href={`/thread/${activity.parentId}`}>
								<article className="activity-card">
									<Image
										src={activity.author.image}
										alt="Profile image"
										className="rounded-full object-cover"
										width={20}
										height={20}
									/>
									<p className="text-small-regular">
										<span className="mr-1 text-primary-500">
											{activity.author.name}
										</span>{" "}
										replied to your thread
									</p>
								</article>
							</Link>
						);
					})
				) : (
					<p className="!text-base-regular">No activity</p>
				)}
			</section>
		</section>
	);
};

export default Page;
