import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../../../components/ui/tabs";

import Image from "next/image";
import ProfileHeader from "../../../../components/shared/ProfileHeader";
import ThreadsTab from "../../../../components/shared/ThreadsTab";
import UserCard from "../../../../components/cards/UserCard";
import { communityTabs } from "../../../../constants";
import { currentUser } from "@clerk/nextjs";
import { fetchCommunityById } from "../../../../lib/actions/community";

const Page = async ({ params }: { params: { id: string } }) => {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const community = await fetchCommunityById(params.id);

	return (
		<section>
			<ProfileHeader
				name={community.name}
				username={community.username}
				imgUrl={community.image}
				bio={community.bio}
				type="Community"
			/>

			<div className="mt-9">
				<Tabs defaultValue="threads" className="w-full">
					<TabsList className="tab">
						{communityTabs.map((tab) => {
							return (
								<TabsTrigger key={tab.label} value={tab.value} className="tab">
									<Image
										src={tab.icon}
										alt={tab.label}
										width={24}
										height={24}
										className="object-contain"
									/>
									<p className="max-sm:hidden">{tab.label}</p>

									{tab.label === "Threads" && (
										<p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
											{community.threads.length}
										</p>
									)}
								</TabsTrigger>
							);
						})}
					</TabsList>
					<TabsContent value="threads" className="w-full">
						<ThreadsTab
							clerkUserId={clerkUser.id}
							userId={community._id}
							accountType="Community"
						/>
					</TabsContent>
					<TabsContent value="members" className="w-full">
						<section>
							{community.members.map((member: any) => {
								return (
									<UserCard
										key={member.id}
										id={member.id}
										name={member.name}
										username={member.username}
										imgUrl={member.image}
										personType="User"
									/>
								);
							})}
						</section>
					</TabsContent>
					<TabsContent value="requests" className="w-full">
						<ThreadsTab
							clerkUserId={clerkUser.id}
							userId={community._id}
							accountType="Community"
						/>
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
};

export default Page;
