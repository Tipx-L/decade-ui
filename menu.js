'use strict';
decadeModule.import((lib, game, ui, get, ai, _status) => {
	Mixin.redirect(
		'ui.create.menu',
		/\s*\/\s*game\s*\.\s*documentZoom\s*/g,
		'',
		/\s*get\s*\.\s*is\s*\.\s*phoneLayout\s*\?\s*.*\s*:\s*/,
		'',
		/\s*if\s*\(\s*Math\s*\.\s*round\s*\(\s*2\s*\*\s*game\s*\.\s*documentZoom\s*\)\s*<\s*2\s*\)\s*{[\s\S]*?}/
	);
});
