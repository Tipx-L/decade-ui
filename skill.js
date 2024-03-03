'use strict';
decadeModule.import((lib, game, ui, get, ai, _status) => {
	const skillMap = {
		guanxing: {
			content: function () {
				'step 0'
				if (player.isUnderControl()) {
					game.modeSwapPlayer(player);
				}

				var num = Math.min(5, game.countPlayer());
				if (player.hasSkill('yizhi') && player.hasSkill('guanxing')) {
					num = 5;
				}
				var player = event.player;
				if (player.isUnderControl()) game.modeSwapPlayer(player);

				var cards = get.cards(num);
				var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				game.broadcast(function (player, cards) {
					if (!window.decadeUI) return;
					decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				}, player, cards);

				event.switchToAuto = function () {
					var cards = guanXing.cards[0].concat();
					var cheats = [];
					var judges = player.node.judges.childNodes;

					if (judges.length) {
						cheats = decadeUI.get.cheatJudgeCards(cards, judges, true);
					}

					if (cards.length && cheats.length == judges.length) {
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
							guanXing.move(card, index, 0);
							if (finished) guanXing.finishTime(1000);
						}, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
						time += 500;
					}

					for (var i = 0; i < cards.length; i++) {
						setTimeout(function (card, index, finished) {
							guanXing.move(card, index, 1);
							if (finished) guanXing.finishTime(1000);
						}, time, cards[i], i, (i >= cards.length - 1));
						time += 500;
					}
				};

				if (event.isOnline()) {
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				'step 1'
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) + '张牌置于牌堆底');
				game.updateRoundNumber()
			}
		},
		reguanxing: {
			content: function () {
				'step 0'
				var player = event.player;
				if (player.isUnderControl()) game.modeSwapPlayer(player);

				var cards = get.cards(game.countPlayer() < 4 ? 3 : 5);
				var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				game.broadcast(function (player, cards) {
					if (!window.decadeUI) return;
					decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				}, player, cards);

				event.switchToAuto = function () {
					var cheats = [];
					var cards = guanXing.cards[0].concat();
					var judges;

					var next = player.getNext();
					var friend = player;
					if (event.triggername == 'phaseJieshuBegin') {
						friend = next;
						judges = friend.node.judges.childNodes;
						if (get.attitude(player, friend) < 0) friend = null;
					} else {
						judges = player.node.judges.childNodes;
					}

					if (judges.length) {
						cheats = decadeUI.get.cheatJudgeCards(cards, judges, friend != null);
					}

					if (cards.length && cheats.length == judges.length) {
						for (var i = 0; i >= 0 && i < cards.length; i++) {
							if (friend) {
								if (get.value(cards[i], friend) >= 5) {
									cheats.push(cards[i]);
									cards.splice(i, 1)
								}
							} else {
								if (get.value(cards[i], next) < 4) {
									cheats.push(cards[i]);
									cards.splice(i, 1)
								}
							}
						}
					}

					var time = 500;
					for (var i = 0; i < cheats.length; i++) {
						setTimeout(function (card, index, finished) {
							guanXing.move(card, index, 0);
							if (finished) guanXing.finishTime(1000);
						}, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
						time += 500;
					}

					for (var i = 0; i < cards.length; i++) {
						setTimeout(function (card, index, finished) {
							guanXing.move(card, index, 1);
							if (finished) guanXing.finishTime(1000);
						}, time, cards[i], i, (i >= cards.length - 1));
						time += 500;
					}
				};

				if (event.isOnline()) {
					// 判断其他玩家是否有十周年UI，否则直接给他结束，不知道有没有效果
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					// 等待其他玩家操作
					event.player.wait();
					// 暂停主机端游戏
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
					/*
					注释说明
					var guanXing = decadeUI.content.chooseGuanXing(
						控制观星的玩家,            	  	// 必选
						[顶部初始化的牌],            	// 必选，可为null，但底部不能为null
						顶部允许控制的牌数范围,        	// 可选，不填根据初始化的牌数量
						[底部初始化的牌],            	// 必选，可为null，但顶部不能为null
						底部允许控制的牌数范围,        	// 可选，不填根据初始化的牌数量
						第一个参数的玩家是否可见);      	// 可选，不设置则根据控制观星的玩家来显示

					// undefined 均为可设置，其他为只读或调用
					var properties = {
						caption: undefined,        	// 设置标题
						header1: undefined,			// 牌堆顶的文字
						header2: undefined,			// 牌堆底的文字
						cards: [[],[]],            	// 获取当前观星的牌，不要瞎改
						callback: undefined,    	// 回调函数，返回 true 表示可以点击【确认】按钮，例：guanXing.callback = function(){ return guanXing.cards[1].length == 1; }
													// 注意：此值一旦设置，观星finish后不会自己置顶牌堆顶和牌堆底，需要自行实现
						infohide: undefined,    	// 设置上面第1个参数的玩家是否可见观星的牌
						confirmed: undefined,		// 是否按下确认按钮
						doubleSwitch: undefined,	// 双击切换牌
						finishTime:function(time),	// 指定的毫秒数后完成观星
						finish:function(),        	// 观星完成，在下一个step 中，可以通过 event.cards1 与 event.cards2 访问观星后的牌
						swap:function(s, t),    	// 交换观星中的两个牌
						switch:function(card),   	// 将观星中的牌切换到另一方
						move:function(card, index, moveDown)	// 移动观星的牌到指定的一方位置
					}
					*/
				}
				'step 1'
				if (event.triggername == 'phaseZhunbeiBegin' && event.num1 == 0) player.addTempSkill('reguanxing_on');
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) + '张牌置于牌堆底');
				game.updateRoundNumber();
			}
		},
		chengxiang: {
			content: function () {
				'step 0'
				var cards = get.cards(4);
				var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 4, false);
				guanXing.doubleSwitch = true;
				guanXing.caption = '【称象】';
				guanXing.header2 = '获得的牌';
				guanXing.callback = function () {
					var num = 0;
					for (var i = 0; i < this.cards[1].length; i++) {
						num += get.number(this.cards[1][i]);
					}

					return num > 0 && num <= 13;
				};

				game.broadcast(function (player, cards, callback) {
					if (!window.decadeUI) return;
					var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 4, false);
					guanXing.caption = '【称象】';
					guanXing.header2 = '获得的牌';
					guanXing.callback = callback;
				}, player, cards, guanXing.callback);

				var player = event.player;
				event.switchToAuto = function () {
					var cards = guanXing.cards[0];
					var num, sum, next;
					var index = 0;
					var results = [];

					for (var i = 0; i < cards.length; i++) {
						num = 0;
						sum = 0;
						next = i + 1;
						for (var j = i; j < cards.length; j++) {
							if (j != i && j < next)
								continue;

							num = sum + get.number(cards[j]);
							if (num <= 13) {
								sum = num;
								if (!results[index]) results[index] = [];
								results[index].push(cards[j]);
							}

							if (j >= cards.length - 1) index++;
						}

						if (results[index] && results[index].length == cards.length) break;
					}

					var costs = [];
					for (var i = 0; i < results.length; i++) {
						costs[i] = {
							value: 0,
							index: i,
						};
						for (var j = 0; j < results[i].length; j++) {
							costs[i].value += get.value(results[i][j], player);
							// 如果有队友且有【仁心】且血量不低，优先选择装备牌
							if (player.hasFriend() && player.hasSkill('renxin') && get.type(results[i][j]) == 'equip' && player.hp > 1) {
								costs[i].value += 5;
							}

							// 如果自己有延时牌且没有无懈可击，优先选择无懈可击
							if (player.node.judges.childNodes.length > 0 && !player.hasWuxie() && results[i][j] == 'wuxie') {
								costs[i].value += 5;
							}
						}
					}

					costs.sort(function (a, b) {
						return b.value - a.value;
					});

					var time = 500;
					var result = results[costs[0].index];

					for (var i = 0; i < result.length; i++) {
						setTimeout(function (move, finished) {
							guanXing.move(move, guanXing.cards[1].length, 1);
							if (finished) guanXing.finishTime(1000);
						}, time, result[i], (i >= result.length - 1));
						time += 500;
					}
				};

				if (event.isOnline()) {
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				'step 1'
				if (event.result && event.result.bool) {
					game.cardsDiscard(event.cards1);
					player.gain(event.cards2, 'log', 'gain2');
				}
			}
		},
		xinfu_zuilun: {
			content: function () {
				'step 0'
				event.num = 0;
				event.cards = get.cards(3);
				if (player.getHistory('lose', function (evt) {
					return evt.type == 'discard';
				}).length) event.num++;
				if (!player.isMinHandcard()) event.num++;
				if (!player.getStat('damage')) event.num++;
				'step 1'
				if (event.num == 0) {
					player.gain(event.cards, 'draw');
					event.finish();
					return;
				}

				var cards = event.cards;
				var gains = cards.length - event.num;

				var zuiLun = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, gains);
				zuiLun.caption = '【罪论】';
				zuiLun.header2 = '获得的牌';
				zuiLun.tip = '可获得' + gains + '张牌<br>' + zuiLun.tip;
				zuiLun.callback = function () {
					return this.cards[1].length == gains;
				};

				game.broadcast(function (player, cards, gains, callback) {
					if (!window.decadeUI) return;
					var zuiLun = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, gains);
					zuiLun.caption = '【罪论】';
					zuiLun.header2 = '获得的牌';
					zuiLun.tip = '可获得' + gains + '张牌<br>' + zuiLun.tip;
					zuiLun.callback = callback;
				}, player, cards, gains, zuiLun.callback);

				var player = event.player;
				event.switchToAuto = function () {
					var cheats = [];
					var cards = zuiLun.cards[0].concat();
					var stopped = false;

					var next = player.getNext();
					var hasFriend = get.attitude(player, next) > 0;

					// 判断下家是不是队友，令其生效或者失效
					var judges = next.node.judges.childNodes;
					if (judges.length > 0) cheats = decadeUI.get.cheatJudgeCards(cards, judges, hasFriend);

					// 如果有【父荫】优先把好牌给队友
					if (hasFriend && player.hasSkill('xinfu_fuyin')) {
						cards = decadeUI.get.bestValueCards(cards, next);
					} else {
						cards.sort(function (a, b) {
							return get.value(a, player) - get.value(b, player);
						});
					}

					cards = cheats.concat(cards);
					var time = 500;
					var gainNum = gains;
					for (var i = cards.length - 1; i >= 0; i--) {
						setTimeout(function (card, index, finished, moveDown) {
							zuiLun.move(card, index, moveDown ? 1 : 0);
							if (finished) zuiLun.finishTime(1000);
						}, time, cards[i], i, i == 0, gainNum > 0);
						time += 500;
						gainNum--;
					}
				};

				if (event.isOnline()) {
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				'step 2'
				event.cards = event.cards2
				if (event.result && event.result.bool) {
					var cards = event.cards1;
					var first = ui.cardPile.firstChild;
					for (var i = 0; i < cards.length; i++) {
						ui.cardPile.insertBefore(cards[i], first);
					}
				}
				'step 3'
				game.updateRoundNumber();
				if (event.cards.length) {
					player.gain(event.cards, 'draw');
					event.finish();
				} else {
					player.chooseTarget('请选择一名角色，与其一同失去1点体力', true, function (card, player, target) {
						return target != player;
					}).ai = function (target) {
						return - get.attitude(_status.event.player, target);
					};
				}
				'step 4'
				player.line(result.targets[0], 'fire');
				player.loseHp();
				result.targets[0].loseHp();
			}
		},
		xunxun: {
			content: function () {
				'step 0'
				var cards = get.cards(4);
				var player = event.player;
				var xunxun = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 2);
				xunxun.caption = '【恂恂】';
				xunxun.header1 = '牌堆底';
				xunxun.header2 = '牌堆顶';
				xunxun.callback = function () {
					return this.cards[0].length == 2 && this.cards[1].length == 2;
				};

				game.broadcast(function (player, cards, callback) {
					if (!window.decadeUI) return;
					var xunxun = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 2);
					xunxun.caption = '【恂恂】';
					xunxun.header1 = '牌堆底';
					xunxun.header2 = '牌堆顶';
					xunxun.callback = callback;
				}, player, cards, xunxun.callback);

				event.switchToAuto = function () {
					var cards = decadeUI.get.bestValueCards(xunxun.cards[0].concat(), player);
					var time = 500;
					for (var i = 0; i < 2; i++) {
						setTimeout(function (card, index, finished) {
							xunxun.move(card, index, 1);
							if (finished) xunxun.finishTime(1000);
						}, time, cards[i], i, i >= 1);
						time += 500;
					}
				}

				if (event.isOnline()) {
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}

				'step 1'
				var first = ui.cardPile.firstChild;
				var cards = event.cards2;
				for (var i = 0; i < cards.length; i++) {
					ui.cardPile.insertBefore(cards[i], first);
				}

				cards = event.cards1;
				for (var i = 0; i < cards.length; i++) {
					ui.cardPile.appendChild(cards[i]);
				}
			}
		},
		xinfu_dianhua: {
			content: function () {
				'step 0'
				var num = 0;
				var player = event.player;
				for (var i = 0; i < lib.suit.length; i++) {
					if (player.hasMark('xinfu_falu_' + lib.suit[i])) num++;
				}

				var cards = get.cards(num);
				var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				dialog.caption = '【点化】';
				game.broadcast(function (player, cards) {
					if (!window.decadeUI) return;
					decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length).caption = '【点化】';
				}, player, cards);

				event.switchToAuto = function () {
					var cheats = [];
					var cards = dialog.cards[0].concat();
					var judges;

					var next = player.getNext();
					var friend = player;
					if (event.triggername == 'phaseJieshuBegin') {
						friend = next;
						judges = friend.node.judges.childNodes;
						if (get.attitude(player, friend) < 0) friend = null;
					} else {
						judges = player.node.judges.childNodes;
					}

					if (judges.length) {
						cheats = decadeUI.get.cheatJudgeCards(cards, judges, friend != null);
					}

					if (cards.length && cheats.length == judges.length) {
						for (var i = 0; i >= 0 && i < cards.length; i++) {
							if (friend) {
								if (get.value(cards[i], friend) >= 5) {
									cheats.push(cards[i]);
									cards.splice(i, 1)
								}
							} else {
								if (get.value(cards[i], next) < 4) {
									cheats.push(cards[i]);
									cards.splice(i, 1)
								}
							}
						}
					}

					var time = 500;
					for (var i = 0; i < cheats.length; i++) {
						setTimeout(function (card, index, finished) {
							dialog.move(card, index, 0);
							if (finished) dialog.finishTime(1000);
						}, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
						time += 500;
					}

					for (var i = 0; i < cards.length; i++) {
						setTimeout(function (card, index, finished) {
							dialog.move(card, index, 1);
							if (finished) dialog.finishTime(1000);
						}, time, cards[i], i, (i >= cards.length - 1));
						time += 500;
					}
				};
				// var dianhua = decadeUI.content.chooseGuanXing(player, cards, cards.length);
				// dianhua.caption = '【点化】';
				// game.broadcast(function(player, cards, callback){
				// if (!window.decadeUI) return;
				// var dianhua = decadeUI.content.chooseGuanXing(player, cards, cards.length);
				// dianhua.caption = '【点化】';
				// dianhua.callback = callback;
				// }, player, cards, dianhua.callback);

				// event.switchToAuto = function(){
				// var cards = dianhua.cards[0].concat();
				// var cheats = [];
				// var judges;

				// var next = player.getNext();
				// var friend = player;
				// if (event.triggername == 'phaseJieshuBegin') {
				// friend = next;
				// judges = friend.node.judges.childNodes;
				// if (get.attitude(player, friend) < 0) friend = null;
				// } else {
				// judges = player.node.judges.childNodes;
				// }

				// if (judges.length > 0) cheats = decadeUI.get.cheatJudgeCards(cards, judges, friend != null);

				// if (friend) {
				// cards = decadeUI.get.bestValueCards(cards, friend);
				// } else {
				// cards.sort(function(a, b){
				// return get.value(a, next) - get.value(b, next);
				// });
				// }

				// cards = cheats.concat(cards);
				// var time = 500;
				// for (var i = 0; i < cards.length; i++) {
				// setTimeout(function(card, index, finished){
				// dianhua.move(card, index, 0);
				// if (finished) dianhua.finishTime(1000);
				// }, time, cards[i], i, i >= cards.length - 1);
				// time += 500;
				// }
				// }

				if (event.isOnline()) {
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}

				'step 1'
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) + '张牌置于牌堆底');
				game.updateRoundNumber();
			}
		},
		zongxuan: {
			content: function () {
				'step 0'
				var cards = [];
				for (var i = 0; i < trigger.cards2.length; i++) {
					var card = trigger.cards2[i];
					if (get.position(card, true) == 'd') {
						cards.push(card);
						clearTimeout(card.timeout);
						card.classList.remove('removing');
						// 防止因为限制结算速度，而导致牌提前进入弃牌堆
					}
				}

				if (!cards.length) return;
				var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				dialog.caption = '【纵玄】';
				dialog.header1 = '弃牌堆';
				dialog.header2 = '牌堆顶';
				dialog.lockCardsOrder(0);
				dialog.callback = function () { return this.cards[1].length > 0; };
				game.broadcast(function (player, cards, callback) {
					if (!window.decadeUI) return;
					var zongxuan = decadeUI.content.chooseGuanXing(player, cards, cards.length);
					dialog.caption = '【纵玄】';
					dialog.header1 = '弃牌堆';
					dialog.header2 = '牌堆顶';
					dialog.lockCardsOrder(0);
					dialog.callback = callback;
				}, player, cards, dialog.callback);

				event.switchToAuto = function () {
					var parent = event.parent;
					while (parent != null && parent.name != 'phaseDiscard') parent = parent.parent;

					var cards = dialog.cards[0].concat();
					var cheats = [];
					var next = player.getNext();
					var hasFriend = get.attitude(player, next) > 0;

					if (parent) {
						var hasZhiYan = player.hasSkill('zhiyan');	//如果有【直言】，AI 1000%肯定会用这个技能
						var judges = next.node.judges.childNodes;
						if (judges > 0 && hasZhiYan && cards.length > 1) {
							cheats = decadeUI.get.cheatJudgeCards(cards, judges, hasFriend);
						}
					}

					if (cards.length > 0) {
						cards.sort(function (a, b) {
							return get.value(b, player) - get.value(a, player);
						});
						cheats.splice(0, 0, cards.shift());

						var cost;
						for (var i = 0; i < cards.length; i++) {
							if (hasFriend) {
								if (get.value(cards[i], next) >= 5) cheats.push(cards[i]);
							} else {
								if (get.value(cards[i], next) < 5) cheats.push(cards[i]);
							}
						}
					}

					var time = 500;
					for (var i = 0; i < cheats.length; i++) {
						setTimeout(function (card, index, finished) {
							dialog.move(card, index, 1);
							if (finished) dialog.finishTime(cards.length <= 1 ? 250 : 1000);;
						}, time, cheats[i], i, (i >= cheats.length - 1));
						time += 500;
					}
				}

				if (event.isOnline()) {
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}

				'step 1'
				var first = ui.cardPile.firstChild;
				var cards = event.cards2;
				for (var i = 0; i < cards.length; i++) {
					ui.cardPile.insertBefore(cards[i], first);
				}

				cards = event.cards1;
				for (var i = 0; i < cards.length; i++) {
					ui.discardPile.appendChild(cards[i]);
				}

				game.log(player, '将' + get.cnNumber(event.num2) + '张牌置于牌堆顶');
			}
		},
		identity_junshi: {
			content: function () {
				"step 0"
				if (player.isUnderControl()) {
					game.modeSwapPlayer(player);
				}
				var num = 3;
				var cards = get.cards(num);
				var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				guanxing.caption = '【军师】';
				game.broadcast(function (player, cards, callback) {
					if (!window.decadeUI) return;
					var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
					guanxing.caption = '【军师】';
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
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				"step 1"
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) + '张牌置于牌堆底');
				game.updateRoundNumber();
			}
		},
		wuxin: {
			content: function () {
				var num = get.population('qun');
				if (player.hasSkill('huangjintianbingfu')) {
					num += player.getExpansions('huangjintianbingfu').length;
				}

				var cards = get.cards(num);
				var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length);
				dialog.caption = '【悟心】';
				game.broadcast(function (player, cards, callback) {
					if (!window.decadeUI) return;
					var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length);
					dialog.caption = '【悟心】';
					dialog.callback = callback;
				}, player, cards, dialog.callback);

				event.switchToAuto = function () {
					var cards = dialog.cards[0].concat();
					var cheats = [];

					var next = player.getNext();
					var friend = player;
					var judges = friend.node.judges.childNodes;
					if (judges.length > 0) cheats = decadeUI.get.cheatJudgeCards(cards, judges, friend != null);

					if (friend) {
						cards = decadeUI.get.bestValueCards(cards, friend);
					} else {
						cards.sort(function (a, b) {
							return get.value(a, next) - get.value(b, next);
						});
					}

					cards = cheats.concat(cards);
					var time = 500;
					for (var i = 0; i < cards.length; i++) {
						setTimeout(function (card, index, finished) {
							dialog.move(card, index, 0);
							if (finished) dialog.finishTime(cards.length <= 1 ? 250 : 1000);;
						}, time, cards[i], i, i >= cards.length - 1);
						time += 500;
					}
				}

				if (event.isOnline()) {
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
			}
		},
		luoying_discard: {
			content: function () {
				"step 0"
				if (trigger.delay == false) game.delay();
				"step 1"
				var cards = [];
				for (var i = 0; i < trigger.cards2.length; i++) {
					var card = trigger.cards2[i];
					if (get.suit(card, trigger.player) == 'club' && get.position(card, true) == 'd') {
						cards.push(card);
						clearTimeout(card.timeout);
						card.classList.remove('removing');
						// 防止因为限制结算速度，而导致牌提前进入弃牌堆
					}
				}

				var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length, false);
				dialog.caption = '【落英】';
				dialog.header1 = '弃牌堆';
				dialog.header2 = '获得牌';
				dialog.tip = '请选择要获得的牌';
				dialog.lockCardsOrder(0);
				dialog.cards[1] = dialog.cards[0];
				dialog.cards[0] = [];
				dialog.update();
				dialog.onMoved();
				dialog.callback = function () { return true; };
				game.broadcast(function (player, cards, callback) {
					if (!window.decadeUI) return;
					var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length, false);
					dialog.caption = '【落英】';
					dialog.header1 = '弃牌堆';
					dialog.header2 = '获得牌';
					dialog.tip = '请选择要获得的牌';
					dialog.lockCardsOrder(0);
					dialog.cards[1] = dialog.cards[0];
					dialog.cards[0] = [];
					dialog.update();
					dialog.onMoved();
					dialog.callback = callback;
				}, player, cards, dialog.callback);

				event.switchToAuto = function () {
					var cards = dialog.cards[1].concat();
					var time = 500;

					if (cards.length) {
						var discards = [];
						for (var i = 0; i < cards.length; i++) {
							if (get.value(cards[i]) < 0) {
								discards.push(cards[i]);
							}
						}

						if (discards.length) {
							for (var i = 0; i < discards.length; i++) {
								setTimeout(function (card, index, finished) {
									dialog.move(card, index, 0);
									if (finished) dialog.finishTime(1000);
								}, time, discards[i], i, i >= discards.length - 1);
								time += 500;
							}
						} else {
							dialog.finishTime(1000);
						}

					} else {
						dialog.finishTime(1000);
					}
				}

				if (event.isOnline()) {
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				"step 2"
				game.cardsDiscard(event.cards1);
				if (event.cards2) {
					// player.logSkill(event.name);
					player.gain(event.cards2, 'gain2', 'log');
				}
			}
		},
		luoying_judge: {
			content: function () {
				"step 0"
				var cards = trigger.cards;

				var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length, false);
				dialog.caption = '【落英】';
				dialog.header1 = '弃牌堆';
				dialog.header2 = '获得牌';
				dialog.tip = '请选择要获得的牌';
				dialog.lockCardsOrder(0);
				dialog.callback = function () { return true; };
				game.broadcast(function (player, cards, callback) {
					if (!window.decadeUI) return;
					var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length, false);
					dialog.caption = '【落英】';
					dialog.header1 = '弃牌堆';
					dialog.header2 = '获得牌';
					dialog.tip = '请选择要获得的牌';
					dialog.lockCardsOrder(0);
					dialog.callback = callback;
				}, player, cards, dialog.callback);

				event.switchToAuto = function () {
					var cards = dialog.cards[0].concat();
					var time = 500;
					for (var i = 0; i < cards.length; i++) {
						if (get.value(cards[i], player) < 0) continue;
						setTimeout(function (card, index, finished) {
							dialog.move(card, index, 1);
							if (finished) dialog.finishTime(cards.length <= 1 ? 250 : 1000);;
						}, time, cards[i], i, i >= cards.length - 1);
						time += 500;
					}
				}

				if (event.isOnline()) {
					event.player.send(function () {
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);

					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				"step 1"
				game.cardsDiscard(event.cards1);
				if (event.cards2) {
					// player.logSkill(event.name);
					player.gain(event.cards2, 'gain2', 'log');
				}
			}
		},
		// huashen: {
		// 	audio: 'huashen2',
		// 	unique: true,
		// 	forbid: ['guozhan'],
		// 	init: function (player) {
		// 		player.storage.huashen = {
		// 			list: [],
		// 			shown: [],
		// 			owned: {},
		// 			player: player,
		// 		}
		// 	},
		// 	get: function (player, num) {
		// 		if (typeof num != 'number') num = 1;
		// 		var list = [];
		// 		while (num--) {
		// 			var name = player.storage.huashen.list.randomRemove();
		// 			var skills = lib.character[name][3].slice(0);
		// 			for (var i = 0; i < skills.length; i++) {
		// 				var info = lib.skill[skills[i]];
		// 				if (info.limited || info.juexingji || info.charlotte || info.zhuSkill || info.hiddenSkill || info.dutySkill) {
		// 					skills.splice(i--, 1);
		// 				}
		// 			}
		// 			player.storage.huashen.owned[name] = skills;
		// 			// player.popup(name);
		// 			game.log(player, '获得了一个化身');
		// 			list.push(name);
		// 		}
		// 		if (player.isUnderControl(true)) {
		// 			var cards = [];
		// 			for (var i = 0; i < list.length; i++) {
		// 				var cardname = 'huashen_card_' + list[i];
		// 				lib.card[cardname] = {
		// 					fullimage: true,
		// 					image: 'character:' + list[i]
		// 				}
		// 				lib.translate[cardname] = lib.translate[list[i]];
		// 				cards.push(game.createCard(cardname, '', ''));
		// 			}
		// 			player.$draw(cards);
		// 		}
		// 	},
		// 	group: ['huashen1', 'huashen2'],
		// 	intro: {
		// 		content: function (storage, player) {
		// 			var str = '';
		// 			var slist = storage.owned;
		// 			var list = [];
		// 			for (var i in slist) {
		// 				list.push(i);
		// 			}
		// 			if (list.length) {
		// 				str += get.translation(list[0]);
		// 				for (var i = 1; i < list.length; i++) {
		// 					str += '、' + get.translation(list[i]);
		// 				}
		// 			}
		// 			var skill = player.additionalSkills.huashen[0];
		// 			if (skill) {
		// 				str += '<p>当前技能：' + get.translation(skill);
		// 			}
		// 			return str;
		// 		},
		// 		mark: function (dialog, content, player) {
		// 			var slist = content.owned;
		// 			var list = [];
		// 			for (var i in slist) {
		// 				list.push(i);
		// 			}
		// 			if (list.length) {
		// 				dialog.addSmall([list, 'character']);
		// 			}
		// 			if (!player.isUnderControl(true)) {
		// 				for (var i = 0; i < dialog.buttons.length; i++) {
		// 					if (!content.shown.includes(dialog.buttons[i].link)) {
		// 						dialog.buttons[i].node.group.remove();
		// 						dialog.buttons[i].node.hp.remove();
		// 						dialog.buttons[i].node.intro.remove();
		// 						dialog.buttons[i].node.name.innerHTML = '未<br>知';
		// 						dialog.buttons[i].node.name.dataset.nature = '';
		// 						dialog.buttons[i].style.background = '';
		// 						dialog.buttons[i]._nointro = true;
		// 						dialog.buttons[i].classList.add('menubg');
		// 					}
		// 				}
		// 			}
		// 			if (player.additionalSkills.huashen) {
		// 				var skill = player.additionalSkills.huashen[0];
		// 				if (skill) {
		// 					dialog.add('<div><div class="skill">【' + get.translation(skill) +
		// 						'】</div><div>' + lib.translate[skill + '_info'] + '</div></div>');
		// 				}
		// 			}
		// 		}
		// 	},
		// 	setup: function (player, gain) {
		// 		for (var i in lib.character) {
		// 			if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
		// 			var add = false;
		// 			for (var j = 0; j < lib.character[i][3].length; j++) {
		// 				var info = lib.skill[lib.character[i][3][j]];
		// 				if (!info) {
		// 					continue;
		// 				}
		// 				if (!info.limited && !info.juexingji && !info.charlotte && !info.zhuSkill && !info.hiddenSkill && !info.dutySkill) {
		// 					add = true; break;
		// 				}
		// 			}
		// 			if (add) {
		// 				player.storage.huashen.list.push(i);
		// 			}
		// 		}
		// 		for (var i = 0; i < game.players.length; i++) {
		// 			player.storage.huashen.list.remove([game.players[i].name]);
		// 			player.storage.huashen.list.remove([game.players[i].name1]);
		// 			player.storage.huashen.list.remove([game.players[i].name2]);
		// 		}
		// 		player.storage.huasheninited = true;
		// 		if (gain) {
		// 			player.markSkill('huashen');
		// 			lib.skill.huashen.get(player, 2);
		// 			_status.event.trigger('huashenStart');
		// 		}
		// 	}
		// },
		// huashen1: {
		// 	trigger: { global: 'gameStart', player: ['enterGame', 'damageBefore'] },
		// 	forced: true,
		// 	popup: false,
		// 	//priority:10,
		// 	filter: function (event, player) {
		// 		return !player.storage.huasheninited;
		// 	},
		// 	content: function () {
		// 		lib.skill.huashen.setup(player, trigger.name != 'damage');
		// 	}
		// },
		// huashen2: {
		// 	audio: 2,
		// 	trigger: { player: ['phaseBegin', 'phaseEnd', 'huashenStart'] },
		// 	filter: function (event, player, name) {
		// 		//if(name=='phaseBegin'&&game.phaseNumber==1) return false;
		// 		return true;
		// 	},
		// 	//priority:50,
		// 	forced: true,
		// 	//popup:false,
		// 	content: function () {
		// 		'step 0'
		// 		if (get.is.empty(player.storage.huashen.owned)) {
		// 			if (!player.storage.huasheninited) {
		// 				lib.skill.huashen.setup(player, false);
		// 			}
		// 			event.finish();
		// 			return;
		// 		}
		// 		event.trigger('playercontrol');
		// 		'step 1'
		// 		var slist = player.storage.huashen.owned;
		// 		var list = [];
		// 		for (var i in slist) {
		// 			list.push(i);
		// 		}
		// 		event.switchToAuto = function () {
		// 			var currentbutton = event.dialog.querySelector('.selected.button');
		// 			if (!currentbutton) {
		// 				currentbutton = event.dialog.buttons[0];
		// 				currentbutton.classList.add('selected');
		// 			}
		// 			event.clickControl(player.storage.huashen.owned[currentbutton.link].randomGet());
		// 		}

		// 		event.clickControl = function (link, type) {
		// 			if (link != 'cancel2') {
		// 				var currentname;
		// 				if (type == 'ai') {
		// 					currentname = event.currentname;
		// 				}
		// 				else {
		// 					currentname = event.dialog.querySelector('.selected.button').link;
		// 				}
		// 				player.storage.huashen.shown.add(currentname);
		// 				if (!player.additionalSkills.huashen || !player.additionalSkills.huashen.includes(link)) {
		// 					player.addAdditionalSkill('huashen', link);
		// 					//player.logSkill('huashen2');
		// 					player.flashAvatar('huashen', currentname);
		// 					game.log(player, '获得技能', '【' + get.translation(link) + '】');
		// 					player.popup(link);

		// 					if (event.dialog && event.dialog.buttons) {
		// 						for (var i = 0; i < event.dialog.buttons.length; i++) {
		// 							if (event.dialog.buttons[i].classList.contains('selected')) {
		// 								var name = event.dialog.buttons[i].link;
		// 								player.sex = lib.character[name][0];
		// 								player.group = lib.character[name][1];
		// 								// player.node.identity.style.backgroundColor=get.translation(player.group+'Color');
		// 								break;
		// 							}
		// 						}
		// 					}

		// 					// if(event.triggername=='phaseZhunbeiBegin'){
		// 					// 	(function(){
		// 					// 		var skills=[link];
		// 					// 		var list=[];
		// 					// 		game.expandSkills(skills);
		// 					// 		var triggerevent=event._trigger;
		// 					// 		var name='phaseZhunbeiBegin';
		// 					// 		for(i=0;i<skills.length;i++){
		// 					// 			var trigger=get.info(skills[i]).trigger;
		// 					// 			if(trigger){
		// 					// 				var add=false;
		// 					// 				if(player==triggerevent.player&&trigger.player){
		// 					// 					if(typeof trigger.player=='string'){
		// 					// 						if(trigger.player==name) add=true;
		// 					// 					}
		// 					// 					else if(trigger.player.includes(name)) add=true;
		// 					// 				}
		// 					// 				if(trigger.global){
		// 					// 					if(typeof trigger.global=='string'){
		// 					// 						if(trigger.global==name) add=true;
		// 					// 					}
		// 					// 					else if(trigger.global.includes(name)) add=true;
		// 					// 				}
		// 					// 				if(add&&player.isOut()==false) list.push(skills[i]);
		// 					// 			}
		// 					// 		}
		// 					// 		for(var i=0;i<list.length;i++){
		// 					// 			game.createTrigger('phaseZhunbeiBegin',list[i],player,triggerevent);
		// 					// 		}
		// 					// 	}());
		// 					// }
		// 				}
		// 			}
		// 			if (type != 'ai') {
		// 				// ui.auto.show();
		// 				event.dialog.close();
		// 				event.control.close();
		// 				game.resume();
		// 			}
		// 		};
		// 		if (event.isMine()) {
		// 			event.dialog = ui.create.dialog('选择获得一项技能', [list, 'character']);
		// 			for (var i = 0; i < event.dialog.buttons.length; i++) {
		// 				event.dialog.buttons[i].classList.add('pointerdiv');
		// 			}
		// 			if (trigger.name == 'game') {
		// 				event.control = ui.create.control();
		// 			}
		// 			else {
		// 				event.control = ui.create.control(['cancel2']);
		// 			}
		// 			event.control.custom = event.clickControl;
		// 			event.control.replaceTransition = false;
		// 			// ui.auto.hide();
		// 			game.pause();
		// 			for (var i = 0; i < event.dialog.buttons.length; i++) {
		// 				event.dialog.buttons[i].classList.add('selectable');
		// 			}
		// 			event.custom.replace.button = function (button) {
		// 				if (button.classList.contains('selected')) {
		// 					button.classList.remove('selected');
		// 					if (trigger.name == 'game') {
		// 						event.control.style.opacity = 0;
		// 					}
		// 					else {
		// 						event.control.replace(['cancel2']);
		// 					}
		// 				}
		// 				else {
		// 					for (var i = 0; i < event.dialog.buttons.length; i++) {
		// 						event.dialog.buttons[i].classList.remove('selected');
		// 					}
		// 					button.classList.add('selected');
		// 					event.control.replace(slist[button.link]);
		// 					if (trigger.name == 'game' && getComputedStyle(event.control).opacity == 0) {
		// 						event.control.style.transition = 'opacity 0.5s';
		// 						ui.refresh(event.control);
		// 						event.control.style.opacity = 1;
		// 						event.control.style.transition = '';
		// 						ui.refresh(event.control);
		// 					}
		// 					else {
		// 						event.control.style.opacity = 1;
		// 					}
		// 				}
		// 				event.control.custom = event.clickControl;
		// 			}
		// 			event.custom.replace.window = function () {
		// 				for (var i = 0; i < event.dialog.buttons.length; i++) {
		// 					if (event.dialog.buttons[i].classList.contains('selected')) {
		// 						event.dialog.buttons[i].classList.remove('selected');
		// 						if (trigger.name == 'game') {
		// 							event.control.style.opacity = 0;
		// 						}
		// 						else {
		// 							event.control.replace(['cancel2']);
		// 						}
		// 						event.control.custom = event.clickControl;
		// 						return;
		// 					}
		// 				}
		// 			}
		// 		}
		// 		else {
		// 			var skills = [];
		// 			var map = {};
		// 			for (var i = 0; i < list.length; i++) {
		// 				var sub = player.storage.huashen.owned[list[i]];
		// 				skills.addArray(sub);
		// 				for (var j = 0; j < sub.length; j++) {
		// 					map[sub[j]] = list[i];
		// 				}
		// 			}
		// 			var add = player.additionalSkills.huashen;
		// 			if (typeof add == 'string') {
		// 				add = [add];
		// 			}
		// 			if (Array.isArray(add)) {
		// 				for (var i = 0; i < add.length; i++) {
		// 					skills.remove(add[i]);
		// 				}
		// 			}
		// 			var cond = 'out';
		// 			if (event.triggername == 'phaseZhunbeiBegin') {
		// 				cond = 'in';
		// 			}
		// 			skills.randomSort();
		// 			skills.sort(function (a, b) {
		// 				return get.skillRank(b, cond) - get.skillRank(a, cond);
		// 			});
		// 			var choice = skills[0];
		// 			if (choice) {
		// 				event.currentname = map[choice];
		// 				event.clickControl(choice, 'ai');
		// 			}
		// 		}
		// 	}
		// },
	};
	const inheritSkillMap = {
		xz_xunxun: {
			content: skillMap.xunxun.content
		},
		reluoying_discard: {
			content: skillMap.luoying_discard.content
		},
		reluoying_judge: {
			content: skillMap.luoying_judge.content
		},
		nk_shekong: {
			content: function () {
				'step 0'
				event.cardsx = cards.slice(0);
				var num = get.cnNumber(cards.length);
				var trans = get.translation(player);
				var prompt = ('弃置' + num + '张牌，然后' + trans + '摸一张牌');
				if (cards.length > 1) prompt += ('；或弃置一张牌，然后' + trans + '摸' + num + '张牌');
				var next = target.chooseToDiscard(prompt, 'he', true);
				next.numx = cards.length;
				next.selectCard = function () {
					if (ui.selected.cards.length > 1) return _status.event.numx;
					return [1, _status.event.numx];
				};
				next.complexCard = true;
				next.ai = function (card) {
					if (ui.selected.cards.length == 0 || (_status.event.player.countCards('he',
						function (cardxq) {
							return get.value(cardxq) < 7;
						}) >= _status.event.numx)) return 7 - get.value(card);
					return - 1;
				};
				'step 1'
				if (result.bool) {
					if (result.cards.length == cards.length) player.draw();
					else player.draw(cards.length);
					event.cardsx.addArray(result.cards);
					for (var i = 0; i < event.cardsx.length; i++) {
						if (get.position(event.cardsx[i]) != 'd') event.cardsx.splice(i--, 1);
					}
				} else event.finish();
				'step 2'
				if (event.cardsx.length) {
					var cards = event.cardsx;
					var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length);
					dialog.caption = '【设控】';
					game.broadcast(function (player, cards, callback) {
						if (!window.decadeUI) return;
						var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length);
						dialog.caption = '【设控】';
						dialog.callback = callback;
					}, player, cards, dialog.callback);

					event.switchToAuto = function () {
						var cards = dialog.cards[0].concat();
						var cheats = [];
						var judges;

						var next = player.getNext();
						var friend = (get.attitude(player, next) < 0) ? null : next;
						judges = next.node.judges.childNodes;

						if (judges.length > 0) cheats = decadeUI.get.cheatJudgeCards(cards, judges, friend != null);

						if (friend) {
							cards = decadeUI.get.bestValueCards(cards, friend);
						} else {
							cards.sort(function (a, b) {
								return get.value(a, next) - get.value(b, next);
							});
						}

						cards = cheats.concat(cards);
						var time = 500;
						for (var i = 0; i < cards.length; i++) {
							setTimeout(function (card, index, finished) {
								dialog.move(card, index, 0);
								if (finished) dialog.finishTime(cards.length <= 1 ? 250 : 1000);;
							}, time, cards[i], i, i >= cards.length - 1);
							time += 500;
						}
					}

					if (event.isOnline()) {
						event.player.send(function () {
							if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
						}, event.player);

						event.player.wait();
						decadeUI.game.wait();
					} else if (!event.isMine()) {
						event.switchToAuto();
					}
				} else event.finish();
			}
		},
		kamome_huanmeng: {
			content: function () {
				"step 0"
				if (player.isUnderControl()) {
					game.modeSwapPlayer(player);
				}
				var num = 1 + player.countCards('e');;
				var cards = get.cards(num);
				var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				guanxing.caption = '【幻梦】';
				game.broadcast(function (player, cards, callback) {
					if (!window.decadeUI) return;
					var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
					guanxing.caption = '【幻梦】';
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
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				"step 1"
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) + '张牌置于牌堆底');
				game.updateRoundNumber()
			}
		},
		// xinbenxi: {
		// 	content: function () {
		// 		"step 0"
		// 		event.videoId = lib.status.videoId++;
		// 		var func = function (card, id, bool) {
		// 			var list = ['为XXX多指定一个目标', '令XXX无视防具', '令XXX不可被抵消', '当XXX造成伤害时摸一张牌',];
		// 			var choiceList = ui.create.dialog('【奔袭】：请选择一至两项', 'forcebutton');
		// 			choiceList.videoId = id;
		// 			for (var i = 0; i < list.length; i++) {
		// 				list[i] = list[i].replace(/XXX/g, card);
		// 				var str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block">';
		// 				if (i == 0 && !bool) str += '<div style="opacity:0.5">';
		// 				str += list[i];
		// 				if (i == 0 && !bool) str += '</div>';
		// 				str += '</div>';
		// 				var next = choiceList.add(str);
		// 				next.firstChild.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
		// 				next.firstChild.link = i;
		// 				for (var j in lib.element.button) {
		// 					next[j] = lib.element.button[j];
		// 				}
		// 				choiceList.buttons.add(next.firstChild);
		// 			}
		// 			return choiceList;
		// 		};
		// 		if (player.isOnline2()) {
		// 			player.send(func, get.translation(trigger.card), event.videoId, lib.skill.xinbenxi.filterx(trigger, player));
		// 		}
		// 		event.dialog = func(get.translation(trigger.card), event.videoId, lib.skill.xinbenxi.filterx(trigger, player));
		// 		if (player != game.me || _status.auto) {
		// 			event.dialog.style.display = 'none';
		// 		}
		// 		var next = player.chooseButton();
		// 		next.set('dialog', event.videoId);
		// 		next.set('forced', true);
		// 		next.set('selectButton', [1, 2]);
		// 		next.set('filterButton',
		// 			function (button) {
		// 				if (button.link == 0) {
		// 					return _status.event.bool1;
		// 				};
		// 				return true;
		// 			});
		// 		next.set('bool1', lib.skill.xinbenxi.filterx(trigger, player));
		// 		next.set('ai',
		// 			function (button) {
		// 				var player = _status.event.player;
		// 				var event = _status.event.getTrigger();
		// 				switch (button.link) {
		// 					case 0:
		// 						{
		// 							if (game.hasPlayer(function (current) {
		// 								return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current) && get.effect(current, event.card, player, player) > 0;
		// 							})) return 1.6 + Math.random();
		// 							return 0;
		// 						}
		// 					case 1:
		// 						{
		// 							if (event.targets.filter(function (current) {
		// 								var eff1 = get.effect(current, event.card, player, player);
		// 								player._xinbenxi_ai = true;
		// 								var eff2 = get.effect(current, event.card, player, player);
		// 								delete player._xinbenxi_ai;
		// 								return eff1 > eff2;
		// 							}).length) return 1.9 + Math.random();
		// 							return Math.random();
		// 						}
		// 					case 2:
		// 						{
		// 							var num = 1.3;
		// 							if (event.card.name == 'sha' && event.targets.filter(function (current) {
		// 								if (current.mayHaveShan() && get.attitude(player, current) <= 0) {
		// 									if (current.hasSkillTag('useShan')) num = 1.9;
		// 									return true;
		// 								}
		// 								return false;
		// 							}).length) return num + Math.random();
		// 							return 0.5 + Math.random();
		// 						}
		// 					case 3:
		// 						{
		// 							return (get.tag(event.card, 'damage') || 0) + Math.random();
		// 						}
		// 				}
		// 			});
		// 		"step 1"
		// 		if (player.isOnline2()) {
		// 			player.send('closeDialog', event.videoId);
		// 		}
		// 		event.dialog.close();
		// 		var map = [function (trigger, player, event) {
		// 			player.chooseTarget('请选择' + get.translation(trigger.card) + '的额外目标', true,
		// 				function (card, player, target) {
		// 					var player = _status.event.player;
		// 					if (_status.event.targets.includes(target)) return false;
		// 					return lib.filter.targetEnabled2(_status.event.card, player, target);
		// 				}).set('targets', trigger.targets).set('card', trigger.card).set('ai',
		// 					function (target) {
		// 						var trigger = _status.event.getTrigger();
		// 						var player = _status.event.player;
		// 						return get.effect(target, trigger.card, player, player);
		// 					});
		// 		},
		// 		function (trigger, player, event) {
		// 			player.storage.xinbenxi_unequip.add(trigger.card);
		// 		},
		// 		function (trigger, player, event) {
		// 			player.storage.xinbenxi_directHit.add(trigger.card);
		// 			trigger.nowuxie = true;
		// 			trigger.customArgs.
		// 				default.directHit2 = true;
		// 		},
		// 		function (trigger, player, event) {
		// 			player.storage.xinbenxi_damage.add(trigger.card);
		// 		}];
		// 		for (var i = 0; i < result.links.length; i++) {
		// 			game.log(player, '选择了', '#g【奔袭】', '的', '#y选项' + get.cnNumber(result.links[i] + 1, true));
		// 			map[result.links[i]](trigger, player, event);
		// 		}
		// 		if (!result.links.includes(0)) event.finish();
		// 		"step 2"
		// 		if (result.targets) {
		// 			player.line(result.targets);
		// 			trigger.targets.addArray(result.targets);
		// 		}
		// 	}
		// }
	};
	if (!_status.connectMode) {
		Object.keys(skillMap).forEach(key => {
			const skill = lib.skill[key];
			if (!skill) return;
			const decadeUISkill = skillMap[key];
			Object.keys(decadeUISkill).forEach(subKey => skill[subKey] = decadeUISkill[subKey]);
		});
		Object.keys(inheritSkillMap).forEach(key => {
			const skill = lib.skill[key];
			if (!skill) return;
			const decadeUIInheritSkill = inheritSkillMap[key];
			Object.keys(decadeUIInheritSkill).forEach(subKey => skill[subKey] = decadeUIInheritSkill[subKey]);
		});
	}
	const onlineSkillMap = {
		xinfu_pingcai: {
			contentx: function () {
				"step 0"
				event.pingcai_delayed = true;
				var name = lib.skill.xinfu_pingcai_backup.takara;
				event.cardname = name;
				event.videoId = lib.status.videoId++;
				if (player.isUnderControl()) {
					game.swapPlayerAuto(player);
				}
				var switchToAuto = function () {
					game.pause();
					game.countChoose();
					setTimeout(function () {
						_status.imchoosing = false;
						event._result = {
							bool: true,
						};
						game.resume();
					}, 9000);
				};
				var createDialog = function (player, id, name) {
					if (player == game.me) return;
					var dialog = ui.create.dialog('forcebutton', 'hidden');
					var str = get.translation(player) + '正在擦拭宝物上的灰尘…';
					var canSkip = (!_status.connectMode);
					if (canSkip) str += '<br>（点击宝物可以跳过等待AI操作）';
					dialog.textPrompt = dialog.add('<div class="text center">' + str + '</div>');
					dialog.classList.add('fixed');
					dialog.classList.add('scroll1');
					dialog.classList.add('scroll2');
					dialog.classList.add('fullwidth');
					dialog.classList.add('fullheight');
					dialog.classList.add('noupdate');
					dialog.videoId = id;

					var canvas2 = document.createElement('canvas');
					dialog.canvas_viewer = canvas2;
					dialog.appendChild(canvas2);
					canvas2.classList.add('grayscale');
					canvas2.style.position = "absolute";
					canvas2.style.width = '249px';
					canvas2.style.height = '249px';
					canvas2.style['border-radius'] = '6px';
					canvas2.style.left = "calc(50% - 125px)";
					canvas2.style.top = "calc(50% - 125px)";
					canvas2.width = 249;
					canvas2.height = 249;
					canvas2.style.border = '3px solid';

					var ctx2 = canvas2.getContext('2d');
					var img = new Image();
					img.src = lib.assetURL + 'image/card/' + name + '.png';
					img.onload = function () {
						ctx2.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas2.width, canvas2.height);
					}
					if (canSkip) {
						var skip = function () {
							if (event.pingcai_delayed) {
								delete event.pingcai_delayed;
								event._result = {
									bool: true,
								};
								game.resume();
								canvas2.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', skip);
							}
						};
						canvas2.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', skip);
					}
					dialog.open();
				};
				var chooseButton = function (id, name) {
					var event = _status.event;
					_status.xinfu_pingcai_finished = false;

					var dialog = ui.create.dialog('forcebutton', 'hidden');
					dialog.textPrompt = dialog.add('<div class="text center">擦拭掉宝物上的灰尘吧！</div>');
					event.switchToAuto = function () {
						event._result = {
							bool: _status.xinfu_pingcai_finished,
						};
						game.resume();
						_status.imchoosing = false;
						_status.xinfu_pingcai_finished = true;
					};
					dialog.classList.add('fixed');
					dialog.classList.add('scroll1');
					dialog.classList.add('scroll2');
					dialog.classList.add('fullwidth');
					dialog.classList.add('fullheight');
					dialog.classList.add('noupdate');
					dialog.videoId = id;

					var canvas = document.createElement('canvas');
					var canvas2 = document.createElement('canvas');

					dialog.appendChild(canvas2);
					dialog.appendChild(canvas);

					canvas.style.position = "absolute";
					canvas.style.width = '249px';
					canvas.style.height = '249px';
					canvas.style['border-radius'] = '6px';
					canvas.style.left = "calc(50% - 125px)";
					canvas.style.top = "calc(50% - 125px)";
					canvas.width = 249;
					canvas.height = 249;
					canvas.style.border = '3px solid';

					canvas2.style.position = "absolute";
					canvas2.style.width = '249px';
					canvas2.style.height = '249px';
					canvas2.style['border-radius'] = '6px';
					canvas2.style.left = "calc(50% - 125px)";
					canvas2.style.top = "calc(50% - 125px)";
					canvas2.width = 249;
					canvas2.height = 249;
					canvas2.style.border = '3px solid';

					var ctx = canvas.getContext('2d');
					var ctx2 = canvas2.getContext('2d');

					var img = new Image();
					img.src = lib.assetURL + 'image/card/' + name + '.png';
					img.onload = function () {
						ctx2.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas2.width, canvas2.height);
					}

					ctx.fillStyle = 'lightgray';
					ctx.fillRect(0, 0, canvas.width, canvas.height);

					canvas.onmousedown = function (ev) {
						//if(_status.xinfu_pingcai_finished) return;
						canvas.onmousemove = function (e) {
							if (_status.xinfu_pingcai_finished) return;
							ctx.beginPath();
							ctx.clearRect(e.offsetX / game.documentZoom - 16, e.offsetY / game.documentZoom - 16, 32, 32);
							var data = ctx.getImageData(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8).data;
							var sum = 0;
							for (var i = 3; i < data.length; i += 4) {
								if (data[i] == 0) {
									sum++;
								}
							}
							if (sum >= (canvas.width * canvas.height) * 0.6) {
								//ctx.clearRect(0,0,canvas.width,canvas.height);
								if (!_status.xinfu_pingcai_finished) {
									_status.xinfu_pingcai_finished = true;
									event.switchToAuto();
								}
							}
						}
					}
					canvas.ontouchstart = function (ev) {
						//if(_status.xinfu_pingcai_finished) return;
						canvas.ontouchmove = function (e) {
							if (_status.xinfu_pingcai_finished) return;
							ctx.beginPath();
							var rect = canvas.getBoundingClientRect();
							var X = ((e.touches[0].clientX / game.documentZoom - rect.left) / rect.width * canvas.width);
							var Y = ((e.touches[0].clientY / game.documentZoom - rect.top) / rect.height * canvas.height);
							ctx.clearRect(X - 16, Y - 16, 32, 32);
							var data = ctx.getImageData(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8).data;
							var sum = 0;
							for (var i = 3; i < data.length; i += 4) {
								if (data[i] == 0) {
									sum++;
								}
							}
							if (sum >= (canvas.width * canvas.height) * 0.6) {
								if (!_status.xinfu_pingcai_finished) {
									_status.xinfu_pingcai_finished = true;
									event.switchToAuto();
								}
							}
						}
					}
					canvas.onmouseup = function (ev) {
						canvas.onmousemove = null;
					}
					canvas.ontouchend = function (ev) {
						canvas.ontouchmove = null;
					}

					dialog.open();

					game.pause();
					game.countChoose();
				};
				//event.switchToAuto=switchToAuto;
				game.broadcastAll(createDialog, player, event.videoId, name);
				if (event.isMine()) {
					chooseButton(event.videoId, name);
				}
				else if (event.isOnline()) {
					event.player.send(chooseButton, event.videoId, name);
					event.player.wait();
					game.pause();
				}
				else {
					switchToAuto();
				}
				"step 1"
				var result = event.result || result;
				if (!result) result = { bool: false };
				event._result = result;
				game.broadcastAll(function (id, result, player) {
					_status.xinfu_pingcai_finished = true;
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.textPrompt.innerHTML = '<div class="text center">' + (get.translation(player) + '擦拭宝物' + (result.bool ? '成功！' : '失败…')) + '</div>';
						if (result.bool && dialog.canvas_viewer) dialog.canvas_viewer.classList.remove('grayscale');
					}
					if (!_status.connectMode) delete event.pingcai_delayed;
				}, event.videoId, result, player);
				game.delay(2.5);
				"step 2"
				game.broadcastAll('closeDialog', event.videoId);
				if (result.bool) {
					player.logSkill('pcaudio_' + event.cardname);
					event.insert(lib.skill.xinfu_pingcai[event.cardname], {
						player: player,
					});
				}
			}
		}
	};
	Object.keys(onlineSkillMap).forEach(key => {
		const skill = lib.skill[key];
		if (!skill) return;
		const decadeUIOnlineSkill = onlineSkillMap[key];
		Object.keys(decadeUIOnlineSkill).forEach(subKey => skill[subKey] = decadeUIOnlineSkill[subKey]);
	});
});
