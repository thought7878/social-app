import { currentUser } from "@clerk/nextjs";
import { fetchUser, fetchUsers } from "../../../lib/actions/user";
import { redirect } from "next/navigation";
import UserCard from "../../../components/cards/UserCard";

const Page = async () => {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const user = await fetchUser(clerkUser.id);
	if (!user.onboarded) return redirect("/onboarding");

	const result = await fetchUsers({
		userId: clerkUser.id,
		searchString: "",
		pageNumber: 1,
		pageSize: 25,
	});

	return (
		<section>
			<h1>Search</h1>

			<div className="mt-14 flex flex-col gap-9">
				{result?.users.length === 0 ? (
					<p className="no-result">No users</p>
				) : (
					<>
						{result?.users.map((user) => {
							return (
								<UserCard
									key={user.id}
									id={user.id}
									name={user.name}
									username={user.username}
									imgUrl={user.image}
									personType="User"
								/>
							);
						})}
					</>
				)}
			</div>
		</section>
	);
};

export default Page;
