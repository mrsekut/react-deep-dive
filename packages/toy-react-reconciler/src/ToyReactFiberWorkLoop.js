"use strict";

import { scheduleCallback } from "./ToyScheduler";
import { createDom } from "./ToyReactFiberReconciler";

export function flushSync(internals) {
	scheduleCallback(commitRoot, performUnitOfWork, internals);
}

// UnitOfWorkを実行する
function performUnitOfWork(fiber_, internals) {
	const fiber = createAndAppendDom(fiber_);

	const childFiber = constructFiberTree(fiber);
	if (childFiber) {
		fiber.child = childFiber;
	}
	return findNextUnitOfWork(fiber);
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
	const elements = fiber.props.children;
	return createFiberList();

	// 再帰的に子要素ごとにfiber treeを構築する
	function createFiberList(index = 0) {
		if (index >= elements.length) {
			return null;
		}

		const element = elements[index];
		const newFiber = {
			type: element.type,
			props: element.props,
			parent: fiber,
			dom: null,
			sibling: createFiberList(index + 1),
		};

		return newFiber;
	}
}

// 次の作業単位を探索する関数
function findNextUnitOfWork(fiber) {
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
