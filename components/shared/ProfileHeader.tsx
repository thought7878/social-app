import React from "react";

interface Props {
	userId: string;
	clerkUserId: string;
	name: string;
	username: string;
	imgUrl?: string;
	bio?: string;
}

const ProfileHeader = ({
	userId,
	clerkUserId,
	name,
	username,
	imgUrl,
	bio,
}: Props) => {
	return (
		<div>
			<h1>ProfileHeader</h1>
		</div>
	);
};

export default ProfileHeader;
