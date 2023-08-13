"use strict";

const internals = {
	nextUnitOfWork: null,
	currentRoot: null,
	wipRoot: null,
	deletions: null,
	wipFiber: null,
	hookIndex: null,
};

export function render(element, container) {
	const dom =
		element.type === "TEXT_ELEMENT"
			? document.createTextNode("")
			: document.createElement(element.type);

	// 属性を更新
	Object.keys(element.props)
		.filter((key) => key !== "children")
		.forEach((name) => {
			dom[name] = element.props[name];
		});

	// childrenを再帰的にレンダリング
	element.props.children.forEach((child) => {
		render(child, dom);
	});

	// containerにdomを追加
	container.appendChild(dom);
}

export function useStateImpl(initial) {}
