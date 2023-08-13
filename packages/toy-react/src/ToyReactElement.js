// @ts-check
"use strict";

/**
 * @param {string} node
 */
function createTextElement(node) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: node,
			children: [],
		},
	};
}

/**
 * @param {any} type
 * @param {any} config
 * @param {any[]} children
 */
export function createElement(type, config, ...children) {
	const props = {
		...config,
		children: children.map((child) =>
			typeof child === "object" ? child : createTextElement(child)
		),
	};
	return {
		type,
		props,
	};
}
