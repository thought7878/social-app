interface IThreadCard {
	id: string;
	userId: string | null;
	parentId: string | null;
	content: string;
	author: {
		name: string;
		image: string;
		id: string;
	};
	community: {
		id: string;
		name: string;
		image: string;
	} | null;
	createdAt: string;
	comments: { author: { image: string } }[];
	isComment?: boolean;
}

export default function ThreadCard({
	id,
	userId,
	parentId,
	content,
	author,
	community,
	createdAt,
	comments,
	isComment,
}: IThreadCard) {
	return (
		<article>
			<h2 className="text-small-regular text-light-2">{content}</h2>
		</article>
	);
}
