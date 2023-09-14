import Image from "next/image";
import React from "react";

interface Props {
	userId: string;
	clerkUserId: string;
	name: string;
	username: string;
	imgUrl?: string;
	bio?: string;
	type?: "User" | "Community";
}

const ProfileHeader = ({
	userId,
	clerkUserId,
	name,
	username,
	imgUrl,
	bio,
	type,
}: Props) => {
	return (
		<>
			<div className="flex items-center mb-6">
				<Image
					src={imgUrl || ""}
					className="rounded-full mr-5"
					alt="user image"
					width={48}
					height={48}
					// fill
				/>
				<div className="flex flex-col">
					<h1 className="text-heading3-bold">{name}</h1>
					<h2 className="text-base-medium text-gray-1">{`@${username}`}</h2>
				</div>
			</div>
			<div className="text-base-regular text-light-2">{bio}</div>
		</>
	);
};

export default ProfileHeader;
