"use strict";

import { scheduleCallback } from "./ToyScheduler";
import { createDom } from "./ToyReactFiberReconciler";

export function flushSync(internals) {
	scheduleCallback(commitRoot, performUnitOfWork, internals);
}

// UnitOfWorkを実行する
function performUnitOfWork(fiber_, internals) {
	const fiber = createAndAppendDom(fiber_);
	const fiberWithChild = {
		...fiber,
		child: constructFiberTree(fiber),
	};

	return findNextUnitOfWork(fiberWithChild);
}

// DOMを作成し、親要素に追加する
function createAndAppendDom(fiber) {
	if (!fiber.dom) {
		fiber.dom = createDom(fiber);
	}

	if (fiber.parent) {
		fiber.parent.dom.appendChild(fiber.dom);
	}

	return fiber;
}

function constructFiberTree(fiber) {
	return createFiberTree(fiber.props.children);

	// 再帰的に子要素ごとにfiber treeを構築する
	function createFiberTree([currentElement, ...rest]) {
		if (!currentElement) {
			return null;
		}

		const newFiber = {
			type: currentElement.type,
			props: currentElement.props,
			parent: fiber,
			dom: null,
			sibling: createFiberTree(rest),
		};

		return newFiber;
	}
}

// 次の作業単位を探索する関数
function findNextUnitOfWork(fiber) {
	if (fiber.child) {
		return fiber.child;
	}

	return findSiblingOrParent(fiber);

	function findSiblingOrParent(currentFiber) {
		if (!currentFiber) {
			return null;
		}
		if (currentFiber.sibling) {
			return currentFiber.sibling;
		}
		return findSiblingOrParent(currentFiber.parent);
	}
}

function commitRoot(internals) {}
