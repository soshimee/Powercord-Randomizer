const { Plugin } = require("powercord/entities"); // Can I use import? 🥺🥺🥺🥺
const { inject, uninject } = require("powercord/injector"); // Import plz?? 🥺🥺🥺
const { messages } = require("powercord/webpack"); // Aww... 😭😭

let observer = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		randomize(mutation.target);
	});
});

module.exports = class Randomizer extends Plugin {
	startPlugin() {
		randomize(document.body);

		observer.observe(document.body, { childList: true, attributes: true, characterData: true, subtree: true });

		inject("randomizerSendMessage", messages, "sendMessage", (args) => {
			args[1].content = args[1].content.split("").sort(() => Math.random() - 0.5).join("");
			return args;
		}, true);
		inject("randomizerEditMessage", messages, "editMessage", (args) => {
			console.log(args);
			args[2].content = args[2].content.split("").sort(() => Math.random() - 0.5).join("");
			return args;
		}, true);
	}

	pluginWillUnload() {
		observer.disconnect();

		uninject("randomizerSendMessage");
		uninject("randomizerEditMessage");
	}
}

function randomize(element) {
	if (element.childNodes.length) {
		Array.from(element.childNodes).filter(element => !["script", "style"].includes(element.tagName)).forEach(element => randomize(element));
	} else if (element.nodeType === Node.TEXT_NODE && getComputedStyle(element.parentElement).display !== "none" && !element.parentElement.isContentEditable) {
		if (!element.parentElement.classList.contains("randomized")) {

			element.nodeValue = element.nodeValue.split("").sort(() => Math.random() - 0.5).join("");
			element.parentElement.classList.add("randomized");
		}
	}
}