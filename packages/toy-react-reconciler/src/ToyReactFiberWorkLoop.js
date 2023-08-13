"use strict";

import { scheduleCallback } from "./ToyScheduler";
import { createDom } from "./ToyReactFiberReconciler";

export function flushSync(internals) {
	scheduleCallback(commitRoot, performUnitOfWork, internals);
}

// UnitOfWorkを実行する
function performUnitOfWork(fiber, internals) {
	if (!fiber.dom) {
		fiber.dom = createDom(fiber);
	}

	if (fiber.parent) {
		fiber.parent.dom.appendChild(fiber.dom);
	}

	// 子要素ごとにfiber treeを構築する
	const elements = fiber.props.children;
	let index = 0;
	let prevSibling = null;

	while (index < elements.length) {
		const element = elements[index];

		const newFiber = {
			type: element.type,
			props: element.props,
			parent: fiber,
			dom: null,
		};

		if (index === 0) {
			fiber.child = newFiber;
		} else {
			prevSibling.sibling = newFiber;
		}

		prevSibling = newFiber;
		index++;
	}

	// 次の作業単位を探索する
	if (fiber.child) {
		return fiber.child;
	}
	let nextFiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling;
		}
		nextFiber = nextFiber.parent;
	}
}

function commitRoot(internals) {}
