'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Requests = {};

/** NAVIGATION **/
Requests.handleJoinServer = 'js';
Requests.handleJoinPlayer = 'jr';
Requests.handleJoinRoom = 'jp';

/** PLAYER **/
Requests.handleHeartBeat = 'h';
Requests.handleGetPlayer = 'gp';

Requests.handleSendPosition = 'sp';
Requests.handleSendFrame = 'sf';
Requests.handleSendAction = 'sa';
Requests.handleSendSnowball = 'sb';
Requests.handleSendEmote = 'se';
Requests.handleSendSafe = 'ss';
Requests.handleSendJoke = 'sj';
Requests.handleSendGuide = 'sg';

/** SYSTEM **/
Requests.handleUpdateClothing = ['upc', 'uph', 'upf', 'upn', 'upb', 'upa', 'upe', 'upl', 'upp'];

/** MODERATION **/
Requests.handleMute = 'm';
Requests.handleKick = 'k';
Requests.handleBan = 'b';

/** COMMUNICATION **/
Requests.handleSendMessage = 'sm';

/** INVENTORY **/
Requests.handleAddItem = 'ai';
Requests.handleGetInventory = 'gi';

/** IGLOO **/
Requests.handleGetIgloo = 'gm';
Requests.handleGetIglooList = 'gr';
Requests.handleGetOwnedIgloos = 'go';
Requests.handleOpenIgloo = 'or';
Requests.handleCloseIgloo = 'cr';
Requests.handleUpdateFurniture = 'ur';
Requests.handleUpdateMusic = 'um';
Requests.handleUpdateIgloo = 'ao';
Requests.handleUpdateFloor = 'ag';
Requests.handleAddIgloo = 'au';
Requests.handleAddFurniture = 'af';
Requests.handleGetFurniture = 'gf';

/** PUFFLE **/
Requests.handleGetPuffle = 'pg';
Requests.handlePuffleUser = 'pgu';

/** TOY **/
Requests.handleAddToy = 'at';
Requests.handleRemoveToy = 'rt';

/** BUDDY LIST **/
Requests.handleGetBuddies = 'gb';
Requests.handleBuddyAccept = 'ba';
Requests.handleBuddyRemove = 'rb';
Requests.handleBuddyFind = 'bf';
Requests.handleBuddyRequest = 'br';

/** IGNORE LIST **/
Requests.handleGetIgnored = 'gn';
Requests.handleAddIgnore = 'an';
Requests.handleRemoveIgnore = 'rn';

/** MAIL **/
Requests.handleStartMail = 'mst';
Requests.handleGetMail = 'mg';

exports.default = Requests;