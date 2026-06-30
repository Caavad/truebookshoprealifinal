-- Seed subcategories and reading content for existing books
UPDATE Books SET SubCategory = 'backend', Content = N'Chapter 1: A Pragmatic Philosophy

Every day, work on something that makes you a better programmer. The Pragmatic Programmer is about continuous learning and taking responsibility for your craft.

Chapter 2: The Evils of Duplication

DRY — Don''t Repeat Yourself. Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.

Chapter 3: The Basic Tools

Always use source code control. Automate your build process. Use the power of plain text. Master your editor and shell.

Chapter 4: Pragmatic Paranoia

Design by contract. Use assertions to prevent impossible things. Handle errors gracefully. Know when to stop.

The journey of a pragmatic programmer never ends — it evolves with every project, every bug, and every lesson learned.'
WHERE Title = 'The Pragmatic Programmer' AND (Content IS NULL OR Content = '');

UPDATE Books SET SubCategory = 'backend', Content = N'Chapter 1: Clean Code

You are reading this book because you care about code quality. Clean code reads like well-written prose.

Chapter 2: Meaningful Names

Use intention-revealing names. Avoid disinformation. Make meaningful distinctions. Use pronounceable names.

Chapter 3: Functions

Functions should be small. Do one thing. One level of abstraction per function. Avoid side effects.

Chapter 4: Comments

Comments do not make up for bad code. Explain yourself in code. Good comments explain why, not what.

Chapter 5: Formatting

The vertical format of code matters. Horizontal formatting reveals structure. Team rules should be consistent.

Writing clean code is an act of respect — for your teammates, your future self, and the users who depend on your software.'
WHERE Title = 'Clean Code' AND (Content IS NULL OR Content = '');

UPDATE Books SET SubCategory = 'habits', Content = N'Introduction

Tiny changes, remarkable results. Atomic Habits offers a proven framework for improving every day.

Chapter 1: The Surprising Power of Atomic Habits

Habits are the compound interest of self-improvement. Getting 1% better every day counts for a lot in the long run.

Chapter 2: How Your Habits Shape Your Identity

The most effective way to change your habits is to focus on who you wish to become, not on what you want to achieve.

Chapter 3: How to Build Better Habits in 4 Simple Steps

Cue, craving, response, reward — the four laws of behavior change form the backbone of every habit.

Chapter 4: The Man Who Didn''t Look Right

The human brain is a difference detector. The cues that trigger habits can be made obvious to start change.

You do not rise to the level of your goals. You fall to the level of your systems.'
WHERE Title = 'Atomic Habits' AND (Content IS NULL OR Content = '');

UPDATE Books SET SubCategory = 'world', Content = N'Part One: The Cognitive Revolution

About 70,000 years ago, Homo sapiens was an insignificant animal. Then something changed — we learned to cooperate in large numbers through shared myths.

Part Two: The Agricultural Revolution

History''s biggest fraud? Wheat domesticated Homo sapiens, not the other way around. Farming created surplus, hierarchy, and suffering.

Part Three: The Unification of Humankind

Money, empires, and universal religions brought humanity together. Shared fictions enabled cooperation on a scale never seen before.

Part Four: The Scientific Revolution

Humans admitted ignorance and began to acquire new powers through research. Science, empire, and capitalism became intertwined.

Epilogue: The End of Homo Sapiens

We are on the verge of becoming something entirely different. The future of humanity may be shaped by our own inventions.'
WHERE Title LIKE 'Sapiens%' AND (Content IS NULL OR Content = '');

UPDATE Books SET SubCategory = 'sci-fi', Content = N'Part One

It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions.

Part Two

Big Brother is watching you. The Party seeks power entirely for its own sake. We are not interested in the good of others; we are interested solely in power.

Part Three

Freedom is the freedom to say that two plus two make four. If that is granted, all else follows. But in Room 101, even that freedom is taken away.

Winston learned that the individual is powerless against the state when the state controls truth itself. The story ends where hope dies — in acceptance of the Party''s reality.'
WHERE Title = '1984' AND (Content IS NULL OR Content = '');

UPDATE Books SET SubCategory = 'fantasy', Content = N'Chapter 1: A Long-Expected Party

When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday, the hobbits of Hobbiton were excited.

Chapter 2: The Shadow of the Past

Gandalf returns to warn Frodo about the Ring. The Shire is no longer safe. The journey must begin.

Chapter 3: Three Is Company

Frodo leaves the Shire with Sam and Pippin. Black Riders hunt them on the road. The world beyond the Shire is vast and dangerous.

The Fellowship will form, the Ring will tempt, and Middle-earth will decide its fate in fire and courage.'
WHERE Title LIKE 'The Lord of the Rings%' AND (Content IS NULL OR Content = '');

UPDATE Books SET SubCategory = 'mystery', Content = N'Chapter 1

Roger Ackroyd knew too much. On the night he was murdered, he had received a letter that would expose the killer in their midst.

Chapter 2

Hercule Poirot retired to grow vegetable marrows, but murder follows him even to the quiet village of King''s Abbot.

Chapter 3

Everyone in the household had a motive. The doctor, the secretary, the stepson — each hid secrets behind polite English manners.

Agatha Christie delivers her most famous twist: the narrator himself was the murderer all along.'
WHERE Title LIKE 'The Murder%' AND (Content IS NULL OR Content = '');

UPDATE Books SET SubCategory = 'classics', Content = N'Chapter 1

It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.

Chapter 2

Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit, though he told his wife otherwise.

Chapter 3

Elizabeth Bennet is clever, lively, and quick to judge. Mr. Darcy is proud, reserved, and slow to reveal his true character.

Their story is one of misunderstanding, growth, and the discovery that first impressions are often wrong.'
WHERE Title LIKE 'Pride and Prejudice%' AND (Content IS NULL OR Content = '');

PRINT 'Book content and subcategories updated.';
