/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 */

import { DualScreenInfoEvent, DualScreenInfoPayload, SpannedChangeHandler, WindowRect } from "../types";
import { EmitterSubscription, NativeEventEmitter, NativeModules } from "react-native";

declare module 'react-native' {
	namespace NativeModules {
		export interface DualScreenInfo {
			isDualScreenDevice: boolean
			hingeWidth: number
		}
	}
}

export interface ExposedNativeMethods {
	addEventListener: (
		type: DualScreenInfoEvent,
		handler: SpannedChangeHandler
	) => void;
	removeEventListener: (
		type: DualScreenInfoEvent,
		handler: SpannedChangeHandler
	) => void;
}

interface IDualScreenInfoModule extends ExposedNativeMethods {
	isDualScreenDevice: boolean;
	hingeWidth: number;
	isSpanning: boolean;
	windowRects: WindowRect[];
}

class RNDualScreenInfoModule implements IDualScreenInfoModule {
	private mIsSpanning: boolean = false;
	private mWindowRects: WindowRect[] = [];
	private eventEmitter: NativeEventEmitter = new NativeEventEmitter(NativeModules.DualScreenInfo);

	constructor() {
		this.eventEmitter.addListener('didUpdateSpanning', (update: DualScreenInfoPayload) => {
			this.mIsSpanning = update.isSpanning;
			this.mWindowRects = update.windowRects;
		});
	}

	addEventListener(type: DualScreenInfoEvent, handler: SpannedChangeHandler): EmitterSubscription {
		return this.eventEmitter.addListener(type, handler);
	}

	removeEventListener(type: DualScreenInfoEvent, handler: SpannedChangeHandler): void {
		this.eventEmitter.removeListener(type, handler);
	}

	get isDualScreenDevice(): boolean {
		return NativeModules.DualScreenInfo.isDualScreenDevice;
	}

	get hingeWidth(): number {
		return NativeModules.DualScreenInfo.hingeWidth;
	}

	get isSpanning(): boolean {
		return this.mIsSpanning;
	}

	get windowRects(): WindowRect[] {
		return this.mWindowRects;
	};
}

export const DualScreenInfo = new RNDualScreenInfoModule();
