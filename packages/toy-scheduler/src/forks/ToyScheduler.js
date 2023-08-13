"use strict";

/**
 * Scheduler
 * - どのタイミングでタスクを実行するかを制御する
 */

export function scheduleCallback(commitRoot, performUnitOfWork, internals) {
	requestIdleCallback((deadline) => {
		workLoop(deadline, commitRoot, performUnitOfWork, internals);
	});
}

function workLoop(deadline, commitRoot, performUnitOfWork, internals) {
	let shouldYield = false;
	while (internals.nextUnitOfWork && !shouldYield) {
		internals.nextUnitOfWork = performUnitOfWork(
			internals.nextUnitOfWork,
			internals
		);
		shouldYield = deadline.timeRemaining() < 1; // IdleDetalineが1msより小さい場合にのみタスクを実行するようにする
	}
	requestIdleCallback((deadline) => {
		workLoop(deadline, commitRoot, performUnitOfWork, internals);
	});
}
