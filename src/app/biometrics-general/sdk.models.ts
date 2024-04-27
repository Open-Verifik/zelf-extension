export enum FacingMode {
	ENVIRONMENT = "environment",
	USER = "user",
	true = "environment",
	false = "user",
}

export interface CameraData {
	hasPermissions: boolean;
	isLoading: boolean;
	isLowQuality?: boolean;
	configuration: {
		facingMode: FacingMode;
		frameRate: { ideal: number; max: number };
		height?: { ideal: number };
		width?: { ideal: number };
	};
	dimensions: {
		real?: {
			height: number;
			width: number;
			offsetX: number;
			offsetY: number;
		};
		result?: {
			height: number;
			width: number;
			offsetX: number;
			offsetY: number;
		};
		video: {
			max: {
				height: number;
				width: number;
			};
			height?: number;
			width?: number;
		};
	};
}

export interface FaceData {
	lastFace?: any;
	minPixels: number;
	minHeight: number;
	successPosition:number,
	threshold: number;
	real?: OvalData;
	result?: OvalData;
	video?: OvalData;
}

export interface OvalData {
	center: {
		x: number;
		y: number;
	};
	radius: {
		x: number;
		y: number;
	};
	margin: {
		x: number;
		y: number;
	};
}

export interface ResponseData {
	isLoading: boolean;
	isFailed: boolean;
	error?: any;
	base64Image?: string;
}

export interface Attemps {
	current: number;
	limit: number;
}

export interface Intervals {
	checkNgxVideo?: any;
	detectFace?: any;
}

export interface ErrorFace {
	title: string;
	subtitle: string;
	canvas?: string;
}

export interface IdCard {
	// image: string;
	face: string;
}

export interface directionImage {
	left: HTMLImageElement;
	right: HTMLImageElement;
	up: HTMLImageElement;
	down: HTMLImageElement;
}
