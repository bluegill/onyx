const DEFAULT_REQUESTS = {
  /** NAVIGATION **/
  JOIN_SERVER: 'js',
  JOIN_ROOM: 'jr',
  JOIN_PLAYER: 'jp',

  /** PLAYER **/
  HEARTBEAT: 'h',
  GET_PLAYER: 'gp',
  SEND_POSITION: 'sp',
  SEND_FRAME: 'sf',
  SEND_ACTION: 'sa',
  SEND_SNOWBALL: 'sb',
  SEND_EMOTE: 'se',
  SEND_SAFE_MESSAGE: 'ss',
  SEND_JOKE: 'sj',
  SEND_GUIDE: 'sg',

  /** SYSTEM **/
  // easier to just combine all requests into single handler
  UPDATE_CLOTHING: [
    'upc', 'uph', 'upf',
    'upn', 'upb', 'upa',
    'upe', 'upl', 'upp'
  ],

  /** MODERATION **/
  KICK_PLAYER: 'k',
  MUTE_PLAYER: 'm',
  BAN_PLAYER: 'b',

  /** COMMUNICATION **/
  SEND_MESSAGE: 'sm',

  /** INVENTORY **/
  ADD_ITEM: 'ai',
  GET_INVENTORY: 'gi',

  /** IGLOO **/
  GET_IGLOO: 'gm',
  GET_IGLOO_LIST: 'gr',
  GET_OWNED_IGLOOS: 'go',
  OPEN_IGLOO: 'or',
  CLOSE_IGLOO: 'cr',
  UPDATE_FURNITURE: 'ur',
  UPDATE_MUSIC: 'um',
  UPDATE_FLOOR: 'ag',
  ADD_IGLOO: 'au',
  UPDATE_IGLOO: 'ao',
  ADD_FURNITURE: 'af',
  GET_FURNITURE: 'gf',

  /** PUFFLE **/
  GET_PUFFLE: 'pg',
  GET_PUFFLE_USER: 'pgu',

  /** TOY **/
  ADD_TOY: 'at',
  REMOVE_TOY: 'rt',

  /** BUDDY LIST **/
  GET_BUDDIES: 'gb',
  BUDDY_ACCEPT: 'ba',
  BUDDY_REMOVE: 'rb',
  BUDDY_FIND: 'bf',
  BUDDY_REQUEST: 'br',

  /** IGNORE LIST **/
  GET_IGNORED: 'gn',
  ADD_IGNORE: 'an',
  REMOVE_IGNORE: 'rn',

  /** MAIL **/
  START_MAIL: 'mst',
  GET_MAIL: 'mg'
};

const EXTENDED_REQUESTS = {
  GET_PLAYER_ID: 'id',
  GET_SETTINGS: 'ge',
  UPDATE_SETTINGS: 'ue',
  UPDATE_OUTFIT: 'upo',
  UPDATE_CARD: 'upu',
  UPDATE_MOOD: 'upm',
  UPDATE_SPEED: 'ups',
  UPDATE_BEAK: 'upk',
  UPDATE_NAME_GLOW: 'ung',
  UPDATE_BUBBLE_COLOR: 'ubc',
  WARN_PLAYER: 'wa',
  SEARCH_PLAYER: 'sr',
  MOVE_PLAYER: 'mp',
  BLOCK_PLAYER_NAME: 'bn',
  SEND_PRIVATE_MESSAGE: 'spm'
};

Object.assign(DEFAULT_REQUESTS, EXTENDED_REQUESTS);

export DEFAULT_REQUESTS;