/*jshint esversion: 6 */
game.import("extension", function (lib, game, ui, get, ai, _status) {
	return {
		name: "十周年UI",
		content: function (config, pack) {
			'use strict';
			if (['tafang', 'chess'].contains(get.mode()) && lib.config['extension_十周年UI_closeWhenChess']) {
				return;
			}
			var extensionName = decadeUIName;
			var extension = lib.extensionMenu['extension_' + extensionName];
			var extensionPath = lib.assetURL + 'extension/' + extensionName + '/';


			if (!(extension && extension.enable && extension.enable.init)) return;

			lib.arenaReady.push(function () {
				if (ui.roundmenu) {
					ui.roundmenu.style.zIndex = 8;
				}
			});

			switch (lib.config.layout) {
				case 'long2':
				case 'nova':
				case 'mobile':
					break;
				default:
					alert('十周年UI提醒您，请使用<默认>、<手杀>、<新版>布局以获得良好体验（在选项-外观-布局中调整）。');
					break;
			}

			console.time(extensionName);

			window.duicfg = config;
			window.dui = window.decadeUI = {
				init: function () {
					this.extensionName = extensionName;

					var sensor = decadeUI.element.create('sensor', document.body);
					sensor.id = 'decadeUI-body-sensor';
					this.bodySensor = new decadeUI.ResizeSensor(sensor);

					var SVG_NS = 'http://www.w3.org/2000/svg';
					var svg = document.body.appendChild(document.createElementNS(SVG_NS, 'svg'));
					var defs = svg.appendChild(document.createElementNS(SVG_NS, 'defs'));
					var solo = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
					var duol = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
					var duor = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
					var dskin = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));


					solo.id = 'solo-clip';
					duol.id = 'duol-clip';
					duor.id = 'duor-clip';
					dskin.id = 'dskin-clip';

					solo.setAttribute('clipPathUnits', 'objectBoundingBox');
					duol.setAttribute('clipPathUnits', 'objectBoundingBox');
					duor.setAttribute('clipPathUnits', 'objectBoundingBox');
					dskin.setAttribute('clipPathUnits', 'objectBoundingBox');


					var soloPath = solo.appendChild(document.createElementNS(SVG_NS, 'path'));
					var duoLPath = duol.appendChild(document.createElementNS(SVG_NS, 'path'));
					var duoRPath = duor.appendChild(document.createElementNS(SVG_NS, 'path'));
					var dskinPath = dskin.appendChild(document.createElementNS(SVG_NS, 'path'));
					soloPath.setAttribute('d', 'M0 0 H1 Q1 0.05 0.9 0.06 Q1 0.06 1 0.11 V1 H0 V0.11 Q0 0.06 0.1 0.06 Q0 0.05 0 0 Z');
					duoLPath.setAttribute('d', 'M1 0 H0 Q0 0.06 0.15 0.06 Q0 0.06 0 0.11 V1 H1 Z');
					duoRPath.setAttribute('d', 'M0 0 H1 Q1 0.06 0.85 0.06 Q1 0.06 1 0.11 V1 H0 Z');
					dskinPath.setAttribute('d', 'M0 0 H1 Q1 0.1 0.94 0.1 Q0.985 0.1 1 0.13 V1 H0 V0.14 Q0 0.11 0.06 0.1 Q0 0.1 0 0 Z');

					document.addEventListener('click', function (e) { dui.set.activeElement(e.target); }, true);
					this.initOverride();
					return this;
				},
				initOverride: function () {
					function override(dest, src) {
						var ok = true;
						var key;
						for (key in src) {
							if (dest[key]) {
								ok = override(dest[key], src[key]);
								if (ok) {
									dest[key] = src[key];
								}
							} else {
								dest[key] = src[key];
							}
							ok = false;
						}

						return ok;
					};

					function overrides(dest, src) {
						if (!dest._super) dest._super = {};
						for (var key in src) {
							if (dest[key])
								dest._super[key] = dest[key];

							dest[key] = src[key];
						}
					};

					var base = {
						ui: {
							create: {
								card: ui.create.card,
								cards: ui.create.cards,
								confirm: ui.create.confirm,
								volume: ui.create.volume,
								chat: ui.create.chat,
								button: ui.create.button,
								menu: ui.create.menu,
								player: ui.create.player,
								selectlist: ui.create.selectlist,
							},

							update: ui.update,
							updatec: ui.updatec,
						},
						get: {
							infoHp: get.infoHp,
							infoMaxHp: get.infoMaxHp,
							objtype: get.objtype,
							skillState: get.skillState,
						},
						game: {
							check: game.check,
							expandSkills: game.expandSkills,
							uncheck: game.uncheck,
							loop: game.loop,
							over: game.over,
							updateRoundNumber: game.updateRoundNumber,
							phaseLoop: game.phaseLoop,
							bossPhaseLoop: game.bossPhaseLoop,
							gameDraw: game.gameDraw,
							swapSeat: game.swapSeat,
						},
						lib: {
							element: {
								card: {
									init: lib.element.card.init,
								},

								content: {
									chooseButton: lib.element.content.chooseButton,
									turnOver: lib.element.content.turnOver,
								},

								control: {
									add: lib.element.control.add,
									open: lib.element.control.open,
									close: lib.element.control.close,
								},

								player: {
									getState: lib.element.player.getState,
									init: lib.element.player.init,
									uninit: lib.element.player.uninit,
									setModeState: lib.element.player.setModeState,
									$compare: lib.element.player.$compare,
									$disableEquip: lib.element.player.$disableEquip,
									$damage: lib.element.player.$damage,
									$damagepop: lib.element.player.$damagepop,
									$dieAfter: lib.element.player.$dieAfter,
									$skill: lib.element.player.$skill,
									setSeatNum: lib.element.player.setSeatNum,
								},
								event: {
									send: lib.element.event.send,
								},
							},
						},
					};

					var Card = (function (Card) {
						Card.moveTo = function (player) {
							if (!player)
								return;

							var arena = dui.boundsCaches.arena;
							if (!arena.updated)
								arena.update();

							player.checkBoundsCache();
							this.fixed = true;
							var x = Math.round((player.cacheWidth - arena.cardWidth) / 2 + player.cacheLeft);
							var y = Math.round((player.cacheHeight - arena.cardHeight) / 2 + player.cacheTop);
							var scale = arena.cardScale;

							this.tx = x;
							this.ty = y;
							this.scaled = true;
							this.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')';
							return this;
						};
						Card.moveDelete = function (player) {
							this.fixed = true;
							this.moveTo(player);
							setTimeout(function (card) {
								card.delete();
							}, 460, this);
						};
						return Card;
					})({});

					var Event = (function (Event) {
						Event.addMessageHook = function (message, callback) {
							if (this._messages == undefined)
								this._messages = {};

							message = message.toLowerCase();
							if (this._messages[message] == undefined)
								this._messages[message] = [];

							message = this._messages[message];
							message.push(callback);
						};
						Event.triggerMessage = function (message) {
							if (this._messages == undefined)
								return;

							message = message.toLowerCase();
							if (this._messages[message] == undefined)
								return;

							message = this._messages[message];
							for (var i = 0; i < message.length; i++) {
								if (typeof message[i] == 'function')
									message[i].call(this);
							}

							this._messages[message] = [];
						};

						return Event;
					})({});

					var Player = (function (Player) {
						Player.init = function (character, character2, skill, update) {
							this.doubleAvatar = (character2 && lib.character[character2]) != undefined;

							var CUR_DYNAMIC = decadeUI.CUR_DYNAMIC;
							var MAX_DYNAMIC = decadeUI.MAX_DYNAMIC;
							if (CUR_DYNAMIC == undefined) {
								CUR_DYNAMIC = 0;
								decadeUI.CUR_DYNAMIC = CUR_DYNAMIC;
							}

							if (MAX_DYNAMIC == undefined) {
								MAX_DYNAMIC = decadeUI.isMobile() ? 2 : 10;
								if (window.OffscreenCanvas)
									MAX_DYNAMIC += 8;
								decadeUI.MAX_DYNAMIC = MAX_DYNAMIC;
							}

							if (this.dynamic)
								this.stopDynamic();
							var showDynamic = (this.dynamic || CUR_DYNAMIC < MAX_DYNAMIC) && duicfg.dynamicSkin;
							if (showDynamic && _status.mode != null) {
								var skins;
								var dskins = decadeUI.dynamicSkin;
								var avatars = this.doubleAvatar ? [character, character2] : [character];
								var increased;

								for (var i = 0; i < avatars.length; i++) {
									skins = dskins[avatars[i]];
									if (skins == undefined)
										continue;

									var keys = Object.keys(skins);
									if (keys.length == 0) {
										console.error('player.init: ' + avatars[i] + ' 没有设置动皮参数');
										continue;
									}

									var skin = skins[Object.keys(skins)[0]];
									if (skin.speed == undefined)
										skin.speed = 1;
									this.playDynamic({
										name: skin.name,		//	string 骨骼文件名，一般是assets/dynamic 下的动皮文件，也可以使用.. 来寻找其他文件目录
										action: skin.action,	// string 播放动作 不填为默认
										loop: true,				// boolean 是否循环播放
										loopCount: -1,			// number 循环次数，只有loop为true时生效
										speed: skin.speed,	 	// number 播放速度
										filpX: undefined,	 	// boolean 水平镜像
										filpY: undefined,	 	// boolean 垂直翻转
										opacity: undefined,	 	// 0~1		不透明度
										x: skin.x,				// 相对于父节点坐标x，不填为居中
										// (1) x: 10, 相当于 left: 10px；
										// (2) x: [10, 0.5], 相当于 left: calc(50% + 10px)；
										y: skin.y,				// 相对于父节点坐标y，不填为居中
										// (1) y: 10，相当于 top: 10px；
										// (2) y: [10, 0.5]，相当于 top: calc(50% + 10px)；
										scale: skin.scale,		// 缩放
										angle: skin.angle,		// 角度
										hideSlots: skin.hideSlots,	// 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
										clipSlots: skin.clipSlots,	// 剪掉超出头的部件，仅针对露头动皮，其他勿用
									}, i == 1);

									this.$dynamicWrap.style.backgroundImage = 'url("' + extensionPath + 'assets/dynamic/' + skin.background + '")';
									if (!increased) {
										increased = true;
										decadeUI.CUR_DYNAMIC++;
									}
								}
							}

							var jie;
							if (character && duicfg.showJieMark) {
								if (lib.characterPack.refresh)
									jie = lib.characterPack.refresh[character];
								if (jie == null) {
									jie = character.substr(0, 3);
									jie == 're_' || jie == 'ol_' || jie == 'xin' || jie == 'old';
								}

								if (jie != null) {
									jie = lib.translate[character] && lib.translate[character][0];
									if (jie == '界') {
										if (this.$jieMark == undefined)
											this.$jieMark = dui.element.create('jie-mark', this);
										else
											this.appendChild(this.$jieMark);
									}
								}
							}

							var result = this._super.init.apply(this, arguments);
							if (jie == '界') {
								var text = result.node.name.innerText;
								if (text[1] == '\n')
									text = text.substr(2);
								else
									text = text.substr(1);

								result.node.name.innerText = text;
							}

							return result;
						};
						Player.uninit = function () {
							if (this.$jieMark)
								this.$jieMark.remove();

							this.stopDynamic();
							this.doubleAvatar = false;
							this.node.campWrap.dataset.camp = null;
							this.node.campWrap.node.campName.innerHTML = '';
							this.node.campWrap.node.campName.style.backgroundImage = '';
							this.node.name2.innerHTML = '';

							for (var i = 1; i < 6; i++) if (this.isDisabled(i)) this.$enableEquip('equip' + i);

							if (this.storage._disableJudge) {
								game.broadcastAll(function (player) {
									player.storage._disableJudge = false;
									for (var i = 0; i < player.node.judges.childNodes.length; i++) {
										if (player.node.judges.childNodes[i].name == 'disable_judge') {
											player.node.judges.removeChild(player.node.judges.childNodes[i]);
											break;
										}
									}
								}, this);
							}
							this.node.avatar.hide();
							this.node.count.hide();
							if (this.node.wuxing) {
								this.node.wuxing.hide();
							}
							if (this.node.name_seat) {
								this.node.name_seat.remove();
								this.node.name_seat = undefined;
							}

							if (this.storage.nohp) this.node.hp.show();
							this.classList.remove('unseen');
							this.classList.remove('unseen2');
							this.name = undefined;
							this.name1 = undefined;
							this.sex = undefined;
							this.group = undefined;
							this.hp = undefined;
							this.maxHp = undefined;
							this.hujia = undefined;

							this.clearSkills(true);
							this.node.identity.style.backgroundColor = '';
							this.node.intro.innerHTML = '';
							this.node.name.innerHTML = '';
							this.node.hp.innerHTML = '';
							this.node.count.innerHTML = '0';
							if (this.name2) {
								this.singleHp = undefined;
								this.node.avatar2.hide();
								this.node.name2.innerHTML = '';
								this.classList.remove('fullskin2');
								this.name2 = undefined;
							}

							for (var mark in this.marks) this.marks[mark].remove();
							ui.updatem(this);

							this.skipList = [];
							this.skills = this.skills.contains('cangji_yozuru') ? ['cangji_yozuru'] : [];
							this.invisibleSkills = [];
							this.initedSkills = [];
							this.additionalSkills = {};
							this.disabledSkills = {};
							this.hiddenSkills = [];
							this.awakenedSkills = [];
							this.forbiddenSkills = {};
							this.phaseNumber = 0;
							this.stat = [{
								card: {},
								skill: {}
							}];
							this.tempSkills = {};
							this.storage = {};
							this.marks = {};
							this.ai = {
								friend: [],
								enemy: [],
								neutral: []
							};

							return this;
						};
						Player.update = function (count, hp, hpMax, hujia) {
							if (!_status.video) {
								if (this.hp >= this.maxHp) this.hp = this.maxHp;
								count = this.countCards('h');
								hp = this.hp;
								hpMax = this.maxHp;

								game.broadcast(function (player, hp, maxHp, hujia) {
									player.hp = hp;
									player.maxHp = maxHp;
									player.hujia = hujia;
									player.update();
								}, this, hp, hpMax, this.hujia);

								if (this.hujia) {
									this.markSkill('ghujia');
								} else {
									this.unmarkSkill('ghujia');
								}

								game.addVideo('update', this, [count, hp, hpMax, this.hujia]);
							} else {
								// 虽然上面的 game.addVideo 提供了好几个参数，但是没啥用，因为videoContent里的update缺只给了1个参数。
								if (!count)
									count = this.countCards('h');

								hp = this.hp;
								hpMax = this.maxHp;
							}

							var hpNode = this.node.hp;
							if (!this.storage.nohp) {
								if (hpMax > 5) {
									hpNode.innerHTML = (isNaN(hp) ? '×' : (hp == Infinity ? '∞' : hp)) + '<br>/<br>'
										+ (isNaN(hpMax) ? '×' : (hpMax == Infinity ? '∞' : hpMax)) + '<div></div>';
									if (hp == 0) hpNode.lastChild.classList.add('lost');
									hpNode.classList.add('textstyle');
								} else {
									hpNode.innerHTML = '';
									hpNode.classList.remove('textstyle');
									while (hpMax > hpNode.childNodes.length) ui.create.div(hpNode);
									while (hpNode.childNodes.length && hpMax < hpNode.childNodes.length) hpNode.lastChild.remove();

									for (var i = 0; i < hpMax; i++) {
										if (i < hp) {
											hpNode.childNodes[i].classList.remove('lost');
										} else {
											hpNode.childNodes[i].classList.add('lost');
										}
									}
								}

								if (hpNode.classList.contains('room')) {
									hpNode.dataset.condition = 'high';
								} else if (hp == 0) {
									hpNode.dataset.condition = '';
								} else if (hp > Math.round(hpMax / 2) || hp === hpMax) {
									hpNode.dataset.condition = 'high';
								} else if (hp > Math.floor(hpMax / 3)) {
									hpNode.dataset.condition = 'mid';
								} else {
									hpNode.dataset.condition = 'low';
								}
							}

							this.node.count.innerHTML = count;
							if (count >= 10) {
								this.node.count.dataset.condition = 'low';
							} else if (count > 5) {
								this.node.count.dataset.condition = 'higher';
							} else if (count > 2) {
								this.node.count.dataset.condition = 'high';
							} else if (count > 0) {
								this.node.count.dataset.condition = 'mid';
							} else {
								this.node.count.dataset.condition = 'none';
							}

							this.dataset.maxHp = hpMax;
							this.updateMarks();

							if (this.updates) {
								for (var i = 0; i < lib.element.player.updates.length; i++) {
									lib.element.player.updates[i](this);
								}
							}

							return this;
						};
						Player.chooseToRespond = function () {
							var next = game.createEvent('chooseToRespond');
							next.player = this;
							for (var i = 0; i < arguments.length; i++) {
								if (typeof arguments[i] == 'number') {
									next.selectCard = [arguments[i], arguments[i]];
								} else if (get.itemtype(arguments[i]) == 'select') {
									next.selectCard = arguments[i];
								} else if (typeof arguments[i] == 'boolean') {
									next.forced = arguments[i];
								} else if (get.itemtype(arguments[i]) == 'position') {
									next.position = arguments[i];
								} else if (typeof arguments[i] == 'function') {
									if (next.filterCard) next.ai = arguments[i];
									else next.filterCard = arguments[i];
								} else if (typeof arguments[i] == 'object' && arguments[i]) {
									next.filter = arguments[i];
									next.filterCard = get.filter(arguments[i]);

								} else if (arguments[i] == 'nosource') {
									next.nosource = true;
								} else if (typeof arguments[i] == 'string') {
									next.prompt = arguments[i];
								}
							}
							if (next.filterCard == undefined) next.filterCard = lib.filter.all;
							if (next.selectCard == undefined) next.selectCard = [1, 1];
							if (next.source == undefined && !next.nosource) next.source = _status.event.player;
							if (next.ai == undefined) next.ai = get.unuseful2;
							next.position = 'hs';
							if (next.ai2 == undefined) next.ai2 = (() => 1);
							next.setContent('chooseToRespond');
							next._args = Array.from(arguments);
							return next;
						};
						Player.directgain = function (cards, broadcast, gaintag) {
							var player = this;
							var handcards = player.node.handcards1;
							var handcards2 = player.node.handcards2;
							var fragment = document.createDocumentFragment();
							var fragment2 = document.createDocumentFragment();

							var card;

							var hs = this.getCards('hs');
							for (var i = 0; i < cards.length; i++) {
								card = cards[i];
								card.fix();
								if (hs.contains(cards[i])) {
									cards.splice(i--, 1);
									continue;
								}
								if (gaintag)
									card.addGaintag(gaintag);
								var sort = lib.config.sort_card(cards[i]);

								if (get.is.singleHandcard() || sort > 0) {
									fragment.insertBefore(card, fragment.firstChild);
								} else {
									fragment2.insertBefore(card, fragment.firstChild);
								}
							}

							if (player == game.me) {
								if (cards && cards.length) dui.layoutHandDraws(cards.reverse());
								dui.queueNextFrameTick(dui.layoutHand, dui);
							}

							var s = player.getCards('s');
							if (s.length) {
								var found = false;
								for (var i = 0; i < handcards.childElementCount; i++) {
									if (handcards.childNodes[i] == s[0]) {
										handcards.insertBefore(fragment, s[0]);
										found = true;
										break;
									}
								}
								if (!found) {
									handcards.appendChild(fragment);
								}
							}
							else {
								handcards.appendChild(fragment);
							}
							s = player.getCards('s');
							if (s.length) {
								var found = false;
								for (var i = 0; i < handcards2.childElementCount; i++) {
									if (handcards2.childNodes[i] == s[0]) {
										handcards2.insertBefore(fragment2, s[0]);
										found = true;
										break;
									}
								}
								if (!found) {
									handcards2.appendChild(fragment2);
								}
							}
							else {
								handcards2.appendChild(fragment2);
							}

							if (this == game.me || _status.video) ui.updatehl();
							if (!_status.video) {
								game.addVideo('directgain', this, get.cardsInfo(cards));
								this.update();
							}

							if (broadcast !== false)
								game.broadcast(function (player, cards) {
									player.directgain(cards);
								}, this, cards);
							return this;
						};
						Player.useCard = function () {
							var event = this._super.useCard.apply(this, arguments);
							Object.defineProperties(event, {
								oncard: {
									get: function () {
										return this._oncard;
									},
									set: function (value) {
										this._oncard2 = value;
									}
								}
							});
							event.finish = function () {
								this.finished = true;
								var targets = this.targets;
								for (var i = 0; i < targets.length; i++) {
									targets[i].classList.remove('target');
								}
							};
							event._oncard = function (card, player) {
								var player = this.player;
								var targets = this.targets;
								for (var i = 0; i < targets.length; i++) {
									if (targets[i] != player)
										targets[i].classList.add('target');
								}


								if (this._oncard2) this._oncard2(card, player);
							}
							return event;
						};
						Player.lose = function () {
							var next = this._super.lose.apply(this, arguments);
							var event = _status.event;
							if (event.name == 'useCard') {
								next.animate = true;
								next.blameEvent = event;
								event.throw = false;
							}

							return next;
						};
						Player.line = function (target, config) {
							if (get.itemtype(target) == 'players') {
								for (var i = 0; i < target.length; i++) {
									this.line(target[i], config);
								}
							} else if (get.itemtype(target) == 'player') {
								if (target == this)
									return;

								var player = this;
								game.broadcast(function (player, target, config) {
									player.line(target, config);
								}, player, target, config);
								game.addVideo('line', player, [target.dataset.position, config]);

								player.checkBoundsCache(true);
								target.checkBoundsCache(true);
								var x1, y1;
								var x2, y2;
								var hand = dui.boundsCaches.hand;
								if (player == game.me) {
									hand.check();
									x1 = hand.x + hand.width / 2;
									y1 = hand.y;
								} else {
									x1 = player.cacheLeft + player.cacheWidth / 2;
									y1 = player.cacheTop + player.cacheHeight / 2;
								}

								if (target == game.me) {
									hand.check();
									x2 = hand.x + hand.width / 2;
									y2 = hand.y;
								} else {
									x2 = target.cacheLeft + target.cacheWidth / 2;
									y2 = target.cacheTop + target.cacheHeight / 2;
								}

								game.linexy([x1, y1, x2, y2], config, true);
							}
						};
						Player.checkBoundsCache = function (forceUpdate) {
							var update;
							var refer = dui.boundsCaches.arena;
							refer.check();

							if (this.cacheReferW != refer.width ||
								this.cacheReferH != refer.height ||
								this.cachePosition != this.dataset.position)
								update = true;

							this.cacheReferW = refer.width;
							this.cacheReferH = refer.height;
							this.cachePosition = this.dataset.position;
							if (this.cacheLeft == null)
								update = true;

							if (update || forceUpdate) {
								this.cacheLeft = this.offsetLeft;
								this.cacheTop = this.offsetTop;
								this.cacheWidth = this.offsetWidth;
								this.cacheHeight = this.offsetHeight;
							}
						};
						Player.queueCssAnimation = function (animation) {
							var current = this.style.animation;
							var animations = this._cssanimations;
							if (animations == undefined) {
								animations = [];
								this._cssanimations = animations;
								this.addEventListener('animationend', function (e) {
									if (this.style.animationName != e.animationName)
										return;

									var current = this.style.animation;
									var animations = this._cssanimations;
									while (animations.length) {
										this.style.animation = animations.shift();
										if (this.style.animation != current)
											return;

										animations.current = this.style.animation;
									}

									animations.current = '';
									this.style.animation = '';
								});
							}

							if (animations.current || animations.length) {
								animations.push(animation);
								return;
							}

							animations.current = animation;
							this.style.animation = animation;
						};
						Player.$draw = function (num, init, config) {
							if (game.chess)
								return this._super.$draw.call(this, num, init, config);

							if (init !== false && init !== 'nobroadcast') {
								game.broadcast(function (player, num, init, config) {
									player.$draw(num, init, config);
								}, this, num, init, config);
							}

							var cards;
							var isDrawCard;
							if (get.itemtype(num) == 'cards') {
								cards = num.concat();
								isDrawCard = true;
							} else if (get.itemtype(num) == 'card') {
								cards = [num];
								isDrawCard = true;
							} else if (typeof num == 'number') {
								cards = new Array(num);
							} else {
								cards = new Array(1);
							}

							if (init !== false) {
								if (isDrawCard) {
									game.addVideo('drawCard', this, get.cardsInfo(cards));
								} else {
									game.addVideo('draw', this, num);
								}
							}

							if (game.me == this)
								return;

							var fragment = document.createDocumentFragment();
							var card;
							for (var i = 0; i < cards.length; i++) {
								card = cards[i];
								if (card == null)
									card = dui.element.create('card thrown drawingcard');
								else
									card = card.copy('thrown', 'drawingcard', false);

								card.fixed = true;
								cards[i] = card;
								fragment.appendChild(card);
							}

							var player = this;
							dui.layoutDrawCards(cards, player, true);
							ui.arena.appendChild(fragment);
							dui.queueNextFrameTick(function () {
								dui.layoutDrawCards(cards, player);
								dui.delayRemoveCards(cards, 460, 220);
							});
						};
						Player.$give = function (cards, target, log, record) {
							var itemtype;
							var duiMod = (cards.duiMod && game.me == target);
							if (typeof cards == 'number') {
								itemtype = 'number';
								cards = new Array(cards);
							} else {
								itemtype = get.itemtype(cards);
								if (itemtype == 'cards') {
									cards = cards.concat();
								} else if (itemtype == 'card') {
									cards = [cards];
								} else {
									return;
								}
							}

							if (record !== false) {
								var cards2 = cards;
								if (itemtype == 'number') {
									cards2 = cards.length;
									game.addVideo('give', this, [cards2, target.dataset.position]);
								} else {
									game.addVideo('giveCard', this, [get.cardsInfo(cards2), target.dataset.position]);
								}

								game.broadcast(function (source, cards2, target, record) {
									source.$give(cards2, target, false, record);
								}, this, cards2, target, record);
							}

							if (log != false) {
								if (itemtype == 'number')
									game.log(target, '从', this, '获得了' + get.cnNumber(cards.length) + '张牌');
								else
									game.log(target, '从', this, '获得了', cards);
							}

							if (this.$givemod) {
								this.$givemod(cards, target);
								return;
							}

							if (duiMod)
								return;

							var card;
							var hand = dui.boundsCaches.hand;
							hand.check();

							var draws = [];
							var player = this;
							var fragment = document.createDocumentFragment();
							for (var i = 0; i < cards.length; i++) {
								card = cards[i];
								if (card) {
									var cp = card.copy('card', 'thrown', 'gainingcard', false);
									var hs = player == game.me;
									if (hs) {
										if (card.throwWith)
											hs = card.throwWith == 'h' || card.throwWith == 's';
										else
											hs = card.parentNode == player.node.handcards1;
									}

									if (hs) {
										cp.tx = Math.round(hand.x + card.tx);
										cp.ty = Math.round(hand.y + 30 + card.ty);
										cp.scaled = true;
										cp.style.transform = 'translate(' + cp.tx + 'px,' + cp.ty + 'px) scale(' + hand.cardScale + ')';
									} else {
										draws.push(cp);
									}
									card = cp;
								} else {
									card = dui.element.create('card thrown gainingcard');
									draws.push(card);
								}

								cards[i] = card;
								cards[i].fixed = true;
								fragment.appendChild(cards[i]);
							}

							if (draws.length)
								dui.layoutDrawCards(draws, player);

							ui.arena.appendChild(fragment);
							dui.queueNextFrameTick(function () {
								dui.layoutDrawCards(cards, target);
								dui.delayRemoveCards(cards, 460, 220);
							});
						};
						Player.$gain2 = function (cards, log) {
							var type = get.itemtype(cards);
							if (type != 'cards') {
								if (type != 'card')
									return;

								type = 'cards';
								cards = [cards];
							}

							if (log === true)
								game.log(this, '获得了', cards);

							game.broadcast(function (player, cards) {
								player.$gain2(cards);
							}, this, cards);

							var gains = [];
							var draws = [];

							var card;
							var clone;
							for (var i = 0; i < cards.length; i++) {
								clone = cards[i].clone;
								card = cards[i].copy('thrown', 'gainingcard');
								card.fixed = true;
								if (clone && clone.parentNode == ui.arena) {
									card.scaled = true;
									card.style.transform = clone.style.transform;
									gains.push(card);
								} else {
									draws.push(card);
								}
							}

							if (gains.length)
								game.addVideo('gain2', this, get.cardsInfo(gains));

							if (draws.length)
								game.addVideo('drawCard', this, get.cardsInfo(draws));

							if (cards.duiMod && this == game.me)
								return;

							cards = gains.concat(draws);
							dui.layoutDrawCards(draws, this, true);

							var player = this;
							var fragment = document.createDocumentFragment();
							for (var i = 0; i < cards.length; i++)
								fragment.appendChild(cards[i]);

							ui.arena.appendChild(fragment);
							dui.queueNextFrameTick(function () {
								dui.layoutDrawCards(cards, player);
								dui.delayRemoveCards(cards, 460, 220);
							});
						};
						Player.$damage = function (source) {
							if (get.itemtype(source) == 'player') {
								game.addVideo('damage', this, source.dataset.position);
							} else {
								game.addVideo('damage', this);
							}
							game.broadcast(function (player, source) {
								player.$damage(source);
							}, this, source);

							this.queueCssAnimation('player-hurt 0.3s');
						};
						Player.$throw = function (cards, time, record, nosource) {
							var itemtype;
							var duiMod = (cards.duiMod && game.me == this && !nosource);
							if (typeof cards == 'number') {
								itemtype = 'number';
								cards = new Array(cards);
							} else {
								itemtype = get.itemtype(cards);
								if (itemtype == 'cards') {
									cards = cards.concat();
								} else if (itemtype == 'card') {
									cards = [cards];
								} else {
									return;
								}
							}

							var card;
							var clone;
							var player = this;
							var hand = dui.boundsCaches.hand;
							hand.check();

							for (var i = 0; i < cards.length; i++) {
								card = cards[i];
								if (card) {
									clone = card.copy('thrown');
									if (duiMod && (card.throwWith == 'h' || card.throwWith == 's')) {
										clone.tx = Math.round(hand.x + card.tx);
										clone.ty = Math.round(hand.y + 30 + card.ty);
										clone.scaled = true;
										clone.throwordered = true;
										clone.style.transform = 'translate(' + clone.tx + 'px,' + clone.ty + 'px) scale(' + hand.cardScale + ')';
									}
									card = clone;
								} else {
									card = dui.element.create('card infohidden infoflip');
									card.moveTo = lib.element.card.moveTo;
									card.moveDelete = lib.element.card.moveDelete;
								}

								cards[i] = card;
							}

							if (record !== false) {
								if (record !== 'nobroadcast') {
									game.broadcast(function (player, cards, time, record, nosource) {
										player.$throw(cards, time, record, nosource);
									}, this, cards, 0, record, nosource);
								}

								game.addVideo('throw', this, [get.cardsInfo(cards), 0, nosource]);
							}

							if (duiMod && cards.length > 2) {
								cards.sort(function (a, b) {
									if (a.tx == undefined && b.tx == undefined)
										return 0;

									if (a.tx == undefined)
										return duicfg.rightLayout ? -1 : 1;

									if (b.tx == undefined)
										return duicfg.rightLayout ? 1 : -1;

									return b.tx - a.tx;
								});
							}

							for (var i = 0; i < cards.length; i++)
								player.$throwordered2(cards[i], nosource);

							if (game.chess)
								this.chessFocus();

							return cards[cards.length - 1];
						};
						Player.$throwordered2 = function (card, nosource) {
							if (_status.connectMode)
								ui.todiscard = [];

							if (card.throwordered == undefined) {
								var x, y;
								var bounds = dui.boundsCaches.arena;
								if (!bounds.updated)
									bounds.update();

								this.checkBoundsCache();
								if (nosource) {
									x = ((bounds.width - bounds.cardWidth) / 2 - bounds.width * 0.08);
									y = ((bounds.height - bounds.cardHeight) / 2);
								} else {
									x = ((this.cacheWidth - bounds.cardWidth) / 2 + this.cacheLeft);
									y = ((this.cacheHeight - bounds.cardHeight) / 2 + this.cacheTop);
								}

								x = Math.round(x);
								y = Math.round(y);

								card.tx = x;
								card.ty = y;
								card.scaled = true;
								card.classList.add('thrown');
								card.style.transform = 'translate(' + x + 'px, ' + y + 'px)' + 'scale(' + bounds.cardScale + ')';
							} else {
								card.throwordered = undefined;
							}

							if (card.fixed)
								return ui.arena.appendChild(card);

							var before;
							for (var i = 0; i < ui.thrown; i++) {
								if (ui.thrown[i].parentNode == ui.arena) {
									before = ui.thrown[i];
									break;
								}
							}

							var tagNode = card.querySelector('.used-info');
							if (tagNode == null)
								tagNode = card.appendChild(dui.element.create('used-info'));

							card.$usedtag = tagNode;
							ui.thrown.unshift(card);
							if (before)
								ui.arena.insertBefore(before, card);
							else
								ui.arena.appendChild(card);

							dui.tryAddPlayerCardUseTag(card, this, _status.event);
							dui.queueNextFrameTick(dui.layoutDiscard, dui);
							return card;
						};
						Player.$phaseJudge = function (card) {
							game.addVideo('phaseJudge', this, get.cardInfo(card));
							this.$throw(card);
							dui.delay(451);
						};
						return Player;
					})({});

					var EventContent = (function (EventContent) {
						EventContent.changeHp = function () {
							game.getGlobalHistory().changeHp.push(event);
							if (num < 0 && player.hujia > 0 && event.getParent().name == 'damage' && !player.hasSkillTag('nohujia')) {
								event.hujia = Math.min(-num, player.hujia);
								event.getParent().hujia = event.hujia;
								event.num += event.hujia;
								game.log(player, '的护甲抵挡了' + get.cnNumber(event.hujia) + '点伤害');
								player.changeHujia(-event.hujia).type = 'damage';
							}
							num = event.num;
							player.hp += num;
							if (isNaN(player.hp)) player.hp = 0;
							if (player.hp > player.maxHp) player.hp = player.maxHp;
							player.update();
							if (event.popup !== false) {
								player.$damagepop(num, 'water');
							}
							if (_status.dying.contains(player) && player.hp > 0) {
								_status.dying.remove(player);
								game.broadcast(function (list) {
									_status.dying = list;
								},
									_status.dying);
								var evt = event.getParent('_save');
								if (evt && evt.finish) evt.finish();
								evt = event.getParent('dying');
								if (evt && evt.finish) evt.finish()
							}
							event.trigger('changeHp');
							dui.delay(68);
						};
						EventContent.chooseBool = function () {
							"step 0"
							if ((typeof event.isMine == 'function') && event.isMine()) {
								if (event.frequentSkill && !lib.config.autoskilllist.contains(event.frequentSkill)) {
									ui.click.ok();
									return;
								} else if (event.hsskill && _status.prehidden_skills.contains(event.hsskill)) {
									ui.click.cancel();
									return;
								}
								ui.create.confirm('oc');
								if (event.createDialog && !event.dialog) {
									if (Array.isArray(event.createDialog)) {
										event.dialog = ui.create.dialog.apply(this, event.createDialog);
										if (event.dialogselectx) {
											for (var i = 0; i < event.dialog.buttons.length; i++) {
												event.dialog.buttons[i].classList.add('selectedx');
											}
										}
									}
								}
								if (event.dialog) {
									event.dialog.open();
								} else if (event.prompt !== false) {
									var tipText;
									var handTip = event.handTip = dui.showHandTip();
									if (typeof event.prompt == 'function') {
										tipText = event.prompt(event);
									} else if (typeof event.prompt == 'string') {
										tipText = event.prompt;
									}

									if (event.prompt2) {
										if (tipText == null)
											tipText = ''

										handTip.setInfomation(event.prompt2);
									}

									if (tipText != undefined) {
										event.dialog = handTip;
										tipText = tipText.replace(/<\/?.+?\/?>/g, '');
										handTip.appendText(tipText)
										handTip.strokeText();
										handTip.show();
									} else {
										handTip.close();
									}
								}
								game.pause();
								game.countChoose();
								event.choosing = true;
							} else if (event.isOnline()) {
								event.send();
							} else {
								event.result = 'ai';
							}
							"step 1"
							if (event.result == 'ai') {
								if (event.ai) {
									event.choice = event.ai(event.getParent(), player);
								}
								event.result = {
									bool: event.choice
								};
							}
							_status.imchoosing = false;
							event.choosing = false;
							if (event.dialog) event.dialog.close();
							event.resume();
						};
						EventContent.chooseTarget = function () {
							"step 0"
							if ((typeof event.isMine == 'function') && event.isMine()) {
								if (event.hsskill && !event.forced && _status.prehidden_skills.contains(event.hsskill)) {
									ui.click.cancel();
									return;
								}
								game.check();
								game.pause();
								if (event.createDialog && !event.dialog && Array.isArray(event.createDialog)) {
									event.dialog = ui.create.dialog.apply(this, event.createDialog);
								} else if (event.prompt !== false) {
									var tipText;
									var handTip = event.handTip = dui.showHandTip();
									if (typeof event.prompt == 'function') {
										tipText = event.prompt(event);
									} else if (typeof event.prompt == 'string') {
										tipText = event.prompt;
									} else {
										tipText = '请选择';
										var range = get.select(event.selectTarget);
										if (range[0] == range[1])
											tipText += get.cnNumber(range[0]);
										else if (range[1] == Infinity)
											tipText += '至少' + get.cnNumber(range[0]);
										else
											tipText += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);

										tipText += '个目标';
									}

									if (event.prompt2) {
										if (tipText == null)
											tipText = ''

										handTip.setInfomation(event.prompt2);
									}

									if (tipText != undefined) {
										event.dialog = handTip;
										tipText = tipText.replace(/<\/?.+?\/?>/g, '');
										handTip.appendText(tipText);
										if (event.promptbar != 'none') {
											var from = get.select(event.selectTarget)[0];
											var to = get.select(event.selectTarget)[1];
											if (!isFinite(to)) {
												to = '∞';
											}
											event.promptbar = handTip.appendText(' ' + from + ' - ' + to);
											event.promptbar.sels = 0;
											event.promptbar.reqs = get.numStr(get.select(event.selectTarget)[1], 'target');
											event.custom.add.target = function () {
												var handTip = _status.event.dialog;
												var promptbar = _status.event.promptbar;
												if (promptbar.sels == ui.selected.cards.length)
													return;

												promptbar.sels = ui.selected.targets.length;
												promptbar.textContent = ' ' + promptbar.sels + ' - ' + promptbar.reqs;
												handTip.strokeText();
											}
										}
										handTip.strokeText();
										handTip.show();
									} else {
										handTip.close();
									}
								} else if (get.itemtype(event.dialog) == 'dialog') {
									event.dialog.open();
								}
							} else if (event.isOnline()) {
								event.send();
							} else {
								event.result = 'ai';
							}
							"step 1"
							if (event.result == 'ai') {
								game.check();
								if ((ai.basic.chooseTarget(event.ai) || forced) && (!event.filterOk || event.filterOk())) {
									ui.click.ok();
								} else {
									ui.click.cancel();
								}
							}
							if (event.result.bool && event.animate !== false) {
								for (var i = 0; i < event.result.targets.length; i++) {
									event.result.targets[i].animate('target');
								}
							}
							if (event.dialog) event.dialog.close();
							event.resume();
							"step 2"
							if (event.onresult) {
								event.onresult(event.result);
							}
							if (event.result.bool && event.autodelay && !((typeof event.isMine == 'function') && event.isMine())) {
								if (typeof event.autodelay == 'number') {
									game.delayx(event.autodelay);
								} else {
									game.delayx();
								}
							}
						};
						EventContent.chooseToDiscard = function () {
							"step 0"
							if (event.autochoose()) {
								event.result = {
									bool: true,
									autochoose: true,
									cards: player.getCards(event.position),
									rawcards: player.getCards(event.position),
								}
								for (var i = 0; i < event.result.cards.length; i++) {
									if (!lib.filter.cardDiscardable(event.result.cards[i], player, event)) {
										event.result.cards.splice(i--, 1);
									}
								}
							} else {
								if (game.modeSwapPlayer && !_status.auto && player.isUnderControl()) {
									game.modeSwapPlayer(player);
								}
								event.rangecards = player.getCards(event.position);
								for (var i = 0; i < event.rangecards.length; i++) {
									if (lib.filter.cardDiscardable(event.rangecards[i], player, event)) {
										event.rangecards.splice(i--, 1);
									} else {
										event.rangecards[i].uncheck('chooseToDiscard');
									}
								}
								var range = get.select(event.selectCard);
								if ((typeof event.isMine == 'function') && event.isMine()) {
									game.check();
									if (event.hsskill && !event.forced && _status.prehidden_skills.contains(event.hsskill)) {
										ui.click.cancel();
										return;
									}
									game.pause();
									if (range[1] > 1 && typeof event.selectCard != 'function') {
										event.promptdiscard = ui.create.control('AI代选', function () {
											ai.basic.chooseCard(event.ai);
											if (_status.event.custom.add.card) {
												_status.event.custom.add.card();
											}
											for (var i = 0; i < ui.selected.cards.length; i++) {
												ui.selected.cards[i].updateTransform(true);
											}
										});
									}

									if (Array.isArray(event.dialog)) {
										event.dialog = ui.create.dialog.apply(this, event.dialog);
										event.dialog.open();
										event.dialog.classList.add('noselect');
									} else if (event.prompt !== false) {
										var tipText;
										var handTip = event.handTip = dui.showHandTip();
										if (typeof event.prompt == 'function') {
											tipText = event.prompt(event);
										} else if (typeof event.prompt == 'string') {
											tipText = event.prompt;
										} else {
											tipText = '请弃置';
											if (range[0] == range[1])
												tipText += get.cnNumber(range[0]);
											else if (range[1] == Infinity)
												tipText += '至少' + get.cnNumber(range[0]);
											else
												tipText += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);

											tipText += '张';
											if (event.position == 'h' || event.position == undefined)
												tipText += '手';
											if (event.position == 'e')
												tipText += '装备';
											tipText += '牌';
										}

										if (event.prompt2) {
											if (tipText == null)
												tipText = ''

											handTip.setInfomation(event.prompt2);
										}

										if (tipText != undefined) {
											event.dialog = handTip;
											tipText = tipText.replace(/<\/?.+?\/?>/g, '');
											handTip.appendText(tipText);
											var from = event.selectCard[0];
											var to = event.selectCard[1];
											if (!isFinite(to)) {
												to = '∞';
											}
											if (Array.isArray(event.selectCard)) {
												event.promptbar = handTip.appendText(' ' + from + ' - ' + to);
												event.promptbar.sels = 0;
												event.promptbar.reqs = get.numStr(event.selectCard[1], 'card');
												event.custom.add.card = function () {
													var handTip = _status.event.dialog;
													var promptbar = _status.event.promptbar;
													if (promptbar.sels == ui.selected.cards.length)
														return;

													promptbar.sels = ui.selected.cards.length;
													promptbar.textContent = ' ' + promptbar.sels + ' - ' + promptbar.reqs;
													handTip.strokeText();
												}
											}

											handTip.strokeText();
											handTip.show();
										} else {
											handTip.close();
										}
									} else if (get.itemtype(event.dialog) == 'dialog') {
										event.dialog.style.display = '';
										event.dialog.open();
									}
								} else if (event.isOnline()) {
									event.send();
								} else {
									event.result = 'ai';
								}
							}
							"step 1"
							if (event.result == 'ai') {
								game.check();
								if ((ai.basic.chooseCard(event.ai) || forced) && (!event.filterOk || event.filterOk())) {
									ui.click.ok();
								} else if (event.skill) {
									var skill = event.skill;
									ui.click.cancel();
									event._aiexclude.add(skill);
									event.redo();
									game.resume();
								} else {
									ui.click.cancel();
								}
							}
							if (event.rangecards) {
								for (var i = 0; i < event.rangecards.length; i++) {
									event.rangecards[i].recheck('chooseToDiscard');
								}
							}
							"step 2"
							event.resume();
							if (event.promptdiscard) {
								event.promptdiscard.close();
							}
							"step 3"
							if (event.result.bool && event.result.cards && event.result.cards.length && !game.online && event.autodelay && !((typeof event.isMine == 'function') && event.isMine())) {
								if (typeof event.autodelay == 'number') {
									game.delayx(event.autodelay);
								} else {
									game.delayx();
								}
							}
							"step 4"
							if (event.logSkill && event.result.bool && !game.online) {
								if (typeof event.logSkill == 'string') {
									player.logSkill(event.logSkill);
								} else if (Array.isArray(event.logSkill)) {
									player.logSkill.apply(player, event.logSkill);
								}
							}
							if (!game.online) {
								if (typeof event.delay == 'boolean') {
									event.done = player.discard(event.result.cards).set('delay', event.delay);
								} else {
									event.done = player.discard(event.result.cards);
								}
								event.done.discarder = player;
							}
							if (event.dialog && event.dialog.close) event.dialog.close();
						};
						EventContent.chooseToRespond = function () {
							"step 0"
							if (event.responded) {
								event.dialog = undefined;
								return;
							}
							var skills = player.getSkills('invisible').concat(lib.skill.global);
							game.expandSkills(skills);
							for (var i = 0; i < skills.length; i++) {
								var info = lib.skill[skills[i]];
								if (info && info.onChooseToRespond) {
									info.onChooseToRespond(event);
								}
							}
							_status.noclearcountdown = true;
							if (!_status.connectMode && lib.config.skip_shan && event.autochoose && event.autochoose()) {
								event.result = {
									bool: false
								};
							} else {
								if (game.modeSwapPlayer && !_status.auto && player.isUnderControl()) {
									game.modeSwapPlayer(player);
								}
								if ((typeof event.isMine == 'function') && event.isMine()) {
									if (event.hsskill && !event.forced && _status.prehidden_skills.contains(event.hsskill)) {
										ui.click.cancel();
										return;
									}
									var ok = game.check();
									if (!ok || !lib.config.auto_confirm) {
										game.pause();
										var tipText;
										var handTip = event.handTip = dui.showHandTip();
										if (event.openskilldialog) {
											tipText = event.openskilldialog;
											event.openskilldialog = undefined;
										} else if (event.prompt !== false) {
											if (typeof event.prompt == 'function') {
												tipText = event.prompt(event);
											} else if (typeof event.prompt == 'string') {
												tipText = event.prompt;
											} else {
												tipText = '请打出' + get.cnNumber(event.selectCard[0]) + '张';
												if (event.source) {
													handTip.appendText(get.translation(event.source), 'player');
													handTip.appendText('使用了');
													handTip.appendText(get.translation(event.getParent().name), 'card');
													tipText = '，' + tipText;
												}

												if (event.filter && event.filter.name) {
													handTip.appendText(tipText);
													handTip.appendText(get.translation(event.filter.name), 'card');
													tipText = '';
												} else {
													tipText += '牌';
												}
											}

											if (event.prompt2) {
												if (tipText == null)
													tipText = ''

												handTip.setInfomation(event.prompt2);
											}
										}

										if (tipText != undefined) {
											event.dialog = handTip;
											tipText = tipText.replace(/<\/?.+?\/?>/g, '');
											handTip.appendText(tipText)
											handTip.strokeText();
											handTip.show();
										} else {
											handTip.close();
										}
									}
								} else if (event.isOnline()) {
									event.send();
								} else {
									event.result = 'ai';
								}
							}
							"step 1"
							if (event.result == 'ai') {
								var ok = game.check();
								if (ok) {
									ui.click.ok();
								} else if (ai.basic.chooseCard(event.ai1 || event.ai) || forced) {
									if ((ai.basic.chooseTarget(event.ai2) || forced) && (!event.filterOk || event.filterOk())) {
										ui.click.ok();
										event._aiexcludeclear = true;
									} else {
										if (!event.norestore) {
											if (event.skill) {
												var skill = event.skill;
												ui.click.cancel();
												event._aiexclude.add(skill);
												var info = get.info(skill);
												if (info.sourceSkill) {
													event._aiexclude.add(info.sourceSkill);
												}
											} else {
												get.card(true).aiexclude();
												game.uncheck();
											}
											event.redo();
											game.resume();
										} else {
											ui.click.cancel();
										}
									}
								} else if (event.skill && !event.norestore) {
									var skill = event.skill;
									ui.click.cancel();
									event._aiexclude.add(skill);
									var info = get.info(skill);
									if (info.sourceSkill) {
										event._aiexclude.add(info.sourceSkill);
									}
									event.redo();
									game.resume();
								} else {
									ui.click.cancel();
								}
								if (event.aidelay && event.result && event.result.bool) {
									game.delayx();
								}
							}
							"step 2"
							event.resume();
							if (event.result) {
								if (event.result._sendskill) {
									lib.skill[event.result._sendskill[0]] = event.result._sendskill[1];
								}
								if (event.result.skill) {
									var info = get.info(event.result.skill);
									if (info && info.chooseButton) {
										if (event.dialog && typeof event.dialog == 'object') event.dialog.close();
										var dialog = info.chooseButton.dialog(event, player);
										if (info.chooseButton.chooseControl) {
											var next = player.chooseControl(info.chooseButton.chooseControl(event, player));
											next.dialog = dialog;
											next.set('ai', info.chooseButton.check ||
												function () {
													return 0;
												});
										} else {
											var next = player.chooseButton(dialog);
											next.set('ai', info.chooseButton.check ||
												function () {
													return 1;
												});
											next.set('filterButton', info.chooseButton.filter ||
												function () {
													return true;
												});
											next.set('selectButton', info.chooseButton.select || 1);
										}
										event.buttoned = event.result.skill;
									} else if (info && info.precontent && !game.online) {
										var next = game.createEvent('pre_' + event.result.skill);
										next.setContent(info.precontent);
										next.set('result', event.result);
										next.set('player', player);
									}
								}
							}
							"step 3"
							if (event.buttoned) {
								if (result.bool || result.control && result.control != 'cancel2') {
									var info = get.info(event.buttoned).chooseButton;
									lib.skill[event.buttoned + '_backup'] = info.backup(info.chooseControl ? result : result.links, player);
									lib.skill[event.buttoned + '_backup'].sourceSkill = event.buttoned;
									if (game.online) {
										event._sendskill = [event.buttoned + '_backup', lib.skill[event.buttoned + '_backup']];
									}
									event.backup(event.buttoned + '_backup');
									if (info.prompt) {
										event.openskilldialog = info.prompt(info.chooseControl ? result : result.links, player);
									}
								} else {
									ui.control.animate('nozoom', 100);
									event._aiexclude.add(event.buttoned);
								}
								event.goto(0);
								delete event.buttoned;
							}
							"step 4"
							_status.noclearcountdown = undefined;
							if (event.skillDialog && get.objtype(event.skillDialog) == 'div') {
								event.skillDialog.close();
							}
							if (event.result.bool && !game.online) {
								if (event.result._sendskill) {
									lib.skill[event.result._sendskill[0]] = event.result._sendskill[1];
								}
								var info = get.info(event.result.skill);
								if (event.onresult) {
									event.onresult(event.result);
								}
								if (event.result.skill) {
									if (info.direct && !info.clearTime) {
										_status.noclearcountdown = true;
									}
								}
								if (event.logSkill) {
									if (typeof event.logSkill == 'string') {
										player.logSkill(event.logSkill);
									} else if (Array.isArray(event.logSkill)) {
										player.logSkill.apply(player, event.logSkill);
									}
								}
								if (!event.result.card && event.result.skill) {
									event.result.used = event.result.skill;
									player.useSkill(event.result.skill, event.result.cards, event.result.targets);
								} else {
									if (info && info.prerespond) {
										info.prerespond(event.result, player);
									}
									var next = player.respond(event.result.cards, event.result.card, event.animate, event.result.skill, event.source);
									if (event.result.noanimate) next.animate = false;
									if (event.parent.card && event.parent.type == 'card') {
										next.set('respondTo', [event.parent.player, event.parent.card]);
									}
									if (event.noOrdering) next.noOrdering = true;
								}
							} else if (event._sendskill) {
								event.result._sendskill = event._sendskill;
							}
							if (event.dialog && event.dialog.close) event.dialog.close();
							if (!_status.noclearcountdown) {
								game.stopCountChoose();
							}
						};
						EventContent.chooseToUse = function () {
							"step 0"
							if (event.responded) return;
							if (game.modeSwapPlayer && !_status.auto && player.isUnderControl() && !lib.filter.wuxieSwap(event)) {
								game.modeSwapPlayer(player);
							}
							var skills = player.getSkills('invisible').concat(lib.skill.global);
							game.expandSkills(skills);
							for (var i = 0; i < skills.length; i++) {
								var info = lib.skill[skills[i]];
								if (info && info.onChooseToUse) {
									info.onChooseToUse(event);
								}
							}
							_status.noclearcountdown = true;
							if (event.type == 'phase') {
								if ((typeof event.isMine == 'function') && event.isMine()) {
									event.endButton = ui.create.control('结束回合', 'stayleft',
										function () {
											var evt = _status.event;
											if (evt.name != 'chooseToUse' || evt.type != 'phase') return;
											if (evt.skill) {
												ui.click.cancel();
											}
											ui.click.cancel();
										});
									event.fakeforce = true;
								} else {
									if (event.endButton) {
										event.endButton.close();
										delete event.endButton;
									}
									event.fakeforce = false;
								}
							}
							if (event.player.isUnderControl() && !_status.auto) {
								event.result = {
									bool: false
								}
								return;
							} else if ((typeof event.isMine == 'function') && event.isMine()) {
								if (event.hsskill && !event.forced && _status.prehidden_skills.contains(event.hsskill)) {
									ui.click.cancel();
									return;
								}
								if (event.type == 'wuxie') {
									if (ui.tempnowuxie) {
										var triggerevent = event.getTrigger();
										if (triggerevent && triggerevent.targets && triggerevent.num == triggerevent.targets.length - 1) {
											ui.tempnowuxie.close();
										}
									}
									if (lib.filter.wuxieSwap(event)) {
										event.result = {
											bool: false
										}
										return;
									}
								}
								var ok = game.check();
								if (!ok || !lib.config.auto_confirm) {
									game.pause();
									if (lib.config.enable_vibrate && player._noVibrate) {
										delete player._noVibrate;
										game.vibrate();
									}
								}
								if (!ok) {
									var tipText;
									var handTip = event.handTip = dui.showHandTip();
									if (event.openskilldialog) {
										tipText = event.openskilldialog;
										event.openskilldialog = undefined;
									} else if (event.prompt !== false) {
										if (typeof event.prompt == 'function') {
											tipText = event.prompt(event);
										} else if (typeof event.prompt == 'string') {
											tipText = event.prompt;
										} else {
											if (typeof event.filterCard == 'object') {
												var filter = event.filterCard;
												tipText = '请使用' + get.cnNumber(event.selectCard[0]) + '张'
												if (filter.name) {
													tipText += get.translation(filter.name);
												} else {
													tipText += '牌';
												}
											} else {
												tipText = '请选择一张卡牌';
											}

											if (event.type == 'phase' && (typeof event.isMine == 'function') && event.isMine()) {
												handTip.appendText('出牌阶段', 'phase');
												tipText = '，' + tipText
											}
										}

										if (event.prompt2) {
											if (tipText == null)
												tipText = ''

											handTip.setInfomation(event.prompt2);
										}
									}

									if (tipText != undefined) {
										event.dialog = handTip;
										tipText = tipText.replace(/<\/?.+?\/?>/g, '');
										handTip.appendText(tipText);
										handTip.strokeText();
										handTip.show();
									} else {
										handTip.close();
									}
								}
							} else if (event.isOnline()) {
								event.send();
							} else {
								event.result = 'ai';
							}
							"step 1"
							if (event.result == 'ai') {
								var ok = game.check();
								if (ok) {
									ui.click.ok();
								} else if (ai.basic.chooseCard(event.ai1) || forced) {
									if ((ai.basic.chooseTarget(event.ai2) || forced) && (!event.filterOk || event.filterOk())) {
										ui.click.ok();
										event._aiexcludeclear = true;
									} else {
										if (!event.norestore) {
											if (event.skill) {
												var skill = event.skill;
												ui.click.cancel();
												event._aiexclude.add(skill);
												var info = get.info(skill);
												if (info.sourceSkill) {
													event._aiexclude.add(info.sourceSkill);
												}
											} else {
												get.card(true).aiexclude();
												game.uncheck();
											}
											event.redo();
											game.resume();
										} else {
											ui.click.cancel();
										}
									}
								} else if (event.skill && !event.norestore) {
									var skill = event.skill;
									ui.click.cancel();
									event._aiexclude.add(skill);
									var info = get.info(skill);
									if (info.sourceSkill) {
										event._aiexclude.add(info.sourceSkill);
									}
									event.redo();
									game.resume();
								} else {
									ui.click.cancel();
								}
								if (event.aidelay && event.result && event.result.bool) {
									game.delayx();
								}
							}
							"step 2"
							if (event.endButton) {
								event.endButton.close();
								delete event.endButton;
							}
							event.resume();
							if (event.result) {
								if (event.result._sendskill) {
									lib.skill[event.result._sendskill[0]] = event.result._sendskill[1];
								}
								if (event.result.skill) {
									var info = get.info(event.result.skill);
									if (info && info.chooseButton) {
										if (event.dialog && typeof event.dialog == 'object') event.dialog.close();
										var dialog = info.chooseButton.dialog(event, player);
										if (info.chooseButton.chooseControl) {
											var next = player.chooseControl(info.chooseButton.chooseControl(event, player));
											next.dialog = dialog;
											next.set('ai', info.chooseButton.check ||
												function () {
													return 0;
												});
											if (event.id) next._parent_id = event.id;
											next.type = 'chooseToUse_button';
										} else {
											var next = player.chooseButton(dialog);
											next.set('ai', info.chooseButton.check ||
												function () {
													return 1;
												});
											next.set('filterButton', info.chooseButton.filter ||
												function () {
													return true;
												});
											next.set('selectButton', info.chooseButton.select || 1);
											if (event.id) next._parent_id = event.id;
											next.type = 'chooseToUse_button';
										}
										event.buttoned = event.result.skill;
									} else if (info && info.precontent && !game.online && !event.nouse) {
										var next = game.createEvent('pre_' + event.result.skill);
										next.setContent(info.precontent);
										next.set('result', event.result);
										next.set('player', player);
									}
								}
							}
							"step 3"
							if (event.buttoned) {
								if (result.bool || result.control && result.control != 'cancel2') {
									var info = get.info(event.buttoned).chooseButton;
									lib.skill[event.buttoned + '_backup'] = info.backup(info.chooseControl ? result : result.links, player);
									lib.skill[event.buttoned + '_backup'].sourceSkill = event.buttoned;
									if (game.online) {
										event._sendskill = [event.buttoned + '_backup', lib.skill[event.buttoned + '_backup']];
									}
									event.backup(event.buttoned + '_backup');
									if (info.prompt) {
										event.openskilldialog = info.prompt(info.chooseControl ? result : result.links, player);
									}
								} else {
									ui.control.animate('nozoom', 100);
									event._aiexclude.add(event.buttoned);
								}
								event.goto(0);
								delete event.buttoned;
							}
							"step 4"
							if (event._aiexcludeclear) {
								delete event._aiexcludeclear;
								event._aiexclude.length = 0;
							}
							delete _status.noclearcountdown;
							if (event.skillDialog && get.objtype(event.skillDialog) == 'div') {
								event.skillDialog.close();
							}
							if (event.result && event.result.bool && !game.online && !event.nouse) {
								player.useResult(event.result, event);
							} else if (event._sendskill) {
								event.result._sendskill = event._sendskill;
							}
							if (event.dialog && typeof event.dialog == 'object') event.dialog.close();
							if (!_status.noclearcountdown) {
								game.stopCountChoose();
							}
							"step 5"
							if (event._result && event.result) {
								event.result.result = event._result;
							}
						};
						EventContent.equip = function () {
							"step 0"
							var owner = get.owner(card);
							if (owner) {
								event.owner = owner;
								var next = owner.lose(card, ui.special, 'visible').set('type', 'equip').set('getlx', false);
								next.animate = true;
								next.blameEvent = event;
							} else if (get.position(card) == 'c') event.updatePile = true;

							"step 1"
							if (event.cancelled) {
								event.finish();
								return;
							}
							if (card.destroyed) {
								if (player.hasSkill(card.destroyed)) {
									delete card.destroyed;
								} else {
									event.finish();
									return;
								}
							} else if (event.owner) {
								if (event.owner.getCards('hejsx').contains(card)) {
									event.finish();
									return;
								}
							}
							if (event.draw) {
								game.delay(0, 300);
								player.$draw(card);
							}
							"step 2"
							if (card.clone)
								player.$gain2(card);
							player.equiping = true;
							"step 3"
							var info = get.info(card, false);
							var current = player.getCards('e',
								function (card) {
									if (info.customSwap) return info.customSwap(card);
									return get.subtype(card, false) == info.subtype;
								});
							if (current.length) {
								player.lose(current, false, 'visible').set('type', 'equip').set('getlx', false).swapEquip = true;
								if (info.loseThrow) {
									player.$throw(current);
								}
								event.swapped = true;
								// event.redo();
							}
							"step 4"
							if (player.isMin() || player.countCards('e', {
								subtype: get.subtype(card)
							})) {
								event.finish();
								game.cardsDiscard(card);
								delete player.equiping;
								return;
							}
							var subtype = get.subtype(card);
							if (subtype == 'equip6') subtype = 'equip3';
							game.broadcastAll(function (type) {
								if (lib.config.background_audio) {
									game.playAudio('effect', type);
								}
							}, subtype);
							player.$equip(card);
							game.addVideo('equip', player, get.cardInfo(card));
							game.log(player, '装备了', card);
							if (event.updatePile) game.updateRoundNumber();
							"step 5"
							var info = get.info(card, false);
							if (info.onEquip && (!info.filterEquip || info.filterEquip(card, player))) {
								if (Array.isArray(info.onEquip)) {
									for (var i = 0; i < info.onEquip.length; i++) {
										var next = game.createEvent('equip_' + card.name);
										next.setContent(info.onEquip[i]);
										next.player = player;
										next.card = card;
									}
								} else {
									var next = game.createEvent('equip_' + card.name);
									next.setContent(info.onEquip);
									next.player = player;
									next.card = card;
								}
								if (info.equipDelay != 'false') game.delayx();
							}
							delete player.equiping;
							if (event.delay) {
								game.delayx();
							}
						};
						EventContent.respond = function () {
							"step 0"
							var cardaudio = true;
							if (event.skill) {
								if (lib.skill[event.skill].audio) {
									cardaudio = false;
								}
								player.logSkill(event.skill);
								player.checkShow(event.skill, true);
								if (lib.skill[event.skill].onrespond && !game.online) {
									lib.skill[event.skill].onrespond(event, player);
								}
							} else if (!event.nopopup) player.tryCardAnimate(card, card.name, 'wood');
							if (cardaudio && event.getParent(3).name == 'useCard') {
								game.broadcastAll(function (player, card) {
									if (lib.config.background_audio) {
										var sex = player.sex == 'female' ? 'female' : 'male';
										var audioinfo = lib.card[card.name].audio;
										if (typeof audioinfo == 'string' && audioinfo.indexOf('ext:') == 0) {
											game.playAudio('..', 'extension', audioinfo.slice(4), card.name + '_' + sex);
										} else {
											game.playAudio('card', sex, card.name);
										}
									}
								}, player, card);
							}
							if (event.skill) {
								if (player.stat[player.stat.length - 1].skill[event.skill] == undefined) {
									player.stat[player.stat.length - 1].skill[event.skill] = 1;
								} else {
									player.stat[player.stat.length - 1].skill[event.skill]++;
								}
								var sourceSkill = get.info(event.skill).sourceSkill;
								if (sourceSkill) {
									if (player.stat[player.stat.length - 1].skill[sourceSkill] == undefined) {
										player.stat[player.stat.length - 1].skill[sourceSkill] = 1;
									} else {
										player.stat[player.stat.length - 1].skill[sourceSkill]++;
									}
								}
							}
							if (cards.length && (cards.length > 1 || cards[0].name != card.name)) {
								game.log(player, '打出了', card, '（', cards, '）');
							} else {
								game.log(player, '打出了', card);
							}
							player.actionHistory[player.actionHistory.length - 1].respond.push(event);
							var cards2 = cards.concat();
							if (cards2.length) {
								var next = player.lose(cards2, ui.ordering, 'visible');
								cards2.removeArray(next.cards);
								if (event.noOrdering)
									next.noOrdering = true;

								if (event.animate != false && event.throw !== false) {
									next.animate = true;
									next.blameEvent = event;
								}

								if (cards2.length) {
									var next2 = game.cardsGotoOrdering(cards2);
									if (event.noOrdering)
										next2.noOrdering = true;

									player.$throw(cards2);
								}
							}
							event.trigger('respond');
							"step 1"
							game.delayx(0.5);
						};
						EventContent.gain = function () {
							"step 0"
							if (event.animate == 'give')
								event.visible = true;

							if (cards) {
								var map = {};
								for (var i of cards) {
									var owner = get.owner(i, 'judge');
									if (owner && (owner != player || get.position(i) != 'h')) {
										var id = owner.playerid;
										if (!map[id]) map[id] = [[], [], []];
										map[id][0].push(i);
										var position = get.position(i);
										if (position == 'h') map[id][1].push(i);
										else map[id][2].push(i);
									} else if (!event.updatePile && get.position(i) == 'c') event.updatePile = true;
								}
								event.losing_map = map;
								for (var i in map) {
									var owner = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
									var next = owner.lose(map[i][0], ui.special).set('type', 'gain').set('forceDie', true).set('getlx', false);
									if (event.visible == true)
										next.visible = true;

									event.relatedLose = next;
								}
							} else {
								event.finish();
							}
							"step 1"
							for (var i = 0; i < cards.length; i++) {
								if (cards[i].destroyed) {
									if (player.hasSkill(cards[i].destroyed)) {
										delete cards[i].destroyed;
									} else {
										cards.splice(i--, 1);
									}
								}
							}
							if (cards.length == 0) {
								event.finish();
								return;
							}
							player.getHistory('gain').push(event);
							"step 2"
							if (player.getStat().gain == undefined) {
								player.getStat().gain = cards.length;
							} else {
								player.getStat().gain += cards.length;
							}
							"step 3"
							var gaintag = event.gaintag;
							var handcards = player.node.handcards1;
							var fragment = document.createDocumentFragment();

							var card;
							for (var i = 0; i < cards.length; i++) {
								card = cards[i];
								card.fix();
								if (card.parentNode == handcards) {
									cards.splice(i--, 1);
									continue;
								}

								if (gaintag)
									card.addGaintag(gaintag);

								fragment.insertBefore(card, fragment.firstChild);
								if (_status.discarded)
									_status.discarded.remove(card);

								for (var j = 0; j < card.vanishtag.length; j++) {
									if (card.vanishtag[j][0] != '_')
										card.vanishtag.splice(j--, 1);
								}
							}

							var gainTo = function (cards, nodelay) {
								cards.duiMod = event.source;
								if (player == game.me) {
									dui.layoutHandDraws(cards.reverse());
									dui.queueNextFrameTick(dui.layoutHand, dui);
									game.addVideo('gain12', player, [get.cardsInfo(fragment.childNodes), gaintag]);
								}

								var s = player.getCards('s');
								if (s.length)
									handcards.insertBefore(fragment, s[0]);
								else
									handcards.appendChild(fragment);

								game.broadcast(function (player, cards, num, gaintag) {
									player.directgain(cards, null, gaintag);
									_status.cardPileNum = num;
								}, player, cards, ui.cardPile.childNodes.length, gaintag);

								if (nodelay !== true) {
									setTimeout(function (player) {
										player.update();
										game.resume();
									}, get.delayx(400, 400) + 66, player);
								} else {
									player.update();
								}
							};
							if (event.animate == 'draw') {
								game.pause();
								gainTo(cards);
								player.$draw(cards.length);
							} else if (event.animate == 'gain') {
								game.pause();
								gainTo(cards);
								player.$gain(cards);
							} else if (event.animate == 'gain2' || event.animate == 'draw2') {
								game.pause();
								gainTo(cards);
								player.$gain2(cards);
							} else if (event.animate == 'give' || event.animate == 'giveAuto') {
								game.pause();
								gainTo(cards);
								var evtmap = event.losing_map;
								if (event.animate == 'give') {
									for (var i in evtmap) {
										var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
										source.$give(evtmap[i][0], player)
									}
								} else {
									for (var i in evtmap) {
										var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
										if (evtmap[i][1].length) source.$giveAuto(evtmap[i][1], player);
										if (evtmap[i][2].length) source.$give(evtmap[i][2], player);
									}
								}
							} else if (typeof event.animate == 'function') {
								var time = event.animate(event);
								game.pause();
								setTimeout(function () {
									addv();
									player.node.handcards1.insertBefore(frag1, player.node.handcards1.firstChild);
									player.node.handcards2.insertBefore(frag2, player.node.handcards2.firstChild);
									player.update();
									if (player == game.me) ui.updatehl();
									broadcast();
									game.resume();
								}, get.delayx(time, time));
							} else {
								gainTo(cards, true);
								event.finish();
							}
							if (event.log) {
								game.log(player, '获得了', cards);
							}
							"step 4"
							if (event.updatePile) game.updateRoundNumber();
							event.finish();
						};
						EventContent.gameDraw = function () {
							"step 0"
							if (_status.brawl && _status.brawl.noGameDraw)
								return event.goto(4);

							var end = player;
							var gainNum = num;
							do {
								if (typeof num == 'function')
									gainNum = num(player);

								if (player.getTopCards)
									player.directgain(player.getTopCards(gainNum));
								else
									player.directgain(get.cards(gainNum));

								player.$draw(gainNum);
								if (player.singleHp === true && get.mode() != 'guozhan' && (lib.config.mode != 'doudizhu' || _status.mode != 'online'))
									player.doubleDraw();

								player._start_cards = player.getCards('h');
								player = player.next;
							} while (player != end);
							event.changeCard = get.config('change_card');
							if (_status.connectMode || (lib.config.mode == 'doudizhu' && _status.mode == 'online') || lib.config.mode != 'identity' && lib.config.mode != 'guozhan' && lib.config.mode != 'doudizhu' && lib.config.mode != 'huanhuazhizhan' && lib.config.mode != 'th_mougong') {
								event.changeCard = 'disabled';
							}
							"step 1"
							if (event.changeCard != 'disabled' && !_status.auto) {
								event.dialog = dui.showHandTip('是否使用手气卡？');
								event.dialog.strokeText();
								ui.create.confirm('oc');
								event.custom.replace.confirm = function (bool) {
									_status.event.bool = bool;
									game.resume();
								}
							} else {
								event.goto(4);
							}
							"step 2"
							if (event.changeCard == 'once') {
								event.changeCard = 'disabled';
							} else if (event.changeCard == 'twice') {
								event.changeCard = 'once';
							} else if (event.changeCard == 'disabled') {
								event.bool = false;
								return;
							}
							_status.imchoosing = true;
							event.switchToAuto = function () {
								_status.event.bool = false;
								game.resume();
							}
							game.pause();
							"step 3"
							_status.imchoosing = false;
							if (event.bool) {
								if (game.changeCoin) {
									game.changeCoin(- 3);
								}
								var hs = game.me.getCards('h');
								game.addVideo('lose', game.me, [get.cardsInfo(hs), [], [], []]);
								for (var i = 0; i < hs.length; i++) {
									hs[i].discard(false);
								}
								game.me.directgain(get.cards(hs.length));
								event.goto(2);
							} else {
								if (event.dialog) event.dialog.close();
								if (ui.confirm) ui.confirm.close();
								game.me._start_cards = game.me.getCards('h');
								event.goto(4);
							}
							"step 4"
							setTimeout(decadeUI.effect.gameStart, 51);
						};
						EventContent.judge = function () {
							"step 0"
							var judgestr = get.translation(player) + '的' + event.judgestr + '判定';
							event.videoId = lib.status.videoId++;
							var cardj = event.directresult;
							if (!cardj) {
								if (player.getTopCards) cardj = player.getTopCards()[0];
								else cardj = get.cards()[0];
							}
							var nextj = game.cardsGotoOrdering(cardj);
							if (event.position != ui.discardPile) nextj.noOrdering = true;
							player.judging.unshift(cardj);
							game.addVideo('judge1', player, [get.cardInfo(player.judging[0]), judgestr, event.videoId]);
							game.broadcastAll(function (player, card, str, id, cardid) {
								var event = game.online ? {} : _status.event;
								if (game.chess)
									event.node = card.copy('thrown', 'center', ui.arena).animate('start');
								else
									event.node = player.$throwordered2(card.copy(), true);

								if (lib.cardOL) lib.cardOL[cardid] = event.node;
								event.node.cardid = cardid;
								if (!window.decadeUI) {
									ui.arena.classList.add('thrownhighlight');
									event.node.classList.add('thrownhighlight');
									event.dialog = ui.create.dialog(str);
									event.dialog.classList.add('center');
								} else {
									event.dialog = dui.showHandTip(str);
									event.dialog.strokeText();
									if (game.online)
										ui.dialogs.push(event.dialog);
								}

								event.dialog.videoId = id;
							}, player, player.judging[0], judgestr, event.videoId, get.id());

							game.log(player, '进行' + event.judgestr + '判定，亮出的判定牌为', player.judging[0]);
							game.delay(2);
							if (!event.noJudgeTrigger)
								event.trigger('judge');
							"step 1"
							event.result = {
								card: player.judging[0],
								name: player.judging[0].name,
								number: get.number(player.judging[0]),
								suit: get.suit(player.judging[0]),
								color: get.color(player.judging[0]),
								node: event.node,
							};
							if (event.fixedResult) {
								for (var i in event.fixedResult) {
									event.result[i] = event.fixedResult[i];
								}
							}
							event.result.judge = event.judge(event.result);
							if (event.result.judge > 0) event.result.bool = true;
							else if (event.result.judge < 0) event.result.bool = false;
							else event.result.bool = null;
							player.judging.shift();
							game.checkMod(player, event.result, 'judge', player);
							if (event.judge2) {
								var judge2 = event.judge2(event.result);
								if (typeof judge2 == 'boolean') player.tryJudgeAnimate(judge2);
							};
							if (event.clearArena != false) {
								game.broadcastAll(ui.clear);
							}

							event.dialog.close();
							game.broadcast(function (id) {
								var dialog = get.idDialog(id);
								if (dialog)
									dialog.close();

								if (!window.decadeUI)
									ui.arena.classList.remove('thrownhighlight');
							}, event.videoId);

							game.addVideo('judge2', null, event.videoId);
							game.log(player, '的判定结果为', event.result.card);
							event.triggerMessage('judgeresult');
							event.trigger('judgeFixing');
							if (event.callback) {
								var next = game.createEvent('judgeCallback', false);
								next.player = player;
								next.card = event.result.card;
								next.judgeResult = get.copy(event.result);
								next.setContent(event.callback);
							} else {
								if (!get.owner(event.result.card)) {
									if (event.position != ui.discardPile)
										event.position.appendChild(event.result.card);
								}
							}
						};
						EventContent.phase = function () {
							"step 0"
							player.phaseZhunbei();
							"step 1"
							player.phaseJudge();
							"step 2"
							player.phaseDraw();
							"step 3"
							player.phaseUse();
							if (!player.noPhaseDelay) {
								if (player == game.me)
									game.delay();
								else
									game.delayx();
							}
							"step 4"
							game.broadcastAll(function () {
								if (ui.tempnowuxie) {
									ui.tempnowuxie.close();
									delete ui.tempnowuxie;
								}
							});
							player.phaseDiscard();
							if (!player.noPhaseDelay)
								game.delayx();

							delete player._noSkill;
							"step 5"
							player.phaseJieshu();
						};
						EventContent.lose = function () {
							"step 0"
							if (event.insert_card && event.position == ui.cardPile)
								event.cards.reverse();

							event.stockcards = cards.concat();
							var hs = [], es = [], js = [], ss = [], xs = [];
							var unmarks = [];
							var cards = event.cards;
							var gainmap = event.gaintag_map = {};
							var be = event.blameEvent;
							var pe = event.getParent();
							var pename = pe.name;

							if (be == undefined && (pename != 'discard' || event.type != 'discard') && (pename != 'loseToDiscardpile' || event.type != 'loseToDiscardpile')) {
								event.animate = false;
								event.delay = false;
							} else {
								if (pe.delay === false)
									event.delay = false;

								if (event.animate == undefined)
									event.animate = pe.animate;
							}


							var card, pileNode;
							var hej = player.getCards('hejsx');
							for (var i = 0; i < cards.length; i++) {
								card = cards[i];

								pileNode = card.parentNode;
								if (!hej.contains(card)) {
									cards.splice(i--, 1);
									continue;
								} else if (pileNode) {
									if (pileNode.classList.contains('equips')) {
										es.push(card);
										card.throwWith = card.original = 'e';
									} else if (pileNode.classList.contains('judges')) {
										js.push(card);
										card.throwWith = card.original = 'j';
									} else if (pileNode.classList.contains('expansions')) {
										xs.push(card);
										card.throwWith = card.original = 'x';
										if (card.gaintag && card.gaintag.length) unmarks.addArray(card.gaintag);
									} else if (pileNode.classList.contains('handcards')) {
										if (card.classList.contains('glows')) {
											ss.push(card);
											card.throwWith = card.original = 's';
										} else {
											hs.push(card);
											card.throwWith = card.original = 'h';
										}
									} else {
										card.throwWith = card.original = null;
									}
								}
								if (card.gaintag && card.gaintag.length) {
									gainmap[card.cardid] = card.gaintag.concat();
									card.removeGaintag(true);
								}

								var info = lib.card[card.name];
								if (info.destroy || card._destroy) {
									card.delete();
									card.destroyed = info.destroy || card._destroy;
								} else if (event.position) {
									if (_status.discarded) {
										if (event.position == ui.discardPile) {
											_status.discarded.add(card);
										} else {
											_status.discarded.remove(card);
										}
									}

									if (event.insert_index) {
										card.fix();
										event.position.insertBefore(card, event.insert_index(event, card));
									} else if (event.insert_card) {
										card.fix();
										event.position.insertBefore(card, event.position.firstChild);
									} else {
										if (event.position == ui.cardPile)
											card.fix();

										event.position.appendChild(card);
									}
								} else {
									card.remove();
								}

								card.recheck();
								card.classList.remove('glow');
								card.classList.remove('glows');
							}

							if (player == game.me)
								dui.queueNextFrameTick(dui.layoutHand, dui);

							ui.updatej(player);
							game.broadcast(function (player, cards, num) {
								for (var i = 0; i < cards.length; i++) {
									cards[i].classList.remove('glow');
									cards[i].classList.remove('glows');
									cards[i].fix();
									cards[i].remove();
								}

								if (player == game.me)
									ui.updatehl();

								ui.updatej(player);
								_status.cardPileNum = num;
							}, player, cards, ui.cardPile.childNodes.length);
							if (event.animate != false) {
								pe.discardid = lib.status.videoId++;
								game.broadcastAll(function (player, cards, id) {
									cards.duiMod = true;
									player.$throw(cards, null, 'nobroadcast');
									var cardnodes = [];
									cardnodes._discardtime = get.time();
									for (var i = 0; i < cards.length; i++) {
										if (cards[i].clone) {
											cardnodes.push(cards[i].clone);
										}
									}
									ui.todiscard[id] = cardnodes;
								}, player, cards, pe.discardid);
								if (lib.config.sync_speed && cards[0] && cards[0].clone) {
									var evt;
									if (pe.delay != false)
										evt = pe;
									else if (pe.getParent().discardTransition)
										evt = pe.getParent();

									if (evt) {
										evt.discardTransition = undefined;
										var waitingForTransition = get.time();
										evt.waitingForTransition = waitingForTransition;
										cards[0].clone.listenTransition(function () {
											if (_status.waitingForTransition == waitingForTransition && _status.paused)
												game.resume();

											evt.waitingForTransition = undefined;
										});
									}
								}
							}

							game.addVideo('lose', player, [get.cardsInfo(hs), get.cardsInfo(es), get.cardsInfo(js), get.cardsInfo(ss), get.cardsInfo(xs)]);
							event.cards2 = hs.concat(es);
							player.getHistory('lose').push(event);
							game.getGlobalHistory().cardMove.push(event);
							player.update();
							game.addVideo('loseAfter', player);
							event.num = 0;
							if (event.position == ui.ordering) {
								var evt = event.relatedEvent || event.getParent();
								if (!evt.orderingCards) evt.orderingCards = [];
								if (!event.noOrdering && !event.cardsOrdered) {
									event.cardsOrdered = true;
									var next = game.createEvent('orderingDiscard', false, evt.getParent());
									next.relatedEvent = evt;
									next.setContent('orderingDiscard');
								}
								if (!event.noOrdering) {
									evt.orderingCards.addArray(cards);
									evt.orderingCards.addArray(ss);
								}
							} else if (event.position == ui.cardPile) {
								game.updateRoundNumber();
							}
							if (event.toRenku) _status.renku.addArray(cards);
							if (unmarks.length) {
								for (var i of unmarks) {
									player[(lib.skill[i] && lib.skill[i].mark || player.hasCard((card) => card.hasGaintag(i), 'x')) ? 'markSkill' : 'unmarkSkill'](i);
								}
							}
							event.hs = hs;
							event.es = es;
							event.js = js;
							event.ss = ss;
							event.xs = xs;
							"step 1"
							if (num < cards.length) {
								if (event.es.contains(cards[num])) {
									event.loseEquip = true;
									player.removeEquipTrigger(cards[num]);
									var info = get.info(cards[num]);
									if (info.onLose && (!info.filterLose || info.filterLose(cards[num], player))) {
										event.goto(2);
										return;
									}
								}
								event.num++;
								event.redo();
							} else {
								if (event.loseEquip) {
									player.addEquipTrigger();
								}
								event.goto(3);
							}
							"step 2"
							var info = get.info(cards[num]);
							if (info.loseDelay != false && (player.isAlive() || info.forceDie)) {
								player.popup(cards[num].name);
								game.delayx();
							}
							if (Array.isArray(info.onLose)) {
								for (var i = 0; i < info.onLose.length; i++) {
									var next = game.createEvent('lose_' + cards[num].name);
									next.setContent(info.onLose[i]);
									if (info.forceDie) next.forceDie = true;
									next.player = player;
									next.card = cards[num];
								}
							} else {
								var next = game.createEvent('lose_' + cards[num].name);
								next.setContent(info.onLose);
								next.player = player;
								if (info.forceDie) next.forceDie = true;
								next.card = cards[num];
							}
							event.num++;
							event.goto(1);
							"step 3"
							if (event.toRenku) {
								if (_status.renku.length > 6) {
									var cards = _status.renku.splice(0, _status.renku.length - 6);
									game.log(cards, '从仁库进入了弃牌堆');
									game.cardsDiscard(cards).set('outRange', true).fromRenku = true;
								}
								game.updateRenku();
							}
							"step 4"
							var evt = event.getParent();
							if (evt.name != 'discard' && event.type != 'discard' && evt.name != 'loseToDiscardpile' && event.type != 'loseToDiscardpile') return;
							if (event.animate === false || event.delay === false) return;
							if (evt.delay != false) {
								if (evt.waitingForTransition) {
									_status.waitingForTransition = evt.waitingForTransition;
									game.pause();
								} else {
									game.delayx();
								}
							}
						};
						EventContent.turnOver = function () {
							game.log(player, '翻面');
							player.classList.toggle('turnedover');
							game.broadcast(function (player) {
								player.classList.toggle('turnedover');
							}, player);
							game.addVideo('turnOver', player, player.classList.contains('turnedover'));
							player.queueCssAnimation('turned-over 0.5s linear');
						};
						return EventContent;
					})({});

					var Skill = (function (Skill) {
						Skill._save = {
							priority: 5,
							forced: true,
							popup: false,
							filter: function () { return false; },
							content: function () {
								"step 0"
								event.dying = trigger.player;
								if (!event.acted) event.acted = [];
								"step 1"
								if (trigger.player.isDead()) {
									event.finish();
									return;
								}
								event.acted.push(player);
								if (lib.config.tao_enemy && event.dying.side != player.side && lib.config.mode != 'identity' && lib.config.mode != 'guozhan' && !event.dying.hasSkillTag('revertsave')) {
									event._result = {
										bool: false
									}
								} else if (player.canSave(event.dying)) {
									player.chooseToUse({
										filterCard: function (card, player, event) {
											event = event || _status.event;
											return lib.filter.cardSavable(card, player, event.dying);
										},
										dyingPlayer: trigger.player,
										filterTarget: function (card, player, target) {
											if (target != _status.event.dying) return false;
											if (!card) return false;
											var info = get.info(card);
											if (!info.singleCard || ui.selected.targets.length == 0) {
												var mod = game.checkMod(card, player, target, 'unchanged', 'playerEnabled', player);
												if (mod == false) return false;
												var mod = game.checkMod(card, player, target, 'unchanged', 'targetEnabled', target);
												if (mod != 'unchanged') return mod;
											}
											return true;
										},
										prompt: function (event) {
											var handTip = event.handTip;
											var player = event.player;
											var target = event.dyingPlayer;
											if (player != target) {
												handTip.appendText(get.translation(target), 'player');
												handTip.appendText('濒死，需要');
												handTip.appendText((Math.abs(target.hp) + 1), 'number');
												handTip.appendText('个桃，是否对其使用桃？');
											} else {
												handTip.appendText('你当前体力值为');
												handTip.appendText(target.hp, 'number');
												handTip.appendText('，需要');
												handTip.appendText((Math.abs(target.hp) + 1), 'number');
												handTip.appendText('个桃，是否出桃？');
											}

											return '';
										},
										ai1: function (card) {
											if (typeof card == 'string') {
												var info = get.info(card);
												if (info.ai && info.ai.order) {
													if (typeof info.ai.order == 'number') {
														return info.ai.order;
													} else if (typeof info.ai.order == 'function') {
														return info.ai.order();
													}
												}
											}
											return 1;
										},
										ai2: get.effect_use,
										type: 'dying',
										targetRequired: true,
										dying: event.dying
									});
								} else {
									event._result = {
										bool: false
									}
								}
								"step 2"
								if (result.bool) {
									var player = trigger.player;
									if (player.hp <= 0 && !trigger.nodying && !player.nodying && player.isAlive() && !player.isOut() && !player.removed) event.goto(0);
									else trigger.untrigger();
								} else {
									for (var i = 0; i < 20; i++) {
										if (event.acted.contains(event.player.next)) {
											break;
										} else {
											event.player = event.player.next;
											if (!event.player.isOut()) {
												event.goto(1);
												break;
											}
										}
									}
								}
							}
						};
						return Skill;
					})({});

					var Click = (function (Click) {
						Click.skill = function (skill) {
							var info = get.info(skill);
							var event = _status.event;
							event.backup(skill);
							if (info.filterCard && info.discard != false && info.lose != false && !info.viewAs) {
								var cards = event.player.getCards(event.position);
								for (var i = 0; i < cards.length; i++) {
									if (!lib.filter.cardDiscardable(cards[i], event.player)) {
										cards[i].uncheck('useSkill');
									}
								}
							}
							if (typeof event.skillDialog == 'object') {
								event.skillDialog.close();
							}
							if ((typeof event.isMine == 'function') && event.isMine()) {
								event.skillDialog = true;
							}
							game.uncheck();
							game.check();
							if (event.skillDialog) {
								var title = get.translation(skill);
								var intro;
								if (info.prompt) {
									if (typeof info.prompt == 'function') {
										intro = info.prompt(event);
									} else {
										intro = info.prompt;
									}
								} else if (info.promptfunc) {
									intro = info.promptfunc(event, event.player);
								} else if (lib.dynamicTranslate[skill]) {
									intro = lib.dynamicTranslate[skill](event.player, skill);
								} else if (lib.translate[skill + '_info']) {
									intro = lib.translate[skill + '_info'];
								}

								if (intro != undefined) {
									if (intro.length > 25) {
										event.skillDialog = ui.create.dialog(title, '<div><div style="width:100%">' + intro + '</div></div>');
									} else {
										var handTip = dui.showHandTip(intro);
										handTip.strokeText();
										event.skillDialog = handTip;
									}
								}
							}
						};
						return Click;
					})({});

					var Create = (function (Create) {
						Create.prebutton = function (item, type, position, noclick) {
							var button = ui.create.div();
							button.style.display = 'none';
							button.link = item;
							button.activate = function () {
								var node = ui.create.button(item, type, undefined, noclick, button);
								node.activate = undefined;
							};
							_status.prebutton.push(button);
							if (position) position.appendChild(button);
							return button;
						};
						return Create;
					})({});

					var Game = (function (Game) {
						Game.bossPhaseLoop = function () {
							game.broadcastAll(function (firstAction) {
								var cur;
								for (var i = 0; i < game.players.length; i++) {
									cur = game.players[i];
									if (!cur.node.seat)
										cur.node.seat = decadeUI.element.create('seat', cur);

									cur.seat = get.distance(firstAction, cur, 'absolute') + 1;
									cur.node.seat.innerHTML = get.cnNumber(cur.seat, true);
								}
							}, game.boss);

							return this._super.bossPhaseLoop.apply(this, arguments);
						};
						Game.logv = function (player, card, targets, event, forced, logvid) {
							var node = ui.create.div('.hidden');
							node.node = {};
							logvid = logvid || get.id();
							if (!player) {
								player = _status.event.getParent().logvid;
								if (!player) return;
							}
							game.broadcast(function (player, card, targets, event, forced, logvid) {
								game.logv(player, card, targets, event, forced, logvid);
							}, player, card, targets, event, forced, logvid);
							if (typeof player == 'string') {
								for (var i = 0; i < ui.historybar.childElementCount; i++) {
									if (ui.historybar.childNodes[i].logvid == player) {
										ui.historybar.childNodes[i].added.push(card);
										break;
									}
								}
								return;
							}
							if (typeof card == 'string') {
								if (card != 'die') {
									if (lib.skill[card] && lib.skill[card].logv === false && !forced) return;
									if (!lib.translate[card]) return;
								}
								var avatar;
								if (!player.isUnseen(0)) {
									avatar = player.node.avatar.cloneNode();
								} else if (!player.isUnseen(1)) {
									avatar = player.node.avatar2.cloneNode();
								} else {
									return;
								}
								node.node.avatar = avatar;
								avatar.style.transform = '';
								avatar.className = 'avatar';
								if (card == 'die') {
									node.dead = true;
									node.player = player;
									var avatar2 = avatar.cloneNode();
									avatar2.className = 'avatarbg grayscale1';
									avatar.appendChild(avatar2);
									avatar.style.opacity = 0.6;
								} else {
									node.node.text = ui.create.div('', get.translation(card, 'skill'), avatar);
									node.node.text.dataset.nature = 'water';
									node.skill = card;
								}
								node.appendChild(avatar);
								if (card == 'die' && targets && targets != player) {
									node.source = targets;
									var avatar;
									player = targets;
									if (!player.isUnseen(0)) {
										avatar = player.node.avatar.cloneNode();
									} else if (!player.isUnseen(1)) {
										avatar = player.node.avatar2.cloneNode();
									} else if (get.mode() == 'guozhan' && player.node && player.node.name_seat) {
										avatar = ui.create.div('.avatar.cardbg');
										avatar.innerHTML = player.node.name_seat.innerHTML[0];
									} else {
										return;
									}
									avatar.style.transform = '';
									node.node.avatar2 = avatar;
									avatar.classList.add('avatar2');
									node.appendChild(avatar);
								}
							} else if (Array.isArray(card)) {
								node.cards = card[1];
								card = card[0];
								var info = [card.suit || '', card.number || '', card.name || '', card.nature || ''];
								if (!Array.isArray(node.cards) || !node.cards.length) {
									node.cards = [ui.create.card(node, 'noclick', true).init(info)];
								}
								if (card.name == 'wuxie') {
									if (ui.historybar.firstChild && ui.historybar.firstChild.type == 'wuxie') {
										ui.historybar.firstChild.players.push(player);
										ui.historybar.firstChild.cards.addArray(node.cards);
										return;
									} else {
										node.type = 'wuxie';
										node.players = [player];
									}
								}
								if (card.copy) {
									card.copy(node, false);
								} else {
									card = ui.create.card(node, 'noclick', true);
									card.init(info);
								}
								var avatar;
								if (!player.isUnseen(0)) {
									avatar = player.node.avatar.cloneNode();
								} else if (!player.isUnseen(1)) {
									avatar = player.node.avatar2.cloneNode();
								} else if (get.mode() == 'guozhan' && player.node && player.node.name_seat) {
									avatar = ui.create.div('.avatar.cardbg');
									avatar.innerHTML = player.node.name_seat.innerHTML[0];
								} else {
									return;
								}
								node.node.avatar = avatar;
								avatar.style.transform = '';
								avatar.classList.add('avatar2');
								node.appendChild(avatar);

								if (targets && targets.length == 1 && targets[0] != player && get.itemtype(targets[0]) == 'player') {
									(function () {
										var avatar2;
										var target = targets[0];
										if (!target.isUnseen(0)) {
											avatar2 = target.node.avatar.cloneNode();
										} else if (!player.isUnseen(1)) {
											avatar2 = target.node.avatar2.cloneNode();
										} else if (get.mode() == 'guozhan' && target.node && target.node.name_seat) {
											avatar2 = ui.create.div('.avatar.cardbg');
											avatar2.innerHTML = target.node.name_seat.innerHTML[0];
										} else {
											return;
										}
										node.node.avatar2 = avatar2;
										avatar2.style.transform = '';
										avatar2.classList.add('avatar2');
										avatar2.classList.add('avatar3');
										node.insertBefore(avatar2, avatar);
									}());
								}
							}
							if (targets && targets.length) {
								if (targets.length == 1 && targets[0] == player) {
									node.targets = [];
								} else {
									node.targets = targets;
								}
							}

							var bounds = dui.boundsCaches.window;
							bounds.check();
							var fullheight = bounds.height;
							var num = Math.round((fullheight - 8) / 50);
							var margin = (fullheight - 42 * num) / (num + 1);
							node.style.transform = 'scale(0.8)';
							ui.historybar.insertBefore(node, ui.historybar.firstChild);
							ui.refresh(node);
							node.classList.remove('hidden');
							for (var i = 0; i < ui.historybar.childElementCount; i++) {
								var current = ui.historybar.childNodes[i];
								if (i < num) {
									current.style.transform = 'scale(1) translateY(' + (margin + i * (42 + margin) - 4) + 'px)';
								} else {
									if (!current.removetimeout) {
										current.style.opacity = 0;
										current.style.transform = 'scale(1) translateY(' + fullheight + 'px)';
										current.removetimeout = setTimeout((function (current) {
											return function () {
												current.remove();
											};
										}(current)), 500);
									}
								}
							}
							if (lib.config.touchscreen) {
								node.addEventListener('touchstart', ui.click.intro);
							} else {
								// node.addEventListener('mouseenter',ui.click.intro);
								node.addEventListener(lib.config.pop_logv ? 'mousemove' : 'click', ui.click.logv);
								node.addEventListener('mouseleave', ui.click.logvleave);
							}
							node.logvid = logvid;
							node.added = [];
							if (!game.online) {
								event = event || _status.event;
								event.logvid = node.logvid;
							}
							return node;
						}
						Game.phaseLoop = function (player) {
							game.broadcastAll(function (firstAction) {
								var cur;
								for (var i = 0; i < game.players.length; i++) {
									cur = game.players[i];
									if (!cur.node.seat)
										cur.node.seat = decadeUI.element.create('seat', cur);

									cur.seat = cur.getSeatNum();
									cur.node.seat.innerHTML = get.cnNumber(cur.seat, true);
								}
							}, player);

							return this._super.phaseLoop.apply(this, arguments);
						};
						Game.swapSeat = function (player1, player2, prompt, behind, noanimate) {
							base.game.swapSeat.apply(this, arguments);
							player1.seat = player1.getSeatNum();
							if (player1.node.seat) player1.node.seat.innerHTML = get.cnNumber(player1.seat, true);
							player2.seat = player2.getSeatNum();
							if (player2.node.seat) player2.node.seat.innerHTML = get.cnNumber(player2.seat, true);
						};

						// if (get.mode() == 'boss') {
						// Game.modeSwapPlayer = function (player) {
						// game.swapControl(player);
						// game.onSwapControl();

						// var num = ui.arena.dataset.number;
						// game.me.dataset.position = 0;
						// var players = game.players.concat(game.dead);
						// var meIndex = players.indexOf(game.me);
						// for (var i = 0; i < players.length; i++) {
						// if (players[i].side != game.me.side)
						// continue;

						// var pos = game.me.seat - players[i].seat;
						// if (pos > 0)
						// pos = num - pos;
						// else
						// pos = Math.abs(pos);

						// players[i].dataset.position = pos;
						// }
						// };
						// }
						return Game;
					})({});

					overrides(lib.element.card, Card);
					overrides(lib.element.event, Event);
					overrides(lib.element.player, Player);
					overrides(lib.element.content, EventContent);
					overrides(lib.skill, Skill);
					overrides(ui.click, Click);
					overrides(ui.create, Create);
					overrides(game, Game);


					var ride = {};
					ride.lib = {
						element: {
							dialog: {
								add: function (item, noclick, zoom) {
									if (typeof item == 'string') {
										if (item.indexOf('###') == 0) {
											var items = item.slice(3).split('###');
											this.add(items[0], noclick, zoom);
											this.addText(items[1], items[1].length <= 20, zoom);
										} else if (noclick) {
											var strstr = item;
											item = ui.create.div('', this.content);
											item.innerHTML = strstr;
										} else {
											item = ui.create.caption(item, this.content);
										}
									} else if (get.objtype(item) == 'div') {
										this.content.appendChild(item);
									} else if (get.itemtype(item) == 'cards') {
										var buttons = ui.create.div('.buttons', this.content);
										if (zoom) buttons.classList.add('smallzoom');
										this.buttons = this.buttons.concat(ui.create.buttons(item, 'card', buttons, noclick));
									} else if (get.itemtype(item) == 'players') {
										var buttons = ui.create.div('.buttons', this.content);
										if (zoom) buttons.classList.add('smallzoom');
										this.buttons = this.buttons.concat(ui.create.buttons(item, 'player', buttons, noclick));
									} else if (item[1] == 'textbutton') {
										ui.create.textbuttons(item[0], this, noclick);
									} else {
										var buttons = ui.create.div('.buttons', this.content);
										if (zoom) buttons.classList.add('smallzoom');

										if (item[1] && item[1].indexOf('character') != -1) {
											if (this.intersection == undefined && self.IntersectionObserver) {
												this.intersection = new IntersectionObserver(function (entries) {
													for (var i = 0; i < entries.length; i++) {
														if (entries[i].intersectionRatio > 0) {
															var target = entries[i].target;
															target.setBackground(target.awaitItem, 'character');
															this.unobserve(target);
														}
													}
												}, {
													root: this,
													rootMargin: '0px',
													thresholds: 0.01,
												});
											}

											buttons.intersection = this.intersection;
										}

										this.buttons = this.buttons.concat(ui.create.buttons(item[0], item[1], buttons, noclick));
									}
									if (this.buttons.length) {
										if (this.forcebutton !== false) this.forcebutton = true;
										if (this.buttons.length > 3 || (zoom && this.buttons.length > 5)) {
											this.classList.remove('forcebutton-auto');
										} else if (!this.noforcebutton) {
											this.classList.add('forcebutton-auto');
										}
									}
									ui.update();
									return item;
								},

								open: function () {
									if (this.noopen) return;
									for (var i = 0; i < ui.dialogs.length; i++) {
										if (ui.dialogs[i] == this) {
											this.show();
											this.refocus();
											ui.dialogs.remove(this);
											ui.dialogs.unshift(this);
											ui.update();
											return this;
										}
										if (ui.dialogs[i].static) ui.dialogs[i].unfocus();
										else ui.dialogs[i].hide();
									}
									ui.dialog = this;
									ui.arena.appendChild(this);
									ui.dialogs.unshift(this);
									ui.update();
									if (!this.classList.contains('prompt')) {
										this.style.animation = 'open-dialog 0.5s';
									}

									return this;
								},

								close: function () {
									if (this.intersection) {
										this.intersection.disconnect();
										this.intersection = undefined;
									}

									ui.dialogs.remove(this);
									if (ui.dialogs.length > 0) {
										ui.dialog = ui.dialogs[0];
										ui.dialog.show();
										ui.dialog.refocus();
										ui.update();
									}

									this.delete();
									return this;
								},
							},

							card: {
								init: function (card) {
									if (Array.isArray(card)) {
										if (card[2] == 'huosha') {
											card[2] = 'sha';
											card[3] = 'fire';
										}
										if (card[2] == 'leisha') {
											card[2] = 'sha';
											card[3] = 'thunder';
										}
										if (card[2] == 'kamisha') {
											card[2] = 'sha';
											card[3] = 'kami';
										}
										if (card[2] == 'icesha') {
											card[2] = 'sha';
											card[3] = 'ice';
										}
										if (card[2] == 'cisha') {
											card[2] = 'sha';
											card[3] = 'stab';
										}
									} else if (typeof card == 'object') {
										card = [card.suit, card.number, card.name, card.nature];
									}

									var cardnum = card[1] || '';
									var cardsuit = get.translation(card[0]);
									if (parseInt(cardnum) == cardnum) cardnum = parseInt(cardnum);
									if (cardnum > 0 && cardnum < 14) {
										cardnum = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][cardnum - 1];
									}
									if (!lib.card[card[2]]) lib.card[card[2]] = {};
									var info = lib.card[card[2]];
									if (info.global && !this.classList.contains('button')) {
										if (Array.isArray(info.global)) {
											while (info.global.length) {
												game.addGlobalSkill(info.global.shift());
											}
										} else if (typeof info.global == 'string') {
											game.addGlobalSkill(info.global);
										}
										delete info.global;
									}
									if (this.name) {
										this.classList.remove('epic');
										this.classList.remove('legend');
										this.classList.remove('gold');
										this.classList.remove('unique');
										this.style.background = '';
										var subtype = get.subtype(this);
										if (subtype) {
											this.classList.remove(subtype);
										}
									}
									if (info.epic) {
										this.classList.add('epic');
									} else if (info.legend) {
										this.classList.add('legend');
									} else if (info.gold) {
										this.classList.add('gold');
									} else if (info.unique) {
										this.classList.add('unique');
									}
									var bg = card[2];
									if (info.cardimage) {
										bg = info.cardimage;
									}
									var img = lib.card[bg].image;
									if (img) {
										if (img.indexOf('db:') == 0) {
											img = img.slice(3);
										} else if (img.indexOf('ext:') != 0) {
											img = null;
										}
									}
									this.classList.remove('fullskin');
									this.classList.remove('fullimage');
									this.classList.remove('fullborder');
									this.dataset.cardName = card[2];
									this.dataset.cardType = info.type || '';
									this.dataset.cardSubype = info.subtype || '';
									this.dataset.cardMultitarget = info.multitarget ? '1' : '0';
									if (this.node.name.dataset.nature) this.node.name.dataset.nature = '';
									if (!lib.config.hide_card_image && lib.card[bg].fullskin) {
										this.classList.add('fullskin');
										if (img) {
											if (img.indexOf('ext:') == 0) {
												this.node.image.setBackgroundImage(img.replace(/ext:/, 'extension/'));
											} else {
												this.node.image.setBackgroundDB(img);
											}
										} else {
											if (lib.card[bg].modeimage) {
												this.node.image.setBackgroundImage('image/mode/' + lib.card[bg].modeimage + '/card/' + bg + '.png');
											} else {
												if (bg == 'sha' && card[3] == 'stab')
													this.node.image.setBackgroundImage('image/card/cisha.png');
												else
													this.node.image.setBackgroundImage('image/card/' + bg + '.png');
											}
										}
										// } else if (lib.card[bg].image == 'background') {
										// if (card[3]) this.node.background.setBackground(bg + '_' + card[3], 'card');
										// else this.node.background.setBackground(bg, 'card');
									} else if (lib.card[bg].fullimage) {
										this.classList.add('fullimage');
										if (img) {
											if (img.indexOf('ext:') == 0) {
												this.setBackgroundImage(img.replace(/ext:/, 'extension/'));
												this.style.backgroundSize = 'cover';
											} else {
												this.setBackgroundDB(img);
											}
										} else if (lib.card[bg].image) {
											if (lib.card[bg].image.indexOf('character:') == 0) {
												this.setBackground(lib.card[bg].image.slice(10), 'character');
											} else {
												this.setBackground(lib.card[bg].image);
											}
										} else {
											var cardPack = lib.cardPack['mode_' + get.mode()];
											if (Array.isArray(cardPack) && cardPack.contains(bg)) {
												this.setBackground('mode/' + get.mode() + '/card/' + bg);
											} else {
												this.setBackground('card/' + bg);
											}
										}
									} else if (lib.card[bg].fullborder) {
										this.classList.add('fullborder');
										if (lib.card[bg].fullborder == 'gold') {
											this.node.name.dataset.nature = 'metalmm';
										} else if (lib.card[bg].fullborder == 'silver') {
											this.node.name.dataset.nature = 'watermm';
										}
										if (!this.node.avatar) {
											this.node.avatar = ui.create.div('.cardavatar');
											this.insertBefore(this.node.avatar, this.firstChild);
										}
										if (!this.node.framebg) {
											this.node.framebg = ui.create.div('.cardframebg');
											this.node.framebg.dataset.auto = lib.card[bg].fullborder;
											this.insertBefore(this.node.framebg, this.firstChild);
										}
										if (img) {
											if (img.indexOf('ext:') == 0) {
												this.node.avatar.setBackgroundImage(img.replace(/ext:/, 'extension/'));
												this.node.avatar.style.backgroundSize = 'cover';
											} else {
												this.node.avatar.setBackgroundDB(img);
											}
										} else if (lib.card[bg].image) {
											if (lib.card[bg].image.indexOf('character:') == 0) {
												this.node.avatar.setBackground(lib.card[bg].image.slice(10), 'character');
											} else {
												this.node.avatar.setBackground(lib.card[bg].image);
											}
										} else {
											var cardPack = lib.cardPack['mode_' + get.mode()];
											if (Array.isArray(cardPack) && cardPack.contains(bg)) {
												this.node.avatar.setBackground('mode/' + get.mode() + '/card/' + bg);
											} else {
												this.node.avatar.setBackground('card/' + bg);
											}
										}
									} else if (lib.card[bg].image == 'card') {
										if (card[3]) this.setBackground(bg + '_' + card[3], 'card');
										else this.setBackground(bg, 'card');
									} else if (typeof lib.card[bg].image == 'string' && !lib.card[bg].fullskin) {
										if (img) {
											if (img.indexOf('ext:') == 0) {
												this.setBackgroundImage(img.replace(/ext:/, 'extension/'));
												this.style.backgroundSize = 'cover';
											} else {
												this.setBackgroundDB(img);
											}
										} else {
											this.setBackground(lib.card[bg].image);
										}
									} else {
										this.node.background.textContent = lib.translate[bg + '_cbg'] || lib.translate[bg + '_bg'] || get.translation(bg)[0];
										// if (this.node.background.innerHTML.length > 1) this.node.background.classList.add('tight');
										// else this.node.background.classList.remove('tight');
									}
									if (!lib.card[bg].fullborder && this.node.avatar && this.node.framebg) {
										this.node.avatar.remove();
										this.node.framebg.remove();
										this.node.avatar = undefined;
										this.node.framebg = undefined;
									}
									if (info.noname && !this.classList.contains('button')) {
										this.node.name.style.display = 'none';
									}
									if (info.addinfo) {
										if (!this.node.addinfo) {
											this.node.addinfo = ui.create.div('.range', this);
										}
										this.node.addinfo.innerHTML = info.addinfo;
									} else if (this.node.addinfo) {
										this.node.addinfo.remove();
										delete this.node.addinfo;
									}

									if (card[0] == 'heart' || card[0] == 'diamond') {
										this.node.info.classList.add('red');
									}

									this.node.image.className = 'image';

									var filename = card[2];
									var vertname = '';
									var cardname = get.translation(card[2]);
									this.dataset.suit = card[0];
									this.$suitnum.$num.textContent = cardnum;
									this.$suitnum.$suit.textContent = cardsuit;

									if (card[2] == 'sha') {
										if (card[3] == 'fire') {
											cardname = '火' + cardname;
											filename = 'huosha';
											this.node.image.classList.add('fire');
										} else if (card[3] == 'thunder') {
											cardname = '雷' + cardname;
											filename = 'leisha';
											this.node.image.classList.add('thunder');
										} else if (card[3] == 'kami') {
											cardname = '神' + cardname;
											this.node.image.classList.add('kami');
										} else if (card[3] == 'ice') {
											cardname = '冰' + cardname;
											filename = 'bingsha';
											this.node.image.classList.add('ice');
										} else if (card[3] == 'stab') {
											name = '刺' + name;
											filename = 'cisha';
										}
									} else if (card[3]) {
										if (['fire', 'thunder', 'kami', 'ice'].contains(card[3])) this.node.image.classList.add(card[3]);
										if (lib.card[filename] && lib.card[filename].nature && lib.card[filename].nature.contains(card[3])) filename += '_' + card[3];
									}

									for (var i = 0; i < cardname.length; i++) vertname += cardname[i] + '\n';
									this.$name.innerText = cardname;
									this.$vertname.innerText = vertname;
									this.$equip.$suitnum.textContent = cardsuit + cardnum;
									this.$equip.$name.textContent = ' ' + cardname;

									this.suit = card[0];
									this.number = parseInt(card[1]) || 0;
									this.name = card[2];
									this.classList.add('card');
									if (card[3]) {
										if (lib.nature.contains(card[3])) this.nature = card[3];
										this.classList.add(card[3]);
									} else if (this.nature) {
										this.classList.remove(this.nature);
										delete this.nature;
									}
									if (info.subtype) this.classList.add(info.subtype);
									if (this.inits) {
										for (var i = 0; i < lib.element.card.inits.length; i++) {
											lib.element.card.inits[i](this);
										}
									}
									if (typeof info.init == 'function') info.init();
									switch (get.subtype({ card: this.name })) {
										case 'equip1':
											var added = false;
											if (lib.card[this.name] && lib.card[this.name].distance) {
												var dist = lib.card[this.name].distance;
												if (dist.attackFrom) {
													added = true;
													this.$range.textContent = '范围: ' + (- dist.attackFrom + 1);
												}
											}
											if (!added) this.$range.textContent = '范围: 1';
											break;
										case 'equip3':
											if (info.distance && info.distance.globalTo) {
												this.$range.textContent = '防御: ' + info.distance.globalTo;
												this.$equip.$name.textContent += '+';
											}
											break;
										case 'equip4':
											if (info.distance && info.distance.globalFrom) {
												this.$range.textContent = '进攻: ' + (- info.distance.globalFrom);
												this.$equip.$name.textContent += '-';
											}
											break;
										default:
											this.$range.textContent = '';
											break;
									}
									if (_status.connectMode && !game.online && lib.cardOL && !this.cardid) {
										this.cardid = get.id();
										lib.cardOL[this.cardid] = this;
									}

									var tags = [];
									if (!_status.connectMode && !_status.video) this.cardid = get.id();
									if (Array.isArray(card[4])) tags.addArray(card[4]);

									if (this.cardid) {
										if (!_status.cardtag) _status.cardtag = {};
										for (var i in _status.cardtag) if (_status.cardtag[i].contains(this.cardid)) { tags.add(i); }
										if (tags.length) {
											var tagText = '';
											for (var i = 0; i < tags.length; i++) {
												var tag = tags[i];
												if (!_status.cardtag[tag]) {
													_status.cardtag[tag] = [];
												}
												_status.cardtag[tag].add(this.cardid);
												tagText += lib.translate[tag + '_tag'];
											}

											this.$range.textContent = tagText;
											this.$range.classList.add('card-tag');
										}
									}

									var imgFormat = decadeUI.config.cardPrettify;
									if (imgFormat != 'off') {
										this.classList.add('decade-card');
										if (!this.classList.contains('infohidden')) {
											var res = dui.statics.cards;
											var asset = res[filename];
											if (res.READ_OK) {
												if (asset == undefined && typeof lib.decade_extCardImage == "object" && typeof lib.decade_extCardImage[filename] == "string") res[filename] = asset = {
													url: lib.decade_extCardImage[filename],
													name: filename,
													loaded: true,
												};
												if (asset == undefined) {
													this.classList.remove('decade-card');
												} else {
													this.style.background = 'url("' + asset.url + '")';
													if (this.node.avatar) this.node.avatar.remove();
													if (this.node.framebg) this.node.framebg.remove();
												}
											} else {
												var url = lib.assetURL + 'extension/' + extensionName + '/image/card/' + filename + '.' + imgFormat;
												if (typeof lib.decade_extCardImage == "object" && typeof lib.decade_extCardImage[filename] == "string") url = lib.decade_extCardImage[filename];
												if (!asset) {
													res[filename] = asset = {
														name: filename,
														url: undefined,			// 图片路径
														loaded: undefined, 		// 是否加载
														rawUrl: undefined, 		// 原图片地址	
													};
												}

												if (asset.loaded !== false) {
													if (asset.loaded == undefined) {
														var image = new Image();
														image.onload = function () {
															asset.loaded = true;
															image.onload = undefined;
														};

														var card = this;
														image.onerror = function () {
															asset.loaded = false;
															image.onerror = undefined;
															card.style.background = asset.rawUrl;
															card.classList.remove('decade-card');
															if (card.node.avatar) card.insertBefore(card.node.avatar, card.firstChild);
															if (card.node.framebg) card.insertBefore(card.node.framebg, card.firstChild);
														}

														asset.url = url;
														asset.rawUrl = this.style.background || this.style.backgroundImage;
														asset.image = image;
														image.src = url;
													}

													this.style.background = 'url("' + url + '")';
													if (this.node.avatar) this.node.avatar.remove();
													if (this.node.framebg) this.node.framebg.remove();
												} else {
													this.classList.remove('decade-card');
												}
											}
										}
									} else {
										this.classList.remove('decade-card');
									}

									return this;
								},

								updateTransform: function (bool, delay) {
									if (delay) {
										var that = this;
										setTimeout(function () {
											that.updateTransform(that.classList.contains('selected'));
										}, delay);
									} else {
										if (_status.event.player != game.me) return;
										if (this._transform && this.parentNode && this.parentNode.parentNode &&
											this.parentNode.parentNode.parentNode == ui.me && (!_status.mousedown || _status.mouseleft)) {
											if (bool) {
												this.style.transform = this._transform + ' translateY(-' + (decadeUI.isMobile() ? 10 : 12) + 'px)';
											} else {
												this.style.transform = this._transform || '';
											}
										}
									}
								},
							},

							control: {
								add: function (item) {
									var node = document.createElement('div');
									node.link = item;
									node.innerHTML = get.translation(item);
									node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.control);
									this.appendChild(node);
									this.updateLayout();
								},

								open: function () {
									ui.control.insertBefore(this, _status.createControl || ui.confirm);
									ui.controls.unshift(this);
									return this;
								},

								close: function () {
									this.remove();
									ui.controls.remove(this);
									if (ui.confirm == this) ui.confirm = null;
									if (ui.skills == this) ui.skills = null;
									if (ui.skills2 == this) ui.skills2 = null;
									if (ui.skills3 == this) ui.skills3 = null;
								},

								replace: function () {
									var items;
									var index = 0;
									var nodes = this.childNodes;

									if (Array.isArray(arguments[0])) {
										items = arguments[0];
									} else {
										items = arguments;
									}

									this.custom = undefined;

									for (var i = 0; i < items.length; i++) {
										if (typeof items[i] == 'function') {
											this.custom = items[i];
										} else {
											if (index < nodes.length) {
												nodes[i].link = items[i];
												nodes[i].innerHTML = get.translation(items[i]);
											} else {
												this.add(items[i]);
											}

											index++;
										}
									}

									while (index < nodes.length) {
										nodes[index].remove();
									}

									this.updateLayout();
									ui.updatec();
									return this;
								},

								updateLayout: function () {
									var nodes = this.childNodes;
									if (nodes.length >= 2) {
										this.classList.add('combo-control');
										for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('control');
									} else {
										this.classList.remove('combo-control');
										if (nodes.length == 1) nodes[0].classList.remove('control');
									}
								},
							},

							player: {
								mark: function (item, info, skill) {
									if (get.itemtype(item) == 'cards') {
										var marks = new Array(item.length);
										for (var i = 0; i < item.length; i++) marks.push(this.mark(item[i], info));
										return marks;
									}

									var mark;
									if (get.itemtype(item) == 'card') {
										mark = item.copy('mark');
										mark.suit = item.suit;
										mark.number = item.number;
										if (item.classList.contains('fullborder')) {
											mark.classList.add('fakejudge');
											mark.classList.add('fakemark');
											if (!mark.node.mark) mark.node.mark = mark.querySelector('.mark-text') || decadeUI.element.create('mark-text', mark);
											mark.node.mark.innerHTML = lib.translate[name.name + '_bg'] || get.translation(name.name)[0];
										}
										item = item.name;
									} else {
										mark = ui.create.div('.card.mark');
										var markText = lib.translate[item + '_bg'];
										if (!markText) {
											markText = get.translation(item).substr(0, 2);
											if (decadeUI.config.playerMarkStyle != 'decade') {
												markText = markText[0];
											}
										}
										mark.text = decadeUI.element.create('mark-text', mark);
										if (lib.skill[item] && lib.skill[item].markimage) {
											markText = '　';
											mark.text.style.animation = 'none';
											mark.text.setBackgroundImage(lib.skill[item].markimage);
											mark.text.style['box-shadow'] = 'none';
											mark.text.style.backgroundPosition = 'center';
											mark.text.style.backgroundSize = 'contain';
											mark.text.style.backgroundRepeat = 'no-repeat';
											mark.text.classList.add('before-hidden');
										} else {
											if (markText.length == 2) mark.text.classList.add('small-text');
										}
										if (lib.skill[item] && lib.skill[item].zhuanhuanji) {
											mark.text.style.animation = 'none';
											mark.text.classList.add('before-hidden');
										}
										mark.text.innerHTML = markText;
									}

									mark.name = item;
									mark.skill = skill || item;
									if (typeof info == 'object') {
										mark.info = info;
									} else if (typeof info == 'string') {
										mark.markidentifer = info;
									}

									mark.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.card);
									if (!lib.config.touchscreen) {
										if (lib.config.hover_all) {
											lib.setHover(mark, ui.click.hoverplayer);
										}
										if (lib.config.right_info) {
											mark.oncontextmenu = ui.click.rightplayer;
										}
									}

									this.node.marks.appendChild(mark);
									this.updateMarks();
									ui.updatem(this);
									return mark;
								},

								markCharacter: function (name, info, learn, learn2) {
									if (typeof name == 'object') name = name.name;

									var nodeMark = ui.create.div('.card.mark');
									var nodeMarkText = ui.create.div('.mark-text', nodeMark);

									if (!info) info = {};
									if (!info.name) info.name = get.translation(name);
									if (!info.content) info.content = get.skillintro(name, learn, learn2);

									if (name.indexOf('unknown') == 0) {
										nodeMarkText.innerHTML = get.translation(name)[0];
									} else {
										if (!lib.character[name]) return console.error(name);
										var text = info.name.substr(0, 2);
										if (text.length == 2) nodeMarkText.classList.add('small-text');
										nodeMarkText.innerHTML = text;
									}

									nodeMark.name = name + '_charactermark';
									nodeMark.info = info;
									nodeMark.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.card);
									if (!lib.config.touchscreen) {
										if (lib.config.hover_all) {
											lib.setHover(nodeMark, ui.click.hoverplayer);
										}
										if (lib.config.right_info) {
											nodeMark.oncontextmenu = ui.click.rightplayer;
										}
									}

									this.node.marks.appendChild(nodeMark);
									ui.updatem(this);
									return nodeMark;
								},
								setSeatNum: function () {
									base.lib.element.player.setSeatNum.apply(this, arguments);
									this.seat = this.getSeatNum();
									this.node.seat.innerHTML = get.cnNumber(this.seat, true);
								},
								markSkillCharacter: function (id, target, name, content) {
									if (typeof target == 'object') target = target.name;
									game.broadcastAll(function (player, target, name, content, id) {
										if (player.marks[id]) {
											player.marks[id].name = name + '_charactermark';
											player.marks[id]._name = target;
											player.marks[id].info = {
												name: name,
												content: content,
												id: id
											};
											player.marks[id].setBackground(target, 'character');
											player.marks[id].style.backgroundSize = "cover !important";
											game.addVideo('changeMarkCharacter', player, {
												id: id,
												name: name,
												content: content,
												target: target
											});
										} else {
											player.marks[id] = player.markCharacter(target, {
												name: name,
												content: content,
												id: id
											});
											player.marks[id]._name = target;
											player.marks[id].style.backgroundSize = "cover !important";
											game.addVideo('markCharacter', player, {
												name: name,
												content: content,
												id: id,
												target: target
											});
										}
									}, this, target, name, content, id);
									return this;
								},

								playDynamic: function (animation, deputy) {
									deputy = deputy === true;
									if (animation == undefined) return console.error('playDynamic: 参数1不能为空');
									var dynamic = this.dynamic;
									if (!dynamic) {
										dynamic = new duilib.DynamicPlayer('assets/dynamic/');
										dynamic.dprAdaptive = true;
										this.dynamic = dynamic;
										this.$dynamicWrap.appendChild(dynamic.canvas);
									} else {
										if (deputy && dynamic.deputy) {
											dynamic.stop(dynamic.deputy);
											dynamic.deputy = null;
										} else if (!deputy && dynamic.primary) {
											dynamic.stop(dynamic.primary);
											dynamic.primary = null;
										}
									}

									if (typeof animation == 'string') animation = { name: animation };
									if (this.doubleAvatar) {
										if (Array.isArray(animation.x)) {
											animation.x = animation.x.concat();
											animation.x[1] += deputy ? 0.25 : -0.25;
										} else {
											if (animation.x == undefined) {
												animation.x = [0, deputy ? 0.75 : 0.25];
											} else {
												animation.x = [animation.x, deputy ? 0.25 : -0.25];
											}
										}

										animation.clip = {
											x: [0, deputy ? 0.5 : 0],
											y: 0,
											width: [0, 0.5],
											height: [0, 1],
											clipParent: true
										};
									}

									if (this.$dynamicWrap.parentNode != this) this.appendChild(this.$dynamicWrap);

									dynamic.outcropMask = duicfg.dynamicSkinOutcrop;
									var avatar = dynamic.play(animation);
									if (deputy === true) {
										dynamic.deputy = avatar;
									} else {
										dynamic.primary = avatar;
									}

									this.classList.add(deputy ? 'd-skin2' : 'd-skin');
								},

								stopDynamic: function (primary, deputy) {
									var dynamic = this.dynamic;
									if (!dynamic) return;

									primary = primary === true;
									deputy = deputy === true;

									if (primary && dynamic.primary) {
										dynamic.stop(dynamic.primary);
										dynamic.primary = null;
									} else if (deputy && dynamic.deputy) {
										dynamic.stop(dynamic.deputy);
										dynamic.deputy = null;
									} else if (!primary && !deputy) {
										dynamic.stopAll();
										dynamic.primary = null;
										dynamic.deputy = null;
									}

									if (!dynamic.primary && !dynamic.deputy) {
										this.classList.remove('d-skin');
										this.classList.remove('d-skin2');
										this.$dynamicWrap.remove();
									}
								},

								say: function (str) {
									str = str.replace(/##assetURL##/g, lib.assetURL);

									if (!this.$chatBubble) {
										this.$chatBubble = decadeUI.element.create('chat-bubble');
									}

									var bubble = this.$chatBubble;
									bubble.innerHTML = str;
									if (this != bubble.parentNode) this.appendChild(bubble);
									bubble.classList.remove('removing');
									bubble.style.animation = 'fade-in 0.3s';

									if (bubble.timeout) clearTimeout(bubble.timeout)
									bubble.timeout = setTimeout(function (bubble) {
										bubble.timeout = undefined;
										bubble.delete();
									}, 2000, bubble);

									var name = get.translation(this.name);
									var info = [name ? (name + '[' + this.nickname + ']') : this.nickname, str];
									lib.chatHistory.push(info);
									if (_status.addChatEntry) {
										if (_status.addChatEntry._origin.parentNode) {
											_status.addChatEntry(info, false);
										} else {
											_status.addChatEntry = undefined;
										}
									}
									if (lib.config.background_speak && lib.quickVoice.indexOf(str) != -1) {
										game.playAudio('voice', (this.sex == 'female' ? 'female' : 'male'), lib.quickVoice.indexOf(str));
									}
								},

								updateMark: function (name, storage) {
									if (!this.marks[name]) {
										if (lib.skill[name] && lib.skill[name].intro && (this.storage[name] || lib.skill[name].intro.markcount)) {
											this.markSkill(name);
											if (!this.marks[name]) return this;
										} else {
											return this;
										}
									}
									var mark = this.marks[name];
									if (storage && this.storage[name]) this.syncStorage(name);
									if (name == 'ghujia' || (lib.skill[name] && lib.skill[name].intro && !lib.skill[name].intro.nocount && (this.storage[name] || lib.skill[name].intro.markcount))) {
										var num = 0;
										if (typeof lib.skill[name].intro.markcount == 'function') {
											num = lib.skill[name].intro.markcount(this.storage[name], this);
										} else if (lib.skill[name].intro.markcount == 'expansion') {
											num = this.countCards('x', (card) => card.hasGaintag(name));
										} else if (typeof this.storage[name + '_markcount'] == 'number') {
											num = this.storage[name + '_markcount'];
										} else if (name == 'ghujia') {
											num = this.hujia;
										} else if (typeof this.storage[name] == 'number') {
											num = this.storage[name];
										} else if (Array.isArray(this.storage[name])) {
											num = this.storage[name].length;
										}

										if (num) {
											if (!mark.markcount) mark.markcount = decadeUI.element.create('mark-count', mark);
											mark.markcount.textContent = num;
										} else if (mark.markcount) {
											mark.markcount.delete();
											mark.markcount = undefined;
										}
									} else {
										if (mark.markcount) {
											mark.markcount.delete();
											mark.markcount = undefined;
										}

										if (lib.skill[name].mark == 'auto') {
											this.unmarkSkill(name);
										}
									}

									return this;
								},

								$dieAfter: function () {
									this.stopDynamic();

									if (!decadeUI.config.playerDieEffect) {
										if (base.lib.element.player.$dieAfter) base.lib.element.player.$dieAfter.apply(this, arguments);
										return;
									}

									if (!this.node.dieidentity) this.node.dieidentity = ui.create.div('died-identity', this);
									this.node.dieidentity.classList.add('died-identity');

									var that = this;
									var image = new Image();
									var identity = decadeUI.getPlayerIdentity(this);
									var url = extensionPath + 'image/decoration/dead_' + identity + '.png';
									image.onerror = function () {
										that.node.dieidentity.innerHTML = decadeUI.getPlayerIdentity(that, that.identity, true) + '<br>阵亡';
									};

									that.node.dieidentity.innerHTML = '';
									that.node.dieidentity.style.backgroundImage = 'url("' + url + '")';
									image.src = url;
									setTimeout(function () {
										var rect = that.getBoundingClientRect();
										decadeUI.animation.playSpine('effect_zhenwang', {
											x: rect.left + rect.width / 2 - 7,
											y: decadeUI.get.bodySize().height - rect.top - rect.height / 2 + 1,
											scale: 0.8,
										});
									}, 250);
								},

								$skill: function (name, type, color, avatar) {
									if (!decadeUI.config.gameAnimationEffect || !decadeUI.animation.gl) return base.lib.element.player.$skill.apply(this, arguments);
									var _this = this;
									if (typeof type != 'string') type = 'legend';

									game.addVideo('skill', this, [name, type, color, avatar]);
									game.broadcastAll(function (player, type, name, color, avatar) {
										if (window.decadeUI == void 0) {
											game.delay(2.5);
											if (name) player.$fullscreenpop(name, color, avatar);
											return;
										}

										decadeUI.delay(2500);
										if (name) decadeUI.effect.skill(player, name, avatar);
									}, _this, type, name, color, avatar);
								},
							},

						}
					};

					ride.ui = {
						updatec: function () {
							var controls = ui.control.childNodes;
							var stayleft;
							var offsetLeft;
							for (var i = 0; i < controls.length; i++) {
								if (!stayleft && controls[i].stayleft) {
									stayleft = controls[i];
								} else if (!offsetLeft) {
									offsetLeft = controls[i].offsetLeft;
								}

								if (stayleft && offsetLeft) break;
							}

							if (stayleft) {
								if (ui.$stayleft != stayleft) {
									stayleft._width = stayleft.offsetWidth
									ui.$stayleft = stayleft;
								}

								if (offsetLeft < stayleft._width) {
									stayleft.style.position = 'static';
								} else {
									stayleft.style.position = 'absolute';
								}
							}
						},

						updatehl: function () {
							dui.queueNextFrameTick(dui.layoutHand, dui);
						},

						updatej: function (player) {
							if (!player) return;

							var judges = player.node.judges.childNodes;
							for (var i = 0; i < judges.length; i++) {
								if (judges[i].classList.contains('removing'))
									continue;

								judges[i].classList.remove('drawinghidden');
								if (_status.connectMode) {
									if (judges[i].viewAs) {
										judges[i].node.judgeMark.node.judge.innerHTML = get.translation(judges[i].viewAs)[0];
									} else {
										judges[i].node.judgeMark.node.judge.innerHTML = get.translation(judges[i].name)[0];
									}
								}
							}
						},

						updatem: function (player) {
							// 不需要
						},

						updatez: function () {
							window.documentZoom = game.documentZoom;
							document.body.style.zoom = game.documentZoom;
							document.body.style.width = '100%';
							document.body.style.height = '100%';
							document.body.style.transform = '';
						},

						update: function () {
							for (var i = 0; i < ui.updates.length; i++) ui.updates[i]();
							if (ui.dialog == undefined || ui.dialog.classList.contains('noupdate')) return;
							if (game.chess) return base.ui.update();

							if ((!ui.dialog.buttons || !ui.dialog.buttons.length) && !ui.dialog.forcebutton && ui.dialog.classList.contains('fullheight') == false && get.mode() != 'stone') {
								ui.dialog.classList.add('prompt');
							} else {
								ui.dialog.classList.remove('prompt');
								var height = ui.dialog.content.offsetHeight;
								if (decadeUI.isMobile())
									height = decadeUI.get.bodySize().height * 0.75 - 80;
								else
									height = decadeUI.get.bodySize().height * 0.45;

								ui.dialog.style.height = Math.min(height, ui.dialog.content.offsetHeight) + 'px';
							}

							if (!ui.dialog.forcebutton && !ui.dialog._scrollset) {
								ui.dialog.classList.remove('scroll1');
								ui.dialog.classList.remove('scroll2');
							} else {
								ui.dialog.classList.add('scroll1');
								ui.dialog.classList.add('scroll2');
							}
						},

						create: {
							rarity: function (button) {
								var rarity = game.getRarity(button.link);
								var intro = button.node.intro;
								intro.classList.add('showintro');
								intro.classList.add('rarity');
								if (intro.innerText)
									intro.innerText = '';

								intro.style.backgroundImage = 'url("' + decadeUIPath + 'assets/image/rarity_' + rarity + '.png")';
								if ((button.link == 'xushu' || button.link == 'xin_xushu') && button.node && button.node.name && button.node.group) {
									if (button.classList.contains('newstyle')) {
										button.node.name.dataset.nature = 'watermm';
										button.node.group.dataset.nature = 'water';
									} else {
										button.node.group.style.backgroundColor = get.translation('weiColor');
									}
								}
							},

							button: function (item, type, position, noclick, node) {
								if (type != 'character' && type != 'characterx') {
									var button = base.ui.create.button.apply(this, arguments);
									if (position) position.appendChild(button);
									return button;
								}

								if (node) {
									node.classList.add('button');
									node.classList.add('character');
									node.classList.add('decadeUI');
									node.style.display = '';
								} else {
									node = ui.create.div('.button.character.decadeUI');
								}

								node._link = item;
								if (type == 'characterx') {
									if (_status.noReplaceCharacter) {
										type = 'character';
									} else if (lib.characterReplace[item] && lib.characterReplace[item].length) {
										item = lib.characterReplace[item][0];
									}
								}

								node.link = item;
								var doubleCamp = get.is.double(node._link, true);
								var character = dui.element.create('character', node);

								if (doubleCamp) node._changeGroup = true;
								var double = get.is.double(node._link, true);
								if (double) node._changeGroup = true;
								if (type == 'characterx' && lib.characterReplace[node._link] && lib.characterReplace[node._link].length > 1) {
									node._replaceButton = true;
								}

								node.refresh = function (node, item, intersection) {
									if (intersection) {
										node.awaitItem = item;
										intersection.observe(node);
										// node.setBackground(item, 'character');
									} else {
										node.setBackground(item, 'character');
									}

									if (node.node) {
										node.node.name.remove();
										node.node.hp.remove();
										node.node.group.remove();
										node.node.intro.remove();
										if (node.node.replaceButton) node.node.replaceButton.remove();
									}
									node.node = {
										name: decadeUI.element.create('name', node),
										hp: decadeUI.element.create('hp', node),
										group: decadeUI.element.create('identity', node),
										intro: decadeUI.element.create('intro', node),
									};
									var infoitem = lib.character[item];
									if (!infoitem) {
										for (var itemx in lib.characterPack) {
											if (lib.characterPack[itemx][item]) {
												infoitem = lib.characterPack[itemx][item];
												break;
											}
										}
									}

									node.node.name.innerText = get.slimName(item).replace(/<br>/g, '\n');
									if (lib.config.buttoncharacter_style == 'default' || lib.config.buttoncharacter_style == 'simple') {
										if (lib.config.buttoncharacter_style == 'simple') {
											node.node.group.style.display = 'none';
										}
										node.node.name.dataset.nature = get.groupnature(infoitem[1]);
										node.node.group.dataset.nature = get.groupnature(infoitem[1], 'raw');
										node.classList.add('newstyle');
										if (doubleCamp && doubleCamp.length) {
											node.node.name.dataset.nature = get.groupnature(doubleCamp[0]);
											node.node.group.dataset.nature = get.groupnature(doubleCamp[doubleCamp.length == 2 ? 1 : 0]);
										}
										ui.create.div(node.node.hp);
										var hp = get.infoHp(infoitem[2]), maxHp = get.infoMaxHp(infoitem[2]), hujia = get.infoHujia(infoitem[2]);
										var str = get.numStr(hp);
										if (hp != maxHp) {
											str += '/';
											str += get.numStr(maxHp);
										}
										var textnode = ui.create.div('.text', str, node.node.hp);
										if (infoitem[2] == 0) {
											node.node.hp.hide();
										} else if (get.infoHp(infoitem[2]) <= 3) {
											node.node.hp.dataset.condition = 'mid';
										} else {
											node.node.hp.dataset.condition = 'high';
										}
										if (hujia > 0) {
											ui.create.div(node.node.hp, '.shield');
											ui.create.div('.text', get.numStr(hujia), node.node.hp);
										}
									} else {
										var hp = get.infoHp(infoitem[2]);
										var maxHp = get.infoMaxHp(infoitem[2]);
										var shield = get.infoHujia(infoitem[2]);
										if (maxHp > 14) {
											if (typeof infoitem[2] == 'string') node.node.hp.innerHTML = infoitem[2];
											else node.node.hp.innerHTML = get.numStr(infoitem[2]);
											node.node.hp.classList.add('text');
										} else {
											for (var i = 0; i < maxHp; i++) {
												var next = ui.create.div('', node.node.hp);
												if (i >= hp) next.classList.add('exclude');
											}
											for (var i = 0; i < shield; i++) {
												ui.create.div(node.node.hp, '.shield');
											}
										}
									}
									if (node.node.hp.childNodes.length == 0) {
										node.node.name.style.top = '8px';
									}
									if (node.node.name.querySelectorAll('br').length >= 4) {
										node.node.name.classList.add('long');
										if (lib.config.buttoncharacter_style == 'old') {
											node.addEventListener('mouseenter', ui.click.buttonnameenter);
											node.addEventListener('mouseleave', ui.click.buttonnameleave);
										}
									}

									node.node.intro.innerText = lib.config.intro;
									if (!noclick) lib.setIntro(node);
									if (infoitem[1]) {
										if (doubleCamp) {
											var text = '';
											if (doubleCamp.length == 2) {
												for (var i = 0; i < doubleCamp.length; i++) text += get.translation(doubleCamp[i]);
											} else {
												text = get.translation(doubleCamp[0]);
											}
											node.node.group.innerText = text;
										} else {
											node.node.group.innerText = get.translation(infoitem[1]);
										}
										node.node.group.style.backgroundColor = get.translation(infoitem[1] + 'Color');
									} else {
										node.node.group.style.display = 'none';
									}
									if (node._replaceButton) {
										var intro = ui.create.div('.button.replaceButton', node);
										node.node.replaceButton = intro;
										intro.innerText = '切换';
										intro._node = node;
										intro.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
											_status.tempNoButton = true;
											var node = this._node;
											var list = lib.characterReplace[node._link];
											var link = node.link;
											var index = list.indexOf(link);
											if (index == list.length - 1) index = 0;
											else index++;
											link = list[index];
											node.link = link;
											node.refresh(node, link);
											setTimeout(function (_status) { _status.tempNoButton = undefined; }, 200, _status);
										});
									}
								};

								node.refresh(node, item, position ? position.intersection : undefined);
								if (!noclick) {
									node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
								} else {
									node.classList.add('noclick');
									if (node.querySelector('.intro')) {
										node.querySelector('.intro').remove();
									}
								}

								for (var i in lib.element.button) node[i] = lib.element.button[i];
								if (position) position.appendChild(node);

								return node;
							},

							buttons: function (list, type, position, noclick, zoom) {
								var buttons = [];
								var pre = (type.substr(0, 3) == 'pre');
								if (pre) {
									if (!_status.prebutton) {
										_status.prebutton = [];
										lib.onfree.push(function () {
											for (var i = 0; i < _status.prebutton.length; i++) {
												if (_status.prebutton[i].activate) {
													_status.prebutton[i].activate();
												}
											}
											_status.prebutton = undefined;
										});
									}
								}

								var fragment = document.createDocumentFragment();
								if (position && position.intersection) {
									fragment.intersection = position.intersection;
								}

								for (var i = 0; i < list.length; i++) {
									if (pre) {
										buttons.push(ui.create.prebutton(list[i], type.slice(3), fragment, noclick));
									} else {
										buttons.push(ui.create.button(list[i], type, fragment, noclick));
									}
								}

								if (position && fragment.childElementCount) position.appendChild(fragment);
								return buttons;
							},

							confirm: function (str, func) {
								if (ui.confirm && ui.confirm.str == str) return;

								switch (str) {
									case 'o':
										if (ui.confirm) {
											ui.confirm.replace('ok');
										} else {
											ui.confirm = ui.create.control('ok');
										}
										break;

									case 'oc':
									case 'co':
										if (ui.confirm) {
											ui.confirm.replace('ok', 'cancel');
										} else {
											ui.confirm = ui.create.control('ok', 'cancel');
										}
										break;

									case 'c':
										if (ui.confirm) {
											ui.confirm.replace('cancel');
										} else {
											ui.confirm = ui.create.control('cancel');
										}
										break;

									default:
										if (ui.confirm) {
											ui.confirm.close();
											ui.confirm = undefined;
										}
										break;
								}

								if (ui.confirm) {
									ui.confirm.str = str;
									if (func) {
										ui.confirm.custom = func;
									} else {
										ui.confirm.custom = undefined;
									}
								}
							},

							control: function () {
								var i, controls;
								var nozoom = false;
								if (Array.isArray(arguments[0])) {
									controls = arguments[0];
								} else {
									controls = arguments;
								}

								var control = document.createElement('div');
								control.className = 'control';
								control.style.opacity = 1;
								for (i in lib.element.control) control[i] = lib.element.control[i];
								for (i = 0; i < controls.length; i++) {
									if (typeof controls[i] == 'function') {
										control.custom = controls[i];
									} else if (controls[i] == 'nozoom') {
										nozoom = true;
									} else if (controls[i] == 'stayleft') {
										control.stayleft = true;
										control.classList.add('stayleft');
									} else {
										control.add(controls[i]);
									}
								}
								ui.controls.unshift(control);
								ui.control.insertBefore(control, _status.createControl || ui.confirm);
								control.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.control2);
								return control;
							},

							dialog: function () {
								var i;
								var hidden = false;
								var notouchscroll = false;
								var forcebutton = false;
								var noforcebutton = false;
								var dialog = decadeUI.element.create('dialog');
								dialog.contentContainer = decadeUI.element.create('content-container', dialog);
								dialog.content = decadeUI.element.create('content', dialog.contentContainer);
								dialog.buttons = [];
								for (i in lib.element.dialog) dialog[i] = lib.element.dialog[i];
								for (i = 0; i < arguments.length; i++) {
									if (typeof arguments[i] == 'boolean') dialog.static = arguments[i];
									else if (arguments[i] == 'hidden') hidden = true;
									else if (arguments[i] == 'notouchscroll') notouchscroll = true;
									else if (arguments[i] == 'forcebutton') forcebutton = true;
									else if (arguments[i] == 'noforcebutton') noforcebutton = true;
									else dialog.add(arguments[i]);
								}
								if (!hidden) dialog.open();
								if (!lib.config.touchscreen) dialog.contentContainer.onscroll = ui.update;
								if (!notouchscroll) {
									dialog.contentContainer.ontouchstart = ui.click.dialogtouchStart;
									dialog.contentContainer.ontouchmove = ui.click.touchScroll;
									dialog.contentContainer.style.WebkitOverflowScrolling = 'touch';
									dialog.ontouchstart = ui.click.dragtouchdialog;
								}

								if (noforcebutton) {
									dialog.noforcebutton = true;
								}
								else if (forcebutton) {
									dialog.forcebutton = true;
									dialog.classList.add('forcebutton');
								}
								return dialog;
							},

							selectlist: function (list, init, position, onchange) {
								var select = document.createElement('select');
								for (var i = 0; i < list.length; i++) {
									var option = document.createElement('option');
									if (Array.isArray(list[i])) {
										option.value = list[i][0];
										option.innerText = list[i][1];
									} else {
										option.value = list[i];
										option.innerText = list[i];
									}
									if (init == option.value) option.selected = 'selected';
									select.appendChild(option);
								}
								if (position) position.appendChild(select);
								if (onchange) select.onchange = onchange;
								return select;
							},
						},

						click: {
							card: function (e) {
								delete this._waitingfordrag;
								if (_status.dragged) return;
								if (_status.clicked) return;
								if (ui.intro) return;
								_status.clicked = true;
								if (this.parentNode && (this.parentNode.classList.contains('judges') || this.parentNode.classList.contains('dui-marks'))) {
									if (!(e && e instanceof MouseEvent)) {
										var rect = this.getBoundingClientRect();
										e = {
											clientX: (rect.left + 10) * game.documentZoom,
											clientY: (rect.top + 10) * game.documentZoom,
										};
									}

									ui.click.touchpop();
									ui.click.intro.call(this, e);
									_status.clicked = false;
									return;
								}
								var custom = _status.event.custom;
								if (custom.replace.card) {
									custom.replace.card(this);
									return;
								}
								if (this.classList.contains('selectable') == false) return;
								if (this.classList.contains('selected')) {
									ui.selected.cards.remove(this);
									if (_status.multitarget || _status.event.complexSelect) {
										game.uncheck();
										game.check();
									} else {
										this.classList.remove('selected');
										this.updateTransform();
									}
								} else {
									ui.selected.cards.add(this);
									this.classList.add('selected');
									this.updateTransform(true);
								}
								if (game.chess && get.config('show_range') && !_status.event.skill && this.classList.contains('selected') && (typeof _status.event.isMine == 'function') && _status.event.isMine() && _status.event.name == 'chooseToUse') {
									var player = _status.event.player;
									var range = get.info(this).range;
									if (range) {
										if (typeof range.attack === 'number') {
											player.createRangeShadow(Math.min(8, player.getAttackRange(true) + range.attack - 1));
										} else if (typeof range.global === 'number') {
											player.createRangeShadow(Math.min(8, player.getGlobalFrom() + range.global));
										}
									}
								}
								if (custom.add.card) {
									custom.add.card();
								}
								game.check();

								if (lib.config.popequip && get.is.phoneLayout() && arguments[0] != 'popequip' && ui.arena && ui.arena.classList.contains('selecting') && this.parentNode.classList.contains('popequip')) {
									var rect = this.getBoundingClientRect();
									ui.click.touchpop();
									ui.click.intro.call(this.parentNode, {
										clientX: rect.left + 18,
										clientY: rect.top + 12
									});
								}
							},
						},


					};

					ride.game = {
						addOverDialog: function (dialog, result) {
							var sprite = decadeUI.backgroundAnimation.current;
							if (!(sprite && sprite.name == 'skin_xiaosha_default')) return;

							decadeUI.backgroundAnimation.canvas.style.zIndex = 7;
							switch (result) {
								case '战斗胜利':
									sprite.scaleTo(1.8, 600);
									sprite.setAction('shengli');
									break;
								case '平局':
								case '战斗失败':
									if (!duicfg.rightLayout) sprite.flipX = true;

									sprite.moveTo([0, 0.5], [0, 0.25], 600);
									sprite.scaleTo(2.5, 600);
									sprite.setAction('gongji');
									break;
							}
						},


						expandSkills: function (skills) {
							var expands = [];
							var info;
							for (var i = 0; i < skills.length; i++) {
								info = get.info(skills[i]);
								if (info) {
									if (info.group) {
										expands.add(info.group);
									}
								} else {
									console.log(skills[i]);
								}
							}

							var i, j;
							for (i = 0; i < expands.length; i++) {
								if (Array.isArray(expands[i])) {
									for (j = 0; j < expands[i].length; j++) {
										skills.add(expands[i][j]);
									}
								} else {
									skills.add(expands[i]);
								}
							}
							return skills;
						},

						gameDraw: function () {
							decadeUI.delay(100);
							return base.game.gameDraw.apply(game, arguments);
						},

						loop: function () {
							if (game.loopLocked) return;
							if (decadeUI.eventDialog) {
								decadeUI.game.wait();
								return;
							}

							game.loopLocked = true;
							var loop;
							do {
								loop = decadeUI.game.loop(_status);
								game.looping = false;
							} while (loop);
							game.loopLocked = false;
						},
					};

					ride.get = {
						objtype: function (obj) {
							obj = Object.prototype.toString.call(obj);
							switch (obj) {
								case '[object Array]':
									return 'array';
								case '[object Object]':
									return 'object';
								case '[object HTMLDivElement]':
									return 'div';
								case '[object HTMLTableElement]':
									return 'table';
								case '[object HTMLTableRowElement]':
									return 'tr';
								case '[object HTMLTableCellElement]':
									return 'td';
								case '[object HTMLBodyElement]':
									return 'td';
							}
						},
					}

					override(lib, ride.lib);
					override(ui, ride.ui);
					override(game, ride.game);
					override(get, ride.get);

					decadeUI.get.extend(decadeUI, duilib);
					if (decadeModule.modules)
						for (var i = 0; i < decadeModule.modules.length; i++)
							decadeModule.modules[i](lib, game, ui, get, ai, _status);

					var getNodeIntro = get.nodeintro;
					var gameLinexyFunction = game.linexy;
					var gameUncheckFunction = game.uncheck;
					var swapControlFunction = game.swapControl;
					var swapPlayerFunction = game.swapPlayer;
					var baseChooseCharacter = game.chooseCharacter;
					var createArenaFunction = ui.create.arena;
					var createPauseFunction = ui.create.pause;
					var createMenuFunction = ui.create.menu;
					var initCssstylesFunction = lib.init.cssstyles;
					var initLayoutFunction = lib.init.layout;

					var cardCopyFunction = lib.element.card.copy;
					var playerInitFunction = lib.element.player.init;
					var playerUninitFunction = lib.element.player.uninit;
					var playerAddSkillFunction = lib.element.player.addSkill;
					var playerRemoveSkillFunction = lib.element.player.removeSkill
					var playerUpdateFunction = lib.element.player.update;
					var playerChooseTargetFunction = lib.element.player.chooseTarget;
					var playerThrowFunction = lib.element.player.$throw;
					var playerDrawFunction = lib.element.player.$draw;
					var playerDieFlipFunction = lib.element.player.$dieflip;

					ui.updatejm = function (player, nodes, start, inv) {
						if (typeof start != 'number') start = 0;

						for (var i = 0; i < nodes.childElementCount; i++) {
							var node = nodes.childNodes[i];
							if (i < start) {
								node.style.transform = '';
							} else if (node.classList.contains('removing')) {
								start++;
							} else {
								node.classList.remove('drawinghidden');
							}
						}
					};

					ui.updatexr = duilib.throttle(ui.updatex, 100, ui);
					document.body.onresize = ui.updatexr;

					get.infoHp = function (hp) {
						if (typeof hp == 'number') {
							return hp;
						} else if (typeof hp == 'string') {
							var index = hp.indexOf('/');
							if (index >= 0) hp = hp.slice(0, hp.indexOf('/'));
							if (hp == 'Infinity' || hp == '∞') {
								return Infinity;
							} else {
								return parseInt(hp);
							}
						}

						return 0;
					};

					get.infoMaxHp = function (hp) {
						if (typeof hp == 'number') {
							return hp;
						} else if (typeof hp == 'string') {
							var index = hp.indexOf('/');
							if (index >= 0) hp = hp.slice(hp.indexOf('/') + 1);
							if (hp == 'Infinity' || hp == '∞') {
								return Infinity;
							} else {
								return parseInt(hp);
							}

						}

						return 0;
					},

						get.skillState = function (player) {
							var skills = base.get.skillState.apply(this, arguments);
							if (game.me != player) {
								var global = skills.global = skills.global.concat();
								for (var i = global.length - 1; i >= 0; i--) {
									if (global[i].indexOf('decadeUI') >= 0) global.splice(i, 1);
								}
							}

							return skills;
						};


					game.updateRoundNumber = function () {
						game.broadcastAll(function (num1, num2, top) {
							_status.pileTop = top;
							if (ui.cardPileNumber && window.decadeUI)
								ui.cardPileNumber.textContent = '牌堆' + num2 + ' 第' + num1 + '轮';
							else if (ui.cardPileNumber)
								ui.cardPileNumber.textContent = num1 + '轮 剩余牌: ' + num2;

						}, game.roundNumber, ui.cardPile.childNodes.length, ui.cardPile.firstChild);
					};

					game.check = function (event) {
						var i, j, range;
						if (event == undefined) event = _status.event;
						event._checked = true;
						var custom = event.custom || {};
						var ok = true,
							auto = true;
						var player = event.player;
						var auto_confirm = lib.config.auto_confirm;
						var players = game.players.slice(0);
						if (event.deadTarget) players.addArray(game.dead);
						if (!event.filterButton && !event.filterCard && !event.filterTarget && (!event.skill || !event._backup)) {
							if (event.choosing) {
								_status.imchoosing = true;
							}
							return;
						}
						player.node.equips.classList.remove('popequip');
						if (event.filterButton) {
							var dialog = event.dialog;
							range = get.select(event.selectButton);
							var selectableButtons = false;
							if (event.forceAuto && ui.selected.buttons.length == range[1]) auto = true;
							else if (range[0] != range[1] || range[0] > 1) auto = false;
							for (i = 0; i < dialog.buttons.length; i++) {
								if (dialog.buttons[i].classList.contains('unselectable')) continue;
								if (event.filterButton(dialog.buttons[i], player) && lib.filter.buttonIncluded(dialog.buttons[i])) {
									if (ui.selected.buttons.length < range[1]) {
										dialog.buttons[i].classList.add('selectable');
									} else if (range[1] == -1) {
										dialog.buttons[i].classList.add('selected');
										ui.selected.buttons.add(dialog.buttons[i]);
									} else {
										dialog.buttons[i].classList.remove('selectable');
									}
								} else {
									dialog.buttons[i].classList.remove('selectable');
									if (range[1] == -1) {
										dialog.buttons[i].classList.remove('selected');
										ui.selected.buttons.remove(dialog.buttons[i]);
									}
								}
								if (dialog.buttons[i].classList.contains('selected')) {
									dialog.buttons[i].classList.add('selectable');
								} else if (!selectableButtons && dialog.buttons[i].classList.contains('selectable')) {
									selectableButtons = true;
								}
							}
							if (ui.selected.buttons.length < range[0]) {
								if (!event.forced || selectableButtons) {
									ok = false;
								}
								if (event.complexSelect || event.getParent().name == 'chooseCharacter' || event.getParent().name == 'chooseButtonOL') {
									ok = false;
								}
							}
							if (custom.add.button) {
								custom.add.button();
							}
						}
						if (event.filterCard) {
							if (ok == false) {
								game.uncheck('card');
							} else {
								var cards = player.getCards(event.position);
								var firstCheck = false;
								range = get.select(event.selectCard);
								if (!event._cardChoice && typeof event.selectCard != 'function' && !event.complexCard && range[1] != -1 && !lib.config.compatiblemode) {
									event._cardChoice = [];
									firstCheck = true;
								}
								if ((typeof event.isMine == 'function') && event.isMine() && event.name == 'chooseToUse' && event.parent.name == 'phaseUse' && !event.skill && !event._targetChoice && !firstCheck && window.Map && !lib.config.compatiblemode) {
									event._targetChoice = new Map();
									for (var i = 0; i < event._cardChoice.length; i++) {
										if (!lib.card[event._cardChoice[i].name].complexTarget) {
											var targets = [];
											for (var j = 0; j < players.length; j++) {
												if (event.filterTarget(event._cardChoice[i], player, players[j])) {
													targets.push(players[j]);
												}
											}
											event._targetChoice.set(event._cardChoice[i], targets);
										}
									}
								}

								var selectableCards = false;
								if (range[0] != range[1] || range[0] > 1) auto = false;
								for (i = 0; i < cards.length; i++) {
									if (lib.config.cardtempname != 'off') {
										var cardname = get.name(cards[i]);
										var cardnature = get.nature(cards[i]);
										var cardsuit = get.suit(cards[i]);
										var cardnumber = get.number(cards[i]);
										if ((cards[i].name != cardname) || (cards[i].nature != cardnature) || (cards[i].suit != cardsuit) || (cards[i].number != cardnumber)) {
											if (!cards[i]._tempName) cards[i]._tempName = ui.create.div('.temp-name', cards[i]);
											var tempname = '';
											if (cards[i].suit != cardsuit) {
												var suitData = {
													'heart': "<span style='color:red;text-shadow:black 0 0 3px;'>♥</span>",
													'diamond': "<span style='color:red;text-shadow:black 0 0 3px;'>♦</span>",
													'spade': "<span style='color:black;text-shadow:black 0 0 3px;'>♠</span>",
													'club': "<span style='color:black;text-shadow:black 0 0 3px;'>♣</span>",
													'none': "<span style='color:white;text-shadow:black 0 0 3px;'>◎</span>"
												};
												tempname += suitData[cardsuit];
											}
											if (cards[i].number != cardnumber) {
												tempname += "<b>" + cardnumber + "</b>";
											}
											if ((cards[i].name != cardname) || (cards[i].nature != cardnature)) {
												var tempname2 = get.translation(cardname);
												if (cardnature) {
													cards[i]._tempName.dataset.nature = cardnature;
													if (cardname == 'sha') {
														tempname2 = get.translation(cardnature) + tempname2;
													}
												}
												tempname += tempname2;
											}

											cards[i]._tempName.innerHTML = tempname;
											cards[i]._tempName.tempname = tempname;
										}
									}

									var nochess = true;
									if (!lib.filter.cardAiIncluded(cards[i])) {
										nochess = false;
									} else if (event._cardChoice && !firstCheck) {
										if (!event._cardChoice.contains(cards[i])) {
											nochess = false;
										}
									} else {
										if (player.isOut() || !lib.filter.cardRespondable(cards[i], player) || cards[i].classList.contains('uncheck') || !event.filterCard(cards[i], player)) {
											nochess = false;
										}
									}
									if (nochess) {
										if (ui.selected.cards.length < range[1]) {
											cards[i].classList.add('selectable');
											if (event._cardChoice && firstCheck) {
												event._cardChoice.push(cards[i]);
											}
										} else if (range[1] == -1) {
											cards[i].classList.add('selected');
											cards[i].updateTransform(true);
											ui.selected.cards.add(cards[i]);
										} else {
											cards[i].classList.remove('selectable');
										}
									} else {
										cards[i].classList.remove('selectable');
										if (range[1] == -1) {
											cards[i].classList.remove('selected');
											cards[i].updateTransform();
											ui.selected.cards.remove(cards[i]);
										}
									}
									if (cards[i].classList.contains('selected')) {
										cards[i].classList.add('selectable');
									} else if (!selectableCards && cards[i].classList.contains('selectable')) {
										selectableCards = true;
									}
								}
								if (ui.selected.cards.length < range[0]) {
									if (!event.forced || selectableCards || event.complexSelect) {
										ok = false;
									}
								}
							}
							if (custom.add.card) {
								custom.add.card();
							}
						}
						if (event.filterTarget) {
							if (ok == false) {
								game.uncheck('target');
							} else {
								var card = get.card();
								var firstCheck = false;
								range = get.select(event.selectTarget);
								var selectableTargets = false;
								if (range[0] != range[1] || range[0] > 1) auto = false;
								for (i = 0; i < players.length; i++) {
									var nochess = true;
									if (game.chess && !event.chessForceAll && player && get.distance(player, players[i], 'pure') > 7) {
										nochess = false;
									} else if (players[i].isOut()) {
										nochess = false;
									} else if (event._targetChoice && event._targetChoice.has(card)) {
										var targetChoice = event._targetChoice.get(card);
										if (!Array.isArray(targetChoice) || !targetChoice.contains(players[i])) {
											nochess = false;
										}
									} else if (!event.filterTarget(card, player, players[i])) {
										nochess = false;
									}
									if (nochess) {
										if (ui.selected.targets.length < range[1]) {
											players[i].classList.add('selectable');
											if (Array.isArray(event._targetChoice)) {
												event._targetChoice.push(players[i]);
											}
										} else if (range[1] == -1) {
											players[i].classList.add('selected');
											ui.selected.targets.add(players[i]);
										} else {
											players[i].classList.remove('selectable');
										}
									} else {
										players[i].classList.remove('selectable');
										if (range[1] == -1) {
											players[i].classList.remove('selected');
											ui.selected.targets.remove(players[i]);
										}
									}

									if (players[i].classList.contains('selected')) {
										players[i].classList.add('selectable');
									} else if (!selectableTargets && players[i].classList.contains('selectable')) {
										selectableTargets = true;
									}

									if (players[i].classList.contains('selected') || players[i].classList.contains('selectable')) {
										players[i].classList.remove('un-selectable');
									} else {
										players[i].classList.add('un-selectable');
									}

									if (players[i].instance) {
										if (players[i].classList.contains('selected')) {
											players[i].instance.classList.add('selected');
										} else {
											players[i].instance.classList.remove('selected');
										}
										if (players[i].classList.contains('selectable')) {
											players[i].instance.classList.add('selectable');
										} else {
											players[i].instance.classList.remove('selectable');
										}
									}
								}
								if (ui.selected.targets.length < range[0]) {
									if (!event.forced || selectableTargets || event.complexSelect) {
										ok = false;
									}
								}
								if (range[1] == -1 && ui.selected.targets.length == 0 && event.targetRequired) {
									ok = false;
								}
							}
							if (custom.add.target) {
								custom.add.target();
							}
						}
						if (!event.skill && get.noSelected() && !_status.noconfirm) {
							var skills = [],
								enable,
								info;
							var skills2;
							if (event._skillChoice) {
								skills2 = event._skillChoice;
								for (var i = 0; i < skills2.length; i++) {
									if (((typeof event.isMine == 'function') && event.isMine()) || !event._aiexclude.contains(skills2[i])) {
										skills.push(skills2[i]);
									}
								}
							} else {
								var skills2;
								if (get.mode() == 'guozhan' && player.hasSkillTag('nomingzhi', false, null, true)) {
									skills2 = player.getSkills(false, true, false);
								} else {
									skills2 = player.getSkills('invisible', true, false);
								}
								skills2 = game.filterSkills(skills2.concat(lib.skill.global), player, player.getSkills('e').concat(lib.skill.global));
								event._skillChoice = [];
								game.expandSkills(skills2);
								for (i = 0; i < skills2.length; i++) {
									info = get.info(skills2[i]);
									enable = false;
									if (typeof info.enable == 'function') enable = info.enable(event);
									else if (typeof info.enable == 'object') enable = info.enable.contains(event.name);
									else if (info.enable == 'phaseUse') enable = (event.type == 'phase');
									else if (typeof info.enable == 'string') enable = (info.enable == event.name);

									if (enable) {
										if (!game.expandSkills(player.getSkills(false).concat(lib.skill.global)).contains(skills2[i]) && (info.noHidden || get.mode() != 'guozhan' || player.hasSkillTag('nomingzhi', false, null, true))) enable = false;
										if (info.filter && !info.filter(event, player)) enable = false;
										if (info.viewAs && typeof info.viewAs != 'function' && event.filterCard && !event.filterCard(info.viewAs, player, event)) enable = false;
										if (info.viewAs && typeof info.viewAs != 'function' && info.viewAsFilter && info.viewAsFilter(player) == false) enable = false;

										if (info.usable && get.skillCount(skills2[i]) >= info.usable) enable = false;
										if (info.chooseButton && _status.event.noButton) enable = false;
										if (info.round && (info.round - (game.roundNumber - player.storage[skills2[i] + '_roundcount']) > 0)) enable = false;
									}

									if (enable) {
										if (((typeof event.isMine == 'function') && event.isMine()) || !event._aiexclude.contains(skills2[i])) {
											skills.add(skills2[i]);
										}
										event._skillChoice.add(skills2[i]);
									}
								}
							}

							var globalskills = [];
							var globallist = lib.skill.global.slice(0);
							game.expandSkills(globallist);
							for (var i = 0; i < skills.length; i++) {
								if (globallist.contains(skills[i])) {
									globalskills.push(skills.splice(i--, 1)[0]);
								}
							}
							var equipskills = [];
							var ownedskills = player.getSkills('invisible', false);
							game.expandSkills(ownedskills);
							for (var i = 0; i < skills.length; i++) {
								if (!ownedskills.contains(skills[i])) {
									equipskills.push(skills.splice(i--, 1)[0]);
								}
							}
							if (equipskills.length) {
								ui.create.skills3(equipskills);
							} else if (ui.skills3) {
								ui.skills3.close();
							}
							if (skills.length) {
								ui.create.skills(skills);
							} else if (ui.skills) {
								ui.skills.close();
							}
							if (globalskills.length) {
								ui.create.skills2(globalskills);
							} else if (ui.skills2) {
								ui.skills2.close();
							}
						} else {
							if (ui.skills) {
								ui.skills.close()
							}
							if (ui.skills2) {
								ui.skills2.close()
							}
							if (ui.skills3) {
								ui.skills3.close()
							}
						}
						_status.multitarget = false;
						var skillinfo = get.info(_status.event.skill);
						if (_status.event.name == 'chooseToUse') {
							if (skillinfo && skillinfo.multitarget && !skillinfo.multiline) {
								_status.multitarget = true;
							}
							if ((skillinfo && skillinfo.viewAs && typeof skillinfo.viewAs != 'function') || !_status.event.skill) {
								var cardinfo = get.info(get.card());
								if (cardinfo && cardinfo.multitarget && !cardinfo.multiline) {
									_status.multitarget = true;
								}
							}
						} else if (_status.event.multitarget) {
							_status.multitarget = true;
						}
						if ((typeof event.isMine == 'function') && event.isMine()) {
							if (game.chess && game.me && get.config('show_distance')) {
								for (var i = 0; i < players.length; i++) {
									if (players[i] == game.me) {
										players[i].node.action.hide();
									} else {
										players[i].node.action.show();
										var dist = get.distance(game.me, players[i], 'pure');
										var dist2 = get.distance(game.me, players[i]);
										players[i].node.action.innerHTML = '距离：' + dist2 + '/' + dist;
										if (dist > 7) {
											players[i].node.action.classList.add('thunder');
										} else {
											players[i].node.action.classList.remove('thunder');
										}
									}
								}
							}
							if (ok && (!event.filterOk || event.filterOk()) && auto && (auto_confirm || (skillinfo && skillinfo.direct)) && (!_status.mousedragging || !_status.mouseleft) && !_status.mousedown && !_status.touchnocheck) {
								if (ui.confirm) {
									if (!skillinfo || !skillinfo.preservecancel) {
										ui.confirm.close();
									}
								}
								if (skillinfo && skillinfo.preservecancel && !ui.confirm) {
									ui.create.confirm('c');
								}
								if (event.skillDialog == true) event.skillDialog = false;
								ui.click.ok();
								_status.mousedragging = null;
							} else {
								ui.arena.classList.add('selecting');
								if (event.filterTarget && (!event.filterCard || !event.position || (typeof event.position == 'string' && event.position.indexOf('e') == -1))) {
									ui.arena.classList.add('tempnoe');
								}
								game.countChoose();
								if (!_status.noconfirm && !_status.event.noconfirm) {
									if (!_status.mousedown || _status.mouseleft) {
										var str = '';
										if (ok && (!event.filterOk || event.filterOk())) str += 'o';
										if (!event.forced && !event.fakeforce && get.noSelected()) str += 'c';
										ui.create.confirm(str);
									}
								}
							}
							if (ui.confirm && ui.confirm.lastChild.link == 'cancel') {
								if (_status.event.type == 'phase' && !_status.event.skill) {
									ui.confirm.lastChild.innerHTML = '结束';
								} else {
									ui.confirm.lastChild.innerHTML = '取消';
								}
							}
						}
						return ok;
					};

					game.uncheck = function () {
						var i, j;
						if (game.chess) {
							var shadows = ui.chessContainer.getElementsByClassName('playergrid temp');
							while (shadows.length) {
								shadows[0].remove();
							}
						}

						var args = new Array(arguments.length);
						for (var i = 0; i < args.length; i++) args[i] = arguments[i];
						if ((args.length == 0 || args.contains('card')) && _status.event.player) {
							var cards = _status.event.player.getCards('hejs');
							for (j = 0; j < cards.length; j++) {
								cards[j].classList.remove('selected');
								cards[j].classList.remove('selectable');
								if (cards[j]._tempName) {
									//cards[j]._tempName.textContent = '';
									cards[j]._tempName.innerHTML = '';
								}
								cards[j].updateTransform();
							}
							ui.selected.cards.length = 0;
							_status.event.player.node.equips.classList.remove('popequip');
						}
						var players = game.players.slice(0);
						if (_status.event.deadTarget) players.addArray(game.dead);
						if ((args.length == 0 || args.contains('target'))) {
							for (j = 0; j < players.length; j++) {
								players[j].classList.remove('selected');
								players[j].classList.remove('selectable');
								players[j].classList.remove('un-selectable');
								if (players[j].instance) {
									players[j].instance.classList.remove('selected');
									players[j].instance.classList.remove('selectable');
								}
							}
							ui.selected.targets.length = 0;
						}
						if ((args.length == 0 || args.contains('button')) && _status.event.dialog && _status.event.dialog.buttons) {
							for (j = 0; j < _status.event.dialog.buttons.length; j++) {
								_status.event.dialog.buttons[j].classList.remove('selectable');
								_status.event.dialog.buttons[j].classList.remove('selected');
							}
							ui.selected.buttons.length = 0;
						}
						if (args.length == 0) {
							ui.arena.classList.remove('selecting');
							ui.arena.classList.remove('tempnoe');
							_status.imchoosing = false;
							_status.lastdragchange.length = 0;
							_status.mousedragging = null;
							_status.mousedragorigin = null;

							while (ui.touchlines.length) {
								ui.touchlines.shift().delete();
							}
						}

						for (var i = 0; i < players.length; i++) {
							players[i].unprompt();
						}
						for (var i = 0; i < _status.dragline.length; i++) {
							if (_status.dragline[i]) _status.dragline[i].remove();
						}
						ui.arena.classList.remove('dragging');
						_status.dragline.length = 0;
					};

					game.swapPlayer = function (player, player2) {
						var result = swapPlayerFunction.call(this, player, player2);
						if (game.me && game.me != ui.equipSolts.me) {
							ui.equipSolts.me.appendChild(ui.equipSolts.equips);
							ui.equipSolts.me = game.me;
							ui.equipSolts.equips = game.me.node.equips;
							ui.equipSolts.appendChild(game.me.node.equips);
						}

						return result;
					};

					game.swapControl = function (player) {
						var result = swapControlFunction.call(this, player);
						if (game.me && game.me != ui.equipSolts.me) {
							ui.equipSolts.me.appendChild(ui.equipSolts.equips);
							ui.equipSolts.me = game.me;
							ui.equipSolts.equips = game.me.node.equips;
							ui.equipSolts.appendChild(game.me.node.equips);
						}
						return result;
					};

					game.linexy = function (path) {
						if (!decadeUI.config.playerLineEffect) return gameLinexyFunction.apply(this, arguments);
						decadeUI.effect.line(path);
					};

					ui.click.intro = function (e) {
						if (this.classList.contains('infohidden') || _status.dragged) return;
						_status.clicked = true;
						if (this.classList.contains('player') && !this.name) return;
						if (this.parentNode == ui.historybar) {
							if (ui.historybar.style.zIndex == '22') {
								if (_status.removePop) {
									if (_status.removePop(this) == false) return;
								} else {
									return;
								}
							}
							ui.historybar.style.zIndex = 22;
						}

						var uiintro = uiintro || get.nodeintro(this, false, e);
						if (!uiintro) return;
						uiintro.classList.add('popped');
						uiintro.classList.add('static');
						ui.window.appendChild(uiintro);
						var layer = ui.create.div('.poplayer', ui.window);
						var clicklayer = function (e) {
							if (_status.touchpopping) return;
							delete _status.removePop;
							uiintro.delete();
							this.remove();
							ui.historybar.style.zIndex = '';
							delete _status.currentlogv;
							if (!ui.arena.classList.contains('menupaused') && !uiintro.noresume) game.resume2();
							if (e && e.stopPropagation) e.stopPropagation();
							if (uiintro._onclose) {
								uiintro._onclose();
							}
							return false;
						};

						layer.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clicklayer);
						if (!lib.config.touchscreen) layer.oncontextmenu = clicklayer;
						if (this.parentNode == ui.historybar && lib.config.touchscreen) {
							var rect = this.getBoundingClientRect();
							e = {
								clientX: 0,
								clientY: rect.top + 30
							};
						}

						lib.placePoppedDialog(uiintro, e, this);
						if (this.parentNode == ui.historybar) {
							if (lib.config.show_history == 'right') {
								uiintro.style.left = (ui.historybar.offsetLeft - 230) + 'px';
							} else {
								uiintro.style.left = (ui.historybar.offsetLeft + 60) + 'px';
							}
						}

						uiintro.style.zIndex = 21;
						var clickintro = function () {
							if (_status.touchpopping) return;
							delete _status.removePop;
							layer.remove();
							this.delete();
							ui.historybar.style.zIndex = '';
							delete _status.currentlogv;
							if (!ui.arena.classList.contains('menupaused') && !uiintro.noresume) game.resume2();
							if (uiintro._onclose) {
								uiintro._onclose();
							}
						};
						var currentpop = this;
						_status.removePop = function (node) {
							if (node == currentpop) return false;
							layer.remove();
							uiintro.delete();
							_status.removePop = null;
							return true;
						};
						if (uiintro.clickintro) {
							uiintro.listen(function () {
								_status.clicked = true;
							});
							uiintro._clickintro = clicklayer;
						} else if (!lib.config.touchscreen) {
							uiintro.addEventListener('mouseleave', clickintro);
							uiintro.addEventListener('click', clickintro);
						} else if (uiintro.touchclose) {
							uiintro.listen(clickintro);
						}
						uiintro._close = clicklayer;

						game.pause2();
						return uiintro;
					};

					ui.click.identity = function (e) {
						if (_status.dragged || !game.getIdentityList || _status.video || this.parentNode.forceShown) return;
						_status.clicked = true;
						var identityList = game.getIdentityList(this.parentNode);
						if (!identityList) return;

						if (lib.config.mark_identity_style == 'click') {
							var getNext = false;
							var theNext;
							var key;
							var current = this.firstChild.innerText;

							for (key in identityList) {
								if (theNext == null || getNext) {
									theNext = key;
									if (getNext) break;
								}

								if (current == identityList[key]) getNext = true;
							}

							this.parentNode.setIdentity(theNext);

						} else {
							if (get.mode() == 'guozhan') {
								identityList = {
									wei: '魏',
									shu: '蜀',
									wu: '吴',
									qun: '群',
									jin: '晋',
									ye: '野',
								};
								if (_status.forceKey) identityList.key = '键';
							}

							if (!dui.$identityMarkBox) {
								dui.$identityMarkBox = decadeUI.element.create('identity-mark-box');
								dui.$identityMarkBox.ondeactive = function () {
									dui.$identityMarkBox.remove();
									_status.clicked = false;
									if (!ui.arena.classList.contains('menupaused')) game.resume2();
								}
							}

							var index = 0;
							var node;
							var nodes = dui.$identityMarkBox.childNodes;
							for (key in identityList) {
								node = nodes[index];
								if (!node) {
									node = decadeUI.element.create('identity-mark-item', dui.$identityMarkBox);
									node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
										this.player.setIdentity(this.link);
										dui.$identityMarkBox.remove();
										_status.clicked = false;
									});
								} else {
									node.style.display = '';
								}

								node.link = key;
								node.player = this.parentNode;
								node.innerText = identityList[key];
								index++;
							}

							while (index < nodes.length) {
								nodes[index].style.display = 'none';
								index++;
							}

							game.pause2();
							setTimeout(function (player) {
								player.appendChild(dui.$identityMarkBox);
								dui.set.activeElement(dui.$identityMarkBox);
							}, 0, this.parentNode);
						}


					};

					ui.click.volumn = function () {
						var setting = ui.create.dialog('hidden');
						setting.listen(function (e) {
							e.stopPropagation();
						});

						var backVolume = decadeUI.component.slider(0, 8, parseInt(lib.config.volumn_background));
						var gameVolume = decadeUI.component.slider(0, 8, parseInt(lib.config.volumn_audio));

						backVolume.onchange = function () {
							game.saveConfig('volumn_background', backVolume.value);
							ui.backgroundMusic.volume = backVolume.value / 8;
						};

						gameVolume.onchange = function () {
							game.saveConfig('volumn_audio', gameVolume.value);
						};

						setting.add('背景音量');
						setting.content.appendChild(backVolume);
						setting.add('游戏音量');
						setting.content.appendChild(gameVolume);
						setting.add(ui.create.div('.placeholder'));
						return setting;
					};

					ui.create.pause = function () {
						var dialog = createPauseFunction.call(this);
						dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
						return dialog;
					};

					ui.clear = function () {
						game.addVideo('uiClear');
						var nodes = document.getElementsByClassName('thrown');
						for (var i = nodes.length - 1; i >= 0; i--) {
							if (nodes[i].fixed)
								continue;

							if (nodes[i].classList.contains('card')) {
								decadeUI.layout.clearout(nodes[i]);
							} else {
								nodes[i].delete();
							}
						}
					};

					// if ((typeof ui.create.menu) == 'function') {
					// var str = ui.create.menu.toString();
					// str = str.substring(str.indexOf('{'));
					// str = str.replace(/game\.documentZoom|1\.3/g, '1');
					// createMenuFunction = new Function('connectMenu', '_status','lib','game','ui','get','ai', str);
					// }

					// ui.create.menu = function(connectMenu){
					// return createMenuFunction.call(this, connectMenu, _status, lib, game, ui, get, ai);
					// };

					ui.create.arena = function () {
						ui.updatez();
						var result = createArenaFunction.apply(this, arguments);
						ui.arena.classList.remove('slim_player');
						ui.arena.classList.remove('uslim_player');
						ui.arena.classList.remove('mslim_player');
						ui.arena.classList.remove('lslim_player');
						ui.arena.classList.remove('oldlayout');
						ui.arena.classList.remove('mobile');
						ui.arena.classList.add('decadeUI');
						ui.control.id = 'dui-controls';

						decadeUI.config.update();
						return result;
					};

					ui.create.me = function (hasme) {
						ui.arena.dataset.layout = game.layout;

						ui.mebg = ui.create.div('#mebg', ui.arena);
						ui.me = ui.create.div('.hand-wrap', ui.arena);
						ui.handcards1Container = decadeUI.element.create('hand-cards', ui.me);
						ui.handcards2Container = ui.create.div('#handcards2');
						ui.arena.classList.remove('nome');
						if (lib.config.mousewheel && !lib.config.touchscreen) {
							ui.handcards1Container.onmousewheel = decadeUI.handler.handMousewheel;
							ui.handcards2Container.onmousewheel = ui.click.mousewheel;
						}

						var equipSolts = ui.equipSolts = decadeUI.element.create('equips-wrap');
						equipSolts.back = decadeUI.element.create('equips-back', equipSolts);

						decadeUI.element.create('icon icon-treasure', decadeUI.element.create('equip0', equipSolts.back));
						decadeUI.element.create('icon icon-saber', decadeUI.element.create('equip1', equipSolts.back));
						decadeUI.element.create('icon icon-shield', decadeUI.element.create('equip2', equipSolts.back));
						decadeUI.element.create('icon icon-mount', decadeUI.element.create('equip3', equipSolts.back));
						decadeUI.element.create('icon icon-mount', decadeUI.element.create('equip4', equipSolts.back));

						ui.arena.insertBefore(equipSolts, ui.me);
						decadeUI.bodySensor.addListener(decadeUI.layout.resize);
						decadeUI.layout.resize();

						ui.handcards1Container.ontouchstart = ui.click.touchStart;
						ui.handcards2Container.ontouchstart = ui.click.touchStart;
						ui.handcards1Container.ontouchmove = decadeUI.handler.touchScroll;
						ui.handcards2Container.ontouchmove = decadeUI.handler.touchScroll;
						ui.handcards1Container.style.WebkitOverflowScrolling = 'touch';
						ui.handcards2Container.style.WebkitOverflowScrolling = 'touch';

						if (hasme && game.me) {
							ui.handcards1 = game.me.node.handcards1;
							ui.handcards2 = game.me.node.handcards2;
							ui.handcards1Container.appendChild(ui.handcards1);
							ui.handcards2Container.appendChild(ui.handcards2);
						} else if (game.players.length) {
							game.me = game.players[0];
							ui.handcards1 = game.me.node.handcards1;
							ui.handcards2 = game.me.node.handcards2;
							ui.handcards1Container.appendChild(ui.handcards1);
							ui.handcards2Container.appendChild(ui.handcards2);
						}

						if (game.me) {
							equipSolts.me = game.me;
							equipSolts.equips = game.me.node.equips;
							equipSolts.appendChild(game.me.node.equips);
						}
					};

					ui.create.player = function (position, noclick) {
						var player = ui.create.div('.player', position);
						var playerExtend = {
							node: {
								avatar: ui.create.div('.primary-avatar', player, ui.click.avatar).hide(),
								avatar2: ui.create.div('.deputy-avatar', player, ui.click.avatar2).hide(),
								turnedover: decadeUI.element.create('turned-over', player),
								framebg: ui.create.div('.framebg', player),
								intro: ui.create.div('.intro', player),
								identity: ui.create.div('.identity', player),
								hp: ui.create.div('.hp', player),
								name: ui.create.div('.name', player),
								name2: ui.create.div('.name.name2', player),
								nameol: ui.create.div('.nameol', player),
								count: ui.create.div('.card-count', player),
								equips: ui.create.div('.equips', player).hide(),
								judges: ui.create.div('.judges', player),
								marks: decadeUI.element.create('dui-marks', player),
								chain: decadeUI.element.create('chain', player),
								handcards1: ui.create.div('.handcards'),
								handcards2: ui.create.div('.handcards'),
								expansions: ui.create.div('.expansions'),
							},
							phaseNumber: 0,
							skipList: [],
							skills: [],
							invisibleSkills: [],
							initedSkills: [],
							additionalSkills: {},
							disabledSkills: {},
							hiddenSkills: [],
							awakenedSkills: [],
							forbiddenSkills: {},
							popups: [],
							damagepopups: [],
							judging: [],
							stat: [{
								card: {},
								skill: {}
							}],
							actionHistory: [{
								useCard: [],
								respond: [],
								skipped: [],
								lose: [],
								gain: [],
								sourceDamage: [],
								damage: [],
								custom: [],
								useSkill: []
							}],
							tempSkills: {},
							storage: {},
							marks: {},
							ai: {
								friend: [],
								enemy: [],
								neutral: [],
								handcards: {
									global: [],
									source: [],
									viewed: []
								}
							},
							queueCount: 0,
							outCount: 0,
						};

						var chainImg = new Image();
						chainImg.onerror = function () {
							var node = decadeUI.element.create('chain-back', player.node.chain);
							for (var i = 0; i < 40; i++) decadeUI.element.create('cardbg', node).style.transform = 'translateX(' + (i * 5 - 5) + 'px)';
							chainImg.onerror = undefined;
						};
						chainImg.src = decadeUIPath + 'assets/image/tie_suo.png';

						var extend = {
							$cardCount: playerExtend.node.count,
							$dynamicWrap: decadeUI.element.create('dynamic-wrap'),
						}

						decadeUI.get.extend(player, extend);
						decadeUI.get.extend(player, playerExtend);
						decadeUI.get.extend(player, lib.element.player);

						player.node.action = ui.create.div('.action', player.node.avatar);
						var realIdentity = ui.create.div(player.node.identity);
						realIdentity.player = player;

						Object.defineProperties(realIdentity, {
							innerHTML: {
								configurable: true,
								get: function () {
									return this.innerText;
								},
								set: function (value) {
									if (get.mode() == 'guozhan' || _status.mode == 'jiange' || _status.mode == 'siguo') {
										this.style.display = 'none';
										this.innerText = value;
										this.parentNode.classList.add('guozhan-mode');
										return;
									}

									var filename;
									var checked;
									var identity = this.parentNode.dataset.color;
									var gameMode = get.mode();
									var isExt = false;
									if (lib.decade_extIdentity && (lib.decade_extIdentity[this.player.identity] || lib.decade_extIdentity[value]) && value != '猜') {
										if (lib.decade_extIdentity[value]) {
											filename = lib.decade_extIdentity[value];
										} else {
											filename = lib.decade_extIdentity[this.player.identity];
										}
										isExt = true;
									} else {
										switch (value) {
											case '猜':
												filename = 'cai';
												if (_status.mode == 'purple' && identity == 'cai') {
													filename += '_blue';
													checked = true;
												}
												break;
											case '友':
												filename = 'friend';
												break;
											case '敌':
												filename = 'enemy';
												break;
											case '反':
												filename = 'fan';
												if (get.mode() == 'doudizhu') {
													filename = 'nongmin';
													checked = true;
												}
												break;
											case '主':
												filename = 'zhu';
												if (get.mode() == 'versus' && get.translation(player.side + 'Color') == 'wei') {
													filename += '_blue';
													this.player.classList.add('opposite-camp');
													checked = true;
												} else if (get.mode() == 'doudizhu') {
													filename = 'dizhu';
													checked = true;
												}
												break;
											case '忠':
												filename = 'zhong';
												if (gameMode == 'identity' && _status.mode == 'purple') {
													filename = 'qianfeng';
												} else if (get.mode() == 'versus' && get.translation(player.side + 'Color') == 'wei') {
													filename += '_blue';
													this.player.classList.add('opposite-camp');
													checked = true;
												}
												break;
											case '内':
												if (_status.mode == 'purple') {
													filename = identity == 'rNei' ? 'xizuo' : 'xizuo_blue';
													checked = true;
												} else {
													filename = 'nei';
												}
												break;
											case '野':
												filename = 'ye';
												break;
											case '首':
												filename = 'zeishou';
												break;
											case '帅':
												filename = 'zhushuai';
												break;
											case '将':
												filename = 'dajiang';
												if (_status.mode == 'three' || get.translation(player.side + 'Color') == 'wei') {
													filename = 'zhushuai_blue';
													checked = true;
												}
												break;
											case '兵':
											case '卒':
												filename = this.player.side === false ? 'qianfeng_blue' : 'qianfeng';
												checked = true;
												break;
											case '师':
												filename = 'junshi';
												break;
											case '盟':
												filename = 'mengjun';
												break;
											case '神':
												filename = 'boss';
												break;
											case '从':
												filename = 'suicong';
												break;
											default:
												this.innerText = value;
												this.style.visibility = '';
												this.parentNode.style.backgroundImage = '';
												return;
										}
									}

									if (!checked && this.parentNode.dataset.color && !isExt) {
										if (this.parentNode.dataset.color[0] == 'b') {
											filename += '_blue';
											this.player.classList.add('opposite-camp');
										}
									}

									this.innerText = value;
									if (decadeUI.config.campIdentityImageMode) {
										this.style.visibility = 'hidden';
										var image = new Image();
										image.node = this;
										image.onerror = function () { this.node.style.visibility = ''; };
										if (isExt) {
											image.src = filename;
										} else {
											image.src = extensionPath + 'image/decoration/identity_' + filename + '.png';
										}
										this.parentNode.style.backgroundImage = 'url("' + image.src + '")';
									} else {
										this.style.visibility = '';
									}
								}
							}
						});

						Object.defineProperties(player.node.count, {
							innerHTML: {
								configurable: true,
								get: function () {
									return this.textContent;
								},
								set: function (value) {
									if (this.textContent == value) return;
									this.textContent = value;
									this.dataset.text = value;
								}
							}
						});

						if (!noclick) {
							player.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.target);
							player.node.identity.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.identity);
							if (lib.config.touchscreen) {
								player.addEventListener('touchstart', ui.click.playertouchstart);
							}
						} else {
							player.noclick = true;
						}

						var campWrap = decadeUI.element.create('camp-wrap');
						var hpWrap = decadeUI.element.create('hp-wrap');

						player.insertBefore(campWrap, player.node.name);
						player.insertBefore(hpWrap, player.node.hp);
						player.node.campWrap = campWrap;
						player.node.hpWrap = hpWrap;
						hpWrap.appendChild(player.node.hp);

						var campWrapExtend = {
							node: {
								back: decadeUI.element.create('camp-back', campWrap),
								border: decadeUI.element.create('camp-border', campWrap),
								campName: decadeUI.element.create('camp-name', campWrap),
								avatarName: player.node.name,
								avatarDefaultName: decadeUI.element.create('avatar-name-default', campWrap),
							}
						};

						decadeUI.get.extend(campWrap, campWrapExtend);

						campWrap.appendChild(player.node.name);
						campWrap.node.avatarName.className = 'avatar-name';
						campWrap.node.avatarDefaultName.innerHTML = '主<br>将';

						var node = {
							mask: player.insertBefore(decadeUI.element.create('mask'), player.node.identity),
							gainSkill: decadeUI.element.create('gain-skill', player),
						}

						var properties = {
							gainSkill: {
								player: player,
								gain: function (skill) {
									var sender = this;

									if (!sender.skills) sender.skills = [];
									if (!sender.skills.contains(skill) && lib.translate[skill]) {
										var info = lib.skill[skill];
										if (!info || info.charlotte || info.sub || (info.mark && !info.limited) || (info.nopop || info.popup === false)) return;
										if (info.onremove && game.me != this.player.storage[skill]) return;

										sender.skills.push(skill);
										var html = '';
										for (var i = 0; i < sender.skills.length; i++) {
											html += '[' + lib.translate[sender.skills[i]] + ']';
										}

										sender.innerHTML = html;
									}
								},
								lose: function (skill) {
									var sender = this;
									var index = sender.skills.indexOf(skill);
									if (index >= 0) {
										sender.skills.splice(index, 1);
										var html = '';
										for (var i = 0; i < sender.skills.length; i++) {
											html += '[' + get.translation(sender.skills[i]) + ']';
										}

										sender.innerHTML = html;
									}
								},
							},
						};

						decadeUI.get.extend(node.gainSkill, properties.gainSkill);
						decadeUI.get.extend(player.node, node);

						Object.defineProperties(player, {
							group: {
								configurable: true,
								get: function () {
									return this.node.campWrap.dataset.camp;
								},
								set: function (value) {
									this.node.campWrap.dataset.camp = value;

									if (value) {
										if (decadeUI.config.campIdentityImageMode) {
											var that = this;
											var image = new Image();
											var url = extensionPath + 'image/decoration/name_' + value + '.png';
											if (lib.decade_extGroupImage && lib.decade_extGroupImage[value]) {
												url = lib.decade_extGroupImage[value];
											}
											that._finalGroup = value;

											image.onerror = function () {
												that.node.campWrap.node.campName.innerHTML = that._finalGroup ? get.translation(that._finalGroup)[0] : '';
											};

											that.node.campWrap.node.campName.innerHTML = '';
											that.node.campWrap.node.campName.style.backgroundImage = 'url("' + url + '")';
											image.src = url;

											return;
										}

										this.node.campWrap.node.campName.innerHTML = value ? get.translation(value)[0] : '';
									}
								}
							}
						});

						return player;
					};

					ui.create.card = function (position, info, noclick) {
						var card = ui.create.div('.card');
						card.node = {
							image: ui.create.div('.image', card),
							info: ui.create.div('.info'),
							suitnum: decadeUI.element.create('suit-num', card),
							name: ui.create.div('.name', card),
							name2: ui.create.div('.name2', card),
							background: ui.create.div('.background', card),
							intro: ui.create.div('.intro', card),
							range: ui.create.div('.range', card),
							gaintag: decadeUI.element.create('gaintag info', card),
							judgeMark: decadeUI.element.create('judge-mark', card),
							cardMask: decadeUI.element.create('card-mask', card),
						};

						var extend = {
							$name: decadeUI.element.create('top-name', card),
							$vertname: card.node.name,
							$equip: card.node.name2,
							$suitnum: card.node.suitnum,
							$range: card.node.range,
							$gaintag: card.node.gaintag,
						};


						for (var i in extend) card[i] = extend[i];
						for (var i in lib.element.card) card[i] = lib.element.card[i];
						card.node.intro.innerText = lib.config.intro;
						if (!noclick) lib.setIntro(card);

						card.storage = {};
						card.vanishtag = [];
						card.gaintag = [];
						card._uncheck = [];
						if (info != 'noclick') {
							card.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.card);
							if (lib.config.touchscreen) {
								card.addEventListener('touchstart', ui.click.cardtouchstart);
								card.addEventListener('touchmove', ui.click.cardtouchmove);
							}
							if (lib.cardSelectObserver) {
								lib.cardSelectObserver.observe(card, {
									attributes: true
								});
							}
						}


						card.$suitnum.$num = decadeUI.element.create(null, card.$suitnum, 'span');
						card.$suitnum.$num.style.fontFamily = '"STHeiti","SimHei","Microsoft JhengHei","Microsoft YaHei","WenQuanYi Micro Hei",Helvetica,Arial,sans-serif';
						card.$suitnum.$br = decadeUI.element.create(null, card.$suitnum, 'br');
						card.$suitnum.$suit = decadeUI.element.create('suit', card.$suitnum, 'span');
						card.$suitnum.$suit.style.fontFamily = '"STHeiti","SimHei","Microsoft JhengHei","Microsoft YaHei","WenQuanYi Micro Hei",Helvetica,Arial,sans-serif';
						card.$equip.$suitnum = decadeUI.element.create(null, card.$equip, 'span');
						card.$equip.$name = decadeUI.element.create(null, card.$equip, 'span');


						card.node.judgeMark.node = {
							back: decadeUI.element.create('back', card.node.judgeMark),
							mark: decadeUI.element.create('mark', card.node.judgeMark),
							judge: decadeUI.element.create('judge', card.node.judgeMark)
						};

						if (position) position.appendChild(card);
						return card;
					};

					ui.create.cards = function () {
						var result = base.ui.create.cards.apply(this, arguments);
						game.updateRoundNumber();
						return result;
					};

					// 不联机就不用
					// ui.create.chat = function(){
					// var chatBox = ui.arena.appendChild(decadeUI.component.chatBox());
					// for (var i = 0; i < lib.chatHistory.length; i++) {
					// chatBox.addEntry(lib.chatHistory[i]);
					// }

					// _status.addChatEntry = chatBox.addEntry;
					// Object.defineProperties(_status, {
					// addChatEntry: {
					// configurable: true,
					// get:function(){
					// return chatBox.addEntry;
					// },
					// set:function(value){
					// chatBox.overrideEntry = value;
					// }
					// },
					// });

					// var retVal = base.ui.create.chat.apply(this, arguments);
					// chatBox.addEntry._origin = chatBox;
					// return retVal;
					// };

					lib.init.cssstyles = function () {
						var temp = lib.config.glow_phase;
						lib.config.glow_phase = '';
						initCssstylesFunction.call(this);
						lib.config.glow_phase = temp;
						ui.css.styles.sheet.insertRule('.avatar-name, .avatar-name-default { font-family: "' + (lib.config.name_font || 'xinkai') + '", "xinwei" }', 0);
					};

					lib.init.layout = function (layout, nosave) {
						if (!nosave) game.saveConfig('layout', layout);
						game.layout = layout;

						var relayout = function () {
							ui.arena.dataset.layout = game.layout;
							if (get.is.phoneLayout()) {
								ui.css.phone.href = lib.assetURL + 'layout/default/phone.css';
								ui.arena.classList.add('phone');
							} else {
								ui.css.phone.href = '';
								ui.arena.classList.remove('phone');
							}

							for (var i = 0; i < game.players.length; i++) {
								if (get.is.linked2(game.players[i])) {
									if (game.players[i].classList.contains('linked')) {
										game.players[i].classList.remove('linked');
										game.players[i].classList.add('linked2');
									}
								} else {
									if (game.players[i].classList.contains('linked2')) {
										game.players[i].classList.remove('linked2');
										game.players[i].classList.add('linked');
									}
								}
							}

							ui.updatej();
							ui.updatem();
							setTimeout(function () {
								if (game.me) game.me.update();
								setTimeout(function () {
									ui.updatex();
								}, 500);

								setTimeout(function () {
									ui.updatec();
								}, 1000);
							}, 100);
						};

						setTimeout(relayout, 500);
					};

					lib.skill._usecard = {
						trigger: { global: 'useCardAfter' },
						forced: true,
						popup: false,
						priority: -100,
						filter: function (event) {
							return ui.clear.delay === 'usecard' && event.card.name != 'wuxie';
						},
						content: function () {
							ui.clear.delay = false;
							game.broadcastAll(function () {
								ui.clear();
							});
						}
					},

						lib.skill._decadeUI_usecardBegin = {
							trigger: { global: 'useCardBegin' },
							forced: true,
							popup: false,
							priority: -100,
							filter: function (event) {
								return !ui.clear.delay && event.card.name != 'wuxie';
							},
							content: function () {
								ui.clear.delay = 'usecard';
							}
						};

					lib.skill._discard = {
						trigger: { global: ['discardAfter', 'loseToDiscardpileAfter', 'loseAsyncAfter'] },
						forced: true,
						popup: false,
						priority: -100,
						filter: function (event) {
							return ui.todiscard[event.discardid] ? true : false;
						},
						content: function () {
							game.broadcastAll(function (id) {
								if (window.decadeUI) {
									ui.todiscard = [];
									ui.clear();
									return;
								}

								var todiscard = ui.todiscard[id];
								delete ui.todiscard[id];
								if (todiscard) {
									var time = 1000;
									if (typeof todiscard._discardtime == 'number') {
										time += todiscard._discardtime - get.time();
									}
									if (time < 0) {
										time = 0;
									}
									setTimeout(function () {
										for (var i = 0; i < todiscard.length; i++) {
											todiscard[i].delete();
										}
									},
										time);
								}
							}, trigger.discardid);
						}
					};

					lib.skill._decadeUI_dieKillEffect = {
						trigger: { source: ['dieBegin'] },
						forced: true,
						popup: false,
						priority: -100,
						lastDo: true,
						content: function () {
							if (!(trigger.source && trigger.player)) return;
							game.broadcastAll(function (source, player) {
								if (!window.decadeUI) return;
								if (!decadeUI.config.playerKillEffect) return;
								decadeUI.effect.kill(source, player);
							}, trigger.source, trigger.player);
						}
					};

					lib.element.content.addJudge = function () {
						"step 0";
						if (cards) {
							var owner = get.owner(cards[0]);
							if (owner) {
								event.relatedLose = owner.lose(cards, 'visible', ui.special).set('getlx', false);
							} else if (get.position(cards[0]) == 'c') event.updatePile = true;
						};
						"step 1";
						if (cards[0].destroyed) {
							if (player.hasSkill(cards[0].destroyed)) {
								delete cards[0].destroyed;
							} else {
								event.finish();
								return;
							}
						} else if (event.relatedLose) {
							var owner = event.relatedLose.player;
							if (owner.getCards('hejsx').contains(card)) {
								event.finish();
								return;
							}
						}
						cards[0].fix();
						cards[0].style.transform = '';
						cards[0].classList.remove('drawinghidden');
						cards[0]._transform = null;

						var viewAs = typeof card == 'string' ? card : card.name;
						if (!lib.card[viewAs] || !lib.card[viewAs].effect) {
							game.cardsDiscard(cards[0]);
						} else {
							cards[0].style.transform = '';
							player.node.judges.insertBefore(cards[0], player.node.judges.firstChild);
							if (_status.discarded) {
								_status.discarded.remove(cards[0]);
							}
							ui.updatej(player);
							game.broadcast(function (player, card, viewAs) {
								card.fix();
								card.style.transform = '';
								card.classList.add('drawinghidden');
								card.viewAs = viewAs;
								if (viewAs && viewAs != card.name) {
									if (window.decadeUI) {
										card.classList.add('fakejudge');
										card.node.judgeMark.node.judge.innerHTML = get.translation(viewAs)[0];

									} else if (card.classList.contains('fullskin') || card.classList.contains('fullborder')) {
										card.classList.add('fakejudge');
										card.node.background.innerHTML = lib.translate[viewAs + '_bg'] || get.translation(viewAs)[0];
									}
								} else {
									card.classList.remove('fakejudge');
									if (window.decadeUI) card.node.judgeMark.node.judge.innerHTML = get.translation(card.name)[0];
								}

								player.node.judges.insertBefore(card, player.node.judges.firstChild);
								ui.updatej(player);
								if (card.clone && (card.clone.parentNode == player.parentNode || card.clone.parentNode == ui.arena)) {
									card.clone.moveDelete(player);
									game.addVideo('gain2', player, get.cardsInfo([card]));
								}
							}, player, cards[0], viewAs);

							if (cards[0].clone && (cards[0].clone.parentNode == player.parentNode || cards[0].clone.parentNode == ui.arena)) {
								cards[0].clone.moveDelete(player);
								game.addVideo('gain2', player, get.cardsInfo(cards));
							}

							if (get.itemtype(card) != 'card') {
								if (typeof card == 'string') cards[0].viewAs = card;
								else cards[0].viewAs = card.name;
							} else {
								cards[0].viewAs = null;
							}

							if (cards[0].viewAs && cards[0].viewAs != cards[0].name) {
								cards[0].classList.add('fakejudge');
								cards[0].node.judgeMark.node.judge.innerHTML = get.translation(cards[0].viewAs)[0];
								game.log(player, '被贴上了<span class="yellowtext">' + get.translation(cards[0].viewAs) + '</span>（', cards, '）');
							} else {
								cards[0].classList.remove('fakejudge');
								cards[0].node.judgeMark.node.judge.innerHTML = get.translation(cards[0].name)[0];
								game.log(player, '被贴上了', cards);
							}

							game.addVideo('addJudge', player, [get.cardInfo(cards[0]), cards[0].viewAs]);
						}
						if (event.updatePile) game.updateRoundNumber();
					};

					lib.element.content.chooseToCompare = function () {
						"step 0"
						if (((!event.fixedResult || !event.fixedResult[player.playerid])
							&& player.countCards('h') == 0) || ((!event.fixedResult || !event.fixedResult[target.playerid])
								&& target.countCards('h') == 0)) {
							event.result = {
								cancelled: true,
								bool: false
							}
							event.finish();
							return;
						}
						game.log(player, '对', target, '发起拼点');
						event.lose_list = [];

						// 更新拼点框
						if (event.parent.name == null || event.parent.name == 'trigger') {
							event.compareName = event.name;
						} else {
							event.compareName = event.parent.name;
						}

						// 有空重写拼点
						event.addMessageHook('finished', function () {
							var dialog = ui.dialogs[this.compareName];
							if (dialog)
								dialog.close();
						});
						game.broadcastAll(function (player, target, eventName) {
							if (!window.decadeUI) return;

							var dialog = decadeUI.create.compareDialog();
							dialog.caption = get.translation(eventName) + '拼点';
							dialog.player = player;
							dialog.target = target;
							dialog.open();

							decadeUI.delay(400);
							ui.dialogs[eventName] = dialog;
						}, player, target, event.compareName);

						"step 1"
						var sendback = function () {
							if (_status.event != event) {
								return function () {
									event.resultOL = _status.event.resultOL;
								};
							}
						};

						if (event.fixedResult && event.fixedResult[player.playerid]) {
							event.card1 = event.fixedResult[player.playerid];
							event.lose_list.push([player, event.card1]);//共同丢失逻辑。
						} else if (player.isOnline()) {
							player.wait(sendback);
							event.ol = true;
							player.send(function (ai) {
								game.me.chooseCard('请选择拼点牌', true).set('prompt', false).set('type', 'compare').ai = ai;
								game.resume();
							}, event.ai);
						} else {
							event.localPlayer = true;
							player.chooseCard('请选择拼点牌', true).set('prompt', false).set('type', 'compare').ai = event.ai;
						}

						if (event.fixedResult && event.fixedResult[target.playerid]) {
							event.card2 = event.fixedResult[target.playerid];
							event.lose_list.push([target, event.card2]);//共同丢失逻辑。
						} else if (target.isOnline()) {
							target.wait(sendback);
							event.ol = true;
							target.send(function (ai) {
								game.me.chooseCard('请选择拼点牌', true).set('prompt', false).set('type', 'compare').ai = ai;
								game.resume();
							},
								event.ai);
						} else {
							event.localTarget = true;
						}

						"step 2"
						if (event.localPlayer) {
							if (result.skill && lib.skill[result.skill] && lib.skill[result.skill].onCompare) {
								result.cards = lib.skill[result.skill].onCompare(player);
								player.logSkill(result.skill);
							} else {
								event.lose_list.push([player, result.cards[0]]);
							}
							event.card1 = result.cards[0];
							// 更新拼点框
							game.broadcastAll(function (eventName) {
								if (!window.decadeUI) return;

								var dialog = ui.dialogs[eventName];
								dialog.$playerCard.classList.add('infohidden');
								dialog.$playerCard.classList.add('infoflip');
							}, event.compareName);
						}
						if (event.localTarget) {
							target.chooseCard('请选择拼点牌', true).set('prompt', false).set('type', 'compare').ai = event.ai;
						}

						"step 3"
						if (event.localTarget) {
							if (result.skill && lib.skill[result.skill] && lib.skill[result.skill].onCompare) {
								target.logSkill(result.skill);
								result.cards = lib.skill[result.skill].onCompare(target);
							} else {
								event.lose_list.push([target, result.cards[0]]);
							}

							event.card2 = result.cards[0];

							// 更新拼点框
							game.broadcastAll(function (eventName) {
								if (!window.decadeUI) return;

								var dialog = ui.dialogs[eventName];
								dialog.$targetCard.classList.add('infohidden');
								dialog.$targetCard.classList.add('infoflip');
							}, event.compareName);
						}
						if (!event.resultOL && event.ol) {
							game.pause();
						}

						"step 4"
						try {
							if (!event.card1) {
								if (event.resultOL[player.playerid].skill && lib.skill[event.resultOL[player.playerid].skill] && lib.skill[event.resultOL[player.playerid].skill].onCompare) {
									player.logSkill(event.resultOL[player.playerid].skill);
									event.resultOL[player.playerid].cards = lib.skill[event.resultOL[player.playerid].skill].onCompare(player);
								} else {
									event.lose_list.push([player, event.resultOL[player.playerid].cards[0]]);
								}
								event.card1 = event.resultOL[player.playerid].cards[0];

								// 更新拼点框
								game.broadcastAll(function (eventName) {
									if (!window.decadeUI) return;

									var dialog = ui.dialogs[eventName];
									dialog.$playerCard.classList.add('infohidden');
									dialog.$playerCard.classList.add('infoflip');
								}, event.compareName);
							};
							if (!event.card2) {
								if (event.resultOL[target.playerid].skill && lib.skill[event.resultOL[target.playerid].skill] && lib.skill[event.resultOL[target.playerid].skill].onCompare) {
									target.logSkill(event.resultOL[target.playerid].skill);
									event.resultOL[target.playerid].cards = lib.skill[event.resultOL[target.playerid].skill].onCompare(player);
								} else {
									event.lose_list.push([target, event.resultOL[target.playerid].cards[0]]);
								}
								event.card2 = event.resultOL[target.playerid].cards[0];
								// 更新拼点框
								game.broadcastAll(function (eventName) {
									if (!window.decadeUI) return;

									var dialog = ui.dialogs[eventName];
									dialog.$targetCard.classList.add('infohidden');
									dialog.$targetCard.classList.add('infoflip');
								}, event.compareName);
							}
							if (!event.card1 || !event.card2) {
								throw ('err');
							}
						} catch (e) {
							console.log(e);
							game.print(e);
							event.finish();
							return;
						}
						if (event.card2.number >= 10 || event.card2.number <= 4) {
							if (target.countCards('h') > 2) {
								event.addToAI = true;
							}
						}
						if (event.lose_list.length) {
							game.loseAsync({
								lose_list: event.lose_list,
							}).setContent('chooseToCompareLose');
						}

						"step 5"
						// 更新拼点框
						game.broadcastAll(function (eventName, player, target, playerCard, targetCard) {
							if (!window.decadeUI) {
								ui.arena.classList.add('thrownhighlight');
								player.$compare(playerCard, target, targetCard);
								return;
							}

							var dialog = ui.dialogs[eventName];
							dialog.playerCard = playerCard.copy();
							dialog.targetCard = targetCard.copy();
						}, event.compareName, player, target, event.card1, event.card2);

						game.log(player, '的拼点牌为', event.card1);
						game.log(target, '的拼点牌为', event.card2);
						var getNum = function (card) {
							for (var i of event.lose_list) {
								if (i[1] == card) return get.number(card, i[0]);
							}
							return get.number(card, false);
						}
						event.num1 = getNum(event.card1);
						event.num2 = getNum(event.card2);
						event.trigger('compare');
						decadeUI.delay(400);

						"step 6"
						event.result = {
							player: event.card1,
							target: event.card2,
							num1: event.num1,
							num2: event.num2
						}
						var str;
						if (event.num1 > event.num2) {
							event.result.bool = true;
							event.result.winner = player;
							str = get.translation(player) + '拼点成功';
							player.popup('胜');
							target.popup('负');
						} else {
							event.result.bool = false;
							str = get.translation(player) + '拼点失败';
							if (event.num1 == event.num2) {
								event.result.tie = true;
								player.popup('平');
								target.popup('平');
							} else {
								event.result.winner = target;
								player.popup('负');
								target.popup('胜');
							}
						}

						// 更新拼点框
						game.broadcastAll(function (str, eventName, result) {
							if (!window.decadeUI) {
								var dialog = ui.create.dialog(str);
								dialog.classList.add('center');
								setTimeout(function (dialog) {
									dialog.close();
								}, 1000, dialog);
								return;
							}

							var dialog = ui.dialogs[eventName];
							dialog.$playerCard.dataset.result = result ? '赢' : '没赢';

							setTimeout(function (dialog, eventName) {
								dialog.close();
								setTimeout(function (dialog) {
									dialog.player.$throwordered2(dialog.playerCard, true);
									dialog.target.$throwordered2(dialog.targetCard, true);
								}, 180, dialog);
								ui.dialogs[eventName] = undefined;

							}, 1400, dialog, eventName);

						}, str, event.compareName, event.result.bool);
						decadeUI.delay(1800);

						"step 7"
						if (typeof event.target.ai.shown == 'number' && event.target.ai.shown <= 0.85 && event.addToAI) {
							event.target.ai.shown += 0.1;
						}
						game.broadcastAll(function () {
							if (!window.decadeUI) ui.arena.classList.remove('thrownhighlight');
						});
						game.addVideo('thrownhighlight2');
						if (event.clear !== false) {
							game.broadcastAll(ui.clear);
						}
						if (typeof event.preserve == 'function') {
							event.preserve = event.preserve(event.result);
						} else if (event.preserve == 'win') {
							event.preserve = event.result.bool;
						} else if (event.preserve == 'lose') {
							event.preserve = !event.result.bool;
						}
					};

					lib.element.content.chooseToCompareMultiple = function () {
						"step 0"
						event.forceDie = true;
						if (player.countCards('h') == 0) {
							event.result = {
								cancelled: true,
								bool: false
							}
							event.finish();
							return;
						}
						for (var i = 0; i < targets.length; i++) {
							if (targets[i].countCards('h') == 0) {
								event.result = {
									cancelled: true,
									bool: false
								}
								event.finish();
								return;
							}
						}
						if (!event.multitarget) {
							targets.sort(lib.sort.seat);
						}
						game.log(player, '对', targets, '发起拼点');

						// 更新拼点框
						if (event.parent.name == null || event.parent.name == 'trigger') {
							event.compareName = event.name;
						} else {
							event.compareName = event.parent.name;
						}

						// 有空重写拼点
						event.addMessageHook('finished', function () {
							var dialog = ui.dialogs[this.compareName];
							if (dialog)
								dialog.close();
						});

						game.broadcastAll(function (player, target, eventName) {
							if (!window.decadeUI) return;

							var dialog = decadeUI.create.compareDialog();
							dialog.caption = get.translation(eventName) + '拼点';
							dialog.player = player;
							dialog.target = target;
							dialog.open();

							decadeUI.delay(400);
							ui.dialogs[eventName] = dialog;
						}, player, targets[0], event.compareName);

						"step 1"
						event._result = [];
						event.list = targets.filter(function (current) {
							return !event.fixedResult || !event.fixedResult[current.playerid];
						});

						if (event.list.length || !event.fixedResult || !event.fixedResult[player.playerid]) {
							if (!event.fixedResult || !event.fixedResult[player.playerid]) event.list.unshift(player);
							player.chooseCardOL(event.list, '请选择拼点牌', true).set('type', 'compare').set('ai', event.ai).set('source', player).aiCard = function (target) {
								var hs = target.getCards('h');
								var event = _status.event;
								event.player = target;
								hs.sort(function (a, b) {
									return event.ai(b) - event.ai(a);
								});
								delete event.player;
								return {
									bool: true,
									cards: [hs[0]]
								};
							};
						}

						"step 2"
						var cards = [];
						var lose_list = [];
						event.lose_list = lose_list;
						event.getNum = function (card) {
							for (var i of event.lose_list) {
								if (i[1].contains && i[1].contains(card)) return get.number(card, i[0]);
							}
							return get.number(card, false);
						};
						if (event.fixedResult && event.fixedResult[player.playerid]) {
							event.list.unshift(player);
							result.unshift({
								bool: true,
								cards: [event.fixedResult[player.playerid]]
							});
							lose_list.push([player, [event.fixedResult[player.playerid]]]);
						} else {
							if (result[0].skill && lib.skill[result[0].skill] && lib.skill[result[0].skill].onCompare) {
								player.logSkill(result[0].skill);
								result[0].cards = lib.skill[result[0].skill].onCompare(player)
							} else lose_list.push([player, result[0].cards]);
						};
						for (var j = 0; j < targets.length; j++) {
							if (event.list.contains(targets[j])) {
								var i = event.list.indexOf(targets[j]);
								if (result[i].skill && lib.skill[result[i].skill] && lib.skill[result[i].skill].onCompare) {
									event.list[i].logSkill(result[i].skill);
									result[i].cards = lib.skill[result[i].skill].onCompare(event.list[i]);
								} else lose_list.push([targets[j], result[i].cards]);
								cards.push(result[i].cards[0]);
							} else if (event.fixedResult && event.fixedResult[targets[j].playerid]) {
								cards.push(event.fixedResult[targets[j].playerid]);
								lose_list.push([targets[j], [event.fixedResult[targets[j].playerid]]]);
							}
						}
						if (lose_list.length) {
							game.loseAsync({
								lose_list: lose_list,
							}).setContent('chooseToCompareLose');
						}
						event.cardlist = cards;
						event.cards = cards;
						event.card1 = result[0].cards[0];
						event.num1 = event.getNum(event.card1);
						event.iwhile = 0;
						event.result = {
							player: event.card1,
							targets: event.cardlist.slice(0),
							num1: [],
							num2: [],
						};
						game.log(player, '的拼点牌为', event.card1);

						// 更新拼点框
						game.broadcastAll(function (eventName, playerCard) {
							if (!window.decadeUI) return;

							var dialog = ui.dialogs[eventName];
							dialog.playerCard = playerCard.copy();
						}, event.compareName, event.card1);

						"step 3"
						if (event.iwhile < targets.length) {
							event.target = targets[event.iwhile];
							// event.target.animate('target');
							// player.animate('target');
							event.card2 = event.cardlist[event.iwhile];
							event.num2 = event.getNum(event.card2);
							game.log(event.target, '的拼点牌为', event.card2);
							player.line(event.target);

							// 更新拼点框
							game.broadcastAll(function (eventName, player, target, playerCard, targetCard) {
								if (!window.decadeUI) {
									player.$compare(playerCard, target, targetCard);
									return;
								}

								var dialog = ui.dialogs[eventName];
								dialog.show();
								dialog.target = target;
								dialog.targetCard = targetCard.copy();
							}, event.compareName, player, event.target, event.card1, event.card2);
							event.trigger('compare');
							decadeUI.delay(400);
						} else {
							// 更新拼点框
							game.broadcastAll(function (eventName) {
								if (!window.decadeUI) return;

								var dialog = ui.dialogs[eventName];
								dialog.close();
								setTimeout(function (dialog) {
									dialog.player.$throwordered2(dialog.playerCard, true);
								}, 110, dialog);

							}, event.compareName);
							event.goto(7);
						}
						"step 4"
						event.result.num1[event.iwhile] = event.num1;
						event.result.num2[event.iwhile] = event.num2;

						var str, result;
						if (event.num1 > event.num2) {
							result = true;
							str = get.translation(player) + '拼点成功';
							player.popup('胜');
							target.popup('负');
						} else {
							result = false;
							str = get.translation(player) + '拼点失败';
							if (event.num1 == event.num2) {
								player.popup('平');
								target.popup('平');
							} else {
								player.popup('负');
								target.popup('胜');
							}
						}

						// 更新拼点框
						game.broadcastAll(function (str, eventName, result) {
							if (!window.decadeUI) {
								var dialog = ui.create.dialog(str);
								dialog.classList.add('center');
								setTimeout(function (dialog) {
									dialog.close();
								}, 1000, dialog);
								return;
							}

							var dialog = ui.dialogs[eventName];
							dialog.$playerCard.dataset.result = result ? '赢' : '没赢';

							setTimeout(function (dialog, eventName) {
								dialog.hide();
								dialog.$playerCard.dataset.result = '';
								setTimeout(function (dialog) {
									dialog.target.$throwordered2(dialog.targetCard, true);
								}, 180, dialog);
							}, 1400, dialog, eventName);

						}, str, event.compareName, result);
						decadeUI.delay(1800);

						"step 5"
						if (event.callback) {
							game.broadcastAll(function (card1, card2) {
								if (!window.decadeUI) {
									if (card1.clone) card1.clone.style.opacity = 0.5;
									if (card2.clone) card2.clone.style.opacity = 0.5;
								}
							}, event.card1, event.card2);
							var next = game.createEvent('compareMultiple');
							next.player = player;
							next.target = event.target;
							next.card1 = event.card1;
							next.card2 = event.card2;
							next.num1 = event.num1;
							next.num2 = event.num2;
							next.setContent(event.callback);
							event.compareMultiple = true;
						}

						"step 6"
						event.iwhile++;
						event.goto(3);
						"step 7"
						game.broadcastAll(ui.clear);
						event.cards.add(event.card1);
					};

					lib.element.content.chooseToGuanxing = function () {
						"step 0"
						if (player.isUnderControl()) {
							game.modeSwapPlayer(player);
						}

						var cards = get.cards(num);
						var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
						if (this.getParent() && this.getParent().name && get.translation(this.getParent().name) != this.getParent().name) {
							guanxing.caption = '【' + get.translation(this.getParent().name) + '】';
						} else {
							guanxing.caption = "请按顺序排列牌。";
						}
						game.broadcast(function (player, cards, callback) {
							if (!window.decadeUI) return;
							var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
							guanxing.caption = '【观星】';
							guanxing.callback = callback;
						}, player, cards, guanxing.callback);

						event.switchToAuto = function () {
							var cards = guanxing.cards[0].concat();
							var cheats = [];
							var judges = player.node.judges.childNodes;

							if (judges.length) cheats = decadeUI.get.cheatJudgeCards(cards, judges, true);
							if (cards.length) {
								for (var i = 0; i >= 0 && i < cards.length; i++) {
									if (get.value(cards[i], player) >= 5) {
										cheats.push(cards[i]);
										cards.splice(i, 1)
									}
								}
							}

							var time = 500;
							for (var i = 0; i < cheats.length; i++) {
								setTimeout(function (card, index, finished) {
									guanxing.move(card, index, 0);
									if (finished) guanxing.finishTime(1000);
								}, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
								time += 500;
							}

							for (var i = 0; i < cards.length; i++) {
								setTimeout(function (card, index, finished) {
									guanxing.move(card, index, 1);
									if (finished) guanxing.finishTime(1000);
								}, time, cards[i], i, (i >= cards.length - 1));
								time += 500;
							}
						}

						if (event.isOnline()) {
							event.player.send(function () {
								if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
							}, event.player);

							event.player.wait();
							decadeUI.game.wait();
						} else if (!(typeof event.isMine == 'function' && event.isMine())) {
							event.switchToAuto();
						}
						"step 1"
						player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
						game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) + '张牌置于牌堆底');
						game.updateRoundNumber()
					};

					lib.element.player.setIdentity = function (identity) {
						if (!identity) identity = this.identity;

						this.node.identity.dataset.color = identity;
						if (get.mode() == 'guozhan') {
							if (identity == 'ye' && get.is.jun(this)) this.identity = identity = lib.character[this.name1][1];
							this.group = identity;
							this.node.identity.firstChild.innerHTML = get.translation(identity);
							return this;
						}

						if (get.is.jun(this)) {
							this.node.identity.firstChild.innerHTML = '君';
						} else {
							this.node.identity.firstChild.innerHTML = get.translation(identity);
						}

						return this;

						// if(!identity) identity = this.identity;

						// var identityColor = identity;
						// var identityNode = this.node.identity;

						// switch(get.mode()){
						// case 'identity':
						// if (_status.mode == 'purple' && identity.indexOf('cai') >= 0) {
						// if (this.identity[0] == 'r') {
						// identity = 'cai';
						// } else {
						// identity = 'cai2';
						// this.classList.add('opposite-camp');
						// this.finalSide = false;
						// }

						// }
						// break;

						// case 'guozhan':
						// if (identity == 'ye' && get.is.jun(this)) {
						// this.identity = identity = lib.character[this.name1][1];
						// }
						// this.group = identity;
						// break;
						// case 'versus':
						// this.finalSide = this.side;
						// if (this.side === false) this.classList.add('opposite-camp');
						// break;
						// }

						// this.finalShownIdentity = identity;
						// identityNode.dataset.color = identityColor;
						// if (lib.huanhuazhizhan) return this;

						// if (decadeUI.config.campIdentityImageMode){
						// var that = this;
						// var image = new Image();
						// var url = extensionPath + 'image/decoration/identity_' + decadeUI.getPlayerIdentity(that, identity) + '.png';
						// that.finalShownIdentity = identity;

						// image.identity = identity;
						// image.onerror = function(){
						// if (this.identity != that.finalShownIdentity) return;

						// that.node.identity.firstChild.style.opacity = '';
						// that.node.identity.firstChild.innerHTML = get.mode() == 'boss' ? get.translation(that.finalShownIdentity) :
						// decadeUI.getPlayerIdentity(that, that.finalShownIdentity, true, true);
						// };

						// that.node.identity.firstChild.innerHTML = '';
						// that.node.identity.firstChild.style.opacity = '0';
						// that.node.identity.style.backgroundImage = 'url("' + url + '")';
						// image.src = url;

						// } else {
						// this.node.identity.firstChild.innerHTML = get.is.jun(this) ? '君' : get.translation(identity);
						// }

						// return this;
					};

					lib.element.player.addSkill = function (skill) {
						var skill = playerAddSkillFunction.apply(this, arguments);
						if (!Array.isArray(skill)) {
							var character1 = lib.character[this.name];
							var character2 = lib.character[this.name2];
							if ((!character1 || !character1[3].contains(skill)) && (!character2 || !character2[3].contains(skill))) {
								this.node.gainSkill.gain(skill);
							}
						}

						return skill;
					};

					lib.element.player.removeSkill = function (skill) {
						var skill = playerRemoveSkillFunction.apply(this, arguments);
						if (!Array.isArray(skill)) {
							if (this.node.gainSkill.skills && this.node.gainSkill.skills.contains(skill)) {
								this.node.gainSkill.lose(skill);
							}
						}

						return skill;
					};

					lib.element.player.getState = function () {
						var state = base.lib.element.player.getState.apply(this, arguments);
						state.seat = this.seat;
						return state;
					};

					lib.element.player.setModeState = function (info) {
						if (info && info.seat) {
							if (!this.node.seat) this.node.seat = decadeUI.element.create('seat', this);
							this.node.seat.innerHTML = get.cnNumber(info.seat, true);
						}

						if (base.lib.element.player.setModeState) {
							return base.lib.element.player.setModeState.apply(this, arguments);
						} else {
							return this.init(info.name, info.name2);
						}
					};

					lib.element.player.prompt = function (str, nature) {
						var node;
						if (this.node.prompt) {
							node = this.node.prompt;
							node.innerHTML = '';
							node.className = 'damage normal-font damageadded';
						} else {
							node = ui.create.div('.damage.normal-font', this);
							this.node.prompt = node;
							ui.refresh(node);
							node.classList.add('damageadded');
						}
						node.innerHTML = str;
						node.dataset.text = str;
						node.dataset.nature = nature || 'soil';
						node.style.animation = 'open-fade-in 0.6s';
					};

					lib.element.player.$damagepop = function (num, nature, font, nobroadcast) {
						if (typeof num == 'number' || typeof num == 'string') {
							game.addVideo('damagepop', this, [num, nature, font]);
							if (nobroadcast !== false) {
								game.broadcast(function (player, num, nature, font) {
									player.$damagepop(num, nature, font);
								}, this, num, nature, font);
							}

							var node;
							if (this.popupNodeCache && this.popupNodeCache.length) {
								node = this.popupNodeCache.shift();
							} else {
								node = decadeUI.element.create('damage');
							}

							if (font) {
								node.classList.add('normal-font');
							} else {
								node.classList.remove('normal-font');
							}

							if (typeof num == 'number') {
								node.popupNumber = num;
								if (num == Infinity) {
									num = '+∞'
								} else if (num == -Infinity) {
									num = '-∞';
								} else if (num > 0) {
									num = '+' + num;
								}

							} else {
								node.popupNumber = null;
							}

							node.textContent = num;
							node.dataset.text = num;
							node.nature = nature || 'soil';
							this.damagepopups.push(node);
						}

						if (this.damagepopups.length && !this.damagepopLocked) {
							var node = this.damagepopups.shift();
							this.damagepopLocked = true;
							if (this != node.parentNode) this.appendChild(node);

							var player = this;
							if (typeof node.popupNumber == 'number') {
								var popupNum = node.popupNumber;
								if (popupNum < 0) {
									switch (node.nature) {
										case 'thunder':
											if (popupNum <= -2) {
												decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play6' }, { scale: 0.8, parent: player });
											} else {
												decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play5' }, { scale: 0.8, parent: player });
											}
											break;
										case 'fire':
											if (popupNum <= -2) {
												decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play4' }, { scale: 0.8, parent: player });
											} else {
												decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play3' }, { scale: 0.8, parent: player });
											}
											break;
										case 'water':
											break;
										default:
											if (popupNum <= -2) {
												decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play2' }, { scale: 0.8, parent: player });
											} else {
												decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play1' }, { scale: 0.8, parent: player });
											}
											break;
									}
								} else {
									if (node.nature == 'wood') {
										decadeUI.animation.playSpine('effect_zhiliao', { scale: 0.7, parent: player });
									}
								}
							}

							node.style.animation = 'open-fade-in-out 1.2s';
							setTimeout(function (player, node) {
								if (!player.popupNodeCache) player.popupNodeCache = [];
								node.style.animation = '';
								player.popupNodeCache.push(node);
							}, 1210, player, node);

							setTimeout(function (player) {
								player.damagepopLocked = false;
								player.$damagepop();
							}, 500, player);
						}
					};

					lib.element.player.$dieflip = function () {
						if (!decadeUI.config.playerDieEffect && playerDieFlipFunction) playerDieFlipFunction.apply(this, arguments);
					};

					Object.defineProperties(lib.element.player, {
						$dieAfter: {
							configurable: true,
							get: function () {
								return ride.lib.element.player.$dieAfter;
							},
							set: function (value) {
								base.lib.element.player.$dieAfter = value;
							}
						}
					});

					lib.element.player.$compare = function (card1, target, card2) {
						game.broadcast(function (player, target, card1, card2) {
							player.$compare(card1, target, card2);
						}, this, target, card1, card2);
						game.addVideo('compare', this, [get.cardInfo(card1), target.dataset.position, get.cardInfo(card2)]);
						var player = this;
						target.$throwordered2(card2.copy(false));
						player.$throwordered2(card1.copy(false));
					};

					lib.element.player.$disableEquip = function (skill) {
						game.broadcast(function (player, skill) {
							player.$disableEquip(skill);
						}, this, skill);
						var player = this;
						if (!player.storage.disableEquip) player.storage.disableEquip = [];
						player.storage.disableEquip.add(skill);
						player.storage.disableEquip.sort();
						var pos = {
							equip1: '武器栏',
							equip2: '防具栏',
							equip3: '+1马栏',
							equip4: '-1马栏',
							equip5: '宝物栏'
						}[skill];
						if (!pos) return;
						var card = game.createCard('feichu_' + skill, pos, '');
						card.fix();
						card.style.transform = '';
						card.classList.remove('drawinghidden');
						card.classList.add('feichu');
						delete card._transform;


						var iconName = {
							equip1: 'icon feichu icon-saber',
							equip2: 'icon feichu icon-shield',
							equip3: 'icon feichu icon-mount',
							equip4: 'icon feichu icon-mount',
							equip5: 'icon feichu icon-treasure'
						}[skill];

						if (iconName) {
							var icon = decadeUI.element.create(iconName, card);
							icon.style.zIndex = '1';
						}

						var equipNum = get.equipNum(card);
						var equipped = false;
						for (var i = 0; i < player.node.equips.childNodes.length; i++) {
							if (get.equipNum(player.node.equips.childNodes[i]) >= equipNum) {
								player.node.equips.insertBefore(card, player.node.equips.childNodes[i]);
								equipped = true;
								break;
							}
						}
						if (!equipped) {
							player.node.equips.appendChild(card);
							if (_status.discarded) {
								_status.discarded.remove(card);
							}
						}
						return player;
					};

					lib.element.card.copy = function () {
						var clone = cardCopyFunction.apply(this, arguments);
						clone.nature = this.nature;

						var res = dui.statics.cards;
						var asset = res[clone.name];
						if (!res.READ_OK)
							return clone;

						if (asset && !asset.loaded && clone.classList.contains('decade-card')) {
							if (asset.loaded == undefined) {
								var image = asset.image;
								image.addEventListener('error', function () {
									clone.style.background = asset.rawUrl;
									clone.classList.remove('decade-card');
								});
							} else {
								clone.style.background = asset.rawUrl;
								clone.classList.remove('decade-card');
							}
						}

						return clone;
					};


				},
				dialog: {
					create: function (className, parentNode, tagName) {
						var element = !tagName ? document.createElement('div') : document.createElement(tagName);
						for (var i in decadeUI.dialog) {
							if (decadeUI.dialog[i]) element[i] = decadeUI.dialog[i];
						}

						element.listens = {};
						for (var i in decadeUI.dialog.listens) {
							if (decadeUI.dialog.listens[i]) element.listens[i] = decadeUI.dialog.listens[i];
						}

						element.listens._dialog = element;
						element.listens._list = [];

						if (className) element.className = className;
						if (parentNode) parentNode.appendChild(element);

						return element;
					},
					open: function () {
						if (this == decadeUI.dialog) return console.error('undefined');
					},
					show: function () {
						if (this == decadeUI.dialog) return console.error('undefined');

						this.classList.remove('hidden');
					},
					hide: function () {
						if (this == decadeUI.dialog) return console.error('undefined');

						this.classList.add('hidden');
					},
					animate: function (property, duration, toArray, fromArrayOptional) {
						if (this == decadeUI.dialog) return console.error('undefined');
						if (property == null || duration == null || toArray == null) return console.error('arguments');

						var propArray = property.replace(/\s*/g, '').split(',');
						if (!propArray || propArray.length == 0) return console.error('property');

						var realDuration = 0;
						if (duration.lastIndexOf('s') != -1) {
							if (duration.lastIndexOf('ms') != -1) {
								duration = duration.replace(/ms/, '');
								duration = parseInt(duration);
								if (isNaN(duration)) return console.error('duration');
								realDuration = duration;
							} else {
								duration = duration.replace(/s/, '');
								duration = parseFloat(duration);
								if (isNaN(duration)) return console.error('duration');
								realDuration = duration * 1000;
							}
						} else {
							duration = parseInt(duration);
							if (isNaN(duration)) return console.error('duration');
							realDuration = duration;
						}

						if (fromArrayOptional) {
							for (var i = 0; i < propArray.length; i++) {
								this.style.setProperty(propArray[i], fromArrayOptional[i]);
							}
						}

						var duraBefore = this.style.transitionDuration;
						var propBefore = this.style.transitionProperty;
						this.style.transitionDuration = realDuration + 'ms';
						this.style.transitionProperty = property;

						ui.refresh(this);
						for (var i = 0; i < propArray.length; i++) {
							this.style.setProperty(propArray[i], toArray[i]);
						}

						var restore = this;
						setTimeout(function () {
							restore.style.transitionDuration = duraBefore;
							restore.style.transitionProperty = propBefore;
						}, realDuration);
					},
					close: function (delayTime, fadeOut) {
						if (this == decadeUI.dialog) return console.error('undefined');
						this.listens.clear();

						if (!this.parentNode) return;

						if (fadeOut === true && delayTime) {
							this.animate('opacity', delayTime, 0);
						}

						if (delayTime) {
							var remove = this;
							delayTime = (typeof delayTime == 'number') ? delayTime : parseInt(delayTime);
							setTimeout(function () {
								if (remove.parentNode) remove.parentNode.removeChild(remove);
							}, delayTime);
							return;
						}

						this.parentNode.removeChild(this);
						return;
					},
					listens: {
						add: function (listenElement, event, func, useCapture) {
							if (!this._dialog || !this._list) return console.error('undefined');
							if (!(listenElement instanceof HTMLElement) || !event || (typeof func !== 'function')) return console.error('arguments');

							this._list.push(new Array(listenElement, event, func));
							listenElement.addEventListener(event, func);
						},
						remove: function (listenElementOptional, eventOptional, funcOptional) {
							if (!this._dialog || !this._list) return console.error('undefined');

							var list = this._list;
							if (listenElementOptional && eventOptional && funcOptional) {
								var index = list.indexOf(new Array(listenElementOptional, eventOptional, funcOptional));
								if (index != -1) {
									list[index][0].removeEventListener(list[index][1], list[index][2]);
									list.splice(index, 1);
									return;
								}
							} else if (listenElementOptional && eventOptional) {
								for (var i = list.length - 1; i >= 0; i--) {
									if (list[i][0] == listenElementOptional && list[i][1] == eventOptional) {
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							} else if (listenElementOptional && funcOptional) {
								for (var i = list.length - 1; i >= 0; i--) {
									if (list[i][0] == listenElementOptional && list[i][2] == funcOptional) {
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							} else if (eventOptional && funcOptional) {
								for (var i = list.length - 1; i >= 0; i--) {
									if (list[i][1] == eventOptional && list[i][2] == funcOptional) {
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							} else if (listenElementOptional) {
								for (var i = list.length - 1; i >= 0; i--) {
									if (list[i][0] == listenElementOptional) {
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							} else if (eventOptional) {
								for (var i = list.length - 1; i >= 0; i--) {
									if (list[i][1] == eventOptional) {
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							} else if (funcOptional) {
								for (var i = list.length - 1; i >= 0; i--) {
									if (list[i][2] == funcOptional) {
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							}
						},
						clear: function () {
							if (!this._dialog || !this._list) return console.error('undefined');

							var list = this._list;
							for (var i = list.length - 1; i >= 0; i--) {
								list[i][0].removeEventListener(list[i][1], list[i][2]);
								list[i] = undefined;
							}
							list.length = 0;
						}
					}
				},
				animate: {
					check: function () {
						if (!ui.arena) return false;
						if (this.updates == undefined) this.updates = [];
						if (this.canvas == undefined) {
							this.canvas = ui.arena.appendChild(document.createElement('canvas'));
							this.canvas.id = 'decadeUI-canvas-arena';
						}

						return true;
					},
					add: function (frameFunc) {
						if (typeof frameFunc != 'function') return;
						if (!this.check()) return;

						var obj = {
							inits: [],
							update: frameFunc,
							id: decadeUI.getRandom(0, 100),
						};

						if (arguments.length > 2) {
							obj.inits = new Array(arguments.length - 2);
							for (var i = 2; i < arguments.length; i++) {
								obj.inits[i - 2] = arguments[i];
							}
						}

						this.updates.push(obj);
						if (this.frameId == undefined) this.frameId = requestAnimationFrame(this.update.bind(this));
					},
					update: function () {
						var frameTime = performance.now();
						var delta = frameTime - (this.frameTime == undefined ? frameTime : this.frameTime);

						this.frameTime = frameTime;
						var e = {
							canvas: this.canvas,
							context: this.canvas.getContext('2d'),
							deltaTime: delta,
							save: function () {
								this.context.save();
								return this.context;
							},
							restore: function () {
								this.context.restore();
								return this.context;
							},
							drawLine: function (x1, y1, x2, y2, color, lineWidth) {
								if (x1 == null || y1 == null) throw 'arguments';

								var context = this.context;
								context.beginPath();

								if (color) context.strokeStyle = color;
								if (lineWidth) context.lineWidth = lineWidth;

								if (x2 == null || y2 == null) {
									context.lineTo(x1, y1);
								} else {
									context.moveTo(x1, y1);
									context.lineTo(x2, y2);
								}

								context.stroke();
							},
							drawRect: function (x, y, width, height, color, lineWidth) {
								if (x == null || y == null || width == null || height == null) throw 'arguments';

								var ctx = this.context;
								ctx.beginPath();

								if (color) ctx.strokeStyle = color;
								if (lineWidth) ctx.lineWidth = lineWidth;
								ctx.rect(x, y, width, height);
								ctx.stroke();
							},
							drawText: function (text, font, color, x, y, textAlign, textBaseline, stroke) {
								if (!text) return;
								if (x == null || y == null) throw 'x or y';
								var context = this.context;

								if (font) context.font = font;
								if (textAlign) context.textAlign = textAlign;
								if (textBaseline) context.textBaseline = textBaseline;
								if (color) {
									if (!stroke) context.fillStyle = color;
									else context.strokeStyle = color;
								}

								if (!stroke) context.fillText(text, x, y);
								else context.strokeText(text, x, y);
							},
							drawStrokeText: function (text, font, color, x, y, textAlign, textBaseline) {
								this.drawText(text, font, color, x, y, textAlign, textBaseline, true);
							},
							fillRect: function (x, y, width, height, color) {
								if (color) this.context.fillStyle = color;
								this.context.fillRect(x, y, width, height);
							},
						}

						if (!decadeUI.dataset.animSizeUpdated) {
							decadeUI.dataset.animSizeUpdated = true;
							e.canvas.width = e.canvas.parentNode.offsetWidth;
							e.canvas.height = e.canvas.parentNode.offsetHeight;
						}

						e.canvas.height = e.canvas.height;
						var args;
						var task;
						for (var i = 0; i < this.updates.length; i++) {
							task = this.updates[i];
							args = Array.from(task.inits);
							args.push(e);
							e.save();
							if (task.update.apply(task, args)) {
								this.updates.remove(task); i--;
							}
							e.restore();
						}

						if (this.updates.length == 0) {
							this.frameId = undefined;
							this.frameTime = undefined;
							return;
						}

						this.frameId = requestAnimationFrame(this.update.bind(this));
					},
				},
				ResizeSensor: (function () {
					function ResizeSensor(element) {
						this.element = element;
						this.width = element.clientWidth || 1;
						this.height = element.clientHeight || 1;
						this.maximumWidth = 10000 * (this.width);
						this.maximumHeight = 10000 * (this.height);
						this.events = [];

						var expand = document.createElement('div');
						expand.style.cssText = 'position:absolute;top:0;bottom:0;left:0;right:0;z-index=-10000;overflow:hidden;visibility:hidden;transition:all 0s;';
						var shrink = expand.cloneNode(false);

						var expandChild = document.createElement('div');
						expandChild.style.cssText = 'transition: all 0s !important; animation: none !important;';
						var shrinkChild = expandChild.cloneNode(false);

						expandChild.style.width = this.maximumWidth + 'px';
						expandChild.style.height = this.maximumHeight + 'px';
						shrinkChild.style.width = '250%';
						shrinkChild.style.height = '250%';

						expand.appendChild(expandChild);
						shrink.appendChild(shrinkChild);
						element.appendChild(expand);
						element.appendChild(shrink);
						if (expand.offsetParent != element) {
							element.style.position = 'relative';
						}

						expand.scrollTop = shrink.scrollTop = this.maximumHeight;
						expand.scrollLeft = shrink.scrollLeft = this.maximumWidth;

						var sensor = this;
						sensor.onscroll = function (e) {
							sensor.w = sensor.element.clientWidth || 1;
							sensor.h = sensor.element.clientHeight || 1;

							if (sensor.w != sensor.width || sensor.h != sensor.height) {
								sensor.width = sensor.w;
								sensor.height = sensor.h;
								sensor.dispatchEvent();
							}

							expand.scrollTop = shrink.scrollTop = sensor.maximumHeight;
							expand.scrollLeft = shrink.scrollLeft = sensor.maximumWidth;
						};

						expand.addEventListener('scroll', sensor.onscroll);
						shrink.addEventListener('scroll', sensor.onscroll);
						sensor.expand = expand;
						sensor.shrink = shrink;
					}

					ResizeSensor.prototype.addListener = function (callback, capture) {
						if (this.events == undefined) this.events = [];
						this.events.push({
							callback: callback,
							capture: capture,
						});
					};

					ResizeSensor.prototype.dispatchEvent = function () {
						var capture = true;
						var evt;

						for (var i = 0; i < this.events.length; i++) {
							evt = this.events[i];
							if (evt.capture) {
								evt.callback();
							} else {
								capture = false;
							}
						}

						if (!capture) {
							requestAnimationFrame(this.dispatchFrameEvent.bind(this));
						}
					};

					ResizeSensor.prototype.dispatchFrameEvent = function () {
						var evt;
						for (var i = 0; i < this.events.length; i++) {
							evt = this.events[i];
							if (!evt.capture)
								evt.callback();
						}
					};

					ResizeSensor.prototype.close = function () {
						this.expand.removeEventListener('scroll', this.onscroll);
						this.shrink.removeEventListener('scroll', this.onscroll);

						if (!this.element) {
							this.element.removeChild(this.expand);
							this.element.removeChild(this.shrink);
						}

						this.events = null;
					};

					return ResizeSensor;
				})(),
				sheet: {
					init: function () {
						if (!this.sheetList) {
							this.sheetList = [];
							for (var i = 0; i < document.styleSheets.length; i++) {
								if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('extension/' + encodeURI(extensionName)) != -1) {
									this.sheetList.push(document.styleSheets[i]);
								}
							}
						}

						if (this.sheetList) delete this.init;
					},
					getStyle: function (selector, cssName) {
						if (!this.sheetList) this.init();
						if (!this.sheetList) throw 'sheet not loaded';
						if ((typeof selector != 'string') || !selector) throw 'parameter "selector" error';
						if (!this.cachedSheet) this.cachedSheet = {};
						if (this.cachedSheet[selector]) return this.cachedSheet[selector];


						var sheetList = this.sheetList;
						var sheet;
						var shouldBreak = false;

						for (var j = sheetList.length - 1; j >= 0; j--) {
							if (typeof cssName == 'string') {
								cssName = cssName.replace(/.css/, '') + '.css';
								for (var k = j; k >= 0; k--) {
									if (sheetList[k].href.indexOf(cssName) != -1) {
										sheet = sheetList[k];
									}
								}

								shouldBreak = true;
								if (!sheet) throw 'cssName not found';
							} else {
								sheet = sheetList[j];
							}

							for (var i = 0; i < sheet.cssRules.length; i++) {
								if (!(sheet.cssRules[i] instanceof CSSMediaRule)) {
									if (sheet.cssRules[i].selectorText == selector) {
										this.cachedSheet[selector] = sheet.cssRules[i].style;
										return sheet.cssRules[i].style;
									}
								} else {
									var rules = sheet.cssRules[i].cssRules;
									for (var j = 0; j < rules.length; j++) {
										if (rules[j].selectorText == selector) {
											return rules[j].style;
										}
									}
								}
							}


							if (shouldBreak) break;
						}

						return null;
					},
					insertRule: function (rule, index, cssName) {
						if (!this.sheetList) this.init();
						if (!this.sheetList) throw 'sheet not loaded';
						if ((typeof rule != 'string') || !rule) throw 'parameter "rule" error';

						var sheet;
						if (typeof cssName == 'string') {
							for (var j = sheetList.length - 1; j >= 0; j--) {
								cssName = cssName.replace(/.css/, '') + '.css';
								if (sheetList[j].href.indexOf(cssName) != -1) {
									sheet = sheetList[k];
								}
							}

							if (!sheet) throw 'cssName not found';
						}

						if (!sheet) sheet = this.sheetList[this.sheetList.length - 1];
						var inserted = 0;
						if (typeof index == 'number') {
							inserted = sheet.insertRule(rule, index);
						} else {
							inserted = sheet.insertRule(rule, sheet.cssRules.length);
						}

						return sheet.cssRules[inserted].style;
					}
				},
				layout: {
					update: function () {
						this.updateHand();
						this.updateDiscard();

					},
					updateHand: function () {
						if (!game.me)
							return;

						var handNode = ui.handcards1;
						if (!handNode)
							return console.error('hand undefined');

						var card;
						var cards = [];
						var childs = handNode.childNodes;
						for (var i = 0; i < childs.length; i++) {
							card = childs[i];
							if (!card.classList.contains('removing')) {
								cards.push(card);
							} else {
								card.scaled = false;
							}
						}

						if (!cards.length)
							return;

						var bounds = dui.boundsCaches.hand;
						bounds.check();

						var pw = bounds.width;
						var ph = bounds.height;
						var cw = bounds.cardWidth;
						var ch = bounds.cardHeight;
						var cs = bounds.cardScale;

						var csw = cw * cs;
						var x;
						var y = Math.round((ch * cs - ch) / 2);

						var xMargin = csw + 2;
						var xStart = (csw - cw) / 2;
						var totalW = cards.length * csw + (cards.length - 1) * 2;
						var limitW = pw;
						var expand;

						if (totalW > limitW) {
							xMargin = csw - Math.abs(limitW - csw * cards.length) / (cards.length - 1);
							if (lib.config.fold_card) {
								var foldCardMinWidth = lib.config['extension_十周年UI_foldCardMinWidth'];
								var min = cs;
								if (foldCardMinWidth == 'cardWidth') {
									min *= cw;
								} else {
									min *= (foldCardMinWidth && foldCardMinWidth.length ? parseInt(foldCardMinWidth) : 81);
								}
								if (xMargin < min) {
									expand = true;
									xMargin = min;
								}
							}
						} else {
							xStart += (limitW - totalW) / 2;
						}

						var card;
						for (var i = 0; i < cards.length; i++) {
							x = Math.round(xStart + i * xMargin);
							card = cards[i];
							card.tx = x;
							card.ty = y;
							card.scaled = true;
							card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
							card._transform = card.style.transform;
						}

						if (expand) {
							ui.handcards1Container.style.overflowX = 'scroll';
							ui.handcards1Container.style.overflowY = 'hidden';
							handNode.style.width = Math.round(cards.length * xMargin + (csw - xMargin)) + 'px';
						} else {
							ui.handcards1Container.style.overflowX = '';
							ui.handcards1Container.style.overflowY = '';
							handNode.style.width = '100%';
						}
					},
					updateDiscard: function () {
						if (!ui.thrown)
							ui.thrown = [];

						for (var i = ui.thrown.length - 1; i >= 0; i--) {
							if (ui.thrown[i].classList.contains('drawingcard') ||
								ui.thrown[i].classList.contains('removing') ||
								ui.thrown[i].parentNode != ui.arena || ui.thrown[i].fixed) {
								ui.thrown.splice(i, 1);
							} else {
								ui.thrown[i].classList.remove('removing');
							}
						}

						if (!ui.thrown.length)
							return;

						var cards = ui.thrown;
						var bounds = dui.boundsCaches.arena;
						bounds.check();

						var pw = bounds.width;
						var ph = bounds.height;
						var cw = bounds.cardWidth;
						var ch = bounds.cardHeight;
						var cs = bounds.cardScale;

						var csw = cw * cs;
						var x;
						var y = Math.round((ph - ch) / 2);

						var xMargin = csw + 2;
						var xStart = (csw - cw) / 2;
						var totalW = cards.length * csw + (cards.length - 1) * 2;
						var limitW = pw;

						if (totalW > limitW) {
							xMargin = csw - Math.abs(limitW - csw * cards.length) / (cards.length - 1);
						} else {
							xStart += (limitW - totalW) / 2;
						}

						var card;
						for (var i = 0; i < cards.length; i++) {
							x = Math.round(xStart + i * xMargin);
							card = cards[i];
							card.tx = x;
							card.ty = y;
							card.scaled = true;
							card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
						}
					},
					clearout: function (card) {
						if (!card)
							return;

						if (card.fixed || card.classList.contains('removing'))
							return;

						if (ui.thrown.indexOf(card) == -1) {
							ui.thrown.splice(0, 0, card);
							dui.queueNextFrameTick(dui.layoutDiscard, dui);
						}

						if (!card.classList.contains('invalided')) {

							var event = _status.event;
							var judging = event.triggername == 'judge' || event.name == 'judge';
							if (event.name == 'judge' && !ui.clear.delay) {
								ui.clear.delay = 'judge';
								event.parent.addMessageHook('finished', function () {
									if (ui.clear.delay == 'judge') {
										ui.clear.delay = false;
										ui.clear();
									}
								});
							}
							if (ui.clear.delay || (judging && !event.finished))
								return;
						}

						card.classList.add('invalided');
						setTimeout(function (card) {
							card.remove();
							dui.queueNextFrameTick(dui.layoutDiscard, dui);
						}, 2333, card);
					},
					delayClear: function () {
						var timestamp = 500;
						var nowTime = new Date().getTime();
						if (this._delayClearTimeout) {
							clearTimeout(this._delayClearTimeout);
							timestamp = nowTime - this._delayClearTimeoutTime;
							if (timestamp > 1000) {
								this._delayClearTimeout = null;
								this._delayClearTimeoutTime = null;
								ui.clear();
								return;
							}
						} else {
							this._delayClearTimeoutTime = nowTime;
						}

						this._delayClearTimeout = setTimeout(function () {
							decadeUI.layout._delayClearTimeout = null;
							decadeUI.layout._delayClearTimeoutTime = null;
							ui.clear();
						}, timestamp);
					},
					invalidate: function () {
						this.invalidateHand();
						this.invalidateDiscard();
					},
					invalidateHand: function (debugName) {
						//和上下面的有点重复，有空合并
						var timestamp = 40;
						var nowTime = new Date().getTime();
						if (this._handcardTimeout) {
							clearTimeout(this._handcardTimeout);
							timestamp = nowTime - this._handcardTimeoutTime;
							if (timestamp > 180) {
								this._handcardTimeout = null;
								this._handcardTimeoutTime = null;
								this.updateHand();
								return;
							}
						} else {
							this._handcardTimeoutTime = nowTime;
						}

						this._handcardTimeout = setTimeout(function () {
							decadeUI.layout._handcardTimeout = null;
							decadeUI.layout._handcardTimeoutTime = null;
							decadeUI.layout.updateHand();
						}, timestamp);
					},
					invalidateDiscard: function () {
						var timestamp = (ui.thrown && ui.thrown.length > 15) ? 80 : 40;
						var nowTime = new Date().getTime();
						if (this._discardTimeout) {
							clearTimeout(this._discardTimeout);
							timestamp = nowTime - this._discardTimeoutTime;
							if (timestamp > 180) {
								this._discardTimeout = null;
								this._discardTimeoutTime = null;
								this.updateDiscard();
								return;
							}
						} else {
							this._discardTimeoutTime = nowTime;
						}

						this._discardTimeout = setTimeout(function () {
							decadeUI.layout._discardTimeout = null;
							decadeUI.layout._discardTimeoutTime = null;
							decadeUI.layout.updateDiscard();
						}, timestamp);
					},
					resize: function () {
						if (decadeUI.isMobile()) {
							ui.arena.classList.add('dui-mobile');
							ui.window.classList.add('dui-mobile');
						}
						else {
							ui.arena.classList.remove('dui-mobile');
							ui.window.classList.remove('dui-mobile');
						}

						var set = decadeUI.dataset;
						set.animSizeUpdated = false;
						set.bodySize.updated = false;

						var caches = decadeUI.boundsCaches;
						for (var key in caches)
							caches[key].updated = false;

						var buttonsWindow = decadeUI.sheet.getStyle('#window > .dialog.popped .buttons:not(.smallzoom)');
						if (!buttonsWindow) {
							buttonsWindow = decadeUI.sheet.insertRule('#window > .dialog.popped .buttons:not(.smallzoom) { zoom: 1; }');
						}

						var buttonsArena = decadeUI.sheet.getStyle('#arena:not(.choose-character) .buttons:not(.smallzoom)');
						if (!buttonsArena) {
							buttonsArena = decadeUI.sheet.insertRule('#arena:not(.choose-character) .buttons:not(.smallzoom) { zoom: 1; }');
						}

						decadeUI.zooms.card = decadeUI.getCardBestScale();
						if (ui.me) {
							var height = Math.round(decadeUI.getHandCardSize().height * decadeUI.zooms.card + 30.4) + 'px';
							ui.me.style.height = height;
						}

						if (buttonsArena) {
							buttonsArena.zoom = decadeUI.zooms.card;
						}

						if (buttonsWindow) {
							buttonsWindow.zoom = decadeUI.zooms.card;
						}

						decadeUI.layout.invalidate();
					},

				},
				handler: {
					handMousewheel: function (e) {
						if (!ui.handcards1Container) return console.error('ui.handcards1Container');

						var hand = ui.handcards1Container;
						if (hand.scrollNum == void 0) hand.scrollNum = 0;
						if (hand.lastFrameTime == void 0) hand.lastFrameTime = performance.now();

						function handScroll() {
							var now = performance.now();
							var delta = now - hand.lastFrameTime;
							var num = Math.round(delta / 16 * 16);
							hand.lastFrameTime = now;

							if (hand.scrollNum > 0) {
								num = Math.min(hand.scrollNum, num);
								hand.scrollNum -= num;
							} else {
								num = Math.min(-hand.scrollNum, num);
								hand.scrollNum += num;
								num = -num;
							}

							if (hand.scrollNum == 0) {
								hand.frameId = void 0;
								hand.lastFrameTime = void 0;
							} else {
								hand.frameId = requestAnimationFrame(handScroll);
								ui.handcards1Container.scrollLeft += num;
							}
						}

						if (e.wheelDelta > 0) {
							hand.scrollNum -= 84;
						} else {
							hand.scrollNum += 84;
						}

						if (hand.frameId == void 0) {
							hand.frameId = requestAnimationFrame(handScroll);
						}
					},
					touchScroll: function (e) {
						if (_status.mousedragging) return;
						if (_status.draggingtouchdialog) return;
						if (!_status.dragged) {
							if (Math.abs(e.touches[0].clientX / game.documentZoom - this.startX) > 10 ||
								Math.abs(e.touches[0].clientY / game.documentZoom - this.startY) > 10) {
								_status.dragged = true;
							}
						}
						if ((this == ui.handcards1Container || this == ui.handcards2Container) && !this.style.overflowX == 'scroll') {
							e.preventDefault();
						} else if (lib.device == 'ios' && this.scrollHeight <= this.offsetHeight + 5 && this.scrollWidth <= this.offsetWidth + 5) {
							e.preventDefault();
						} else {
							delete _status._swipeorigin;
							e.stopPropagation();
						}
					},
				},
				zooms: {
					body: 1,
					card: 1,
				},
				isMobile: function () {
					return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent));
				},
				delay: function (milliseconds) {
					if (typeof milliseconds != 'number') throw 'milliseconds is not number';
					if (_status.paused) return;
					game.pause();
					_status.timeout = setTimeout(game.resume, milliseconds);
				},

				queueNextTick: function (callback, ctx) {
					if (!dui._tickEntries)
						dui._tickEntries = [];

					dui._tickEntries.push({
						ctx: ctx,
						callback: callback
					});

					if (dui._queueTick)
						return;

					dui._queueTick = Promise.resolve().then(function () {
						dui._queueTick = null;
						var entries = dui._tickEntries;
						dui._tickEntries = [];
						for (var i = 0; i < entries.length; i++)
							entries[i].callback.call(entries[i].ctx);
					});
				},
				queueNextFrameTick: function (callback, ctx) {
					if (!dui._frameTickEntries)
						dui._frameTickEntries = [];

					dui._frameTickEntries.push({
						ctx: ctx,
						callback: callback
					});

					if (dui._queueFrameTick)
						return;

					dui._queueFrameTick = requestAnimationFrame(function () {
						dui._queueFrameTick = null;
						setTimeout(function (entries) {
							for (var i = 0; i < entries.length; i++)
								entries[i].callback.call(entries[i].ctx);

						}, 0, dui._frameTickEntries);
						dui._frameTickEntries = [];
					})
				},

				layoutHand: function () {
					dui.layout.updateHand();
				},

				layoutHandDraws: function (cards) {
					var bounds = dui.boundsCaches.hand;
					bounds.check();

					var x, y;
					var pw = bounds.width;
					var ph = bounds.height;
					var cw = bounds.cardWidth;
					var ch = bounds.cardHeight;
					var cs = bounds.cardScale;
					var csw = cw * cs;
					var xStart, xMargin;

					var draws = [];
					var card;
					var clone;
					var source = cards.duiMod;
					if (source && source != game.me) {
						source.checkBoundsCache();
						xMargin = 27;
						xStart = source.cacheLeft - bounds.x - csw / 2 - (cw - csw) / 2;
						var totalW = xMargin * cards.length + (csw - xMargin);
						var limitW = source.cacheWidth + csw;
						if (totalW > limitW) {
							xMargin = csw - Math.abs(limitW - csw * cards.length) / (cards.length - 1);
						} else {
							xStart += (limitW - totalW) / 2;
						}

						y = Math.round((source.cacheTop - bounds.y - 30 + (source.cacheHeight - ch) / 2));
						for (var i = 0; i < cards.length; i++) {
							x = Math.round(xStart + i * xMargin);
							card = cards[i];
							card.tx = x;
							card.ty = y;
							card.fixed = true;
							card.scaled = true;
							card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
						}
						return;
					} else {
						for (var i = 0; i < cards.length; i++) {
							card = cards[i];
							clone = card.clone;
							if (clone && !clone.fixed && clone.parentNode == ui.arena) {
								x = Math.round(clone.tx - bounds.x);
								y = Math.round(clone.ty - (bounds.y + 30));
								card.tx = x;
								card.ty = y;
								card.scaled = true;
								card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
							} else {
								draws.push(card);
							}
						}
					}

					y = Math.round(-ch * cs * 2);
					xMargin = csw * 0.5;
					xStart = (pw - xMargin * (draws.length + 1)) / 2 - (cw - csw) / 2;

					for (var i = 0; i < draws.length; i++) {
						x = Math.round(xStart + i * xMargin);
						card = draws[i];
						card.tx = x;
						card.ty = y;
						card.scaled = true;
						card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
					}
				},

				layoutDrawCards: function (cards, player, center) {
					var bounds = dui.boundsCaches.arena;
					if (!bounds.updated)
						bounds.update();

					player.checkBoundsCache();
					var playerX = player.cacheLeft;
					var playerY = player.cacheTop;
					var playerW = player.cacheWidth;
					var playerH = player.cacheHeight;

					var pw = bounds.width;
					var ph = bounds.height;
					var cw = bounds.cardWidth;
					var ch = bounds.cardHeight;
					var cs = bounds.cardScale;
					var csw = cw * cs;

					var xMargin = 27;
					var xStart = (center ? (pw - playerW) / 2 : playerX) - csw / 2 - (cw - csw) / 2;
					var totalW = xMargin * cards.length + (csw - xMargin);
					var limitW = playerW + csw;

					if (totalW > limitW) {
						xMargin = csw - Math.abs(limitW - csw * cards.length) / (cards.length - 1);
					} else {
						xStart += (limitW - totalW) / 2;
					}

					var x;
					var y;
					if (center)
						y = Math.round((ph - ch) / 2);
					else
						y = Math.round(playerY + (playerH - ch) / 2);

					var card;
					for (var i = 0; i < cards.length; i++) {
						x = Math.round(xStart + i * xMargin);
						card = cards[i];
						card.tx = x;
						card.ty = y;
						card.scaled = true;
						card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
					}
				},

				layoutDiscard: function () {
					dui.layout.updateDiscard();
				},

				delayRemoveCards: function (cards, delay, delay2) {
					if (!Array.isArray(cards))
						cards = [cards];

					setTimeout(function (cards, delay2) {
						var remove = function (cards) {
							for (var i = 0; i < cards.length; i++)
								cards[i].remove();
						};

						if (delay2 == null) {
							remove(cards);
							return;
						}

						for (var i = 0; i < cards.length; i++)
							cards[i].classList.add('removing');

						setTimeout(remove, delay2, cards)
					}, delay, cards, delay2)
				},

				tryAddPlayerCardUseTag: function (card, player, event) {
					if (!card)
						return;

					if (!player)
						return;

					if (!event)
						return;

					var noname;
					var tagText = '';
					var tagNode = card.querySelector('.used-info');
					if (tagNode == null)
						tagNode = card.appendChild(dui.element.create('used-info'));

					card.$usedtag = tagNode;
					var blameEvent;
					if (event.blameEvent)
						event = event.blameEvent;

					switch (event.name.toLowerCase()) {
						case 'usecard':
							if (event.targets.length == 1) {
								if (event.targets[0] == player)
									tagText = '对自己';
								else
									tagText = '对' + get.translation(event.targets[0]);
							} else {
								tagText = '使用';
							}
						case 'respond':
							if (tagText == '')
								tagText = '打出';

							var cardname = event.card.name;
							var cardnature = event.card.nature;
							if ((lib.config.cardtempname != 'off') && ((card.name != cardname) || (card.nature != cardnature))) {
								if (!card._tempName) card._tempName = ui.create.div('.temp-name', card);

								var tempname = get.translation(cardname);
								if (cardnature) {
									card._tempName.dataset.nature = cardnature;
									if (cardname == 'sha') {
										tempname = get.translation(cardnature) + tempname;
									}
								}


								card._tempName.textContent = tempname;
								card._tempName.tempname = tempname;
							}

							if (duicfg.cardUseEffect && event.card && (!event.card.cards || event.card.cards.length == 1)) {
								var name = event.card.name;
								var nature = event.card.nature;

								switch (name) {
									case 'effect_caochuanjiejian':
										decadeUI.animation.cap.playSpineTo(card, 'effect_caochuanjiejian');
										break;
									case 'sha':
										switch (nature) {
											case 'thunder':
												decadeUI.animation.cap.playSpineTo(card, 'effect_leisha');
												break;
											case 'fire':
												decadeUI.animation.cap.playSpineTo(card, 'effect_huosha');
												break;
											default:
												if (get.color(card) == 'red') {
													decadeUI.animation.cap.playSpineTo(card, 'effect_hongsha');
												} else {
													decadeUI.animation.cap.playSpineTo(card, 'effect_heisha');
												}
												break;
										}
										break;
									case 'shan':
										decadeUI.animation.cap.playSpineTo(card, 'effect_shan');
										break;
									case 'tao':
										decadeUI.animation.cap.playSpineTo(card, 'effect_tao', { scale: 0.9 });
										break;
									case 'tiesuo':
										decadeUI.animation.cap.playSpineTo(card, 'effect_tiesuolianhuan', { scale: 0.9 });
										break;
									case 'jiu':
										decadeUI.animation.cap.playSpineTo(card, 'effect_jiu', { y: [-30, 0.5] });
										break;
									case 'kaihua':
										decadeUI.animation.cap.playSpineTo(card, 'effect_shushangkaihua');
										break;
									case 'wuzhong':
										decadeUI.animation.cap.playSpineTo(card, 'effect_wuzhongshengyou');
										break;
									case 'wuxie':
										decadeUI.animation.cap.playSpineTo(card, 'effect_wuxiekeji', { y: [10, 0.5], scale: 0.9 });
										break;
									// case 'nanman':
									// decadeUI.animation.cap.playSpineTo(card, 'effect_nanmanruqin', { scale: 0.45 });
									// break;
									case 'wanjian':
										decadeUI.animation.cap.playSpineTo(card, 'effect_wanjianqifa', { scale: 0.78 });
										break;
									case 'wugu':
										decadeUI.animation.cap.playSpineTo(card, 'effect_wugufengdeng', { y: [10, 0.5] });
										break;
									// case 'taoyuan':
									// decadeUI.animation.cap.playSpineTo(card, 'effect_taoyuanjieyi', { y:[10, 0.5] });
									// break;
									case 'shunshou':
										decadeUI.animation.cap.playSpineTo(card, 'effect_shunshouqianyang');
										break;
									case 'huogong':
										decadeUI.animation.cap.playSpineTo(card, 'effect_huogong', { x: [8, 0.5], scale: 0.5 });
										break;
									case 'guohe':
										decadeUI.animation.cap.playSpineTo(card, 'effect_guohechaiqiao', { y: [10, 0.5] });
										break;
									case 'yuanjiao':
										decadeUI.animation.cap.playSpineTo(card, 'effect_yuanjiaojingong');
										break;
									case 'zhibi':
										decadeUI.animation.cap.playSpineTo(card, 'effect_zhijizhibi');
										break;
									case 'zhulu_card':
										decadeUI.animation.cap.playSpineTo(card, 'effect_zhulutianxia');
										break;
								}
							}
							break;
						case 'useskill':
							tagText = '发动';
							break;
						case 'die':
							tagText = '弃置';
							card.classList.add('invalided');
							dui.layout.delayClear();
							break;
						case 'lose':
							if (event.parent && event.parent.name == 'discard' && event.parent.parent) {
								var skillEvent = event.parent.parent.parent;
								if (skillEvent) {
									tagText = lib.translate[skillEvent.name != 'useSkill' ? skillEvent.name : skillEvent.skill];
									if (!tagText)
										tagText = '';

									tagText += '弃置';
									break;
								}
							}
						case 'discard':
							tagText = '弃置';
							break;
						case 'phaseJudge':
							tagText = '即将生效';
							break;
						case 'judge':
							noname = true;
							tagText = event.judgestr + '的判定牌';
							event.addMessageHook('judgeResult', function () {
								var event = this;
								var card = event.result.card.clone;
								var apcard = event.apcard;

								var tagText = '';
								var tagNode = card.querySelector('.used-info');
								if (tagNode == null)
									tagNode = card.appendChild(dui.element.create('used-info'));

								var action;
								var judgeValue;
								var getEffect = event.judge2;
								if (getEffect) {
									judgeValue = getEffect(event.result);
								} else {
									judgeValue = decadeUI.get.judgeEffect(event.judgestr, event.result.judge);
								}

								if ((typeof judgeValue == 'boolean')) {
									judgeValue = judgeValue ? 1 : -1;
								} else {
									judgeValue = event.result.judge;
								}

								if (judgeValue >= 0) {
									action = 'play4';
									tagText = '判定生效';
								} else {
									action = 'play5';
									tagText = '判定失效';
								}

								if (apcard && apcard._ap)
									apcard._ap.stopSpineAll();
								if (apcard && apcard._ap && apcard == card) {
									apcard._ap.playSpine({
										name: 'effect_panding',
										action: action
									});
								} else {
									decadeUI.animation.cap.playSpineTo(card, {
										name: 'effect_panding',
										action: action
									});
								}

								event.apcard = undefined;
								tagNode.textContent = get.translation(event.judgestr) + tagText;
							});

							if (duicfg.cardUseEffect) {
								decadeUI.animation.cap.playSpineTo(card, {
									name: 'effect_panding',
									action: 'play',
									loop: true
								});

								event.apcard = card;
							}
							break;
						default:
							tagText = get.translation(event.name);
							if (tagText == event.name)
								tagText = '';
							break;
					}

					tagNode.textContent = (noname ? '' : get.translation(player)) + tagText;
				},

				getRandom: function (min, max) {
					if (min == null) {
						min = -2147483648;
					}

					if (max == null) {
						max = 2147483648;
					}

					if (min > max) {
						min = min + max;
						max = min - max;
						min = min - max;
					}

					var diff = 0;
					if (min < 0) {
						diff = min;
						min = 0;
						max -= diff;
					}

					return Math.floor(Math.random() * (max + 1 - min)) + min + diff;
				},
				getCardBestScale: function (size) {
					if (!(size && size.height)) size = decadeUI.getHandCardSize();

					var bodySize = decadeUI.get.bodySize();
					return Math.min(bodySize.height * (decadeUI.isMobile() ? 0.23 : 0.18) / size.height, 1);
				},
				getHandCardSize: function (canUseDefault) {
					var style = decadeUI.sheet.getStyle('.media_defined > .card');
					if (style == null) style = decadeUI.sheet.getStyle('.hand-cards > .handcards > .card');
					if (style == null) return canUseDefault ? { width: 108, height: 150 } : { width: 0, height: 0 };
					var size = { width: parseFloat(style.width), height: parseFloat(style.height) };
					return size;
				},
				getMapElementPos: function (elementFrom, elementTo) {
					if (!(elementFrom instanceof HTMLElement) || !(elementTo instanceof HTMLElement)) return console.error('arguments');
					var rectFrom = elementFrom.getBoundingClientRect();
					var rectTo = elementTo.getBoundingClientRect();
					var pos = { x: rectFrom.left - rectTo.left, y: rectFrom.top - rectTo.top };
					pos.left = pos.x;
					pos.top = pos.y;
					return pos;
				},
				getPlayerIdentity: function (player, identity, chinese, isMark) {
					if (!(player instanceof HTMLElement && get.itemtype(player) == 'player')) throw 'player';
					if (!identity) identity = player.identity;


					var mode = get.mode();
					var translated = false;
					if (!chinese) {
						switch (mode) {
							case 'identity': case 'huanhuazhizhan': case 'th_mougong':
								if (!player.isAlive() || player.identityShown || player == game.me) {
									identity = (player.special_identity ? player.special_identity : identity).replace(/identity_/, '');
								}

								break;

							case 'guozhan':
								if (identity == 'unknown') {
									identity = player.wontYe() ? lib.character[player.name1][1] : 'ye';
								}

								if (get.is.jun(player)) identity += 'jun';
								break;

							case 'versus':
								if (!game.me) break;
								switch (_status.mode) {
									case 'standard':
										switch (identity) {
											case 'trueZhu': return 'shuai';
											case 'trueZhong': return 'bing';
											case 'falseZhu': return 'jiang';
											case 'falseZhong': return 'zu';
										}
										break;
									case 'three':
									case 'four':
									case 'guandu':
										if (get.translation(player.side + 'Color') == 'wei') identity += '_blue';
										break;

									case 'two':
										var side = player.finalSide ? player.finalSide : player.side;
										identity = game.me.side == side ? 'friend' : 'enemy';
										break;
								}

								break;
							case 'doudizhu':
								identity = identity == 'zhu' ? 'dizhu' : 'nongmin';
								break;
							case 'boss':
								switch (identity) {
									case 'zhu': identity = 'boss'; break;
									case 'zhong': identity = 'cong'; break;
									case 'cai': identity = 'meng'; break;
								}
								break;
						}
					} else {
						switch (mode) {
							case 'identity': case 'huanhuazhizhan': case 'th_mougong':
								if (identity.indexOf('cai') < 0) {
									if (isMark) {
										if (player.special_identity) identity = player.special_identity + '_bg';
									} else {
										identity = player.special_identity ? player.special_identity : identity + '2';
									}
								}

								// ok
								break;

							case 'guozhan':
								if (identity == 'unknown') {
									identity = player.wontYe() ? lib.character[player.name1][1] : 'ye';
								}

								if (get.is.jun(player)) {
									identity = isMark ? '君' : get.translation(identity) + '君';
								} else {
									identity = identity == 'ye' ? '野心家' : (identity == 'qun' ? '群雄' : get.translation(identity) + '将');
								}
								translated = true;
								break;

							case 'versus':
								translated = true;
								if (!game.me) break;
								switch (_status.mode) {
									case 'three':
									case 'standard':
									case 'four':
									case 'guandu':
										switch (identity) {
											case 'zhu': identity = '主公'; break;
											case 'zhong': identity = '忠臣'; break;
											case 'fan': identity = '反贼'; break;
											default: translated = false; break;
										}
										break;

									case 'two':
										var side = player.finalSide ? player.finalSide : player.side;
										identity = game.me.side == side ? '友方' : '敌方';
										break;

									case 'siguo':
									case 'jiange':
										identity = get.translation(identity) + '将';
										break;

									default:
										translated = false;
										break;
								}
								break;

							case 'doudizhu':
								identity += '2';
								break;
							case 'boss':
								translated = true;
								switch (identity) {
									case 'zhu': identity = 'BOSS'; break;
									case 'zhong': identity = '仆从'; break;
									case 'cai': identity = '盟军'; break;
									default: translated = false; break;
								}
								break;
						}

						if (!translated) identity = get.translation(identity);
						if (isMark) identity = identity[0];
					}

					return identity;
				},

				create: {
					skillDialog: function () {
						var dialog = document.createElement('div');
						dialog.className = 'skill-dialog';

						var extend = {
							caption: undefined,
							tip: undefined,

							open: function (customParent) {
								if (!customParent) {
									var size = decadeUI.get.bodySize();
									this.style.minHeight = (parseInt(size.height * 0.42)) + 'px';
									if (this.parentNode != ui.arena) ui.arena.appendChild(this);
								}

								this.style.animation = 'open-dialog 0.4s';
								return this;
							},
							show: function () {
								this.style.animation = 'open-dialog 0.4s';;
							},
							hide: function () {
								this.style.animation = 'close-dialog 0.1s forwards';
							},
							close: function () {
								var func = function (e) {
									if (e.animationName != 'close-dialog') return;
									this.remove();
									this.removeEventListener('animationend', func);
								};

								var animation = 'close-dialog';
								if (this.style.animationName == animation) {
									setTimeout(function (dialog) {
										dialog.remove();
									}, 100, this);
								} else {
									this.style.animation = animation + ' 0.1s forwards';
									this.addEventListener('animationend', func);
								}
							},

							appendControl: function (text, clickFunc) {
								var control = document.createElement('div');
								control.className = 'control-button';
								control.textContent = text;
								if (clickFunc) {
									control.addEventListener('click', clickFunc);
								}

								return this.$controls.appendChild(control);
							},

							$caption: decadeUI.element.create('caption', dialog),
							$content: decadeUI.element.create('content', dialog),
							$tip: decadeUI.element.create('tip', dialog),
							$controls: decadeUI.element.create('controls', dialog),
						}; decadeUI.get.extend(dialog, extend);

						Object.defineProperties(dialog, {
							caption: {
								configurable: true,
								get: function () {
									return this.$caption.innerHTML;
								},
								set: function (value) {
									if (this.$caption.innerHTML == value) return;
									this.$caption.innerHTML = value;
								},
							},
							tip: {
								configurable: true,
								get: function () {
									return this.$tip.innerHTML;
								},
								set: function (value) {
									if (this.$tip.innerHTML == value) return;
									this.$tip.innerHTML = value;
								},
							},
						});

						return dialog;
					},

					compareDialog: function (player, target) {
						var dialog = decadeUI.create.skillDialog();
						dialog.classList.add('compare');
						dialog.$content.classList.add('buttons');

						var extend = {
							player: undefined,
							target: undefined,
							playerCard: undefined,
							targetCard: undefined,

							$player: decadeUI.element.create('player-character player1', dialog.$content),
							$target: decadeUI.element.create('player-character player2', dialog.$content),
							$playerCard: decadeUI.element.create('player-card', dialog.$content),
							$targetCard: decadeUI.element.create('target-card', dialog.$content),
							$vs: decadeUI.element.create('vs', dialog.$content),
						}; decadeUI.get.extend(dialog, extend);

						decadeUI.element.create('image', dialog.$player),
							decadeUI.element.create('image', dialog.$target),

							Object.defineProperties(dialog, {
								player: {
									configurable: true,
									get: function () {
										return this._player;
									},
									set: function (value) {
										if (this._player == value) return;
										this._player = value;

										if (value == null || value.isUnseen()) {
											this.$player.firstChild.style.backgroundImage = '';
										} else {
											this.$player.firstChild.style.backgroundImage = (value.isUnseen(0) ? value.node.avatar2 : value.node.avatar).style.backgroundImage;
										}

										if (value) this.$playerCard.dataset.text = get.translation(value) + '发起';
									},
								},
								target: {
									configurable: true,
									get: function () {
										return this._target;
									},
									set: function (value) {
										if (this._target == value) return;
										this._target = value;
										if (value == null || value.isUnseen()) {
											this.$target.firstChild.style.backgroundImage = '';
										} else {
											this.$target.firstChild.style.backgroundImage = (value.isUnseen(0) ? value.node.avatar2 : value.node.avatar).style.backgroundImage;
										}

										if (value) this.$targetCard.dataset.text = get.translation(value);
									},
								},
								playerCard: {
									configurable: true,
									get: function () {
										return this._playerCard;
									},
									set: function (value) {
										if (this._playerCard == value) return;
										if (this._playerCard) this._playerCard.remove();
										this._playerCard = value;
										if (value) this.$playerCard.appendChild(value);
									},
								},
								targetCard: {
									configurable: true,
									get: function () {
										return this._targetCard;
									},
									set: function (value) {
										if (this._targetCard == value) return;
										if (this._targetCard) this._targetCard.remove();
										this._targetCard = value;
										if (value) this.$targetCard.appendChild(value);
									},
								},
							});

						if (player) dialog.player = player;
						if (target) dialog.target = target;

						return dialog;
					},

				},

				get: {


					judgeEffect: function (name, value) {
						switch (name) {
							case 'caomu': case '草木皆兵':
							case 'fulei': case '浮雷':
							case 'shandian': case '闪电':
							case 'bingliang': case '兵粮寸断':
							case 'lebu': case '乐不思蜀':
								return value < 0 ? true : false;
						}

						return value;
					},

					isWebKit: function () {
						return document.body.style.WebkitBoxShadow !== undefined;
					},

					lerp: function (min, max, fraction) {
						return (max - min) * fraction + min;
					},

					ease: function (fraction) {
						if (!decadeUI.get._bezier3) decadeUI.get._bezier3 = new duilib.CubicBezierEase(0.25, 0.1, 0.25, 1);
						return decadeUI.get._bezier3.ease(fraction);
					},

					extend: function (target, source) {
						if (source === null || typeof source !== 'object') return target;

						var keys = Object.keys(source);
						var i = keys.length;
						while (i--) {
							target[keys[i]] = source[keys[i]];
						}

						return target;
					},

					bodySize: function () {
						var size = decadeUI.dataset.bodySize;
						if (!size.updated) {
							var body = document.body;
							size.updated = true;
							size.height = body.clientHeight;
							size.width = body.clientWidth;
						}

						return size;
					},

					bestValueCards: function (cards, player) {
						if (!player) player = _status.event.player;

						var matchs = [];
						var basics = [];
						var equips = [];
						var hasEquipSkill = player.hasSkill('xiaoji');
						cards.sort(function (a, b) {
							return get.value(b, player) - get.value(a, player);
						});

						for (var i = 0; i >= 0 && i < cards.length; i++) {
							var limited = false;
							switch (get.type(cards[i])) {
								case 'basic':
									for (var j = 0; j < basics.length; j++) {
										if (!cards[i].toself && basics[j].name == cards[i].name) {
											limited = true;
											break;
										}
									}

									if (!limited) basics.push(cards[i]);
									break;

								case 'equip':
									if (hasEquipSkill) break;
									for (var j = 0; j < equips.length; j++) {
										if (get.subtype(equips[j]) == get.subtype(cards[i])) {
											limited = true;
											break;
										}
									}

									if (!limited) equips.push(cards[i]);
									break;
							}

							if (!limited) {
								matchs.push(cards[i]);
								cards.splice(i--, 1);
							}
						}

						cards.sort(function (a, b) {
							return get.value(b, player) - get.value(a, player);
						});

						cards = matchs.concat(cards);
						return cards;
					},
					cheatJudgeCards: function (cards, judges, friendly) {
						if (!cards || !judges) throw arguments;

						var cheats = [];
						var judgeCost;
						for (var i = 0; i < judges.length; i++) {
							var judge = get.judge(judges[i]);
							if (typeof judge != 'function') {
								judge = function () {
									return 1;
								};
							}
							cards.sort(function (a, b) {
								return friendly ? judge(b) - judge(a) : judge(a) - judge(b);
							});

							judgeCost = judge(cards[0]);
							if ((friendly && judgeCost >= 0) || (!friendly && judgeCost < 0)) {
								cheats.push(cards.shift());
							} else {
								break;
							}
						}

						return cheats;
					},
					elementLeftFromWindow: function (element) {
						var left = element.offsetLeft;
						var current = element.offsetParent;

						while (current != null) {
							left += current.offsetLeft;
							current = current.offsetParent;
						}

						return left;
					},
					elementTopFromWindow: function (element) {
						var top = element.offsetTop;
						var current = element.offsetParent;

						while (current != null) {
							top += current.offsetTop;
							current = current.offsetParent;
						}

						return top;
					},
					handcardInitPos: function () {
						var hand = dui.boundsCaches.hand;
						if (!hand.updated)
							hand.update();

						var cardW = hand.cardWidth;
						var cardH = hand.cardHeight;
						var scale = hand.cardScale;

						var x = -Math.round((cardW - cardW * scale) / 2);
						var y = ((cardH * scale - cardH) / 2);

						return {
							x: x,
							y: y,
							scale: scale
						};
					},
				},

				set: (function (set) {
					set.activeElement = function (element) {
						var deactive = dui.$activeElement;
						dui.$activeElement = element;
						if (deactive && deactive != element && (typeof deactive.ondeactive == 'function')) {
							deactive.ondeactive();
						}

						if (element && element != deactive && (typeof element.onactive == 'function')) {
							element.onactive();
						}
					};
					return set;
				})({}),
				statics: {
					cards: (function (cards) {
						var readFiles = function (files, entry) {
							var index, cardname, filename;
							var cards = dui.statics.cards;
							var format = duicfg.cardPrettify;
							var prefix = decadeUIPath + 'image/card/';
							cards.READ_OK = true;
							if (format == null)
								format = 'webp';
							if (format === 'off')
								return;

							format = '.' + format.toLowerCase();
							for (var i = 0; i < files.length; i++) {
								filename = entry ? files[i].name : files[i];
								index = filename.lastIndexOf(format);
								if (index == -1)
									continue;

								cardname = filename.substring(0, index);
								cards[cardname] = {
									url: prefix + filename,
									name: cardname,
									loaded: true,
								};
							}
						};

						if (window.fs) {
							fs.readdir(__dirname + '/' + decadeUIPath + 'image/card/', function (err, files) {
								if (err)
									return;

								readFiles(files);
							});
						} else if (window.resolveLocalFileSystemURL) {
							resolveLocalFileSystemURL(decadeUIPath + 'image/card/', function (entry) {
								var reader = entry.createReader();
								reader.readEntries(function (entries) {
									readFiles(entries, true);
								});
							});
						}
						return cards;
					})({}),
					// images: (function(images){
					// var readFiles = function (files, entry, prefix) {
					// var index, name, filename;
					// var images = dui.statics.images;
					// images.READ_OK = true;
					// for (var i = 0; i < files.length; i++) {
					// filename = entry ? files[i].name : files[i];
					// index = filename.lastIndexOf('.png');
					// if (index == -1)
					// continue;

					// name = filename.substring(0, index);
					// images[name] = prefix + filename;
					// }
					// };

					// var prefix = decadeUIPath + 'assets/image/';
					// if (window.fs) {
					// prefix = __dirname + '/' + prefix;
					// fs.readdir(prefix, function(err, files){
					// if (err)
					// return;

					// readFiles(files, false, prefix);
					// });
					// } else if (window.resolveLocalFileSystemURL) {
					// resolveLocalFileSystemURL(prefix, function(entry) {
					// var reader = entry.createReader();
					// reader.readEntries(function(entries){
					// readFiles(entries, true, prefix);
					// });
					// });
					// }
					// return images;
					// })({}),
					handTips: [],

				},

				dataset: {
					animSizeUpdated: false,
					bodySizeUpdated: false,
					bodySize: {
						height: 1,
						width: 1,
						updated: false,
					},
				},
			};


			dui.showHandTip = function (text) {
				var tip;
				var tips = this.statics.handTips;
				for (var i = 0; i < tips.length; i++) {
					if (tip == undefined && tips[i].closed) {
						tip = tips[i];
						tip.closed = false;
					} else {
						tips[i].hide();
					}
				}

				if (tip == undefined) {
					tip = dui.element.create('hand-tip', ui.arena);
					tips.unshift(tip);
					tip.clear = function () {
						var nodes = this.childNodes;
						for (var i = 0; i < nodes.length; i++)
							nodes[i].textContent = '';

						this.dataset.text = '';
					};
					tip.setText = function (text, type) {
						this.clear();
						this.appendText(text, type);
					};
					tip.setInfomation = function (text) {
						if (this.$info == null)
							this.$info = dui.element.create('hand-tip-info', ui.arena);

						this.$info.innerHTML = text;
					};
					tip.appendText = function (text, type) {
						if (text == undefined || text === '')
							return;
						if (type == undefined)
							type = '';

						var nodes = this.childNodes;
						for (var i = 0; i < nodes.length; i++) {
							if (nodes[i].textContent == '') {
								nodes[i].textContent = text;
								nodes[i].dataset.type = type;
								return nodes[i];
							}
						}

						var span = document.createElement('span');
						span.textContent = text;
						span.dataset.type = type;
						return this.appendChild(span);
					};
					tip.strokeText = function () {
						this.dataset.text = this.innerText;
					};
					tip.show = function () {
						this.classList.remove('hidden');
						if (this.$info && this.$info.innerHTML)
							this.$info.show();
					};
					tip.hide = function () {
						this.classList.add('hidden');
						if (this.$info)
							this.$info.hide();
					};
					tip.close = function () {
						this.closed = true;
						this.hide();
						if (tip.$info)
							tip.$info.innerHTML = '';
						var tips = dui.statics.handTips;
						for (var i = 0; i < tips.length; i++) {
							if (tips[i].closed)
								continue;

							tips[i].show();
							return;
						}
					};
					tip.isEmpty = function () {
						var nodes = this.childNodes;
						for (var i = 0; i < nodes.length; i++) {
							if (nodes[i].textContent != '')
								return false;
						}

						return true;
					};
				}
				tip.setText(text);
				tip.show();
				return tip;
			};

			decadeUI.BoundsCache = (function () {
				function BoundsCache(element, updateBefore) {
					this.element = element;
					this.updateBefore = updateBefore;
					this.updated = false;
					Object.defineProperties(this, {
						x: {
							configurable: true,
							get: function () {
								if (!this.updated) this.update();
								return this._x;
							},
							set: function (value) {
								this._x == value;
							}
						},
						y: {
							configurable: true,
							get: function () {
								if (!this.updated) this.update();
								return this._y;
							},
							set: function (value) {
								this._y == value;
							}
						},
						width: {
							configurable: true,
							get: function () {
								if (!this.updated) this.update();
								return this._width;
							},
							set: function (value) {
								this._width == value;
							}
						},
						height: {
							configurable: true,
							get: function () {
								if (!this.updated) this.update();
								return this._height;
							},
							set: function (value) {
								this._height == value;
							}
						},
					});
				};

				BoundsCache.prototype.check = function () {
					if (!this.updated)
						this.update();
				};
				BoundsCache.prototype.update = function () {
					if (this.updateBefore)
						this.updateBefore();

					var element = this.element;
					this.updated = true;
					if (element == undefined) return;
					this._x = element.offsetLeft;
					this._y = element.offsetTop;
					this._width = element.offsetWidth;
					this._height = element.offsetHeight;
				};

				return BoundsCache;
			})();

			decadeUI.boundsCaches = (function (boundsCaches) {
				boundsCaches.window = new decadeUI.BoundsCache(null, function () {
					this.element = ui.window;
				});
				boundsCaches.arena = new decadeUI.BoundsCache(null, function () {
					this.element = ui.arena;
					if (ui.arena == null)
						return;

					this.cardScale = dui.getCardBestScale();
					if (this.cardWidth != null)
						return;

					var childs = ui.arena.childNodes;
					for (var i = 0; i < childs.length; i++) {
						if (childs[i].classList.contains('card')) {
							this.cardWidth = childs[i].offsetWidth;
							this.cardHeight = childs[i].offsetHeight;
							return;
						}
					}

					var card = dui.element.create('card');
					card.style.opacity = 0;
					ui.arena.appendChild(card);
					this.cardWidth = card.offsetWidth;
					this.cardHeight = card.offsetHeight;
					card.remove();
				});
				boundsCaches.hand = new decadeUI.BoundsCache(null, function () {
					this.element = ui.me;
					if (ui.handcards1 == null)
						return;

					this.cardScale = dui.getCardBestScale();
					if (this.cardWidth != null)
						return;

					var childs = ui.handcards1.childNodes;
					for (var i = 0; i < childs.length; i++) {
						if (childs[i].classList.contains('card')) {
							this.cardWidth = childs[i].offsetWidth;
							this.cardHeight = childs[i].offsetHeight;
							return;
						}
					}

					var card = dui.element.create('card');
					card.style.opacity = 0;
					ui.handcards1.appendChild(card);
					this.cardWidth = card.offsetWidth;
					this.cardHeight = card.offsetHeight;
					card.remove();
				});

				return boundsCaches;
			})({});

			decadeUI.element = {
				base: {
					removeSelf: function (milliseconds) {
						var remove = this;
						if (milliseconds) {
							milliseconds = (typeof milliseconds == 'number') ? milliseconds : parseInt(milliseconds);
							setTimeout(function () {
								if (remove.parentNode) remove.parentNode.removeChild(remove);
							}, milliseconds);
							return;
						}

						if (remove.parentNode) remove.parentNode.removeChild(remove);
						return;
					}
				},
				create: function (className, parentNode, tagName) {
					var tag = tagName == void 0 ? 'div' : tagName;
					var element = document.createElement(tag);
					element.view = {};

					for (var key in this.base) {
						element[key] = this.base[key];
					}

					if (className)
						element.className = className;

					if (parentNode)
						parentNode.appendChild(element);

					return element;
				},
				clone: function (element) {

				},
			};

			decadeUI.game = {
				loop: function () {
					if (game.looping) return false;
					game.looping = true;
					var event = _status.event;
					var step = event.step;
					var source = event.source;
					var player = event.player;
					var target = event.target;
					var targets = event.targets;
					var card = event.card;
					var cards = event.cards;
					var skill = event.skill;
					var forced = event.forced;
					var num = event.num;
					var trigger = event._trigger;
					var result = event._result;
					if (decadeUI.eventDialog) {
						decadeUI.game.wait();
						return false;
					}

					if (!game.loopTime)
						game.loopTime = performance.now();
					if ((_status.paused2 || _status.imchoosing) && !lib.status.dateDelaying) {
						lib.status.dateDelaying = new Date();
					}

					if (_status.paused || _status.paused2 || _status.over) {
						game.loopTime = undefined;
						return false;
					}

					if (_status.paused3) {
						_status.paused3 = 'paused';
						game.loopTime = undefined;
						return false;
					}
					if (lib.status.dateDelaying) {
						lib.status.dateDelayed += lib.getUTC(new Date()) - lib.getUTC(lib.status.dateDelaying);
						lib.status.dateDelaying = undefined;
					}

					if (event.next.length > 0) {
						var next = event.next.shift();
						if (next.player && next.player.skipList.contains(next.name)) {
							event.trigger(next.name + 'Skipped');
							next.player.skipList.remove(next.name);
							if (lib.phaseName.contains(next.name)) next.player.getHistory('skipped').add(next.name);
						} else {
							next.parent = event;
							_status.event = next;
						}
					} else if (event.finished) {
						if (event._triggered == 1) {
							if (event.type == 'card') event.trigger('useCardToOmitted');
							event.trigger(event.name + 'Omitted');
							event._triggered = 4;
						} else if (event._triggered == 2) {
							if (event.type == 'card') event.trigger('useCardToEnd');
							event.trigger(event.name + 'End');
							event._triggered = 3;
						} else if (event._triggered == 3) {
							if (event.type == 'card') event.trigger('useCardToAfter');
							event.trigger(event.name + 'After');
							event._triggered++;
						} else if (event.after && event.after.length) {
							var next = event.after.shift();
							if (next.player && next.player.skipList.contains(next.name)) {
								event.trigger(next.name + 'Skipped');
								next.player.skipList.remove(next.name);
								if (lib.phaseName.contains(next.name)) next.player.getHistory('skipped').add(next.name)
							} else {
								next.parent = event;
								_status.event = next;
							}
						} else {
							if (event.triggerMessage)
								event.triggerMessage('finished');

							if (event.parent) {
								if (event.result) event.parent._result = event.result;
								_status.event = event.parent;
							} else {
								game.loopTime = undefined;
								game.loopLocked = false;
								return false;
							}
						}
					} else {
						if (event._triggered == 0) {
							if (event.type == 'card') event.trigger('useCardToBefore');
							event.trigger(event.name + 'Before');
							event._triggered++;
						} else if (event._triggered == 1) {
							if (event.type == 'card') event.trigger('useCardToBegin');
							if (event.name == 'phase' && !event._begun) {
								var next = game.createEvent('phasing', false, event);
								next.player = event.player;
								next.skill = event.skill;
								next.setContent('phasing');
								event._begun = true;
							} else {
								event.trigger(event.name + 'Begin');
								event._triggered++;
							}
						} else {
							if (player && player.classList.contains('dead') && !event.forceDie && event.name != 'phaseLoop') {
								game.broadcastAll(function () {
									while (_status.dieClose.length) {
										_status.dieClose.shift().close();
									}
								});
								if (event._oncancel) {
									event._oncancel();
								}
								event.finish();
							} else if (player && player.removed && event.name != 'phaseLoop') {
								event.finish();
							} else if (player && player.isOut() && event.name != 'phaseLoop' && !event.includeOut) {
								if (event.name == 'phase' && player == _status.roundStart && !event.skill) {
									_status.roundSkipped = true;
								}
								event.finish();
							} else {
								decadeUI.game.tryContent(event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result, _status, lib, game, ui, get, ai);
							}
							event.step++;
						}
					}

					var delta = performance.now() - game.loopTime;
					if (delta > 15 && decadeUI.config.smoothMode) {
						game.loopTime = undefined;
						requestIdleCallback(game.loop, { timeout: 16 });
						return false;
					}

					return true;
				},

				wait: function () {
					game.pause();
				},

				resume: function () {
					if (!game.loopLocked) {
						var ok = false;
						try {
							if (decadeUI.eventDialog && !decadeUI.eventDialog.finished && !decadeUI.eventDialog.finishing) {
								decadeUI.eventDialog.finish();
								decadeUI.eventDialog = undefined;
								ok = true;
							}
						} finally {
							if (!ok) game.resume();
						}
					} else {
						_status.paused = false;
					}
				},

				tryContent: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result, _status, lib, game, ui, get, ai) {
					if (_status.withError || lib.config.compatiblemode || (_status.connectMode && !lib.config.debug)) {
						try {
							event.content(event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result, _status, lib, game, ui, get, ai);
						} catch (e) {
							game.print('游戏出错：' + event.name);
							game.print(e.toString());
							console.log(e);
						}
					} else {
						event.content(event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result, _status, lib, game, ui, get, ai);
					}
				}
			};


			decadeUI.config = config;
			duicfg.update = function () {
				var menu = lib.extensionMenu['extension_' + extensionName];
				for (var key in menu) {
					if (menu[key] && (typeof menu[key] == 'object')) {
						if (typeof menu[key].update == 'function') {
							menu[key].update();
						}
					}
				}
			};

			decadeUI.init();
			console.timeEnd(extensionName);
		},
		precontent: function () {
			lib.decade_isXingchengVersion = true;
			if (['tafang', 'chess'].contains(get.mode()) && lib.config['extension_十周年UI_closeWhenChess']) {
				return;
			}
			window.decadeUIName = '十周年UI';
			window.decadeUIPath = lib.assetURL + 'extension/' + decadeUIName + '/';
			if (lib.config['extension_' + decadeUIName + '_eruda']) {
				var script = document.createElement('script');
				script.src = decadeUIPath + 'eruda.js';
				document.body.appendChild(script);
				script.onload = function () { eruda.init(); };
			}

			var extension = lib.extensionMenu['extension_' + decadeUIName];
			if (!(extension && extension.enable && extension.enable.init))
				return;

			if (window.require) {
				if (!window.fs)
					window.fs = require('fs');
			}

			lib.configMenu.appearence.config.layout.visualMenu = function (node, link) {
				node.className = 'button character themebutton ' + lib.config.theme;
				node.classList.add(link);
				if (!node.created) {
					node.created = true;
					node.style.overflow = 'scroll';

					var list = ['re_caocao', 're_liubei', 'sp_zhangjiao', 'sunquan'];
					for (var i = 0; i < 4; i++) {
						var player = ui.create.div('.seat-player.fakeplayer', node);
						ui.create.div('.avatar', player).setBackground(list.randomRemove(), 'character');
					}
				}
			};

			var decadePack = this;
			window.decadeModule = (function (decadeModule) {
				if (ui.css.layout) {
					if (!ui.css.layout.href || ui.css.layout.href.indexOf('long2') < 0)
						ui.css.layout.href = lib.assetURL + 'layout/long2/layout.css';
				}

				if (ui.css.fontsheet)
					ui.css.fontsheet.remove();

				decadeModule.init = function () {
					this.css(decadeUIPath + 'font.css');
					this.css(decadeUIPath + 'layout.css');
					this.css(decadeUIPath + 'decadeLayout.css');
					this.css(decadeUIPath + 'player.css');

					this.js(decadeUIPath + 'spine.js');
					this.js(decadeUIPath + 'component.js');
					this.js(decadeUIPath + 'skill.js');
					this.js(decadeUIPath + 'content.js');
					this.js(decadeUIPath + 'effect.js');
					this.js(decadeUIPath + 'animation.js');
					this.js(decadeUIPath + 'dynamicSkin.js');
					this.js(decadeUIPath + 'menu.js');
					return this;
				};
				decadeModule.js = function (path) {
					if (!path) return console.error('path');

					var _this = this;
					var script = document.createElement('script');
					script.onload = function () {
						this.remove();
					};
					script.onerror = function () {
						this.remove();
						console.error(this.src + 'not found');
					};
					script.src = path + '?v=' + decadePack.package.version;
					document.head.appendChild(script);
					return script;
				};
				decadeModule.css = function (path) {
					if (!path) return console.error('path');
					var link = document.createElement('link');
					link.rel = 'stylesheet';
					link.href = path + '?v=' + decadePack.package.version;
					document.head.appendChild(link);
					return link;
				};
				decadeModule.import = function (module) {
					if (!this.modules) this.modules = [];
					if (typeof module != 'function') return console.error('import failed');
					this.modules.push(module);
				};
				return decadeModule.init();
			})({})

			Object.defineProperties(_status, {
				connectMode: {
					configurable: true,
					get: function () {
						return this._connectMode;
					},
					set: function (value) {
						this._connectMode = value;
						if (value && lib.extensions) {
							var decadeExtension;
							var startBeforeFunction = lib.init.startBefore;

							for (var i = 0; i < lib.extensions.length; i++) {
								if (lib.extensions[i][0] == decadeUIName) {
									decadeExtension = lib.extensions[i];
									break;
								}
							}

							if (!decadeExtension) return;

							lib.init.startBefore = function () {
								try {
									_status.extension = decadeExtension[0];
									_status.evaluatingExtension = decadeExtension[3];
									decadeExtension[1](decadeExtension[2], decadeExtension[4]);
									delete _status.extension;
									delete _status.evaluatingExtension;
									console.log('%c' + decadeUIName + ': 联机成功', 'color:blue');
								} catch (e) {
									console.log(e);
								}

								if (startBeforeFunction) startBeforeFunction.apply(this, arguments);
							};
						}
					}
				},
				_connectMode: {
					value: false,
					writable: true
				}
			});

		}, help: {},
		config: {
			eruda: {
				name: '调试助手(开发用)',
				init: false,
			},
			smoothMode: {
				name: '流畅模式',
				init: false,
			},
			rightLayout: {
				name: '右手布局',
				init: false,
				update: function () {
					if (window.decadeUI) ui.arena.dataset.rightLayout = lib.config['extension_十周年UI_rightLayout'] ? 'on' : 'off';
				}
			},
			cardPrettify: {
				name: '卡牌美化(需重启)',
				init: 'webp',
				item: {
					off: '关闭',
					webp: 'WEBP素材',
					png: 'PNG 素材',
				}
			},
			dynamicBackground: {
				name: '动态背景',
				init: 'off',
				item: {
					off: '关闭',
					skin_xiaosha_default: '小杀',
					skin_baosanniang_漫花剑俏: '鲍三娘-漫花剑俏',
					skin_baosanniang_舞剑铸缘: '鲍三娘-舞剑铸缘',
					skin_caiwenji_才颜双绝: '蔡文姬-才颜双绝',
					skin_caojie_凤历迎春: '曹　节-凤历迎春',
					skin_caojie_战场绝版: '曹　节-战场绝版',
					skin_caoying_巾帼花舞: '曹　婴-巾帼花舞',
					skin_daqiao_清萧清丽: '大　乔-清萧清丽',
					skin_daqiao_衣垂绿川: '大　乔-衣垂绿川',
					skin_daqiao_战场绝版: '大　乔-战场绝版',
					skin_daqiaoxiaoqiao_战场绝版: '大乔小乔-战场绝版',
					skin_diaochan_玉婵仙子: '貂　蝉-玉婵仙子',
					skin_diaochan_战场绝版: '貂　蝉-战场绝版',
					skin_dongbai_娇俏伶俐: '董　白-娇俏伶俐',
					skin_fuhuanghou_万福千灯: '伏皇后-万福千灯',
					skin_fanyufeng_斟酒入情: '樊玉凤-斟酒入情',
					skin_guozhao_雍容尊雅: '郭　照-雍容尊雅',
					skin_huaman_花俏蛮娇: '花　鬘-花俏蛮娇',
					skin_huaman_经典形象: '花　鬘-经典形象',
					skin_hetaihou_鸩毒除患: '何太后-鸩毒除患',
					skin_hetaihou_蛇蝎为心: '何太后-蛇蝎为心',
					skin_hetaihou_耀紫迷幻: '何太后-耀紫迷幻',
					skin_lukang_毁堰破晋: '陆　抗-毁堰破晋',
					skin_luxun_谋定天下: '陆　逊-谋定天下',
					skin_luxunlvmeng_清雨踏春: '陆逊吕蒙-清雨踏春',
					skin_mayunlu_战场绝版: '马云騄-战场绝版',
					skin_simashi_桀骜睥睨: '司马师-桀骜睥睨',
					skin_sundengzhoufei_鹊星夕情: '孙登周妃-鹊星夕情',
					skin_sunluban_宵靥谜君: '孙鲁班-宵靥谜君',
					skin_sunluyu_娇俏伶俐: '孙鲁育-娇俏伶俐',
					skin_shuxiangxiang_花好月圆: '蜀香香-花好月圆',
					skin_shuxiangxiang_花曳心牵: '蜀香香-花曳心牵',
					skin_wangrong_云裳花容: '王　荣-云裳花容',
					skin_wangyi_绝色异彩: '王　异-绝色异彩',
					skin_wangyi_战场绝版: '王　异-战场绝版',
					skin_wolongzhuge_隆中陇亩: '卧龙诸葛-隆中陇亩',
					skin_wuxian_锦运福绵: '吴　苋-锦运福绵',
					skin_wuxian_金玉满堂: '吴　苋-金玉满堂',
					skin_xiahoushi_端华夏莲: '夏侯氏-端华夏莲',
					skin_xiahoushi_战场绝版: '夏侯氏-战场绝版',
					skin_xiaoqiao_花好月圆: '小　乔-花好月圆',
					skin_xiaoqiao_采莲江南: '小　乔-采莲江南',
					skin_xinxianying_英装素果: '辛宪英-英装素果',
					skin_xushi_拈花思君: '徐　氏-拈花思君',
					skin_xushi_为夫弑敌: '徐　氏-为夫弑敌',
					skin_zhangchangpu_钟桂香蒲: '张昌蒲-钟桂香蒲',
					skin_zhangchunhua_花好月圆: '张春华-花好月圆',
					skin_zhangchunhua_战场绝版: '张春华-战场绝版',
					skin_zhoufei_晴空暖鸢: '周　妃-晴空暖鸢',
					skin_zhangqiying_逐鹿天下: '张琪瑛-逐鹿天下',
					skin_zhangqiying_岁稔年丰: '张琪瑛-岁稔年丰',
					skin_zhenji_才颜双绝: '甄　姬-才颜双绝',
					skin_zhenji_洛神御水: '甄　姬-洛神御水',
					skin_zhugeguo_兰荷艾莲: '诸葛果-兰荷艾莲',
					skin_zhugeguo_仙池起舞: '诸葛果-仙池起舞',
					skin_zhugeguo_英装素果: '诸葛果-英装素果',
					skin_zhugeliang_空城退敌: '诸葛亮-空城退敌',
					skin_zhouyi_剑舞浏漓: '周　夷-剑舞浏漓',
					skin_zhangxingcai_凯旋星花: '张星彩-凯旋星花',
				},
				update: function () {
					if (!window.decadeUI) return;

					var item = lib.config['extension_十周年UI_dynamicBackground'];
					if (!item || item == 'off') {
						decadeUI.backgroundAnimation.stopSpineAll();
					} else {
						var name = item.split('_');
						var skin = name.splice(name.length - 1, 1)[0]
						name = name.join('_')
						decadeUI.backgroundAnimation.play(name, skin);
					}
				}
			},
			dynamicSkin: {
				name: '动态皮肤',
				init: false,
			},
			dynamicSkinOutcrop: {
				name: '动皮露头',
				init: true,
				update: function () {
					if (window.decadeUI) {
						var enable = lib.config['extension_十周年UI_dynamicSkinOutcrop'];
						ui.arena.dataset.dynamicSkinOutcrop = enable ? 'on' : 'off';
						var players = game.players;
						if (!players) return;
						for (var i = 0; i < players.length; i++) {
							if (players[i].dynamic) {
								players[i].dynamic.outcropMask = enable;
								players[i].dynamic.update(false);
							}
						}
					}
				}
			},
			showJieMark: {
				name: '界标记显示',
				init: true,
			},
			cardAlternateNameVisible: {
				name: '牌名辅助显示',
				init: false,
				update: function () {
					if (window.decadeUI) ui.window.dataset.cardAlternateNameVisible = lib.config['extension_十周年UI_cardAlternateNameVisible'] ? 'on' : 'off';
				}
			},
			campIdentityImageMode: {
				name: '势力身份美化',
				init: true,
			},
			playerKillEffect: {
				name: '玩家击杀特效',
				init: true,
				onclick: function (value) {
					game.saveConfig('extension_十周年UI_playerKillEffect', value);
					if (window.decadeUI) decadeUI.config.playerKillEffect = value;
				},
			},
			gameAnimationEffect: {
				name: '游戏动画特效',
				init: true,
			},
			playerDieEffect: {
				name: '玩家阵亡特效',
				init: true,
				onclick: function (value) {
					game.saveConfig('extension_十周年UI_playerDieEffect', value);
					if (window.decadeUI) decadeUI.config.playerDieEffect = value;
				},
			},
			cardUseEffect: {
				name: '卡牌使用特效',
				init: true,
				onclick: function (value) {
					game.saveConfig('extension_十周年UI_cardUseEffect', value);
					if (window.decadeUI) decadeUI.config.cardUseEffect = value;
				},
			},
			playerLineEffect: {
				name: '玩家指示线特效',
				init: true,
				onclick: function (value) {
					game.saveConfig('extension_十周年UI_playerLineEffect', value);
					if (window.decadeUI) decadeUI.config.playerLineEffect = value;
				},
			},
			outcropSkin: {
				name: '露头皮肤(需对应素材)',
				init: false,
				update: function () {
					if (window.decadeUI) ui.arena.dataset.outcropSkin = lib.config['extension_十周年UI_outcropSkin'] ? 'on' : 'off';
				}
			},
			borderLevel: {
				name: '玩家边框等阶',
				init: 'five',
				item: {
					one: '一阶',
					two: '二阶',
					three: '三阶',
					four: '四阶',
					five: '五阶',
				},
				update: function () {
					if (window.decadeUI) ui.arena.dataset.borderLevel = lib.config['extension_十周年UI_borderLevel'];
				}
			},
			gainSkillsVisible: {
				name: '获得技能显示',
				init: 'on',
				item: {
					on: '显示',
					off: '不显示',
					othersOn: '显示他人',
				},
				update: function () {
					if (window.decadeUI) ui.arena.dataset.gainSkillsVisible = lib.config['extension_十周年UI_gainSkillsVisible'];
				}
			},
			playerMarkStyle: {
				name: '人物标记样式',
				init: 'yellow',
				item: {
					red: '红色',
					yellow: '黄色',
					decade: '十周年',
				},
				update: function () {
					if (window.decadeUI) ui.arena.dataset.playerMarkStyle = lib.config['extension_十周年UI_playerMarkStyle'];
				}
			},
			closeWhenChess: {
				name: '战棋模式关闭UI',
				init: false,
			},
			foldCardMinWidth: {
				name: '折叠手牌最小宽度',
				intro: '设置当手牌过多时，折叠手牌露出部分的最小宽度（默认值为81）',
				init: '81',
				item: {
					'9': '9',
					'18': '18',
					'27': '27',
					'36': '36',
					'45': '45',
					'54': '54',
					'63': '63',
					'72': '72',
					'81': '81',
					'90': '90',
					'cardWidth': '卡牌宽度'
				},
				update: function () {
					if (window.decadeUI) decadeUI.layout.updateHand();
				}
			}
		},
		package: {
			character: {
				character: {},
				translate: {}
			},
			card: {
				card: {},
				translate: {},
				list: []
			},
			skill: {
				skill: {},
				translate: {}
			},
			intro: (function () {
				var log = [
					'有bug先检查其他扩展，不行再关闭UI重试，最后再联系作者。',
					'当前版本：1.2.0.220114.27（Show-K修复版）',
					'更新日期：2023-06-30',
					'- 感谢原作者短歌的认可！',
					'- 修复了因equip和addJudge导致的问题。',
					/*
					'- 新增动皮及背景：[曹节-凤历迎春]、[曹婴-巾帼花舞]、[貂蝉-战场绝版]、[何太后-耀紫迷幻]、[王荣-云裳花容]、[吴苋-金玉满堂]、[周夷-剑舞浏漓]；',
					'- 新增动皮oncomplete支持(函数内部只能调用this.xxx代码)；',
					'- 优化了主玩家攻击指示线的位置显示；',
					'- 优化了主玩家出牌摸牌相关呈现动画；',
					'- 优化折叠手牌，开关跟随系统的设置；',
					'- 优化部分代码，提升游戏整体流畅度；',
					'- 修复关闭界包后因界标记弹窗的问题；',
					'- 修复挑战模式下界武将名丢失的问题；',
					'- 修复挑战模式下动皮异常拉伸的问题；',
					'- 修复了加载其他目录的特效文件问题；',
					'- 修复低版本窗口改动后动皮模糊问题；'*/
				];

				return '<p style="color:rgb(210,210,000); font-size:12px; line-height:14px; text-shadow: 0 0 2px black;">' + log.join('<br>') + '</p>';
			})(),
			author: "Show-K←寰宇星城←短歌 QQ464598631",
			diskURL: "",
			forumURL: "",
			version: "1.2.0.220114.27",
		},
		files: {
			"character": [],
			"card": [],
			"skill": []
		},
		editable: false
	};
});

/*
1.9.97.6.2：修复不是本扩展卡牌图片溢出，因判定不能及时清理弃牌区，更正势力颜色，技能按钮位置。
1.9.97.6.3：修复类似邓小艾这种判定没有标记的bug，对决模式可能正常换装备了。新增自定义势力字图，直接放到(十周年UI/image/decoration/name_你的势力名.webp)，如果不存自动用字体代替。
1.9.97.6.5：修复国战模式势力名显示错误，新增新版布局。
1.9.97.9.1：新增身份面具，identity_你的身份名.webp，暂时关闭pc版判定牌的信息(有bug没电脑)。
1.9.97.9.2：优化对决模式中的对抗4v4显示身份面具一样，另一个命名为identity_身份名_false.webp。
1.9.98.1.1：修复游戏原版的界面缩放问题，以便更好的适配布局。增加红色技能标记。
1.9.98.1.2：修正了在新版布局未亮明武将牌的情况下装备不能正常显示，以及调整角色背景，可以自定义透明图片了，适当调宽其他玩家装备显示。
1.9.98.1.3：修复因缺少素材而造成显示身份名不正确的bug。
1.9.98.1.4：新增卡牌素材开关，卡牌左边辅助名称开关。
1.9.98.1.5：现在游戏1.8版本也能用了，不过我发现没有1.9版本流畅。
1.9.98.1.6：修复缩放问题。
1.9.98.1.7：修复PC版判定牌，新增缩放防抖动（但会模糊点）。
1.9.98.1.8：新增秃头皮肤使用开关（必须有秃头皮肤），双将默认为左右布局；调整缩放后造成的画面抖动，修正展示手牌过大的问题，修复势力名素材无法正确加载的问题。
1.9.98.1.9：修复：菜单栏显示偏移，武将选择框小；新增：人名字体自由设置，扩展联机可用。
1.9.98.1.10：修复：因联机引起的扩展加载错误。
1.9.98.1.11：
- 新增可变关闭的击杀特效、死亡特效，边框可以自由选择等阶；
- 血条框现在根据血量上限自动变化；
- 无限血量现在正常显示为 ∞ / ∞;
- 卡牌美化素材增加：国战、衍生；
- 修正只明置单将的情况下显示错误；
- 修正卡牌辅助名称上下的间距过大；
- 修正张宝符咒的技能标记显示错误；
1.9.98.1.12：
- 修复1.8版本特效失效。
1.9.98.1.13：
- 修复1.8版本特效失效。
1.9.98.2.4.1：
- 新增指示线特效（可关闭）；
- 玩家击杀自己时不再会显示击杀动画；
- 任意一方玩家没有明置的武将不再会触发击杀动画；
- 国战君主阵亡文字正常显示，玩家阵亡复活后阵亡文字仍显示修复；
1.9.98.2.4.2：
- 新增拼点框特效；
- 其他玩家装备位置修正；
- 替换卡牌的素材只需要在扩展目录正确命名即可；
1.9.98.2.4.3：
- 修复武将不能点击查看详情；
- 修复无法正常加载卡牌素材；
1.9.98.2.4.4：
- 修复bug；
1.9.98.3.2.1：
- 视为某牌、联机进度条、菜单栏、标记菜单位置调整，指示线速度调整；
1.9.98.3.2.2：
- 增加获得的技能显示（如幻化之战、合纵抗秦）；
- 修复王朗拼点、刘璋卡牌显示、阵法卡牌摸牌错误等其他BUG；
- 修正特殊坐骑牌位置；
- 修正标记的显示位置；
1.9.98.3.2.3：
- 又㕛叒叕修复标记偏移了；
- 武将获得的技能显示可以关闭；
- 有想试试观星效果的可以再准备阶段（下次估计会更改方法= =）：
- var cads = get.cards(5)；
- decadeUI.content.chooseGuanXing(player, cards, 5, null, 5);
1.9.98.3.2.4：
- 没更新啥内容，小修了下观星；
- 以及可能修复了笨战万里的不能选择；
1.9.98.3.2.5：
- 调整及修复观星界面；
1.9.98.3.2.6：
- 优化观星界面；
1.9.98.3.2.7：
- 修复观星托管BUG；
1.9.98.4.2.1：
- 修复类似【严教】技能的BUG；
1.9.98.4.2.2：
- 增加【杀】【闪】出牌特效（可关闭）；
- 【视为牌】雷属性增加闪电背景；
- 修复结算、标记卡牌大小；
- 修复移动端无法选择装备；
1.9.98.4.3.1：
- 修复【视为牌】的杀闪特效显示；
1.9.98.4.4.1：
- 移植演示观星UI的几个技能（联机模式关闭），替换的是【界观星】、【称象】、【罪论】、【恂恂】、【点化】、【纵玄】；
1.9.98.4.4.2：
- 新增修复原版【木牛流马】不能很好使用的问题，如改判、丈八等（测试阶段中。。）；
- 修复观星UI的几个技能音效问题；
1.9.98.4.4.3：
- 调整【木牛流马】用牌的规则；
1.9.98.4.4.4：
- 增加老【观星】的UI；
- 修复联机模式判定区未显示标记；
- 修复联机对抗模式自动开始的BUG；
- 修复武将详情标记文字偏移；
- 修复挑战模式的弹窗；
1.9.98.4.5.1:
- 修复联机模式其他玩家没有【十周年UI】扩展不能出牌的BUG；
- 修正联机模式进度条显示位置；
1.9.98.5.0.1:
- 增加唐咨【恂恂】、国战君张角【悟心】的UI；
- 修复类似荀攸【奇策】、刘堪【战绝】会弃掉【木牛流马】里的牌的BUG；
- 修复【木牛流马】有牌自己没有手牌，也能发动类似曹睿【明鉴】的技能的BUG；
- 修复【木牛流马】有牌自己没有手牌，敌方也对自己释放【火攻】的BUG；
- 调整类似【对策】拼牌的动画为丢牌动画；
- 调整联机模式中击杀特效由客机自己控制；
1.9.98.5.1.1:
- 增加了角色座位号显示(联机模式下只有房主有UI才显示)；
- 修复技能动画会让【木牛流马】显示的BUG；
- 修复身份模式特殊身份【军师】技能只显示牌堆顶的BUG；
- 优化【纵玄】AI无脑发动，现在根据会根据情况发动了；
1.9.98.5.1.2:
- 优化了常用的字体预加载；
- 修正了血条显示，如3/Infinity，3/∞，NaN显示为×；
- 修正出牌记录阻挡牌堆牌数记录显示；
1.9.98.7.0.1:
- 新增联机模式聊天框（暂时没弄表情），美化音量条；
- 修复国战诸葛亮师徒观星牌数问题；
- 修复【纵玄】其他人能观看移动的牌问题；
- 修复类似陈琳【颂词】AI因【木牛流马】计算目标手牌不正常的问题；
- 可能修复先亮的野副将，后变成君主将还是野的问题；
1.9.98.7.0.2:
- 修复联机模式创建房间自动开始的BUG；
1.9.99.2.0.1:
- 新增了曹植【落英】技能显示框；
- 修复了国战野势力仍为原势力问题；
- 修正了圆角大小会影响角色；
- 优化了幻化之战目标信息遮挡；
- 优化了AI观星技能没有合适的改判牌不全下的问题；
1.9.99.2.0.2:
- 新增了枣恭介(DIY包)技能【设控】、界曹植【落英】的UI； 
- 修复了曹植【落英】技能因游戏速度过快而不能获得牌的问题；
- 修正了1点血量上限血条框的高度问题；
1.9.99.3.0.1:
- 修复界/曹植的【落英】AI不获得牌的问题；
- 修复界曹植的【落英】配音；
- 修复视为卡牌名称的问题；
1.9.100.0.0.1:
- 修复新版引起的技能BUG；
1.9.100.2.0.1:
- 修复【落英】AI引起的界面卡住问题；
1.9.100.4.2.1:
- 优化带了有观星类UI技能的AI排序牌的问题；
- 修复界太史慈拼点，官渡许攸BUG，键枣宗介的【设控】AI弹窗；
- 调整界/曹植的落英获得牌操作顺序；
1.9.103.4.0.1:
- 修复了某些情况扩展已经载入无法使用的BUG；
- 修复了发动【拼点】时在发动拼点窗口不会消失的BUG（由寰宇星城提供代码，未验证）；
- 增加了主玩家空装备的五个武器图标；
- 增加了【默认】布局；
1.9.105.1.0.1:
- 增加了[游戏开始、诸葛连弩、八卦阵、仁王盾]动画
- 修复了默认布局主玩家受伤动画错位的BUG
1.9.105.1.0.2:
- 优化了动画的预加载，提升流畅度；
- 增加了[藤甲、白银狮子、麒麟弓、丈八蛇矛、青龙偃月刀、寒冰剑、古锭刀、贯石斧、方天画戟、雌雄双股剑]动画；
1.9.105.3.0.1:
- 修复动画多次绘制的BUG；
- 修复[藤甲、贯石斧]不能播放动画的BUG；
- 修复了某些设备不支持"webgl"导致不能加载本扩展的BUG；
- 增加了[朱雀羽扇]动画；
- 增加了[伤害、治疗]动画；
- 优化了[游戏开始]动画的加载时机；
1.9.105.4.0.1:
- 修复了失去体力时也会播放[伤害]动画的BUG；
- 增加了[逐鹿天下]包相关装备的动画(有几个播放不了，等待游戏修复而修复)；
- 优化了所有动画的大小；
1.9.105.4.0.2:
- 修复了装备牌[女装、折戟、驽马]动画播放问题；
- 增加了基本牌[黑杀、红杀、雷杀、火杀、闪、桃、酒]的相关动画；
1.9.105.5.0.1:
- 优化了[击杀特效]动画；
- 增加了[阵亡破碎、南蛮入侵、乐不思蜀、闪电、兵粮寸断、无懈可击、万箭齐发、桃园结义、顺手牵羊、火攻、过河拆桥、五谷丰登]动画；
- 新增动态背景[马云禄、曹节、大乔、鲍三娘、小杀]；
- 将受伤动画调整为数字一并显示；
1.9.105.5.1.1:
- 修复[兵粮思蜀]的BUG；
- 修复默认布局标记显示错位；
- 动态背景只加载所选资源；
- 优化界面一丢丢性能问题；
1.9.105.6.1.3:
- 优化主玩家手牌显示(滚动拖动)；
- 优化击杀特效的显示时机；
- 新增很多个动态人物背景；
1.9.105.7.0.1:
- 修复不能导入扩展的BUG；
- 再次的再次优化击杀特效；
- 新增发动[限定技]的动画；
- 稍微延时游戏开始时机，提升流畅度；
1.9.105.9.0.1:
- 将张琪瑛的[点化]调整为最新版本；
- 将武将评级替换为A、S、SS、SSS图标；
- 修复翻面牌移动的BUG；
- 修复限定动画资源缓存的BUG；
- 修复已经修复过的BUG；
1.9.105.9.1.1:
- 优化选将露头皮肤显示；
- 修复重复修复的BUG；
1.9.105.9.1.2:
- 将[南蛮入侵]大象腿特效替换为原卡牌的特效；
- 修复选将预览切换皮肤不更新显示的BUG；
1.9.105.10.0.1:
- 增加【身在曹营心在汉】的彩蛋
- 优化[落英]AI拿牌显示时的速度；
1.9.106.0.0.1:
- 增加[流畅模式]功能，可能略微降低游戏出牌速度；
- 增加[花鬘-花俏蛮娇]、[花鬘-经典形象]动态背景；
- 修复最新版不显示出牌特效的BUG（临时打磨）；
1.9.108.4.1.1:
- 新增[辛宪英-英装素果]、[诸葛果-英装素果]、[张春华-战场绝版]、[大乔小乔-战场绝版]、[伏皇后-万福千灯]、[吴苋-锦运福绵]动态背景；
- 新增DIY包久岛欧/野村美希的【幻梦】、应变篇【洞烛先机】的显示UI；
- 修复chooseTuUse代码；
1.9.108.4.1.5:(星城代耕)
- 适配最新无名杀版本，修改木牛流马。,
- 增加装备栏在左边的新样式。,
- 修复了国战无法标记晋势力的问题,
- 修复了晋势力颜色,
- 其它BUG的修复
1.9.110.1.1.0:
- 修正木牛流马；
- 修复晋势力异常显示；
- 新增[大乔-清萧清丽]、[孙鲁育-娇俏伶俐]、[何太后-鸩毒除患]、[张星彩-凯旋星花]、[张琪瑛-岁稔年丰]、[夏侯氏-战场绝版]、[孙鲁班-宵靥谜君]、[董白-娇俏伶俐]、[郭照-雍容尊雅]、[周妃-晴空暖鸢]、[樊玉凤-斟酒入情]；
- 拼点按照无名杀本体的要求，添加同时失去牌的机制。
- 增加边框随击杀数改变的设置。
1.9.110.8.5.1：
- 新增卡牌[知己知彼]、[铁锁连环]、[逐鹿天下]、[树上开花]、[草船借箭]、[远交近攻]的使用特效；
- 新增武将翻面动画及素材，铁索素材，判定特效；
- 新增卡牌美化图片格式选项[关闭、WEBP、PNG]；
- 将部分图片素材的格式统一改为PNG(以后也是)，为了兼容如IOS系统；
- 优化人物边框阴影发光，以及受伤动画；
- 优化部分代码，提升加载速度及流畅度；
- 优化界面操作按钮的布局与对应素材图；
- 优化原有颜色标记的样式，增加动画性；(转换技显示+-)
- 修复了身份面具在对应模式不显示问题；
- 修复界面出牌提示文字被操作按钮遮住；
- 修复spine 读取多张素材图出错的问题(spine 部分函数名已更换)；
- 预计下个版本增加可选的动态皮肤功能；
1.9.110.9.1：
- 优化身份标记框界面；
- 优化拼点框发动界面；
- 优化聊天泡泡框界面；
- 适配新版的判断生效；(judge2)
- 修复出牌特效过快引起的问题；
- 修复其他模式阵亡身份的显示问题；
- 增加了动态皮肤功能，目前只考虑了单武将，后续慢慢优化，相关示例请打开动态皮肤示例开关，如没有显示请检查assets/dynamic下的动皮文件是否完整。
  动态皮肤功能后续只做优化，具体全动皮实现自行解决或者由其他皮肤扩展实现；
1.9.110.9.2.2：
- 增加使用过的牌转换显示；
- 增加动态皮肤的露头开关，默认预览武将为张琪瑛，相关配置文件为dynamicSkin.js；
- 调整卡牌的发光阴影为指定素材显示；
- 优化卡名辅助显示，范围显示可一同控制；
- 修复结束回合按钮不靠左的问题；
- 修复对话框中不可选中的卡牌的显示样式；
- 修复阵亡身份变灰、不正确显示翻面的问题；
1.9.110.9.2.3：
- 新增动态背景[何太后-蛇蝎为心]；
- 新增默认动皮武将有界马超、鲍三娘、魏蔡文姬、大乔、小乔、大乔小乔、貂蝉、郭照、黄月英、何太后、
  花鬘、陆郁生、马云禄、潘淑、孙鲁班、孙鲁育、孙尚香、蜀香香、王元姬、王异、吴苋、夏侯氏、小乔、
  辛宪英、徐氏、杨婉、张菖蒲、张星彩、甄姬、周妃、诸葛果，以及界限突破后的(非界马超除外)。
- 新增动皮高清自适应开关(移动端效果显著)；
- 更新 game.check 函数代码；
- 修复某些动皮白边显示问题；
- 修复初次导入扩展弹窗问题；
- 修复弃牌堆不是转换牌也显示的问题；
- 修复开启动皮后阵亡、翻面不显示问题；
1.9.110.9.3.5：
- 新增动态背景[大　乔-衣垂绿川]、[小　乔-采莲江南]、[蜀香香-花曳心牵];
- 新增动态背景小杀的彩蛋；
- 新增双武将动态皮肤支持；
- 优化动画相关的布局逻辑;
- 优化动皮的显示过度动画；
- 优化代码，提升加载速度；
- 优化手机端窗口过小问题；
- 修复手机端按钮大小问题；
- 修复部分卡牌的判断显示；
- 修复受伤时动画与体力条未同步的问题；
- 修复替换武将后动皮未正确显示的问题；
- 由于动态皮肤过多会导致特效丢失，因此作出以下数量限制；
  chrome 69 及以上的内核版本，手机端限制在10个，PC端限制在18个；
  chrome 69 　以下的内核版本，手机端限制在 2个，PC端限制在10个；
  在控制台输入代码：navigator.appVersion，会返回你的chrome版本；
- windows端闪屏的请使用诗笺的64位版(chrome 91~)，或者原版的win由里版(chrome 51)，或者自行
  打包electron 10.4.7(chrome 85) ~ 4.0.0(chrome 69);
1.1.0.211130：
- 新增动皮[诸葛果仙池起舞]及其背景；
- 新增界武将标记显示及其对应的开关；
- 优化字体加载，配置font.css后秒开；
- 优化卡牌素材加载时机，提升流畅度；
- 优化出牌阶段与技能使用时文本提示；
- 优化武将的发光阴影时机并改为动图；
- 优化露头动皮其他特效部件显示范围；
  优化露头动皮有：大乔-衣垂绿川、小乔-采莲江南、何太后-蛇蝎为心、徐氏-为夫弑敌；
- 调整高清动皮自适应功能默认为开启；
- 修复在低内核版本下动皮的模糊问题；
- 修复挑战模式下BOSS图片消失的问题；
- 修复对决模式下选将图片消失的问题；
- 关于动皮数量限制，手机端请把chrome 内核更新到90及以上；
1.2.0.220114:
- 新增动皮及背景：[曹节-凤历迎春]、[曹婴-巾帼花舞]、[貂蝉-战场绝版]、[何太后-耀紫迷幻]、[王荣-云裳花容]、[吴苋-金玉满堂]、[周夷-剑舞浏漓]；
- 新增动皮oncomplete支持(函数内部只能调用this.xxx代码)；
- 优化了主玩家攻击指示线的位置显示；
- 优化了主玩家出牌摸牌相关呈现动画；
- 优化折叠手牌，开关跟随系统的设置；
- 优化部分代码，提升游戏整体流畅度；
- 修复关闭界包后因界标记弹窗的问题；
- 修复挑战模式下界武将名丢失的问题；
- 修复挑战模式下动皮异常拉伸的问题；
- 修复了加载其他目录的特效文件问题；
- 修复低版本窗口改动后动皮模糊问题；
*/
