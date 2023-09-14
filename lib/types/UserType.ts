import { Types } from "mongoose";

export interface UserType {
	_id: Types.ObjectId;
	id?: string;
	username?: string;
	name?: string;
	image?: string;
	bio?: string;
	threads?: {}[];
	onboarded?: boolean;
	communities?: {}[];
}
