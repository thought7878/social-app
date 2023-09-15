import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../../../components/ui/tabs";

import Image from "next/image";
import ProfileHeader from "../../../../components/shared/ProfileHeader";
import ThreadList from "../../../../components/shared/ThreadList";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "../../../../lib/actions/user";
import { profileTabs } from "../../../../constants";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const user = await fetchUser(params.id);
	if (!user?.onboarded) return redirect("/onboarding");

	return (
		<section>
			<ProfileHeader
				name={user.name as string}
				username={user.username as string}
				imgUrl={user.image}
				bio={user.bio}
			/>

			<div className="mt-9">
				<Tabs defaultValue="threads" className="w-full">
					{/* tab header Start */}
					<TabsList className="tab">
						{profileTabs.map((tab) => {
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
											{user.threads?.length}
										</p>
									)}
								</TabsTrigger>
							);
						})}
					</TabsList>
					{/* tab header End */}

					{/* tab content Start */}
					{profileTabs.map((tab) => {
						return (
							<TabsContent
								value={tab.value}
								className="w-full"
								key={`content-${tab.label}`}
							>
								<ThreadList userId={user.id!} type="User" />
							</TabsContent>
						);
					})}
					{/* tab content End */}
				</Tabs>
			</div>
		</section>
	);
};

export default Page;
