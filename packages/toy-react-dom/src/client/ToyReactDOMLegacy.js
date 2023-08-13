"use strict";

import { flushSync } from "toy-react-reconciler/src/ToyReactFiberWorkLoop";

const internals = {
	nextUnitOfWork: null,
	currentRoot: null,
	wipRoot: null,
	deletions: null,
	wipFiber: null,
	hookIndex: null,
};

export function render(element, container) {
	const fiberRoot = {
		dom: container,
		props: {
			children: [element],
		},
	};

	// fiber treeのrootをnext unit of workに設定して、renderを開始する
	internals.nextUnitOfWork = fiberRoot;
	flushSync(internals);
}

export function useStateImpl(initial) {}
