"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
	id: string;
	name: string;
	username: string;
	imgUrl: string;
	personType: string;
}

const UserCard = ({ id, name, username, imgUrl, personType }: Props) => {
	const router = useRouter();

	return (
		<article className="user-card">
			<div className="user-card_avatar">
				<Image
					src={imgUrl}
					alt="user image"
					width={48}
					height={48}
					className="rounded-full"
				/>
				<div className="flex-1 text-ellipsis">
					<h1 className="text-base-semibold">{name}</h1>
					<h2 className="text-small-medium text-gray-1">{username}</h2>
				</div>
			</div>

			<Button
				className="user-card_btn"
				onClick={() => {
					router.push(`/profile/${id}`);
				}}
			>
				View
			</Button>
		</article>
	);
};

export default UserCard;
